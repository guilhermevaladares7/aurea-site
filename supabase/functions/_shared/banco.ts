import type { Banco, Evento, Resumo } from "./metricas.ts";

/**
 * O banco do Supabase, chamado pelas duas funções do arquivo de migração (metricas_registrar e
 * metricas_resumo). Usa a chave de serviço, que só existe dentro das funções: nunca vai para o site.
 */
export function bancoSupabase(ler: (nome: string) => string | undefined): Banco {
  const url = ler("SUPABASE_URL");
  // a chave de serviço antiga ou, se ela for desligada no projeto, a primeira das chaves secretas novas
  let chave = ler("SUPABASE_SERVICE_ROLE_KEY");
  if (!chave) {
    try {
      chave = Object.values(JSON.parse(ler("SUPABASE_SECRET_KEYS") ?? "{}") as Record<string, string>)[0];
    } catch {
      chave = undefined;
    }
  }

  async function rpc(nome: string, args: unknown): Promise<unknown> {
    if (!url || !chave) throw new Error("banco não configurado");
    const r = await fetch(`${url}/rest/v1/rpc/${nome}`, {
      method: "POST",
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!r.ok) throw new Error(`banco respondeu ${r.status}`);
    return r.status === 204 ? null : await r.json();
  }

  return {
    async registrar(e: Evento) {
      await rpc("metricas_registrar", {
        p_dia: e.dia,
        p_pagina: e.pagina,
        p_tipo: e.tipo,
        p_alvo: e.alvo,
        p_visitante: e.visitante,
        p_origem: e.origem,
        p_ip_hash: e.ipHash,
      });
    },
    async resumo(desde: string) {
      return ((await rpc("metricas_resumo", { p_desde: desde })) ?? {}) as Resumo;
    },
  };
}
