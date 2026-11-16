// Regras da coleta de visitas e da API de métricas que a AFIO lê.
// Sem dependências: roda igual no Supabase (Deno) e nos testes (Node).

/** Páginas e alvos de clique aceitos. Lista fechada: o que não está aqui vira 400. */
export const PAGINAS = ["home", "sites", "sistemas", "automacoes"];
export const ALVOS = ["whatsapp", "instagram", "github", "email", "afio"];
/** Endereços do próprio site: visita vinda deles é "interno". */
export const SITE_HOSTS = ["auereastack.com.br"];

export type Evento = {
  dia: string;
  pagina: string;
  tipo: "visita" | "clique";
  alvo: string;
  visitante: string;
  origem: string;
  ipHash: string;
};

export type Resumo = { paginas?: unknown; cliques?: unknown; origens?: unknown; porDia?: unknown };

export interface Banco {
  registrar(e: Evento): Promise<void>;
  resumo(desde: string): Promise<Resumo>;
}

/** A data (AAAA-MM-DD) no fuso de São Paulo. */
export function diaSP(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Primeiro dia do período: hoje menos (dias - 1). O período inclui hoje. */
export function desdeDia(hoje: string, dias: number): string {
  const [a, m, d] = hoje.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d - (dias - 1))).toISOString().slice(0, 10);
}

/** Só a-z 0-9 . _ - em minúsculo, no máximo 40 caracteres. */
export function rotulo(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);
}

/** De onde a visita veio: o ?ref= se houver; senão o site de origem; senão "direto". */
export function origemDe(ref: unknown, de: unknown): string {
  const r = rotulo(ref);
  if (r) return r;
  let host = "";
  try {
    host = new URL(String(de ?? "")).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "direto";
  }
  if (!host) return "direto";
  if (SITE_HOSTS.some((h) => host === h || host.endsWith("." + h))) return "interno";
  if (/(^|\.)instagram\.com$/.test(host)) return "instagram";
  if (/(^|\.)google\.[a-z.]+$/.test(host)) return "google";
  if (host === "wa.me" || /(^|\.)whatsapp\.com$/.test(host)) return "whatsapp";
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host)) return "facebook";
  return rotulo(host) || "direto";
}

export function ehRobo(ua: string): boolean {
  return !ua.trim() || /bot|crawl|spider|slurp|facebookexternalhit|preview/i.test(ua);
}

export function ipDe(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  return xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
}

const enc = new TextEncoder();

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** HMAC-SHA256 em hexadecimal, cortado em 24 caracteres. */
export async function hmac24(segredo: string, texto: string): Promise<string> {
  const chave = await crypto.subtle.importKey("raw", enc.encode(segredo), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", chave, enc.encode(texto))).slice(0, 24);
}

/** Compara dois textos em tempo constante (compara os SHA-256, que têm sempre o mesmo tamanho). */
export async function igualSeguro(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const p = new Uint8Array(x);
  const q = new Uint8Array(y);
  let dif = 0;
  for (let i = 0; i < p.length; i++) dif |= p[i] ^ q[i];
  return dif === 0;
}

/* ───────── coleta: POST com { pagina, tipo, alvo?, ref?, de? } ───────── */

export function criarColeta(cfg: { segredo: string | undefined; banco: Banco; agora?: () => Date }) {
  const vazio = (status: number) => new Response(null, { status });

  return async (req: Request): Promise<Response> => {
    if (req.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });

    let c: Record<string, unknown>;
    try {
      const texto = await req.text();
      if (texto.length > 2000) return vazio(400);
      const j = JSON.parse(texto);
      if (!j || typeof j !== "object" || Array.isArray(j)) return vazio(400);
      c = j;
    } catch {
      return vazio(400);
    }

    const { pagina, tipo } = c;
    if (typeof pagina !== "string" || !PAGINAS.includes(pagina)) return vazio(400);
    if (tipo !== "visita" && tipo !== "clique") return vazio(400);
    let alvo = "";
    if (tipo === "clique") {
      if (typeof c.alvo !== "string" || !ALVOS.includes(c.alvo)) return vazio(400);
      alvo = c.alvo;
    } else if (c.alvo != null && c.alvo !== "") {
      return vazio(400);
    }

    // daqui para baixo a resposta é sempre 200: robô, limite e falha do banco não viram erro para o visitante
    const ua = req.headers.get("user-agent") ?? "";
    if (ehRobo(ua)) return vazio(200);
    // sem o segredo não dá para contar pessoas sem guardar IP, então não grava nada
    if (!cfg.segredo) return vazio(200);

    try {
      const dia = diaSP(cfg.agora?.() ?? new Date());
      const ip = ipDe(req);
      const [visitante, ipHash] = await Promise.all([
        hmac24(cfg.segredo, `${dia}|${ip}|${ua}`),
        hmac24(cfg.segredo, `${dia}|ip|${ip}`),
      ]);
      await cfg.banco.registrar({
        dia,
        pagina,
        tipo,
        alvo,
        visitante,
        origem: origemDe(c.ref, typeof c.de === "string" ? c.de.slice(0, 500) : ""),
        ipHash,
      });
    } catch {
      // o visitante não tem nada a ver com isso
    }
    return vazio(200);
  };
}

