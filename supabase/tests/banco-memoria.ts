import type { Banco, Evento, Resumo } from "../functions/_shared/metricas.ts";

/**
 * Banco de mentira para os testes, com as mesmas regras do arquivo de migração
 * (migrations/20261115000000_metricas.sql): uma linha por (dia, página, tipo, alvo, visitante),
 * contador com teto de 1000, origem da primeira vez no dia e limite de 120 eventos por IP.
 */
export function bancoMemoria() {
  type Linha = Evento & { vezes: number };
  const linhas = new Map<string, Linha>();
  const limite = new Map<string, number>();

  const banco: Banco = {
    async registrar(e: Evento) {
      const n = (limite.get(e.ipHash) ?? 0) + 1;
      limite.set(e.ipHash, n);
      if (n > 120) return;
      const chave = [e.dia, e.pagina, e.tipo, e.alvo, e.visitante].join("|");
      const antes = linhas.get(chave);
      if (antes) antes.vezes = Math.min(antes.vezes + 1, 1000);
      else linhas.set(chave, { ...e, vezes: 1 });
    },

    async resumo(desde: string): Promise<Resumo> {
      const doPeriodo = [...linhas.values()].filter((l) => l.dia >= desde);
      const visitas = doPeriodo.filter((l) => l.tipo === "visita");
      const cliquesLinhas = doPeriodo.filter((l) => l.tipo === "clique");

      function agrupar<T extends Record<string, string | number>>(
        ls: Linha[],
        chave: (l: Linha) => string,
        novo: (l: Linha) => T,
        total: "visitas" | "cliques",
      ) {
        const m = new Map<string, T & { pessoas: number }>();
        for (const l of ls) {
          const k = chave(l);
          const x = m.get(k) ?? ({ ...novo(l), [total]: 0, pessoas: 0 } as T & { pessoas: number });
          (x as Record<string, number>)[total] += l.vezes;
          x.pessoas += 1;
          m.set(k, x);
        }
        return [...m.values()];
      }

      const maiorPrimeiro = (campo: string) => (a: Record<string, string | number>, b: Record<string, string | number>) =>
        Number(b[campo]) - Number(a[campo]) || String(a.pagina).localeCompare(String(b.pagina));
      const paginas = agrupar(visitas, (l) => l.pagina, (l) => ({ pagina: l.pagina }), "visitas").sort(maiorPrimeiro("visitas"));
      const cliques = agrupar(cliquesLinhas, (l) => l.pagina + "|" + l.alvo, (l) => ({ pagina: l.pagina, alvo: l.alvo }), "cliques").sort(
        maiorPrimeiro("cliques"),
      );

      // as 12 maiores origens de cada página; o resto vira "outros"
      const porOrigem = agrupar(visitas, (l) => l.pagina + "|" + l.origem, (l) => ({ pagina: l.pagina, origem: l.origem }), "visitas") as unknown as {
        pagina: string;
        origem: string;
        visitas: number;
        pessoas: number;
      }[];
      const origens: typeof porOrigem = [];
      for (const pagina of new Set(porOrigem.map((o) => o.pagina))) {
        const dela = porOrigem.filter((o) => o.pagina === pagina).sort((a, b) => b.visitas - a.visitas || a.origem.localeCompare(b.origem));
        origens.push(...dela.slice(0, 12));
        const resto = dela.slice(12);
        if (resto.length) {
          origens.push({
            pagina,
            origem: "outros",
            visitas: resto.reduce((s, o) => s + o.visitas, 0),
            pessoas: resto.reduce((s, o) => s + o.pessoas, 0),
          });
        }
      }

      // por dia, "pessoas" é no site inteiro: quem abriu duas páginas conta uma vez
      const dias = new Map<string, { dia: string; visitas: number; quem: Set<string> }>();
      for (const l of visitas) {
        const d = dias.get(l.dia) ?? { dia: l.dia, visitas: 0, quem: new Set<string>() };
        d.visitas += l.vezes;
        d.quem.add(l.visitante);
        dias.set(l.dia, d);
      }
      const porDia = [...dias.values()]
        .sort((a, b) => a.dia.localeCompare(b.dia))
        .map((d) => ({ dia: d.dia, visitas: d.visitas, pessoas: d.quem.size }));

      return { paginas, cliques, origens, porDia };
    },
  };

  return { banco, linhas };
}
