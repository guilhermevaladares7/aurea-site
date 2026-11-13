"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { AuriIcon, type Outfit } from "@/components/mascot";

/**
 * Faixa grande que anda para os lados conforme a rolagem
 * (e entorta um pouco quando a rolagem é rápida).
 */
const ITEMS: { t: string; outfit: Outfit; c: string }[] = [
  { t: "Sites", outfit: "hardhat", c: "text-sites" },
  { t: "Sistemas", outfit: "tie", c: "text-sistemas" },
  { t: "Automações com IA", outfit: "headset", c: "text-ia" },
];

export function MarqueeBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"]);
  const v = useVelocity(scrollY);
  const skew = useSpring(useTransform(v, [-2500, 0, 2500], [8, 0, -8]), { stiffness: 300, damping: 40 });

  const row = (x: typeof x1, outline: boolean) => (
    <motion.div style={reduce ? undefined : { x, skewX: skew }} className="flex w-max items-center gap-10 whitespace-nowrap">
      {Array.from({ length: 4 }).flatMap((_, k) =>
        ITEMS.map((it) => (
          <span key={`${k}-${it.t}`} className="flex items-center gap-10">
            <span
              className={`text-[clamp(48px,8vw,128px)] font-extrabold leading-none tracking-[-0.04em] [font-stretch:125%] ${
                outline ? "text-transparent [-webkit-text-stroke:1.5px_rgba(232,242,244,.35)]" : it.c
              }`}
            >
              {it.t}
            </span>
            <AuriIcon outfit={it.outfit} mood="happy" className="w-[clamp(44px,5vw,76px)]" />
          </span>
        )),
      )}
    </motion.div>
  );

  return (
    <div ref={ref} aria-hidden="true" className="relative overflow-hidden py-16 lg:py-24">
      {row(x1, false)}
      <div className="mt-4">{row(x2, true)}</div>
    </div>
  );
}
