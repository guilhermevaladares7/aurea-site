"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { PackageCheck } from "lucide-react";
import { useRef } from "react";
import { StepArt } from "@/components/how/art";
import { AuriIcon } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { H2 } from "@/components/service-sections";
import type { HowStep } from "@/lib/how";
import { cn } from "@/lib/utils";

/** "Como funciona" em linha do tempo: cada etapa com texto detalhado e uma ilustração animada. */
export function HowItWorks({ intro, steps }: { intro: string; steps: HowStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });

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

      {/* resumo das etapas */}
      <Rise delay={0.1} className="mt-10">
        <ul className="flex flex-wrap gap-2" aria-label="Etapas">
          {steps.map((st, i) => (
            <li key={st.title}>
              <a
                href={`#etapa-${i + 1}`}
                className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[15px] text-foreground ring-1 ring-white/8 transition-colors hover:bg-surface-2 hover:ring-tc/50"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-tc/15 text-[13px] font-bold text-tc">{i + 1}</span>
                {st.title}
              </a>
            </li>
          ))}
        </ul>
      </Rise>

      <ol ref={ref} className="relative mt-16 flex flex-col gap-24 lg:mt-24 lg:gap-36">
        {/* linha do tempo que vai enchendo com a rolagem */}
        <span aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-[3px] rounded-full bg-white/8 lg:left-[27px]" />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-[19px] top-0 w-[3px] origin-top rounded-full bg-tc lg:left-[27px]"
          style={reduce ? undefined : { scaleY: scrollYProgress }}
        />

        {steps.map((st, i) => (
          <li key={st.title} id={`etapa-${i + 1}`} className="relative scroll-mt-28 pl-14 lg:pl-24">
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-background text-[17px] font-extrabold ring-[3px] lg:h-14 lg:w-14 lg:text-[22px]"
              initial={{ color: "var(--muted-foreground)", boxShadow: "0 0 0 0 transparent" }}
              whileInView={{ color: "var(--tc)", boxShadow: "0 0 24px 2px color-mix(in srgb, var(--tc) 45%, transparent)" }}
              viewport={{ amount: 0.5, margin: "-20% 0px -30% 0px" }}
              style={{ ["--tw-ring-color" as string]: "var(--tc)" }}
            >
              {i + 1}
            </motion.span>

            <div className={cn("grid items-center gap-10 lg:gap-16", i % 2 ? "lg:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-[1fr_1.1fr]")}>
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                <Rise>
                  <span className="text-[15px] font-semibold uppercase tracking-[0.16em] text-tc">
                    {i + 1}. {st.title}
                  </span>
                  <h3 className="mt-3 max-w-[16ch] text-[clamp(34px,4vw,58px)] font-extrabold leading-[1] tracking-[-0.035em] [font-stretch:110%]">
                    {st.head}
                  </h3>
                </Rise>
                <Rise as="p" delay={0.06} className="mt-6 max-w-[46ch] text-[20px] leading-relaxed text-foreground">
                  {st.text}
                </Rise>
                <Rise delay={0.12} className="mt-7">
                  <p className="inline-flex items-center gap-3 rounded-2xl bg-tc/12 px-4 py-3 ring-1 ring-tc/40">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tc text-tc-ink">
                      <PackageCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-tc">Você recebe</span>
                      <span className="block text-[19px] font-bold leading-snug text-foreground">{st.get}</span>
                    </span>
                  </p>
                </Rise>
              </div>

              <Rise delay={0.08} className={cn("relative", i % 2 === 1 && "lg:order-1")}>
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
                  <StepArt art={st.art} />
                </div>
                {/* o Auri, vestido para a etapa, comenta a cena */}
                <div aria-hidden="true" className="absolute -bottom-9 right-3 flex items-end gap-2 sm:-right-4">
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ amount: 0.8 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 22 }}
                    className="mb-12 hidden rounded-xl rounded-br-sm bg-foreground px-3 py-2 text-[13px] font-semibold text-background sm:block"
                  >
                    {st.bit}
                  </motion.span>
                  <motion.span
                    className="block w-[64px] sm:w-[84px]"
                    animate={reduce ? undefined : { y: [0, -5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  >
                    <AuriIcon outfit={st.outfit} mood={st.mood} className="w-full" />
                  </motion.span>
                </div>
              </Rise>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
