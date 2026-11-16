// Testes da coleta e da API de métricas. Rodar com: npm run test:metricas
import assert from "node:assert/strict";
import { test } from "node:test";
import { criarApi, criarColeta, desdeDia, diaSP, origemDe } from "../functions/_shared/metricas.ts";
import { bancoMemoria } from "./banco-memoria.ts";

// valores só de teste, sem relação com os de produção
const TOKEN = "token-de-teste-com-mais-de-32-caracteres-0001";
const SEGREDO = "segredo-de-teste";
const AGORA = () => new Date("2026-11-15T15:00:00Z"); // 12h em São Paulo
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36";

function montar(opcoes: { token?: string | undefined; agora?: () => Date } = {}) {
  const { banco, linhas } = bancoMemoria();
  const agora = opcoes.agora ?? AGORA;
  const coleta = criarColeta({ segredo: SEGREDO, banco, agora });
  const api = criarApi({ token: "token" in opcoes ? opcoes.token : TOKEN, banco, agora });
  return { banco, linhas, coleta, api };
}

function post(corpo: unknown, cab: Record<string, string> = {}) {
  return new Request("https://exemplo.test/coleta", {
    method: "POST",
    headers: { "user-agent": UA, "x-forwarded-for": "203.0.113.7", ...cab },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
  });
}

function get(query = "", token: string | null = TOKEN) {
  return new Request("https://exemplo.test/metricas-afio" + query, {
    headers: token === null ? {} : { Authorization: `Bearer ${token}` },
  });
}

test("token certo: 200 no formato combinado", async () => {
  const { coleta, api } = montar();
  await coleta(post({ pagina: "home", tipo: "visita", ref: "instagram", de: "" }));
  await coleta(post({ pagina: "home", tipo: "clique", alvo: "whatsapp", ref: "instagram", de: "" }));

  const r = await api(get("?dias=30"));
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("content-type"), "application/json");
  assert.equal(r.headers.get("cache-control"), "private, no-store");
  assert.equal(r.headers.get("access-control-allow-origin"), null);

  const texto = await r.text();
  assert.ok(texto.length < 200_000);
  assert.deepEqual(JSON.parse(texto), {
    versao: 1,
    dias: 30,
    desde: "2026-10-17",
    paginas: [{ pagina: "home", visitas: 1, pessoas: 1 }],
    cliques: [{ pagina: "home", alvo: "whatsapp", cliques: 1, pessoas: 1 }],
    origens: [{ pagina: "home", origem: "instagram", visitas: 1, pessoas: 1 }],
    porDia: [{ dia: "2026-11-15", visitas: 1, pessoas: 1 }],
  });
  // nada pessoal na resposta
  assert.doesNotMatch(texto, /203\.0\.113\.7|Mozilla|visitante/);
});

test("token errado ou ausente: 401", async () => {
  const { api } = montar();
  assert.equal((await api(get("", "token-errado-com-mais-de-32-caracteres-00000"))).status, 401);
  assert.equal((await api(get("", TOKEN.slice(0, -1)))).status, 401);
  assert.equal((await api(get("", null))).status, 401);
  const semBearer = new Request("https://exemplo.test/metricas-afio", { headers: { Authorization: TOKEN } });
  assert.equal((await api(semBearer)).status, 401);
});

test("variável ausente: 503, nunca libera", async () => {
  for (const token of [undefined, "", "curto"]) {
    const { api } = montar({ token });
    assert.equal((await api(get("", null))).status, 503);
    assert.equal((await api(get("", token ?? "qualquer"))).status, 503);
  }
});