/* ───────── API da AFIO: GET ?dias=7|30|90 com Authorization: Bearer <token> ───────── */

const MAX_ITENS = 200;

function inteiro(v: unknown): number {
  const n = Math.trunc(Number(v));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function lista<T>(v: unknown, item: (o: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(v)) return [];
  const out: T[] = [];
  for (const o of v) {
    if (!o || typeof o !== "object") continue;
    const x = item(o as Record<string, unknown>);
    if (x) out.push(x);
    if (out.length >= MAX_ITENS) break;
  }
  return out;
}

/** Monta a resposta só com os campos combinados: nada que venha do banco passa sem ser conferido. */
export function montarResposta(dias: number, desde: string, r: Resumo) {
  return {
    versao: 1,
    dias,
    desde,
    paginas: lista(r.paginas, (o) => {
      const pagina = rotulo(o.pagina);
      return pagina ? { pagina, visitas: inteiro(o.visitas), pessoas: inteiro(o.pessoas) } : null;
    }),
    cliques: lista(r.cliques, (o) => {
      const pagina = rotulo(o.pagina);
      const alvo = rotulo(o.alvo);
      return pagina && alvo ? { pagina, alvo, cliques: inteiro(o.cliques), pessoas: inteiro(o.pessoas) } : null;
    }),
    origens: lista(r.origens, (o) => {
      const pagina = rotulo(o.pagina);
      const origem = rotulo(o.origem);
      return pagina && origem ? { pagina, origem, visitas: inteiro(o.visitas), pessoas: inteiro(o.pessoas) } : null;
    }),
    porDia: lista(r.porDia, (o) => {
      const dia = String(o.dia ?? "");
      return /^\d{4}-\d{2}-\d{2}$/.test(dia) ? { dia, visitas: inteiro(o.visitas), pessoas: inteiro(o.pessoas) } : null;
    }),
  };
}

export function criarApi(cfg: { token: string | undefined; banco: Banco; agora?: () => Date }) {
  // sem CORS de propósito: é para ser lida de servidor para servidor
  const cab = { "Content-Type": "application/json", "Cache-Control": "private, no-store" };
  const json = (status: number, corpo: unknown, extra: Record<string, string> = {}) =>
    new Response(JSON.stringify(corpo), { status, headers: { ...cab, ...extra } });

  return async (req: Request): Promise<Response> => {
    // variável não configurada nunca libera para todo mundo
    if (!cfg.token || cfg.token.length < 32) return json(503, { erro: "nao_configurado" });

    const m = /^Bearer\s+(\S+)$/.exec(req.headers.get("authorization") ?? "");
    if (!m || !(await igualSeguro(m[1], cfg.token))) return json(401, { erro: "nao_autorizado" });
    if (req.method !== "GET") return json(405, { erro: "metodo" }, { Allow: "GET" });

    const pedido = new URL(req.url).searchParams.get("dias");
    const dias = pedido === "7" ? 7 : pedido === "90" ? 90 : 30;
    const desde = desdeDia(diaSP(cfg.agora?.() ?? new Date()), dias);

    let resumo: Resumo;
    try {
      resumo = await cfg.banco.resumo(desde);
    } catch {
      return json(500, { erro: "indisponivel" });
    }
    return json(200, montarResposta(dias, desde, resumo));
  };
}
