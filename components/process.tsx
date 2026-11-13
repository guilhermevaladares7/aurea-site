"use client";

import { useState } from "react";
import { Mascot, type BitMood, type Outfit } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Conversa",
    text: "Você conta o que precisa pelo WhatsApp ou numa chamada de 30 minutos. Você sai com escopo e preço fechados.",
    bit: "Pode mandar áudio, eu entendo tudo.",
    mood: "happy" as BitMood,
    outfit: "headset" as Outfit,
  },
  {
    title: "Protótipo",
    text: "Em poucos dias você vê a primeira versão funcionando no seu celular e pede os ajustes que quiser.",
    bit: "Compilando sua ideia…",
    mood: "think" as BitMood,
    outfit: "beret" as Outfit,
  },
  {
    title: "No ar",
    text: "Eu publico, te ensino a usar e sigo cuidando: hospedagem, manutenção e suporte entram no plano.",
    bit: "Publicado! Pode mostrar pra todo mundo.",
    mood: "wave" as BitMood,
    outfit: "crown" as Outfit,
  },
];

export function Process() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : STEPS[active];

  return (
    <section id="como-funciona" className="scroll-mt-20 px-4 pt-32 sm:px-8 lg:pt-48">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <Rise>
            <h2 className="text-[clamp(40px,5.6vw,84px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-foreground [font-stretch:112%]">
              Do papo ao ar em três passos
            </h2>
          </Rise>

          <ol className="mt-12 space-y-2">
            {STEPS.map((s, i) => (
              <Rise as="li" key={s.title} delay={0.08 * i}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(i)}
                  aria-label={`${s.title}: ${s.text}`}
                  className={cn(
                    "grid w-full grid-cols-[auto_1fr] items-baseline gap-x-6 rounded-2xl px-5 py-5 text-left transition-colors",
                    active === i ? "bg-surface-2" : "bg-transparent hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "wordmark text-[44px] transition-colors",
                      active === i ? "text-primary" : "text-foreground/30",
                    )}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[26px] font-bold leading-tight text-foreground">{s.title}</span>
                    <span className="mt-1.5 block max-w-[52ch] text-[17px] text-foreground/85">{s.text}</span>
                  </span>
                </button>
              </Rise>
            ))}
          </ol>
        </div>

        {/* o Bit comenta o passo que você está olhando */}
        <div className="flex justify-center pt-20 lg:pt-0">
          <div className="relative grid aspect-square w-full max-w-[460px] place-items-center rounded-[40px] bg-surface">
            <Mascot
              size="54%"
              mood={current?.mood ?? "idle"}
              outfit={current?.outfit ?? "none"}
              say={current?.bit ?? null}
              bubbleSide="top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
