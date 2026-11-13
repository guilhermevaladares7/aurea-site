"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AureaLogo } from "@/components/aurea-logo";
import { Mascot } from "@/components/mascot";
import { ParticleLogo } from "@/components/particle-logo";
import { whatsappLink } from "@/lib/site";

/**
 * Abertura: o nome AUREA se monta com pixels, o Auri pula em cima do último A
 * e, conforme você rola, o nome encolhe e se desfaz (o palco fica preso na tela
 * enquanto isso acontece).
 */
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [formed, setFormed] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const hiOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, 40]);
  const bitOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bitY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormed(false);
  }, [run]);

  return (
    <section id="topo" ref={sectionRef} className="relative h-[175vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4 text-center sm:px-8">
        <ParticleLogo
          slotRef={slotRef}
          progress={scrollYProgress}
          run={run}
          onReady={() => setReady(true)}
          onFormed={() => setFormed(true)}
        />

        <motion.p
          key={`hi-${run}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: reduce ? 0 : 0.5 }}
          style={{ opacity: hiOpacity }}
          className="submark relative text-[clamp(24px,2.8vw,38px)] text-foreground/85"
        >
          Bem-vindo à
        </motion.p>

        {/* lugar do logo: o canvas desenha por cima; o SVG fica de reserva sem JavaScript */}
        <div ref={slotRef} className="relative mt-6 aspect-[1260/250] w-[min(92vw,1180px)]">
          <h1 className="text-foreground">
            <span className="sr-only">Aurea: sites, sistemas e automações com IA</span>
            <span aria-hidden="true" className={ready ? "opacity-0" : "opacity-100"}>
              <AureaLogo title="" />
            </span>
          </h1>

          <AnimatePresence>
            {formed && (
              <motion.div
                key={`auri-${run}`}
                style={{ opacity: bitOpacity, y: bitY }}
                className="absolute bottom-[90%] left-[89.2%] w-[13%] min-w-[64px] -translate-x-1/2"
              >
                <motion.div
                  initial={{ y: -260, opacity: 0 }}
                  animate={{ y: [-260, 0, -26, 0], opacity: 1 }}
                  transition={{ duration: 0.9, times: [0, 0.55, 0.75, 1], ease: "easeIn" }}
                >
                  <AuriHello />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative flex flex-col items-center">
          <motion.p
            key={`t-${run}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: reduce ? 0 : 2.1 }}
            className="mt-10 max-w-[40ch] text-[clamp(19px,1.7vw,24px)] leading-snug text-foreground"
          >
            Sites, sistemas e automações com IA, feitos sob medida para pequenas e médias empresas.
          </motion.p>
          <motion.div
            key={`b-${run}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: reduce ? 0 : 2.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={whatsappLink("Olá! Quero um orçamento com a Aurea.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-6 py-3.5 text-[16px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Pedir orçamento
            </a>
            <a
              href="#servicos"
              className="rounded-md bg-white/8 px-6 py-3.5 text-[16px] font-semibold text-foreground transition-colors hover:bg-white/14"
            >
              Ver serviços
            </a>
          </motion.div>
        </motion.div>

        <motion.a
          href="#servicos"
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Role para ver os serviços
          <motion.span animate={reduce ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </motion.a>

        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="absolute bottom-6 right-4 hidden items-center gap-1.5 rounded-md px-2 py-1 text-[14px] text-muted-foreground transition-colors hover:text-foreground sm:right-8 sm:inline-flex"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Rever entrada
        </button>
      </div>
    </section>
  );
}

/** Auri dá oi assim que aparece e depois fica de boa. */
function AuriHello() {
  const [say, setSay] = useState<string | null>(null);
  const [mood, setMood] = useState<"wave" | "idle">("wave");
  useEffect(() => {
    const a = setTimeout(() => setSay("Oi! Eu sou o Auri."), 900);
    const b = setTimeout(() => setSay(null), 3600);
    const c = setTimeout(() => setMood("idle"), 4400);
    return () => [a, b, c].forEach(clearTimeout);
  }, []);
  return <Mascot size="100%" mood={mood} say={say} bubbleSide="left" />;
}
