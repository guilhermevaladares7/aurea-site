"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { GithubIcon } from "@/components/icons";
import { AuriIcon, Mascot } from "@/components/mascot";
import { Submark } from "@/components/submark";
import { SERVICES, type Project, type Service } from "@/lib/services";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Título de seção: sóbrio, do tamanho de um título de documento. A letra larga e pesada fica só no topo da página. */
export const H2 = "text-[clamp(26px,2.3vw,34px)] font-semibold leading-[1.12] tracking-[-0.02em]";

/**
 * A seção padrão das páginas: uma linha fina por cima, o título numa coluna estreita à esquerda
 * e o conteúdo à direita. Com `wide`, o título fica em cima e o conteúdo usa a largura toda.
 */
export function Section({
  id,
  headId,
  title,
  intro,
  aside,
  wide = false,
  children,
}: {
  id?: string;
  headId: string;
  title: string;
  intro?: string;
  /** conteúdo extra embaixo do título, na coluna da esquerda */
  aside?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-white/10 py-16 lg:py-24" aria-labelledby={headId}>
      {wide ? (
        <>
          <div className="grid gap-4 lg:grid-cols-[300px_1fr] lg:gap-16">
            <h2 id={headId} className={H2}>
              {title}
            </h2>
            {intro && <p className="max-w-[58ch] text-[18px] leading-relaxed text-foreground/80">{intro}</p>}
          </div>
          <div className="mt-10 lg:mt-12">{children}</div>
        </>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 id={headId} className={H2}>
              {title}
            </h2>
            {intro && <p className="mt-4 text-[17px] leading-relaxed text-foreground/75">{intro}</p>}
            {aside}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      )}
    </section>
  );
}

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
    <section className="grid items-center gap-12 pb-16 pt-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:pb-24 lg:pt-40">
      {/* a única entrada animada do texto da página: o bloco inteiro, de uma vez */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <Link
          href="/#servicos"
          className="inline-flex items-center gap-2 rounded-md py-1 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Todos os serviços
        </Link>
        <p className="mt-8 text-[22px]" aria-hidden="true">
          <Submark word={s.sub} wordClass="text-tc" />
        </p>
        <h1 className="mt-5 text-[clamp(36px,4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground [font-stretch:112%]">
          {s.title}
        </h1>
        <p className="mt-6 max-w-[50ch] text-[19px] leading-relaxed text-foreground/85">{s.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            data-metrica="whatsapp"
            href={whatsappLink(`Olá! Vim pelo site da Aurea e quero saber mais sobre ${s.title.toLowerCase()}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-tc2 px-6 py-3.5 text-[16px] font-semibold text-tc2-ink transition-transform hover:-translate-y-0.5"
          >
            {s.cta}
          </a>
          <a
            href="#inclui"
            className="rounded-md bg-white/8 px-6 py-3.5 text-[16px] font-semibold text-foreground transition-colors hover:bg-white/14"
          >
            Ver o que vem incluso
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        // no celular o Auri fica em cima da demonstração: o espaço extra evita que o balão cubra os botões
        className="relative mt-12 lg:mt-0"
      >
        <div className="absolute -top-[84px] right-8 z-10 w-[96px] sm:-top-[100px] sm:w-[116px]">
          <BitIntro outfit={s.outfit} bit={bit} />
        </div>
        <div className="rounded-2xl bg-surface p-3 ring-1 ring-white/10 sm:p-4">{demo}</div>
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

export function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Destaques">
      {tags.map((t) => (
        <li key={t} className="rounded-md px-2.5 py-1 text-[14px] text-foreground/80 ring-1 ring-white/12">
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
          className="inline-flex items-center gap-2 rounded-md bg-tc2 px-4 py-2.5 text-[15px] font-semibold text-tc2-ink transition-transform hover:-translate-y-0.5"
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

/**
 * O que vem incluso: a resposta que o cliente procura, logo depois do topo.
 * É uma faixa baixa com seis itens curtos, para bater o olho e entender. Sem parágrafo.
 */
export function Includes({ service }: { service: Service }) {
  const s = service;
  const inc = s.includes;
  return (
    <section id="inclui" className="scroll-mt-24 pb-16 lg:pb-24" aria-labelledby="inclui-h">
      <div className="grid items-center gap-7 rounded-2xl bg-surface p-6 ring-1 ring-white/10 sm:p-8 lg:grid-cols-[250px_1fr] lg:gap-12 lg:px-10">
        <div>
          <h2 id="inclui-h" className="text-[clamp(26px,2.4vw,32px)] font-bold leading-[1.08] tracking-[-0.025em]">
            {inc.title}
          </h2>
          {/* preço é combinado pelo WhatsApp, caso a caso */}
          <a
            data-metrica="whatsapp"
            href={whatsappLink(`Olá! Quero um orçamento de ${s.title.toLowerCase()} com a Aurea.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 hidden items-center gap-2 rounded-md bg-tc2 px-5 py-3 text-[16px] font-semibold text-tc2-ink transition-transform hover:-translate-y-0.5 lg:inline-flex"
          >
            Pedir orçamento
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-6">
          {inc.items.map((it) => (
            <li key={it} className="flex items-center gap-3 text-[18px] font-semibold leading-snug">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-tc/15 text-tc">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              </span>
              {it}
            </li>
          ))}
        </ul>

        {/* no celular o botão vem depois da lista */}
        <a
          data-metrica="whatsapp"
          href={whatsappLink(`Olá! Quero um orçamento de ${s.title.toLowerCase()} com a Aurea.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-tc2 px-5 py-3 text-[16px] font-semibold text-tc2-ink lg:hidden"
        >
          Pedir orçamento
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

// título grande das duas seções do fim da página, como era antes da reestruturação
const H2_BIG = "text-[clamp(32px,3.6vw,52px)] font-extrabold leading-[0.95] tracking-[-0.035em] [font-stretch:112%]";

/** Perguntas comuns, com o Auri de professor. */
export function Faq({ service }: { service: Service }) {
  const s = service;
  return (
    <section className="mx-auto max-w-[820px] pt-28 lg:pt-36" aria-labelledby="duvidas">
      <div className="flex items-end justify-between gap-4">
        <h2 id="duvidas" className={H2_BIG}>
          Perguntas comuns
        </h2>
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
    </section>
  );
}

/** Links para os outros dois serviços, cada um na sua cor. */
export function OtherServices({ current }: { current: Service["slug"] }) {
  const others = SERVICES.filter((o) => o.slug !== current);
  return (
    <section className="pt-28 lg:pt-36" aria-labelledby="outros">
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
                <AuriIcon outfit={o.outfit} className="w-full" />
              </span>
              <span>
                <span className="block text-[26px]" aria-hidden="true">
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