test("dias aceita 7, 30 e 90; qualquer outro vale 30", async () => {
  const { api } = montar();
  const dias = async (q: string) => (await (await api(get(q))).json()) as { dias: number; desde: string };
  const sete = await dias("?dias=7");
  assert.deepEqual([sete.dias, sete.desde], [7, "2026-11-09"]);
  const noventa = await dias("?dias=90");
  assert.deepEqual([noventa.dias, noventa.desde], [90, "2026-08-18"]);
  for (const q of ["", "?dias=5", "?dias=abc", "?dias=-7", "?dias=07", "?dias=365"]) {
    const r = await dias(q);
    assert.equal(r.dias, 30, q);
    assert.equal(r.desde, "2026-10-17", q);
  }
});

test("a coleta recusa página ou alvo fora da lista", async () => {
  const { coleta, linhas } = montar();
  const status = async (corpo: unknown) => (await coleta(post(corpo))).status;
  assert.equal(await status({ pagina: "admin", tipo: "visita" }), 400);
  assert.equal(await status({ pagina: "home", tipo: "clique", alvo: "comprar-agora" }), 400);
  assert.equal(await status({ pagina: "home", tipo: "clique" }), 400);
  assert.equal(await status({ pagina: "home", tipo: "outro" }), 400);
  assert.equal(await status({ pagina: "home", tipo: "visita", alvo: "whatsapp" }), 400);
  assert.equal(await status("isto não é json"), 400);
  assert.equal(await status([]), 400);
  assert.equal(linhas.size, 0);
  assert.equal(await status({ pagina: "home", tipo: "visita" }), 200);
  assert.equal(linhas.size, 1);
});

test("visita repetida no mesmo dia soma em visitas e não em pessoas", async () => {
  const { coleta, api } = montar();
  for (let i = 0; i < 3; i++) await coleta(post({ pagina: "home", tipo: "visita", de: "https://l.instagram.com/" }));
  // a mesma pessoa abre outra página: conta nas páginas, mas é uma pessoa só no dia
  await coleta(post({ pagina: "sites", tipo: "visita", de: "https://auereastack.com.br/" }));
  // outra pessoa (outro IP)
  await coleta(post({ pagina: "home", tipo: "visita", de: "" }, { "x-forwarded-for": "198.51.100.9" }));

  const j = (await (await api(get("?dias=7"))).json()) as Record<string, unknown>;
  assert.deepEqual(j.paginas, [
    { pagina: "home", visitas: 4, pessoas: 2 },
    { pagina: "sites", visitas: 1, pessoas: 1 },
  ]);
  assert.deepEqual(j.porDia, [{ dia: "2026-11-15", visitas: 5, pessoas: 2 }]);
  const origens = j.origens as { pagina: string; origem: string; visitas: number; pessoas: number }[];
  assert.deepEqual(origens.find((o) => o.pagina === "home" && o.origem === "instagram"), { pagina: "home", origem: "instagram", visitas: 3, pessoas: 1 });
  assert.deepEqual(origens.find((o) => o.pagina === "home" && o.origem === "direto"), { pagina: "home", origem: "direto", visitas: 1, pessoas: 1 });
  assert.deepEqual(origens.find((o) => o.pagina === "sites"), { pagina: "sites", origem: "interno", visitas: 1, pessoas: 1 });
});

test("o código da pessoa muda de um dia para o outro e não guarda o IP", async () => {
  let agora = new Date("2026-11-15T15:00:00Z");
  const { coleta, linhas, api } = montar({ agora: () => agora });
  await coleta(post({ pagina: "home", tipo: "visita" }));
  agora = new Date("2026-11-16T15:00:00Z");
  await coleta(post({ pagina: "home", tipo: "visita" }));

  const [a, b] = [...linhas.values()];
  assert.notEqual(a.visitante, b.visitante);
  assert.match(a.visitante, /^[0-9a-f]{24}$/);
  assert.match(a.ipHash, /^[0-9a-f]{24}$/);
  assert.doesNotMatch(JSON.stringify([...linhas.values()]), /203\.0\.113\.7|Mozilla/);

  const j = (await (await api(get("?dias=7"))).json()) as { paginas: unknown; porDia: unknown };
  assert.deepEqual(j.paginas, [{ pagina: "home", visitas: 2, pessoas: 2 }]);
  assert.deepEqual(j.porDia, [
    { dia: "2026-11-15", visitas: 1, pessoas: 1 },
    { dia: "2026-11-16", visitas: 1, pessoas: 1 },
  ]);
});

