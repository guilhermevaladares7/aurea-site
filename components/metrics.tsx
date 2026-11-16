"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { METRICAS_URL } from "@/lib/site";

/**
 * Coleta de visitas e cliques para o painel da AFIO (o servidor fica em supabase/functions/coleta).
 * Sem cookie: manda só o nome da página, o ?ref= e de onde a pessoa veio.
 * Os nomes de página e de alvo têm que existir na lista do servidor, senão ele recusa.
 */
const PAGINAS: Record<string, string> = {
  "/": "home",
  "/ig": "home",
  "/servicos/sites": "sites",
  "/servicos/sistemas": "sistemas",
  "/servicos/automacoes": "automacoes",
};

// a primeira página da visita carrega o ?ref= e o site de origem; as seguintes são navegação interna
let primeira = true;
let ultimo = "";
let atual = { pagina: "", ref: "", de: "" };

function enviar(dados: Record<string, string>) {
  if (!METRICAS_URL) return;
  // erro de rede nunca pode quebrar a página
  try {
    const corpo = JSON.stringify(dados);
    // text/plain: o navegador envia direto, sem pedir permissão antes ao outro servidor
    if (navigator.sendBeacon?.(METRICAS_URL, new Blob([corpo], { type: "text/plain" }))) return;
    fetch(METRICAS_URL, {
      method: "POST",
      body: corpo,
      keepalive: true,
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
    }).catch(() => {});
  } catch {}
}

export function Metrics() {
  const path = usePathname();

  useEffect(() => {
    const limpo = path.replace(/\/$/, "") || "/";
    if (limpo === ultimo) return;
    ultimo = limpo;
    const pagina = PAGINAS[limpo];
    if (!pagina) {
      atual = { pagina: "", ref: "", de: "" };
      return;
    }
    let ref = "";
    let de = location.origin + "/";
    if (primeira) {
      const q = new URLSearchParams(location.search);
      // o endereço /ig é o da bio do Instagram
      ref = q.get("ref") || q.get("utm_source") || (limpo === "/ig" ? "instagram" : "");
      de = document.referrer;
    }
    primeira = false;
    atual = { pagina, ref, de };
    enviar({ ...atual, tipo: "visita" });
  }, [path]);

  useEffect(() => {
    // um listener só, na fase de captura: pega o clique mesmo que o botão pare a propagação
    const onClick = (e: MouseEvent) => {
      const alvo = (e.target as Element | null)?.closest?.("[data-metrica]")?.getAttribute("data-metrica");
      if (alvo && atual.pagina) enviar({ ...atual, tipo: "clique", alvo });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
