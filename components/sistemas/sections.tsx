"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Bell,
  Calculator,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  History,
  LayoutGrid,
  MessageCircle,
  Package,
  PlayCircle,
  Receipt,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Mascot, type BitMood, type Outfit } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { H2, ProjectLinks, ScrollTilt, Tags } from "@/components/service-sections";
import type { Project } from "@/lib/services";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";
import { AdminShell, SCREENS, Screen, type ScreenId } from "./admin-screens";

function BrowserFrame({ url, children, className }: { url: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-white/10", className)}>
      <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
        <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-3 truncate rounded-md bg-background/60 px-3 py-1 text-[12px] text-muted-foreground">{url}</span>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Calenda: vídeo real do sistema                                       */
/* ------------------------------------------------------------------ */

const CALENDA_FEATURES = [
  { icon: Calculator, t: "Calculadora de venda", d: "Mostra na hora o que dá para oferecer: desconto, parcelas e frete, pelas regras da loja." },
  { icon: Receipt, t: "Orçamentos e clientes", d: "Preços passados ficam guardados, com o histórico de cada cliente." },
  { icon: Truck, t: "Agenda e entregas", d: "Quem leva, quando e para onde, incluindo entrega na roça." },
  { icon: Wrench, t: "Assistência", d: "Chamados abertos e resolvidos, com aviso dos atrasados." },
  { icon: FileSpreadsheet, t: "Fechamento do caixa", d: "Vendas por forma de pagamento e planilhas do mês direto no Excel." },
];

const STILLS = [
  { src: "/projetos/calenda-12.jpg", alt: "Calculadora de venda do Calenda", cap: "Calculadora de venda" },
  { src: "/projetos/calenda-40.jpg", alt: "Histórico de consultas, vendas e entregas do Calenda", cap: "Histórico" },
  { src: "/projetos/calenda-44.jpg", alt: "Fechamento do caixa do Calenda por forma de pagamento", cap: "Fechamento do caixa" },
];

export function CalendaShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.3 });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  return (
    <section id="calenda" className="scroll-mt-24 pt-32 lg:pt-44" aria-labelledby="calenda-h">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
        <div>
          <Rise>
            <h2 id="calenda-h" className={H2}>
              O Calenda, rodando de verdade
            </h2>
          </Rise>
          <Rise as="p" delay={0.06} className="mt-6 max-w-[48ch] text-[19px] text-foreground">
            O sistema que eu fiz para a Calenda Móveis. A vendedora preenche a venda e o sistema já mostra o que
            pode oferecer, sem ninguém precisar decorar regra. No fim do mês, o fechamento sai pronto.
          </Rise>
          <ul className="mt-8 space-y-4">
            {CALENDA_FEATURES.map((f, i) => (
              <Rise as="li" key={f.t} delay={0.04 * i} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tc/15 text-tc">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[17px] font-semibold">{f.t}</span>
                  <span className="block text-[15px] text-foreground/75">{f.d}</span>
                </span>
              </Rise>
            ))}
          </ul>
        </div>

        <div ref={boxRef} className="relative">
          <div className="absolute -top-[74px] left-6 z-10 w-[88px]">
            <Mascot
              size="100%"
              outfit="tie"
              mood="happy"
              bubbleSide="right"
              lines={["Esse é o Calenda!", "Tudo gravado de verdade, com dados de teste.", "Repara na calculadora: ela segue as regras da loja."]}
            />
          </div>
          <ScrollTilt>
            <BrowserFrame url="calenda · sistema da loja">
              <video
                ref={videoRef}
                className="block aspect-[1440/652] w-full bg-white"
                src={asset("/projetos/calenda.mp4")}
                poster={asset("/projetos/calenda-3.jpg")}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Gravação de tela do Calenda: calculadora de venda, clientes, entregas, histórico, fechamento e regras"
              />
            </BrowserFrame>
          </ScrollTilt>
          <p className="mt-3 flex items-center gap-2 text-[14px] text-muted-foreground">
            <PlayCircle className="h-4 w-4 text-tc" aria-hidden="true" />
            Gravação real do sistema, com dados de teste.
          </p>
        </div>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {STILLS.map((s, i) => (
          <Rise as="li" key={s.src} delay={i * 0.08}>
            <figure className="group overflow-hidden rounded-2xl bg-surface">
              <div className="overflow-hidden">
                <Image
                  src={asset(s.src)}
                  alt={s.alt}
                  width={1440}
                  height={652}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <figcaption className="px-4 py-3 text-[15px] font-semibold">{s.cap}</figcaption>
            </figure>
          </Rise>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tour pelas telas, com o Auri de guia                                 */
/* ------------------------------------------------------------------ */

const GUIDE: Record<ScreenId, { outfit: Outfit; mood: BitMood; line: string; text: string }> = {
  dashboard: { outfit: "tie", mood: "happy", line: "Tudo o que importa numa tela só.", text: "Os números do dia e do mês, sem abrir planilha." },
  agenda: { outfit: "hardhat", mood: "work", line: "Entrega e montagem sem conflito.", text: "Cada equipe vê o seu dia, com endereço e horário." },
  clientes: { outfit: "headset", mood: "focus", line: "Digitou, achou.", text: "Histórico, telefone e quem está com pagamento atrasado." },
  financeiro: { outfit: "crown", mood: "wow", line: "Entrou, saiu, sobrou. Sem susto.", text: "Entradas, saídas e contas a pagar do mês." },
  estoque: { outfit: "chef", mood: "think", line: "Acabando? Eu aviso antes.", text: "Alerta de produto abaixo do mínimo." },
  permissoes: { outfit: "detective", mood: "wink", line: "Cada um vê só o que deve.", text: "Logins com o que cada pessoa pode ver e mexer." },
};

const TOUR_MS = 6500;

export function PanelTour() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const id = SCREENS[idx].id;
  const g = GUIDE[id];

  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % SCREENS.length), TOUR_MS);
    return () => clearTimeout(t);
  }, [idx, inView, paused]);

  return (
    <section className="pt-32 lg:pt-44" aria-labelledby="tour-h">
      <div className="grid items-end gap-4 lg:grid-cols-2">
        <Rise>
          <h2 id="tour-h" className={H2}>
            Um passeio pelas telas
          </h2>
        </Rise>
        <Rise as="p" delay={0.06} className="max-w-[48ch] text-[18px] text-foreground lg:justify-self-end">
          Um painel de exemplo com as telas que mais aparecem nos sistemas que eu faço. O Auri troca de roupa em cada uma.
          Clique nas abas para ver.
        </Rise>
      </div>

      <div
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="mt-12 grid gap-6 lg:grid-cols-[270px_1fr]"
      >
        <div className="flex flex-col gap-4">
          <div role="tablist" aria-label="Telas do painel" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                className={cn(
                  "relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-left text-[16px] font-semibold transition-colors",
                  i === idx ? "bg-surface-2 text-foreground" : "bg-surface text-foreground/70 hover:text-foreground",
                )}
              >
                <s.icon className={cn("h-5 w-5", i === idx ? "text-tc" : "text-foreground/50")} aria-hidden="true" />
                {s.label}
                {i === idx && (
                  <motion.span
                    key={`bar-${idx}-${paused}`}
                    className="absolute bottom-0 left-0 h-[3px] bg-tc"
                    initial={{ width: "0%" }}
                    animate={{ width: paused || !inView ? "0%" : "100%" }}
                    transition={{ duration: TOUR_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden items-end gap-3 rounded-2xl bg-surface p-4 lg:flex">
            <div className="w-[84px] shrink-0">
              <Mascot size="100%" outfit={g.outfit} mood={g.mood} lines={[g.line]} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <p className="pixel text-[16px] leading-tight text-tc">{g.line}</p>
                <p className="mt-1 text-[14px] text-foreground/80">{g.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-[60px] right-6 z-10 w-[70px] lg:hidden">
            <Mascot size="100%" outfit={g.outfit} mood={g.mood} lines={[g.line]} />
          </div>
          <BrowserFrame url={`painel.suaempresa.com.br/${id}`}>
            <div className="h-[460px] p-2 sm:h-[500px]" role="tabpanel" aria-label={SCREENS[idx].label}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={id}
                  className="h-full"
                  initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AdminShell active={id}>
                    <Screen id={id} />
                  </AdminShell>
                </motion.div>
              </AnimatePresence>
            </div>
          </BrowserFrame>
          <p className="mt-3 text-[14px] text-muted-foreground lg:hidden">{g.text}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Faixa de módulos                                                     */
/* ------------------------------------------------------------------ */

const MODULES = [
  { i: LayoutGrid, t: "Painel" },
  { i: Calculator, t: "Calculadora de venda" },
  { i: Receipt, t: "Orçamentos" },
  { i: Users, t: "Clientes" },
  { i: CalendarDays, t: "Agenda" },
  { i: Truck, t: "Entregas" },
  { i: Package, t: "Estoque" },
  { i: Wallet, t: "Financeiro" },
  { i: Wrench, t: "Assistência" },
  { i: History, t: "Histórico" },
  { i: FileSpreadsheet, t: "Excel" },
  { i: ShieldCheck, t: "Permissões" },
  { i: Bell, t: "Avisos" },
  { i: MessageCircle, t: "WhatsApp" },
  { i: ClipboardList, t: "Checklists" },
];

export function ModulesMarquee() {
  const row = (reverse: boolean) => (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className="flex shrink-0 gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee 38s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {[...MODULES, ...MODULES].map((m, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2.5 rounded-full bg-surface px-5 py-3 text-[16px] font-semibold">
            <m.i className="h-5 w-5 text-tc" aria-hidden="true" />
            {m.t}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <section className="pt-32 lg:pt-40" aria-labelledby="modulos-h">
      <Rise>
        <h2 id="modulos-h" className={cn(H2, "max-w-[18ch]")}>
          Monte o seu com as peças que precisar
        </h2>
      </Rise>
      <div className="mt-10 space-y-3" aria-label={MODULES.map((m) => m.t).join(", ")}>
        <div aria-hidden="true">{row(false)}</div>
        <div aria-hidden="true">{row(true)}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Projetos de sistemas                                                 */
/* ------------------------------------------------------------------ */

export function SystemProjects({ projects, intro }: { projects: Project[]; intro: string }) {
  const [first, ...rest] = projects;
  return (
    <section id="exemplos" className="scroll-mt-24 pt-32 lg:pt-44" aria-labelledby="exemplos-h">
      <div className="grid items-end gap-4 lg:grid-cols-2">
        <Rise>
          <h2 id="exemplos-h" className={H2}>
            Projetos feitos
          </h2>
        </Rise>
        <Rise as="p" delay={0.06} className="max-w-[48ch] text-[18px] text-foreground lg:justify-self-end">
          {intro}
        </Rise>
      </div>

      {/* destaque: Calenda */}
      <Rise className="mt-12">
        <article className="grid gap-6 rounded-3xl bg-surface p-3 lg:grid-cols-[1.3fr_1fr]">
          <div className="overflow-hidden rounded-2xl">
            {first.image && (
              <Image src={asset(first.image)} alt={first.imageAlt ?? first.name} width={1440} height={652} sizes="(min-width: 1024px) 55vw, 100vw" className="block h-auto w-full" />
            )}
          </div>
          <div className="flex flex-col px-3 pb-3 lg:py-4">
            <h3 className="text-[28px] font-bold leading-tight">{first.name}</h3>
            <p className="mt-1 text-[16px] text-muted-foreground">{first.what}</p>
            <p className="mt-3 text-[17px] text-foreground">{first.did}</p>
            {first.note && <p className="mt-2 text-[15px] text-muted-foreground">{first.note}</p>}
            <Tags tags={first.tags} />
            <a
              href="#calenda"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-tc px-4 py-2.5 text-[15px] font-semibold text-tc-ink transition-transform hover:-translate-y-0.5"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Ver o vídeo
            </a>
          </div>
        </article>
      </Rise>

      {rest.length > 0 && (
      <ul className="mt-6 grid gap-6 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Rise as="li" key={p.name} delay={i * 0.08} className="flex flex-col rounded-3xl bg-surface p-3">
            <div data-ui className="rounded-2xl bg-[#0b1016] p-4">
              <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                <span>{p.name}</span>
                <span className="text-tc">módulos</span>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {p.modules?.map((m, k) => (
                  <motion.li
                    key={m}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: k * 0.05 }}
                    className="rounded-lg bg-surface px-3 py-2.5 text-[14px] text-foreground"
                  >
                    <span className="mb-1.5 block h-1 w-6 rounded bg-tc/70" aria-hidden="true" />
                    {m}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
              <h3 className="text-[24px] font-bold leading-tight">{p.name}</h3>
              <p className="mt-1 text-[16px] text-muted-foreground">{p.what}</p>
              <p className="mt-3 text-[17px] text-foreground">{p.did}</p>
              {p.note && <p className="mt-2 text-[15px] text-muted-foreground">{p.note}</p>}
              <Tags tags={p.tags} />
              <div className="mt-auto">
                <ProjectLinks p={p} />
              </div>
            </div>
          </Rise>
        ))}
      </ul>
      )}
    </section>
  );
}