test("robôs são ignorados e o limite por IP responde 200 sem gravar", async () => {
  const { coleta, linhas } = montar();
  for (const ua of ["", "Googlebot/2.1", "facebookexternalhit/1.1", "WhatsApp/2.23 Preview", "Baiduspider"]) {
    const r = await coleta(post({ pagina: "home", tipo: "visita" }, { "user-agent": ua }));
    assert.equal(r.status, 200);
  }
  assert.equal(linhas.size, 0);

  for (let i = 0; i < 130; i++) {
    const r = await coleta(post({ pagina: "home", tipo: "visita" }));
    assert.equal(r.status, 200);
  }
  assert.equal([...linhas.values()][0].vezes, 120);
});

test("a coleta responde 200 mesmo com o banco fora do ar e só aceita POST", async () => {
  const quebrado = { registrar: async () => { throw new Error("fora do ar"); }, resumo: async () => { throw new Error("fora do ar"); } };
  const coleta = criarColeta({ segredo: SEGREDO, banco: quebrado, agora: AGORA });
  assert.equal((await coleta(post({ pagina: "home", tipo: "visita" }))).status, 200);
  assert.equal((await coleta(new Request("https://exemplo.test/coleta"))).status, 405);
  const api = criarApi({ token: TOKEN, banco: quebrado, agora: AGORA });
  assert.equal((await api(get())).status, 500);
});

test("origem: ref normalizado, redes conhecidas, direto e interno", () => {
  assert.equal(origemDe("Insta Bio!", "https://google.com/"), "instabio");
  assert.equal(origemDe("x".repeat(60), ""), "x".repeat(40));
  assert.equal(origemDe("", "https://l.instagram.com/?u=abc"), "instagram");
  assert.equal(origemDe("", "https://www.google.com.br/search?q=aurea"), "google");
  assert.equal(origemDe("", "https://wa.me/5533"), "whatsapp");
  assert.equal(origemDe("", "https://m.facebook.com/"), "facebook");
  assert.equal(origemDe("", "https://www.exemplo.com.br/pagina?x=1"), "exemplo.com.br");
  assert.equal(origemDe("", ""), "direto");
  assert.equal(origemDe(undefined, "não é url"), "direto");
  assert.equal(origemDe("", "https://auereastack.com.br/servicos/sites/"), "interno");
});

test("o dia é o de São Paulo e o período inclui hoje", () => {
  assert.equal(diaSP(new Date("2026-11-16T02:30:00Z")), "2026-11-15"); // 23h30 do dia 15 em São Paulo
  assert.equal(diaSP(new Date("2026-11-16T03:30:00Z")), "2026-11-16");
  assert.equal(desdeDia("2026-11-15", 7), "2026-11-09");
  assert.equal(desdeDia("2026-03-01", 30), "2026-01-31");
});

test("muitas origens: as 12 maiores e o resto em outros", async () => {
  const { coleta, api } = montar();
  for (let i = 0; i < 15; i++) {
    // origens com pesos diferentes, cada uma de um IP
    for (let k = 0; k <= i; k++) {
      await coleta(post({ pagina: "home", tipo: "visita", ref: `canal${String(i).padStart(2, "0")}` }, { "x-forwarded-for": `198.51.100.${i}` }));
    }
  }
  const j = (await (await api(get())).json()) as { origens: { origem: string; visitas: number; pessoas: number }[] };
  assert.equal(j.origens.length, 13);
  assert.deepEqual(j.origens.at(-1), { pagina: "home", origem: "outros", visitas: 1 + 2 + 3, pessoas: 3 });
  assert.equal(j.origens[0].origem, "canal14");
});
