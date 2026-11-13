"use client";

import { motion } from "framer-motion";
import { AuriIcon } from "@/components/mascot";
import { useTicker } from "./use-ticker";

/*
  O "bastidor" da automação: um terminal de agente, no estilo do Claude Code,
  com o Auri na tela de boas-vindas e cada ação que a IA executa aparecendo
  linha a linha.
*/

const RUNS = [
  {
    input: "Oi! Tem bolo de cenoura hoje?",
    lines: [
      { kind: "tool", text: "Lendo cardapio.pdf" },
      { kind: "tool", text: "Conferindo estoque do dia na planilha" },
      { kind: "ok", text: "Bolo de cenoura: 3 disponíveis · R$ 38" },
      { kind: "tool", text: "Reservando 1 bolo · retirada 17h" },
      { kind: "ok", text: "Pedido #1043 criado no painel" },
      { kind: "send", text: "Resposta enviada no WhatsApp em 3 s" },
    ],
  },
  {
    input: "[áudio 0:07]",
    lines: [
      { kind: "tool", text: "Transcrevendo áudio" },
      { kind: "ok", text: "“Duas dúzias de pão de queijo pra sábado”" },
      { kind: "tool", text: "Consultando agenda de entregas de sábado" },
      { kind: "ok", text: "Horário livre às 8h" },
      { kind: "tool", text: "Pedindo confirmação ao cliente" },
      { kind: "send", text: "Pedido #1044 anotado · lembrete na sexta às 18h" },
    ],
  },
  {
    input: "Prefiro falar com uma pessoa",
    lines: [
      { kind: "tool", text: "Resumindo a conversa" },
      { kind: "ok", text: "Cliente quer trocar o sabor da encomenda #1031" },
      { kind: "tool", text: "Avisando a equipe no grupo do WhatsApp" },
      { kind: "ok", text: "Ana assumiu a conversa" },
      { kind: "send", text: "IA pausada nesta conversa" },
    ],
  },
];

const DURATIONS = [900, 700, 700, 700, 700, 700, 700, 2600];

export function AgentTerminal() {
  const { ref, step, round } = useTicker(DURATIONS);
  const run = RUNS[round % RUNS.length];
  const shown = Math.max(0, step - 1);

  return (
    <div ref={ref} data-ui className="overflow-hidden rounded-2xl bg-[#0d0c0b] text-[13px] leading-relaxed text-foreground sm:text-[14px]">
      <div className="flex items-center gap-1.5 bg-surface-2 px-4 py-2.5" aria-hidden="true">
        <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-[12px] text-muted-foreground">aurea-agent — atendimento</span>
      </div>

      <div className="p-4 sm:p-5">
        {/* boas-vindas com o mascote */}
        <div className="flex items-center gap-4 rounded-lg px-4 py-3 ring-1 ring-primary/40">
          <AuriIcon className="w-12 shrink-0 sm:w-14" />
          <div>
            <p className="pixel text-[18px] text-primary">Aurea Agent</p>
            <p className="text-[12px] text-muted-foreground">WhatsApp · planilha · agenda · painel conectados</p>
          </div>
        </div>

        <div className="mt-4 min-h-[13.5rem] font-mono" key={round}>
          <p className="text-muted-foreground">
            <span className="text-ia">›</span> nova mensagem: <span className="text-foreground">{run.input}</span>
          </p>
          <ul className="mt-2 space-y-1">
            {run.lines.slice(0, shown).map((l, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-2"
              >
                <span className={l.kind === "tool" ? "text-primary" : l.kind === "ok" ? "text-ia" : "text-sistemas"} aria-hidden="true">
                  {l.kind === "tool" ? "●" : l.kind === "ok" ? "⎿" : "✓"}
                </span>
                <span className={l.kind === "ok" ? "text-foreground/75" : "text-foreground"}>{l.text}</span>
              </motion.li>
            ))}
            {shown < run.lines.length && (
              <li className="flex gap-2 text-primary">
                <motion.span className="inline-block" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} aria-hidden="true">
                  ✻
                </motion.span>
                <span className="text-muted-foreground">pensando…</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
