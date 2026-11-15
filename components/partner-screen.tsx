"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Msg = { me?: boolean; text: string; time: string };
type Line = {
  code: string;
  name: string;
  phone: string;
  /** conversas novas que aparecem na bolinha verde quando o número não está aberto */
  unread: number;
  chats: { initials: string; name: string; last: string; time: string; color: string; unread?: number }[];
  msgs: Msg[];
};

// Dados de exemplo, os mesmos da apresentação do AFIO conect.
const LINES: Line[] = [
  {
    code: "VEN",
    name: "Vendas",
    phone: "(31) 3333-0101",
    unread: 3,
    chats: [
      { initials: "CL", name: "Carla Lima", last: "Tem no tamanho M?", time: "10:42", color: "#3d5a9e", unread: 2 },
      { initials: "RB", name: "Rafael B.", last: "Fechado, pode mandar", time: "10:31", color: "#6b4a9e", unread: 1 },
      { initials: "DM", name: "Dona Marta", last: "Obrigada!", time: "09:58", color: "#2f7a5c" },
    ],
    msgs: [
      { text: "Oi! Vi o vestido azul no site.", time: "10:39" },
      { me: true, text: "Oi, Carla! Temos sim, quer que eu separe?", time: "10:40" },
      { text: "Tem no tamanho M?", time: "10:42" },
    ],
  },
  {
    code: "SUP",
    name: "Suporte",
    phone: "(31) 3333-0102",
    unread: 1,
    chats: [
      { initials: "TS", name: "Thiago S.", last: "Qual o prazo de entrega?", time: "09:12", color: "#9e6a3d", unread: 1 },
      { initials: "LM", name: "Lúcia M.", last: "Deu certo, valeu!", time: "08:47", color: "#3d5a9e" },
      { initials: "PA", name: "Paulo A.", last: "Vou testar aqui", time: "08:20", color: "#2f7a5c" },
    ],
    msgs: [
      { text: "Qual o prazo de entrega?", time: "09:12" },
      { me: true, text: "Oi, Thiago! Sai hoje e chega em 2 dias.", time: "09:13" },
      { text: "Perfeito, obrigado!", time: "09:14" },
    ],
  },
  {
    code: "SUL",
    name: "Filial Sul",
    phone: "(31) 3333-0124",
    unread: 2,
    chats: [
      { initials: "JR", name: "Júlia R.", last: "Vocês abrem sábado?", time: "11:05", color: "#6b4a9e", unread: 2 },
      { initials: "AM", name: "André M.", last: "Pode reservar", time: "10:50", color: "#9e6a3d" },
      { initials: "BS", name: "Bia S.", last: "Chego às 15h", time: "10:22", color: "#3d5a9e" },
    ],
    msgs: [
      { text: "Vocês abrem sábado?", time: "11:05" },
      { me: true, text: "Abrimos, das 9h às 13h.", time: "11:06" },
      { text: "Ótimo, passo aí de manhã!", time: "11:07" },
    ],
  },
];

const RAIL = ["VEN", "SUP", "NOR", "SUL", "RH"];
const STEPS = 5; // 3 mensagens entrando + 2 tempos de pausa antes de trocar de número

/**
 * A tela do atendente do AFIO conect, refeita em miniatura: a coluna da esquerda traz
 * os números da empresa, e a conversa muda conforme o número escolhido.
 */
export function AfioScreen() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 1300);
    return () => clearInterval(id);
  }, [reduce]);

  const li = Math.floor(tick / STEPS) % LINES.length;
  const line = LINES[li];
  const shown = reduce ? line.msgs.length : Math.min(line.msgs.length, (tick % STEPS) + 1);
  const who = line.chats[0];

  return (
    <div
      data-ui
      aria-hidden="true"
      className="overflow-hidden rounded-2xl bg-[#0b141a] text-[#e9edef] shadow-[0_30px_80px_-30px_color-mix(in_srgb,var(--tc)_55%,transparent)] ring-1 ring-tc/25"
    >
      <div className="flex h-[380px]">
        {/* 1. os números */}
        <ul className="flex w-[58px] shrink-0 flex-col items-center gap-2.5 border-r border-white/8 bg-[#0a1014] py-3">
          {RAIL.map((code) => {
            const l = LINES.find((x) => x.code === code);
            const on = code === line.code;
            return (
              <li key={code} className="relative">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl text-[11px] font-bold tracking-wide transition-colors duration-300",
                    on ? "bg-tc/20 text-white ring-2 ring-tc" : "bg-white/6 text-white/60",
                  )}
                >
                  {code}
                </span>
                {l && !on && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#00a884] px-1 text-[10px] font-bold text-[#04130d]">
                    {l.unread}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* 2. as conversas do número escolhido */}
        <div className="hidden w-[40%] shrink-0 flex-col border-r border-white/8 bg-[#111b21] sm:flex">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={line.code}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col"
            >
              <div className="px-3.5 pb-2 pt-3">
                <p className="text-[15px] font-bold leading-tight">{line.name}</p>
                <p className="text-[11px] text-[#8696a0]">{line.phone}</p>
              </div>
              <ul>
                {line.chats.map((c, i) => (
                  <li key={c.name} className={cn("flex items-center gap-2.5 px-3.5 py-2.5", i === 0 && "bg-white/6")}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: c.color }}>
                      {c.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[13px] font-semibold">{c.name}</span>
                        <span className={cn("text-[10px]", c.unread ? "text-[#00a884]" : "text-[#8696a0]")}>{c.time}</span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[12px] text-[#8696a0]">{c.last}</span>
                        {c.unread && (
                          <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#00a884] px-1 text-[10px] font-bold text-[#04130d]">
                            {c.unread}
                          </span>
                        )}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. a conversa */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2.5 border-b border-white/8 bg-[#111b21] px-3.5 py-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: who.color }}>
              {who.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">{who.name}</span>
              <span className="block truncate text-[11px] text-[#8696a0]">pelo número {line.name}</span>
            </span>
            <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/20">Transferir</span>
          </div>

          <ul className="flex flex-1 flex-col justify-end gap-2 px-3.5 py-3">
            <AnimatePresence initial={false}>
              {line.msgs.slice(0, shown).map((m) => (
                <motion.li
                  key={`${line.code}-${m.time}`}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28 }}
                  className={cn(
                    "max-w-[88%] rounded-xl px-3 py-2 text-[13px] leading-snug",
                    m.me ? "self-end rounded-br-sm bg-[#005c4b]" : "self-start rounded-bl-sm bg-[#202c33]",
                  )}
                >
                  {m.text} <span className="ml-1 whitespace-nowrap text-[10px] text-white/55">{m.time}{m.me ? " ✓✓" : ""}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="flex items-center gap-2 border-t border-white/8 bg-[#111b21] px-3.5 py-2.5">
            <span className="flex-1 rounded-full bg-white/6 px-3.5 py-2 text-[12px] text-[#8696a0]">Mensagem</span>
            <span className="h-8 w-8 rounded-full bg-[#00a884]" />
          </div>
        </div>
      </div>
    </div>
  );
}
