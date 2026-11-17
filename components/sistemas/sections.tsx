"use client";

import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from "framer-motion";
import {
  Calculator,
  FileSpreadsheet,
  PlayCircle,
  Receipt,
  Truck,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Mascot, type BitMood, type Outfit } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { H2, ScrollTilt } from "@/components/service-sections";
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
    <section id="calenda" className="scroll-mt-20 border-t border-white/10 py-16 lg:py-24" aria-labelledby="calenda-h">
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

/**
 * As telas do painel passam conforme a pessoa rola a página: a seção fica presa na tela
 * e cada trecho de rolagem abre a próxima tela, com o Auri explicando.
 */
export function PanelTour() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [idx, setIdx] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(SCREENS.length - 1, Math.max(0, Math.floor(p * SCREENS.length)));
    setIdx((prev) => (prev === i ? prev : i));
  });

  // clicar numa tela rola até o trecho dela
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / SCREENS.length), behavior: "smooth" });
  };

  const id = SCREENS[idx].id;
  const g = GUIDE[id];

  return (
    <section ref={ref} className="relative border-t border-white/10" style={{ height: `${SCREENS.length * 70 + 40}vh` }} aria-labelledby="tour-h">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center py-20">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
          <div className="flex flex-col gap-4">
            <div>
              <h2 id="tour-h" className={H2}>
                Um passeio pelas telas
              </h2>
              <p className="mt-3 hidden text-[17px] leading-relaxed text-foreground/75 lg:block">
                Role a página e veja as telas que mais aparecem nos sistemas que eu faço.
              </p>
            </div>
            <div role="tablist" aria-label="Telas do painel" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {SCREENS.map((sc, i) => (
                <button
                  key={sc.id}
                  role="tab"
                  aria-selected={i === idx}
                  onClick={() => goTo(i)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl px-4 py-2.5 text-left text-[16px] font-semibold transition-colors",
                    i === idx ? "bg-surface-2 text-foreground" : "text-foreground/55 hover:text-foreground",
                  )}
                >
                  <sc.icon className={cn("h-5 w-5", i === idx ? "text-tc" : "text-foreground/40")} aria-hidden="true" />
                  {sc.label}
                  {i < idx && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-tc/60 lg:block" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-[64px] right-6 z-10 w-[72px] lg:-top-[78px] lg:w-[88px]">
              <Mascot size="100%" outfit={g.outfit} mood={g.mood} lines={[g.line]} />
            </div>
            <BrowserFrame url={`painel.suaempresa.com.br/${id}`}>
              <div className="h-[min(52svh,500px)] p-2" role="tabpanel" aria-label={SCREENS[idx].label}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={id}
                    className="h-full"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <AdminShell active={id}>
                      <Screen id={id} />
                    </AdminShell>
                  </motion.div>
                </AnimatePresence>
              </div>
            </BrowserFrame>
            <AnimatePresence mode="wait">
              <motion.p
                key={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-[16px] text-foreground/80"
              >
                <b className="text-tc">{g.line}</b> {g.text}
              </motion.p>
            </AnimatePresence>
            {/* quanto falta do passeio */}
            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {SCREENS.map((sc, i) => (
                <span key={sc.id} className={cn("h-1 flex-1 rounded-full transition-colors", i <= idx ? "bg-tc" : "bg-white/10")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
