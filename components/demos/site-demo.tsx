"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTicker } from "./use-ticker";

// Exemplos de clientes (fictícios) que o mini-site monta em sequência.
const SAMPLES = [
  {
    domain: "padariasolnascente.com.br",
    name: "Padaria Sol Nascente",
    line: "Pão quentinho a partir das 6h",
    cta: "Encomendar no WhatsApp",
    photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&q=70&auto=format&fit=crop",
    alt: "Pães artesanais sobre uma bancada de madeira",
  },
  {
    domain: "barbeariadozeca.com.br",
    name: "Barbearia do Zeca",
    line: "Corte e barba com hora marcada",
    cta: "Agendar horário",
    photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=640&q=70&auto=format&fit=crop",
    alt: "Cadeira e ferramentas de barbearia",
  },
  {
    domain: "cafedapraca.com.br",
    name: "Café da Praça",
    line: "Café especial e bolo do dia",
    cta: "Ver cardápio",
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&q=70&auto=format&fit=crop",
    alt: "Xícara de café sobre a mesa",
  },
];

// 0 vazio · 1 menu · 2 título · 3 foto · 4 botão · 5 cursor vai · 6 clique · 7 no ar
const DURATIONS = [700, 550, 650, 700, 600, 900, 450, 2600];

export function SiteDemo() {
  const { ref, step, round } = useTicker(DURATIONS);
  const s = SAMPLES[round % SAMPLES.length];
  const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring" as const, stiffness: 380, damping: 26 } };

  return (
    <div ref={ref} data-ui className="flex h-full flex-col overflow-hidden rounded-xl bg-[#0e0f11] text-[11px]">
      {/* barra do navegador */}
      <div className="flex items-center gap-2 bg-surface-2 px-3 py-2">
        <span className="flex gap-1" aria-hidden="true">
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-background/70 px-2 py-1 text-[10px] text-muted-foreground">
          {s.domain}
        </span>
        <motion.span
          animate={step === 6 ? { scale: [1, 0.9, 1] } : { scale: 1 }}
          className={
            "rounded-md px-2 py-1 text-[10px] font-semibold transition-colors " +
            (step >= 6 ? "bg-sites text-primary-foreground" : "bg-white/10 text-foreground")
          }
        >
          {step >= 7 ? "No ar" : "Publicar"}
        </motion.span>
      </div>

      {/* o site sendo montado */}
      <div className="relative flex-1 p-3" key={round}>
        {step >= 1 && (
          <motion.div {...pop} className="flex items-center justify-between">
            <span className="font-bold text-foreground">{s.name.split(" ")[0]}</span>
            <span className="flex gap-3 text-muted-foreground">
              <span>Início</span>
              <span>Sobre</span>
              <span>Contato</span>
            </span>
          </motion.div>
        )}

        <div className="mt-3 grid grid-cols-[1.1fr_1fr] gap-3">
          <div>
            {step >= 2 && (
              <motion.div {...pop}>
                <p className="text-[17px] font-extrabold leading-[1.05] tracking-tight text-foreground [font-stretch:115%]">
                  {s.name}
                </p>
                <p className="mt-1.5 text-muted-foreground">{s.line}</p>
              </motion.div>
            )}
            {step >= 4 && (
              <motion.span {...pop} className="mt-3 inline-block rounded-md bg-sites px-2.5 py-1.5 font-semibold text-primary-foreground">
                {s.cta}
              </motion.span>
            )}
          </div>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image src={s.photo} alt={s.alt} fill sizes="200px" className="object-cover" />
            </motion.div>
          )}
        </div>

        {/* cursor do mouse */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="absolute h-4 w-4 drop-shadow"
          initial={{ left: "40%", top: "80%", opacity: 0 }}
          animate={
            step >= 5 && step < 7
              ? { left: "88%", top: "-14%", opacity: 1 }
              : { left: "40%", top: "80%", opacity: step >= 4 && step < 7 ? 1 : 0 }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <path d="M2 1 L2 13 L5.5 10 L8 15 L10 14 L7.5 9 L12 9 Z" fill="#f1eee8" stroke="#0a0a0b" strokeWidth="1" />
        </motion.svg>

        <AnimatePresence>
          {step === 7 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-sites px-3 py-2 font-semibold text-primary-foreground"
            >
              <span>Site publicado ✓</span>
              <span className="tabular-nums">carregou em 0,8 s</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
