"use client";

import { motion } from "framer-motion";
import { CheckCheck, Copy, MapPin, Mic, Phone as PhoneIcon, Play, Video } from "lucide-react";
import type { ReactNode } from "react";
import { AuriIcon, type Outfit } from "@/components/mascot";
import { cn } from "@/lib/utils";

/*
  Peças de um WhatsApp de mentira, para as demonstrações de automação.
*/

export type WaMsg =
  | { from: "cliente" | "ia" | "humano"; text: string; time: string }
  | { from: "cliente"; audio: string; time: string }
  | { from: "ia"; card: "menu"; title: string; items: [string, string][]; time: string }
  | { from: "ia"; card: "pix"; value: string; time: string }
  | { from: "ia"; card: "slots"; title: string; slots: string[]; picked?: number; time: string }
  | { from: "ia"; card: "local"; title: string; address: string; time: string }
  | { from: "sistema"; text: string };

export const WA_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='none' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Cpath d='M40 8l8 8M48 8l-8 8'/%3E%3Crect x='36' y='38' width='12' height='9' rx='2'/%3E%3Cpath d='M8 44q6-8 12 0t12 0'/%3E%3C/svg%3E\")";

export function Bubble({ m }: { m: WaMsg }) {
  if (m.from === "sistema") {
    return (
      <div className="self-center rounded-md bg-[#182229] px-3 py-1 text-[12px] text-[#8696a0]">{m.text}</div>
    );
  }
  const mine = m.from === "cliente";
  const time = (
    <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 text-[11px] text-white/50 tabular-nums">
      {m.time}
      {mine && <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" aria-hidden="true" />}
    </span>
  );
  let body: ReactNode;
  if ("audio" in m) {
    body = (
      <span className="flex items-center gap-2.5">
        <Play className="h-4 w-4 fill-current" aria-hidden="true" />
        <span className="flex h-4 items-center gap-[2px]" aria-hidden="true">
          {[5, 9, 4, 11, 7, 13, 6, 10, 4, 8, 12, 5, 7, 3, 9, 6].map((h, k) => (
            <i key={k} className="w-[2.5px] rounded bg-white/80" style={{ height: h }} />
          ))}
        </span>
        <span className="tabular-nums">{m.audio}</span>
        <span className="sr-only">Mensagem de áudio</span>
        {time}
      </span>
    );
  } else if ("card" in m && m.card === "menu") {
    body = (
      <span className="block min-w-[200px]">
        <span className="block font-semibold">{m.title}</span>
        {m.items.map(([n, p]) => (
          <span key={n} className="mt-1 flex justify-between gap-6 border-t border-white/10 pt-1 text-[13px]">
            <span>{n}</span>
            <span className="tabular-nums text-[#25d366]">{p}</span>
          </span>
        ))}
        <span className="block text-right">{time}</span>
      </span>
    );
  } else if ("card" in m && m.card === "pix") {
    body = (
      <span className="block min-w-[200px]">
        <span className="block text-[12px] text-white/60">Pix copia e cola</span>
        <span className="mt-0.5 block text-[18px] font-bold tabular-nums">{m.value}</span>
        <span className="mt-2 flex items-center justify-center gap-2 rounded-md bg-white/10 py-1.5 text-[13px] font-semibold text-[#53bdeb]">
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Copiar código
        </span>
        <span className="block text-right">{time}</span>
      </span>
    );
  } else if ("card" in m && m.card === "slots") {
    body = (
      <span className="block min-w-[200px]">
        <span className="block">{m.title}</span>
        <span className="mt-2 grid gap-1">
          {m.slots.map((s, i) => (
            <span
              key={s}
              className={cn(
                "rounded-md py-1.5 text-center text-[13px] font-semibold",
                m.picked === i ? "bg-[#25d366] text-[#0b141a]" : "bg-white/10 text-[#53bdeb]",
              )}
            >
              {s}
            </span>
          ))}
        </span>
        <span className="block text-right">{time}</span>
      </span>
    );
  } else if ("card" in m && m.card === "local") {
    body = (
      <span className="block min-w-[200px]">
        <span className="flex h-16 items-center justify-center rounded-md bg-[#2a3942]">
          <MapPin className="h-6 w-6 text-[#ff5d5d]" aria-hidden="true" />
        </span>
        <span className="mt-1.5 block font-semibold">{m.title}</span>
        <span className="block text-[13px] text-white/70">{m.address}</span>
        <span className="block text-right">{time}</span>
      </span>
    );
  } else {
    body = (
      <>
        {m.from === "humano" && <span className="block text-[12px] font-semibold text-[#ffb35c]">Equipe</span>}
        {m.text}
        {time}
      </>
    );
  }
  return (
    <div
      className={cn(
        "max-w-[84%] rounded-lg px-3 py-1.5 text-[14px] leading-snug text-[#e9edef]",
        mine ? "self-end rounded-tr-sm bg-[#005c4b]" : "self-start rounded-tl-sm bg-[#202c33]",
      )}
    >
      {body}
    </div>
  );
}

export function Typing() {
  return (
    <div className="flex gap-1 self-start rounded-lg bg-[#202c33] px-3 py-2.5" aria-label="digitando">
      {[0, 1, 2].map((i) => (
        <motion.i
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white/60"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

/** Celular com o WhatsApp aberto numa conversa. */
export function Phone({
  name,
  status,
  outfit = "headset",
  children,
  footer,
  className,
}: {
  name: string;
  status: string;
  outfit?: Outfit;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-ui
      className={cn(
        "relative mx-auto flex flex-col overflow-hidden rounded-[38px] bg-[#0b141a] p-0 ring-[10px] ring-[#1a2026]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 bg-[#202c33] px-4 pb-2.5 pt-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2a3942]">
          <AuriIcon outfit={outfit} className="w-7" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[15px] font-semibold text-[#e9edef]">{name}</span>
          <span className="block text-[12px] text-[#25d366]">{status}</span>
        </span>
        <Video className="h-4 w-4 text-white/60" aria-hidden="true" />
        <PhoneIcon className="ml-3 h-4 w-4 text-white/60" aria-hidden="true" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden p-3" style={{ backgroundImage: WA_PATTERN }}>
        {children}
      </div>
      {footer ?? (
        <div className="flex items-center gap-2 bg-[#202c33] px-3 py-2.5">
          <span className="flex-1 rounded-full bg-[#2a3942] px-4 py-2 text-[13px] text-white/50">Mensagem</span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#00a884] text-[#0b141a]">
            <Mic className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      )}
    </div>
  );
}
