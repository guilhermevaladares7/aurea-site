"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, Play } from "lucide-react";
import { AuriIcon } from "@/components/mascot";
import { cn } from "@/lib/utils";
import { SCENES } from "@/lib/chat-scenes";
import { useTicker } from "./use-ticker";

/*
  Conversa de WhatsApp com a IA, em loop, passando por quatro situações:
  pedido novo, pedido por áudio, troca de data e "quero falar com uma pessoa".
*/

// 0 vazio · 1 cliente · 2 digitando · 3 ia · 4 cliente · 5 digitando · 6 ia · 7 segura
const DURATIONS = [500, 1000, 1100, 1300, 1000, 1000, 1300, 2600];
const VISIBLE_AT = [1, 3, 4, 6]; // em que passo cada mensagem aparece

// textura de fundo do chat (desenhos pequenos e apagados, como no WhatsApp)
const PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='none' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Cpath d='M40 8l8 8M48 8l-8 8'/%3E%3Crect x='36' y='38' width='12' height='9' rx='2'/%3E%3Cpath d='M8 44q6-8 12 0t12 0'/%3E%3C/svg%3E\")";

export function AiDemo({ large = false }: { large?: boolean }) {
  const { ref, step, round } = useTicker(DURATIONS);
  const scene = SCENES[round % SCENES.length];
  const typing = step === 2 || step === 5;

  return (
    <div
      ref={ref}
      data-ui
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl bg-[#0b141a]",
        large ? "text-[14px]" : "text-[11px]",
      )}
    >
      {/* cabeçalho do WhatsApp */}
      <div className={cn("flex items-center gap-2 bg-[#1f2c33]", large ? "px-4 py-3" : "px-3 py-2")}>
        <span className={cn("grid shrink-0 place-items-center rounded-full bg-[#2a3942]", large ? "h-10 w-10" : "h-7 w-7")}>
          <AuriIcon className={large ? "w-7" : "w-5"} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block font-semibold text-foreground">Sua loja</span>
          <span className={cn("block text-ia", large ? "text-[12px]" : "text-[10px]")}>
            {typing ? "digitando…" : "online"}
          </span>
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={scene.label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={cn(
              "ml-auto shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-muted-foreground",
              large ? "text-[12px]" : "text-[10px]",
            )}
          >
            {scene.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* conversa */}
      <div
        className={cn("flex flex-1 flex-col justify-end gap-1.5 overflow-hidden", large ? "p-4" : "p-2.5")}
        style={{ backgroundImage: PATTERN }}
        key={round}
        aria-live="polite"
      >
        {scene.msgs.map((m, i) =>
          step >= VISIBLE_AT[i] ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className={cn(
                "max-w-[82%] rounded-lg px-2.5 py-1.5 text-foreground",
                m.from === "cliente" ? "self-end rounded-tr-sm bg-[#005c4b]" : "self-start rounded-tl-sm bg-[#1f2c33]",
              )}
            >
              {m.audio ? (
                <span className="flex items-center gap-2">
                  <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                  <span className="flex h-3 items-center gap-[2px]" aria-hidden="true">
                    {[5, 9, 4, 11, 7, 12, 6, 9, 4, 8, 10, 5, 7, 3].map((h, k) => (
                      <i key={k} className="w-[2px] rounded bg-foreground/80" style={{ height: h }} />
                    ))}
                  </span>
                  <span className="tabular-nums">{m.audio}</span>
                  <span className="sr-only">Mensagem de áudio</span>
                </span>
              ) : (
                m.text
              )}
              <span className="ml-2 inline-block translate-y-0.5 text-[0.8em] text-foreground/55 tabular-nums">
                {m.time}
                {m.from === "cliente" && <span className="ml-1 text-[#53bdeb]">✓✓</span>}
              </span>
            </motion.div>
          ) : null,
        )}

        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1 self-start rounded-lg bg-[#1f2c33] px-3 py-2"
            aria-label="IA digitando"
          >
            {[0, 1, 2].map((i) => (
              <motion.i
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-foreground/60"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* barra de digitar */}
      <div className={cn("flex items-center gap-2 bg-[#1f2c33]", large ? "px-4 py-2.5" : "px-3 py-1.5")}>
        <span className="flex-1 rounded-full bg-[#2a3942] px-3 py-1 text-muted-foreground">Mensagem</span>
        <span className={cn("grid place-items-center rounded-full bg-[#00a884] text-[#0b141a]", large ? "h-8 w-8" : "h-6 w-6")}>
          <Mic className={large ? "h-4 w-4" : "h-3 w-3"} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
