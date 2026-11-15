"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { PackageCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StepArt } from "@/components/how/art";
import { AuriIcon } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { H2 } from "@/components/service-sections";
import type { HowStep } from "@/lib/how";
import { cn } from "@/lib/utils";

const STEP_MS = 6000;

/**
 * "Como funciona" compacto: as etapas numa lista ao lado de uma única ilustração animada.
 * As etapas passam sozinhas enquanto a seção está na tela; ao clicar numa, ela fica parada ali.
 */
export function HowItWorks({ intro, steps }: { intro: string; steps: HowStep[] }) {
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.45 });
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const playing = auto && inView && !reduce;
  const st = steps[active];

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [playing, active, steps.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section id="como" className="scroll-mt-24 pt-28 lg:pt-36" aria-labelledby="como-h">
      <div className="grid items-end gap-6 lg:grid-cols-2">
        <Rise>
          <h2 id="como-h" className={H2}>
            Como funciona
          </h2>
        </Rise>
        <Rise as="p" delay={0.06} className="max-w-[50ch] text-[19px] leading-snug text-foreground lg:justify-self-end">
          {intro}
        </Rise>
      </div>

      <Rise delay={0.08} className="mt-12">
        <div ref={boxRef} className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
          {/* a ilustração da etapa escolhida, com o Auri comentando */}
          <div className="relative mb-6 lg:order-2 lg:mb-0">
            <div
              data-ui
              aria-hidden="true"
              className="relative aspect-[4/3.6] overflow-hidden rounded-3xl bg-surface p-4 ring-1 ring-tc/20 sm:aspect-[4/3] sm:p-5"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="h-full"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepArt art={st.art} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div aria-hidden="true" className="absolute -bottom-9 right-3 flex items-end gap-2 sm:-right-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`bit-${active}`}
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 22 }}
                  className="mb-12 hidden rounded-xl rounded-br-sm bg-foreground px-3 py-2 text-[13px] font-semibold text-background sm:block"
                >
                  {st.bit}
                </motion.span>
              </AnimatePresence>
              <motion.span
                className="block w-[64px] sm:w-[84px]"
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <AuriIcon outfit={st.outfit} mood={st.mood} className="w-full" />
              </motion.span>
            </div>
          </div>

          {/* as etapas */}
          <ol className="flex flex-col gap-2 lg:order-1" aria-label="Etapas">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-current={on ? "step" : undefined}
                    className={cn(
                      "relative w-full overflow-hidden rounded-2xl px-4 py-4 text-left transition-colors sm:px-5",
                      on ? "bg-surface-2 ring-1 ring-tc/40" : "hover:bg-surface",
                    )}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={cn(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[17px] font-extrabold ring-[3px] transition-colors",
                          on ? "bg-tc text-tc-ink ring-tc" : "text-muted-foreground ring-white/12",
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-[13px] font-semibold uppercase tracking-[0.14em]", on ? "text-tc" : "text-muted-foreground")}>
                          {s.title}
                        </span>
                        <span className="block text-[clamp(19px,1.7vw,23px)] font-bold leading-tight text-foreground">{s.head}</span>
                      </span>
                    </span>

                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="block overflow-hidden pl-0 sm:pl-14"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className="mt-2 block max-w-[46ch] text-[17px] leading-snug text-foreground/85">{s.text}</span>
                          <span className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-tc/12 py-1.5 pl-1.5 pr-3.5 text-[15px] font-semibold leading-snug text-foreground ring-1 ring-tc/35">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-tc text-tc-ink">
                              <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <span className="sr-only">Você recebe: </span>
                            {s.get}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* barrinha do tempo até a próxima etapa */}
                    {on && playing && (
                      <motion.span
                        key={`bar-${active}`}
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-tc/70"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </Rise>
    </section>
  );
}
