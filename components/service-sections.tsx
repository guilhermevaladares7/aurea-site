"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { GithubIcon } from "@/components/icons";
import { AuriIcon, Mascot } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { Submark } from "@/components/submark";
import { SERVICES, type Project, type Service, type Step } from "@/lib/services";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const H2 = "text-[clamp(36px,4.6vw,68px)] font-extrabold leading-[0.95] tracking-[-0.035em] [font-stretch:112%]";

/** A demonstração "deita" para trás e se endireita conforme entra na tela. */
export function ScrollTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  return (
    <div ref={ref} className={cn("[perspective:1400px]", className)}>
      <motion.div style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 100%" }}>{children}</motion.div>
    </div>
  );
}

/** Topo das páginas de serviço, com o Auri fantasiado em cima da demonstração. */
export function ServiceHero({ service, demo, bit }: { service: Service; demo: ReactNode; bit: string }) {
  const s = service;
  return (
    <section className="grid items-center gap-14 pt-36 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-48">
      <div>
        <Link
          href="/#servicos"
          className="inline-flex items-center gap-2 rounded-md py-1 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Todos os serviços
        </Link>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-[clamp(44px,6vw,88px)]"
          aria-hidden="true"
        >
          <Submark word={s.sub} wordClass="text-tc" />
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[clamp(30px,3.4vw,48px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-foreground [font-stretch:112%]"
        >
          {s.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-[52ch] text-[19px] text-foreground"
        >
          {s.lead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a
            href={whatsappLink(`Olá! Vim pelo site da Aurea e quero saber mais sobre ${s.title.toLowerCase()}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-tc px-6 py-3.5 text-[16px] font-semibold text-tc-ink transition-transform hover:-translate-y-0.5"
          >
            {s.cta}
          </a>
          <a
            href="#exemplos"
            className="rounded-md bg-white/8 px-6 py-3.5 text-[16px] font-semibold text-foreground transition-colors hover:bg-white/14"
          >
            Ver exemplos
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 18 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative [perspective:1400px]"
      >
        <div className="absolute -top-[84px] right-8 z-10 w-[96px] sm:-top-[100px] sm:w-[116px]">
          <BitIntro outfit={s.outfit} bit={bit} />
        </div>
        <div className="rounded-3xl bg-tc/[0.08] p-4 ring-1 ring-tc/25 sm:p-5">{demo}</div>
      </motion.div>
    </section>
  );
}

function BitIntro({ outfit, bit }: { outfit: Service["outfit"]; bit: string }) {
  const [say, setSay] = useState<string | null>(null);
  return (
    <motion.div
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: [-120, 0, -16, 0], opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.8, times: [0, 0.55, 0.75, 1], ease: "easeIn" }}
      onAnimationComplete={() => {
        setSay(bit);
        setTimeout(() => setSay(null), 3200);
      }}
    >
      <Mascot size="100%" outfit={outfit} mood={say ? "wave" : "idle"} say={say} bubbleSide="left" />
    </motion.div>
  );
}

/** Os quatro passos, cada um com o Auri numa roupa e expressão diferente. */
export function StepsWithMascot({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="pt-32 lg:pt-44" aria-labelledby="como">
      <div className="grid items-end gap-4 lg:grid-cols-2">
        <Rise>
          <h2 id="como" className={H2}>
            Como funciona
          </h2>
        </Rise>
        <Rise as="p" delay={0.06} className="max-w-[46ch] text-[18px] text-foreground lg:justify-self-end">
          Quatro passos, e o Auri troca de roupa em cada um. Passe o mouse (ou toque) para ele contar o que acontece.
        </Rise>
      </div>
      <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((st, i) => (
          <Rise as="li" key={st.title} delay={i * 0.08}>
            <div
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn(
                "group relative flex h-full flex-col rounded-3xl p-6 pt-8 transition-colors duration-300",
                active === i ? "bg-surface-2 ring-1 ring-tc/50" : "bg-surface",
              )}
            >
              <div className="flex items-start justify-between">
                <span className={cn("wordmark text-[56px] transition-colors", active === i ? "text-tc" : "text-foreground/25")} aria-hidden="true">
                  {i + 1}
                </span>
                <motion.div
                  className="-mt-2 w-[92px]"
                  animate={active === i ? { y: -8, scale: 1.08 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <Mascot
                    size="100%"
                    outfit={st.outfit}
                    mood={active === i ? st.mood : "idle"}
                    say={active === i ? st.bit : null}
                    bubbleSide="top"
                    lines={[st.bit]}
                    label={`Auri no passo ${st.title}. Clique para ele falar.`}
                  />
                </motion.div>
              </div>
              <h3 className="mt-6 text-[22px] font-bold leading-tight">{st.title}</h3>
              <p className="mt-2 text-[16px] text-foreground">{st.text}</p>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-6 right-6 h-[3px] origin-left scale-x-0 rounded-full bg-tc transition-transform duration-500 group-hover:scale-x-100"
              />
            </div>
          </Rise>
        ))}
      </ol>
    </section>
  );
}

export function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tecnologias">
      {tags.map((t) => (
        <li key={t} className="rounded-full bg-surface-2 px-3 py-1 text-[14px] text-foreground">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {p.live && (
        <a
          href={p.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-tc px-4 py-2.5 text-[15px] font-semibold text-tc-ink transition-transform hover:-translate-y-0.5"
        >
          Ver site no ar
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
      {p.repo && (
        <a
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-white/8 px-4 py-2.5 text-[15px] font-semibold transition-colors hover:bg-white/14"
        >
          <GithubIcon className="h-4 w-4" />
          Código no GitHub
        </a>
      )}
    </div>
  );
}

/** Lista do que vem incluso + perguntas comuns, com o Auri de professor. */
export function IncludesFaq({ service }: { service: Service }) {
  const s = service;
  return (
    <section className="grid gap-12 pt-32 lg:grid-cols-2 lg:gap-16 lg:pt-44">
      <div aria-labelledby="inclui">
        <Rise>
          <h2 id="inclui" className="text-[clamp(32px,3.6vw,52px)] font-extrabold leading-[0.95] tracking-[-0.035em] [font-stretch:112%]">
            O que vem incluso
          </h2>
        </Rise>
        <ul className="mt-8 space-y-3">
          {s.includes.map((it, i) => (
            <Rise as="li" key={it} delay={i * 0.04} className="flex gap-3 text-[17px]">
              <Check className="mt-1 h-5 w-5 shrink-0 text-tc" aria-hidden="true" />
              {it}
            </Rise>
          ))}
        </ul>
        {/* preço é combinado pelo WhatsApp, caso a caso */}
        <a
          href={whatsappLink(`Olá! Quero um orçamento de ${s.title.toLowerCase()} com a Aurea.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-tc px-5 py-3 text-[16px] font-semibold text-tc-ink transition-transform hover:-translate-y-0.5"
        >
          Pedir orçamento no WhatsApp
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div aria-labelledby="duvidas">
        <div className="flex items-end justify-between gap-4">
          <Rise>
            <h2 id="duvidas" className="text-[clamp(32px,3.6vw,52px)] font-extrabold leading-[0.95] tracking-[-0.035em] [font-stretch:112%]">
              Perguntas comuns
            </h2>
          </Rise>
          <div className="w-[72px] shrink-0">
            <Mascot size="100%" outfit="grad" mood="think" lines={["Pode perguntar, eu explico!", "Ficou dúvida? Me chama no WhatsApp."]} />
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {s.faq.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-surface px-5 py-4 transition-colors open:bg-surface-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold">
                {f.q}
                <span className="text-[22px] text-tc transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[16px] text-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Links para os outros dois serviços, cada um na sua cor. */
export function OtherServices({ current }: { current: Service["slug"] }) {
  const others = SERVICES.filter((o) => o.slug !== current);
  return (
    <section className="pt-32 lg:pt-44" aria-labelledby="outros">
      <h2 id="outros" className="text-[clamp(28px,3vw,44px)] font-extrabold tracking-[-0.03em] [font-stretch:112%]">
        Outros serviços
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {others.map((o) => (
          <Link
            key={o.slug}
            href={`/servicos/${o.slug}`}
            className={cn(o.theme, "group flex items-center justify-between gap-6 rounded-3xl bg-surface p-6 transition-colors hover:bg-surface-2 sm:p-8")}
          >
            <span className="flex items-center gap-5">
              <span className="w-16 shrink-0 transition-transform duration-300 group-hover:-translate-y-1.5">
                <MascotStatic outfit={o.outfit} />
              </span>
              <span>
                <span className="block text-[30px]" aria-hidden="true">
                  <Submark word={o.sub} wordClass="text-tc" />
                </span>
                <span className="mt-2 block text-[18px] font-bold">{o.title}</span>
                <span className="mt-1 block text-[16px] text-foreground/80">{o.short}</span>
              </span>
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-2 text-tc transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ícone parado, para dentro de links (não pode ter botão dentro de link)
function MascotStatic({ outfit }: { outfit: Service["outfit"] }) {
  return <AuriIcon outfit={outfit} className="w-full" />;
}
