"use client";

/**
 * Ilustrações animadas do "Como funciona".
 * Cada cena roda em loop (só enquanto está na tela) e mostra o que acontece naquela etapa.
 */
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  Check,
  FileText,
  Globe,
  KeyRound,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Mic,
  Search,
  Sheet,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { useTicker } from "@/components/demos/use-ticker";
import type { Art } from "@/lib/how";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 320, damping: 24 } as const;

/** Conta de 0 a n-1 em loop; no último passo segura um pouco mais. */
function Stage({ n, ms = 850, hold = 2400, children }: { n: number; ms?: number; hold?: number; children: (k: number) => ReactNode }) {
  const durations = useMemo(() => [...Array<number>(n - 1).fill(ms), hold], [n, ms, hold]);
  const { ref, step } = useTicker(durations);
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative h-full w-full">
      {children(reduce ? n - 1 : step)}
    </div>
  );
}

function Pop({ on, children, className, from = 12, style }: { on: boolean; children?: ReactNode; className?: string; from?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={false}
      animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: from, scale: 0.94 }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}

function Win({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl bg-[#0b1016] ring-1 ring-white/10", className)}>
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-tc/70" />
        {title && <span className="ml-2 truncate text-[11px] text-muted-foreground">{title}</span>}
      </div>
      <div className="relative flex-1 overflow-hidden p-3">{children}</div>
    </div>
  );
}

const Bar = ({ w, className }: { w: string; className?: string }) => (
  <span className={cn("block h-2 rounded-full bg-white/15", className)} style={{ width: w }} />
);

const Bubble = ({ me, children }: { me?: boolean; children: ReactNode }) => (
  <div
    className={cn(
      "max-w-[78%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug",
      me ? "ml-auto rounded-br-sm bg-tc text-tc-ink" : "rounded-bl-sm bg-white/10 text-foreground",
    )}
  >
    {children}
  </div>
);

const Done = ({ on }: { on: boolean }) => (
  <motion.span
    initial={false}
    animate={on ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
    transition={spring}
    className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tc text-tc-ink"
  >
    <Check className="h-3 w-3" strokeWidth={3} />
  </motion.span>
);

/* ------------------------------------------------------------------ */
/* Sites                                                                */
/* ------------------------------------------------------------------ */

function ChatArt() {
  return (
    <Stage n={5}>
      {(k) => (
        <Win title="WhatsApp · Aurea" className="h-full">
          <div className="flex h-full flex-col justify-end gap-2">
            <Pop on={k >= 1}>
              <Bubble me>Oi! Tenho uma padaria e quero um site.</Bubble>
            </Pop>
            <Pop on={k >= 2}>
              <div className="ml-auto flex w-[62%] items-center gap-2 rounded-2xl rounded-br-sm bg-tc px-3 py-2 text-tc-ink">
                <Mic className="h-3.5 w-3.5 shrink-0" />
                <span className="flex flex-1 items-center gap-[3px]">
                  {[6, 12, 8, 14, 5, 10, 13, 7, 11, 6, 9, 12].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] rounded-full bg-tc-ink/70"
                      animate={k >= 2 ? { height: [h * 0.4, h, h * 0.6] } : { height: 3 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror", delay: i * 0.05 }}
                    />
                  ))}
                </span>
                <span className="text-[11px]">0:42</span>
              </div>
            </Pop>
            <Pop on={k >= 3}>
              <div className="ml-auto grid w-[62%] grid-cols-3 gap-1.5">
                {["from-amber-300/70 to-orange-500/60", "from-tc/70 to-sky-700/60", "from-rose-300/60 to-amber-600/60"].map((g) => (
                  <span key={g} className={cn("aspect-square rounded-lg bg-gradient-to-br", g)} />
                ))}
              </div>
            </Pop>
            <Pop on={k >= 4}>
              <Bubble>Anotado! Já te mando o resumo do site.</Bubble>
            </Pop>
          </div>
        </Win>
      )}
    </Stage>
  );
}

function SitemapArt() {
  const pages = ["Sobre", "Produtos", "Contato"];
  return (
    <Stage n={5}>
      {(k) => (
        <div className="flex h-full flex-col items-center justify-center">
          <Pop on={k >= 0} className="rounded-xl bg-tc px-5 py-2.5 text-[14px] font-bold text-tc-ink">
            Início
          </Pop>
          <motion.span
            className="h-6 w-px origin-top bg-tc/60"
            initial={false}
            animate={{ scaleY: k >= 1 ? 1 : 0 }}
          />
          <motion.span
            className="h-px w-[66%] origin-center bg-tc/60"
            initial={false}
            animate={{ scaleX: k >= 1 ? 1 : 0 }}
          />
          <div className="grid w-[82%] grid-cols-3 gap-3">
            {pages.map((p, i) => (
              <div key={p} className="flex flex-col items-center">
                <motion.span className="h-5 w-px origin-top bg-tc/60" initial={false} animate={{ scaleY: k >= 1 ? 1 : 0 }} />
                <Pop on={k >= 2} className="w-full rounded-xl bg-[#0b1016] p-2.5 ring-1 ring-white/10" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="block text-center text-[12.5px] font-semibold">{p}</span>
                  <span className="mt-2 flex flex-col gap-1.5">
                    <Bar w="100%" />
                    <Bar w="70%" />
                  </span>
                </Pop>
              </div>
            ))}
          </div>
          <motion.span className="ml-[54%] h-6 w-px origin-top bg-tc/60" initial={false} animate={{ scaleY: k >= 3 ? 1 : 0 }} />
          <Pop on={k >= 3} className="ml-[54%] flex items-center gap-1.5 rounded-full bg-tc/15 px-3 py-1.5 text-[12px] font-semibold text-tc ring-1 ring-tc/40">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </Pop>
        </div>
      )}
    </Stage>
  );
}

function StyleArt() {
  const swatches = ["bg-tc", "bg-[#f4efe6]", "bg-[#2b1d14]", "bg-[#d98a4e]"];
  return (
    <Stage n={6}>
      {(k) => (
        <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-3">
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
              <span className="text-[11px] text-muted-foreground">Cores</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {swatches.map((c, i) => (
                  <Pop key={c} on={k >= 1} className={cn("aspect-square rounded-lg ring-1 ring-white/10", c)} style={{ transitionDelay: `${i * 70}ms` }} />
                ))}
              </div>
            </div>
            <Pop on={k >= 2} className="flex-1 rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
              <span className="text-[11px] text-muted-foreground">Letra</span>
              <span className="mt-1 block font-serif text-[30px] italic leading-none text-tc sm:text-[40px]">Aa</span>
            </Pop>
          </div>
          <Win title="padariaboavista.com.br" className="h-full">
            <div className="flex h-full flex-col gap-2">
              <Pop on={k >= 3} className="rounded-lg bg-gradient-to-br from-[#d98a4e]/70 to-[#2b1d14] p-3">
                <span className="block h-2.5 w-[70%] rounded-full bg-[#f4efe6]/90" />
                <span className="mt-1.5 block h-2 w-[45%] rounded-full bg-[#f4efe6]/50" />
              </Pop>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((i) => (
                  <Pop key={i} on={k >= 4} className="h-12 rounded-lg bg-white/8" style={{ transitionDelay: `${i * 90}ms` }} />
                ))}
              </div>
              <Pop on={k >= 5} className="mt-auto w-fit rounded-md bg-tc px-3 py-1.5 text-[11px] font-bold text-tc-ink">
                Pedir pelo WhatsApp
              </Pop>
            </div>
          </Win>
        </div>
      )}
    </Stage>
  );
}

function BuildArt() {
  const code = [
    ["<header>", "40%"],
    ["  <h1>Pão quentinho</h1>", "78%"],
    ["  <a href=whatsapp>", "64%"],
    ["<section produtos>", "56%"],
    ["  <card /> <card />", "70%"],
  ];
  return (
    <Stage n={6} ms={700}>
      {(k) => (
        <div className="grid h-full grid-cols-[1.25fr_0.75fr] items-center gap-4">
          <Win title="site.tsx" className="h-full">
            <div className="flex flex-col gap-2 font-mono text-[11.5px] leading-tight">
              {code.map(([t], i) => (
                <motion.span
                  key={t}
                  initial={false}
                  animate={{ opacity: k > i ? 1 : 0.12, x: k > i ? 0 : -6 }}
                  className={cn("whitespace-pre", i % 2 ? "text-foreground" : "text-tc")}
                >
                  {t}
                </motion.span>
              ))}
              <motion.span className="h-3.5 w-2 bg-tc" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            </div>
          </Win>
          <div className="mx-auto flex aspect-[9/17] w-full max-w-[150px] flex-col gap-1.5 rounded-[22px] bg-[#0b1016] p-2.5 ring-2 ring-white/15">
            <span className="mx-auto mb-1 h-1 w-8 rounded-full bg-white/20" />
            <Pop on={k >= 1} className="h-3 rounded bg-white/15" />
            <Pop on={k >= 2} className="flex-[1.3] rounded-lg bg-gradient-to-br from-[#d98a4e]/70 to-[#2b1d14]" />
            <Pop on={k >= 3} className="rounded-md bg-tc py-1 text-center text-[9px] font-bold text-tc-ink">
              WhatsApp
            </Pop>
            <div className="grid flex-1 grid-cols-2 gap-1.5">
              <Pop on={k >= 4} className="rounded-md bg-white/10" />
              <Pop on={k >= 5} className="rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}

function ReviewArt() {
  const pins = [
    { t: "Trocar esta foto", x: "8%", y: "16%" },
    { t: "Texto maior", x: "46%", y: "48%" },
    { t: "Contato no topo", x: "18%", y: "74%" },
  ];
  return (
    <Stage n={7} ms={750}>
      {(k) => (
        <Win title="Prévia · versão 2" className="h-full">
          <div className="flex h-full flex-col gap-2 opacity-80">
            <div className="h-[38%] rounded-lg bg-gradient-to-br from-[#d98a4e]/60 to-[#2b1d14]" />
            <Bar w="70%" className="h-3" />
            <Bar w="90%" />
            <Bar w="60%" />
            <div className="mt-auto grid grid-cols-3 gap-2">
              <span className="h-10 rounded-lg bg-white/8" />
              <span className="h-10 rounded-lg bg-white/8" />
              <span className="h-10 rounded-lg bg-white/8" />
            </div>
          </div>
          {pins.map((p, i) => (
            <Pop key={p.t} on={k >= i + 1} className="absolute flex items-center gap-1.5" style={{ left: p.x, top: p.y }}>
              <span className="relative grid h-6 w-6 place-items-center rounded-full bg-[#ffb84d] text-[11px] font-bold text-[#2a1a00]">
                {k >= i + 4 ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-[11.5px] font-semibold transition-colors",
                  k >= i + 4 ? "bg-tc text-tc-ink line-through" : "bg-[#1d2630] text-foreground",
                )}
              >
                {p.t}
              </span>
            </Pop>
          ))}
        </Win>
      )}
    </Stage>
  );
}

function LaunchArt() {
  const url = "padariaboavista.com.br";
  return (
    <Stage n={5} ms={900} hold={2800}>
      {(k) => (
        <div className="relative flex h-full flex-col justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#0b1016] px-4 py-2.5 ring-1 ring-white/10">
            <Lock className={cn("h-3.5 w-3.5", k >= 1 ? "text-tc" : "text-muted-foreground")} />
            <span className="overflow-hidden whitespace-nowrap text-[13px]">
              <motion.span
                className="inline-block overflow-hidden align-bottom"
                initial={false}
                animate={{ width: k >= 1 ? "auto" : 0 }}
                transition={{ duration: 0.8 }}
              >
                {url}
              </motion.span>
            </span>
          </div>
          <div className="rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
            <div className="flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-[12px] text-muted-foreground">
              <Search className="h-3.5 w-3.5" /> padaria perto de mim
            </div>
            <Pop on={k >= 2} className="mt-3 rounded-lg bg-tc/10 p-2.5 ring-1 ring-tc/40">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Globe className="h-3 w-3" /> {url}
              </span>
              <span className="mt-0.5 block text-[14px] font-semibold text-tc">Padaria Boa Vista · Pão quentinho</span>
              <span className="mt-1 flex items-center gap-0.5 text-[11px] text-[#ffb84d]">★★★★★</span>
            </Pop>
            <div className="mt-2 flex flex-col gap-1.5 opacity-50">
              <Bar w="60%" />
              <Bar w="80%" />
            </div>
          </div>
          {k >= 3 &&
            Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={`${k}-${i}`}
                className={cn("absolute h-2 w-2", i % 3 ? "bg-tc" : "bg-[#ffb84d]")}
                style={{ left: "50%", top: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos(i * 0.45) * (90 + (i % 4) * 25), y: Math.sin(i * 0.45) * (70 + (i % 3) * 20) - 40, opacity: 0 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
              />
            ))}
        </div>
      )}
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Sistemas                                                             */
/* ------------------------------------------------------------------ */

function MessyArt() {
  const cells = ["1.200", "??", "Maria", "R$ 80", "#REF!", "ok", "12/03", "", "Pago?", "3x", "", "frete"];
  return (
    <Stage n={4} ms={1000} hold={2800}>
      {(k) => (
        <div className="relative h-full">
          <Win title="vendas_FINAL_v3 (2).xlsx" className="h-[78%] w-[86%]">
            <div className="grid grid-cols-3 gap-1">
              {cells.map((c, i) => (
                <motion.span
                  key={i}
                  animate={k < 3 ? { x: [0, (i % 2 ? 2 : -2), 0], rotate: [0, i % 3 ? 1 : -1, 0] } : { x: 0, rotate: 0 }}
                  transition={{ duration: 0.4, repeat: k < 3 ? Infinity : 0, delay: i * 0.03 }}
                  className={cn(
                    "h-6 truncate rounded bg-white/6 px-1.5 text-[11px] leading-6",
                    c === "??" || c === "#REF!" ? "bg-[#ff5d5d]/20 text-[#ff8a8a]" : "text-foreground",
                  )}
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </Win>
          <Pop on={k >= 1} className="absolute right-[2%] top-[8%] w-[34%] rotate-3 rounded-md bg-[#ffe27a] p-2 text-[11px] font-semibold text-[#3a2c00] shadow-lg">
            Ligar pro cliente do sofá!
          </Pop>
          <Pop on={k >= 2} className="absolute bottom-[26%] right-[8%] w-[30%] -rotate-6 rounded-md bg-[#ffd0e0] p-2 text-[11px] font-semibold text-[#4a1426] shadow-lg">
            Conferir caixa de ontem
          </Pop>
          <Pop on={k >= 3} className="absolute bottom-0 left-[6%] right-[6%] flex items-center gap-2 rounded-xl bg-tc px-3 py-2.5 text-[12.5px] font-bold text-tc-ink">
            <Search className="h-4 w-4 shrink-0" /> 3 planilhas · 2 cadernos · 14 tarefas mapeadas
          </Pop>
        </div>
      )}
    </Stage>
  );
}

function WireframeArt() {
  return (
    <Stage n={5}>
      {(k) => {
        const solid = k >= 4;
        const box = cn("rounded-lg transition-colors duration-500", solid ? "bg-white/8 ring-1 ring-white/10" : "border border-dashed border-tc/50");
        return (
          <div className="grid h-full grid-cols-[0.26fr_1fr] gap-2 rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
            <Pop on={k >= 1} className={cn(box, "flex flex-col gap-2 p-2")}>
              <span className={cn("h-2.5 w-[70%] rounded-full", solid ? "bg-tc" : "bg-tc/30")} />
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-2 w-full rounded-full bg-white/12" />
              ))}
            </Pop>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                {["Vendas", "Pedidos", "Ticket"].map((t, i) => (
                  <Pop key={t} on={k >= 2} className={cn(box, "p-2")} style={{ transitionDelay: `${i * 80}ms` }}>
                    <span className="text-[10.5px] text-muted-foreground">{t}</span>
                    <span className={cn("mt-1 block h-3 w-[60%] rounded", solid ? "bg-tc" : "bg-white/10")} />
                  </Pop>
                ))}
              </div>
              <Pop on={k >= 3} className={cn(box, "flex flex-1 flex-col gap-2 p-2")}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="flex gap-2">
                    <span className="h-2 flex-[2] rounded-full bg-white/12" />
                    <span className="h-2 flex-1 rounded-full bg-white/12" />
                    <span className={cn("h-2 flex-1 rounded-full", solid ? "bg-tc/60" : "bg-white/12")} />
                  </span>
                ))}
              </Pop>
            </div>
          </div>
        );
      }}
    </Stage>
  );
}

function RulesArt() {
  const rows: { l: string; v: string; tag?: string }[] = [
    { l: "Sofá retrátil", v: "R$ 1.200,00" },
    { l: "Pagamento à vista", v: "− R$ 60,00", tag: "−5%" },
    { l: "Entrega", v: "grátis", tag: "acima de R$ 1.000" },
  ];
  return (
    <Stage n={5} ms={950}>
      {(k) => (
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-[340px] rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10 sm:p-4">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Calculadora de venda</span>
            <div className="mt-2 flex flex-col gap-1.5 sm:mt-3 sm:gap-2.5">
              {rows.map((r, i) => (
                <Pop key={r.l} on={k >= i} className="flex items-center justify-between gap-2 text-[12px] sm:text-[13px]">
                  <span className="flex items-center gap-2">
                    {r.l}
                    {r.tag && <span className="rounded-full bg-tc/15 px-2 py-0.5 text-[10.5px] font-semibold text-tc">{r.tag}</span>}
                  </span>
                  <span className={cn("font-semibold", i ? "text-tc" : "")}>{r.v}</span>
                </Pop>
              ))}
            </div>
            <motion.div className="my-2 h-px origin-left bg-white/15 sm:my-3" initial={false} animate={{ scaleX: k >= 3 ? 1 : 0 }} />
            <Pop on={k >= 3} className="flex items-center justify-between">
              <span className="text-[13px] text-muted-foreground">Total</span>
              <span className="text-[18px] font-extrabold sm:text-[22px]">R$ 1.140,00</span>
            </Pop>
            <Pop on={k >= 4} className="mt-2 flex items-center gap-2 rounded-lg bg-tc px-3 py-1.5 text-[11.5px] font-bold text-tc-ink sm:mt-3 sm:py-2 sm:text-[12px]">
              <Check className="h-4 w-4" strokeWidth={3} /> Ou 3x de R$ 400,00 sem juros
            </Pop>
          </div>
        </div>
      )}
    </Stage>
  );
}

function ModulesArt() {
  const mods = ["Login", "Clientes", "Vendas", "Relatórios"];
  return (
    <Stage n={5} ms={1000}>
      {(k) => (
        <div className="flex h-full flex-col justify-center gap-2 sm:gap-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {mods.map((m, i) => {
              const state = k > i ? "pronto" : k === i ? "testando" : "na fila";
              return (
                <div
                  key={m}
                  className={cn(
                    "rounded-xl p-2.5 ring-1 transition-colors duration-500 sm:p-3",
                    k > i ? "bg-tc/12 ring-tc/50" : "bg-[#0b1016] ring-white/10",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold">{m}</span>
                    <Done on={k > i} />
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10 sm:mt-3">
                    <motion.span
                      className="block h-full bg-tc"
                      initial={false}
                      animate={{ width: k > i ? "100%" : k === i ? "60%" : "0%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className={cn("mt-1.5 block text-[11px]", k > i ? "text-tc" : k === i ? "text-[#ffb84d]" : "text-muted-foreground")}>
                    {state}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#0b1016] px-3 py-2.5 ring-1 ring-white/10">
            <span className="text-[12px] text-muted-foreground">Entrega</span>
            <span className="flex flex-1 gap-1">
              {mods.map((m, i) => (
                <span key={m} className={cn("h-2.5 flex-1 rounded-sm transition-colors duration-500", k > i ? "bg-tc" : "bg-white/10")} />
              ))}
            </span>
            <span className="text-[12px] font-bold text-tc">{Math.min(k, 4)}/4</span>
          </div>
        </div>
      )}
    </Stage>
  );
}

function MigrateArt() {
  const roles = ["Dono", "Gerente", "Atendente"];
  return (
    <Stage n={7} ms={650} hold={2600}>
      {(k) => (
        <div className="flex h-full flex-col gap-3">
          <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
            <Win title="clientes.xlsx" className="h-full">
              <div className="flex flex-col gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="h-4 rounded bg-[#3ddc84]/20"
                    initial={false}
                    animate={{ opacity: k > i ? 0.15 : 1, x: k > i ? 12 : 0 }}
                  />
                ))}
              </div>
            </Win>
            <motion.span
              className="text-[20px] font-bold text-tc"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              →
            </motion.span>
            <Win title="Sistema" className="h-full">
              <div className="flex flex-col gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <Pop key={i} on={k > i} from={0} className="flex h-4 items-center gap-1 rounded bg-tc/20 px-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-tc" />
                    <span className="h-1.5 flex-1 rounded-full bg-white/20" />
                  </Pop>
                ))}
              </div>
            </Win>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r, i) => (
              <Pop key={r} on={k >= 4 + i} className="flex items-center gap-2 rounded-xl bg-[#0b1016] p-2.5 ring-1 ring-white/10">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-tc/15 text-tc">
                  <UserRound className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold">{r}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <KeyRound className="h-2.5 w-2.5" /> login
                  </span>
                </span>
              </Pop>
            ))}
          </div>
        </div>
      )}
    </Stage>
  );
}

function DailyArt() {
  const sales = [3180, 3420, 3790, 4115];
  const bars = [40, 62, 48, 70, 55, 82, 66];
  return (
    <Stage n={4} ms={1200} hold={1800}>
      {(k) => (
        <div className="flex h-full flex-col gap-2.5 rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
          <div className="flex items-center justify-between text-[11.5px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5 text-tc" /> Painel · hoje
            </span>
            <span className="flex items-center gap-1 text-tc">
              <motion.span className="h-1.5 w-1.5 rounded-full bg-tc" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              ao vivo
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Vendas", `R$ ${sales[k].toLocaleString("pt-BR")}`],
              ["Pedidos", String(31 + k * 3)],
              ["Entregas", `${6 + k}/12`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-white/6 p-2">
                <span className="block text-[10.5px] text-muted-foreground">{l}</span>
                <motion.span key={v} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="block text-[15px] font-bold">
                  {v}
                </motion.span>
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-1.5 rounded-lg bg-white/4 p-2">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                className={cn("flex-1 rounded-t", i === bars.length - 1 ? "bg-tc" : "bg-tc/35")}
                initial={false}
                animate={{ height: `${i === bars.length - 1 ? h * (0.6 + k * 0.13) : h}%` }}
                transition={spring}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/6 px-2.5 py-1.5 text-[11.5px]">
            <ShieldCheck className="h-3.5 w-3.5 text-tc" /> Backup de hoje às 03:00
            <span className="ml-auto">
              <Done on />
            </span>
          </div>
        </div>
      )}
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Automações                                                           */
/* ------------------------------------------------------------------ */

function TopicsArt() {
  const topics: [string, number][] = [
    ["Preço", 42],
    ["Horário", 31],
    ["Entrega", 18],
    ["Cardápio", 12],
  ];
  return (
    <Stage n={5} ms={800} hold={2600}>
      {(k) => (
        <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-3">
          <div className="flex flex-col justify-center gap-2">
            {["Quanto custa o bolo?", "Abre domingo?", "Entrega no centro?"].map((m, i) => (
              <Pop key={m} on={k >= i} className="rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-[12px]">
                {m}
              </Pop>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-3 rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Perguntas no mês</span>
            {topics.map(([t, n], i) => (
              <div key={t}>
                <div className="flex justify-between text-[12.5px]">
                  <span>{t}</span>
                  <span className="font-bold text-tc">{k > i ? n : 0}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="block h-full rounded-full bg-tc"
                    initial={false}
                    animate={{ width: k > i ? `${(n / 42) * 100}%` : "0%" }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Stage>
  );
}

function TeachArt() {
  const docs = ["Cardápio", "Preços", "Horários", "Regras"];
  return (
    <Stage n={6} ms={750} hold={2400}>
      {(k) => (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <div className="grid w-full grid-cols-4 gap-2">
            {docs.map((d, i) => (
              <motion.div
                key={d}
                initial={false}
                animate={k > i ? { y: 52, opacity: 0, scale: 0.6 } : { y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeIn" }}
                className="flex flex-col items-center gap-1 rounded-lg bg-[#0b1016] p-2 ring-1 ring-white/10"
              >
                <FileText className="h-5 w-5 text-tc" />
                <span className="text-[11px]">{d}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="w-[78%] rounded-2xl bg-tc/10 p-3 ring-1 ring-tc/50"
            animate={k > 0 && k < 5 ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            key={k}
          >
            <span className="flex items-center justify-between text-[12.5px] font-semibold">
              Base de conhecimento <span className="text-tc">{Math.min(k, 4)}/4</span>
            </span>
            <span className="mt-2 flex gap-1">
              {docs.map((d, i) => (
                <span key={d} className={cn("h-2 flex-1 rounded-sm transition-colors duration-500", k > i ? "bg-tc" : "bg-white/10")} />
              ))}
            </span>
          </motion.div>
          <Pop on={k >= 5} className="rounded-full bg-[#0b1016] px-3 py-1.5 text-[12px] ring-1 ring-white/10">
            Jeito de falar: <b className="text-tc">simpático e direto</b>
          </Pop>
        </div>
      )}
    </Stage>
  );
}

function LimitsArt() {
  const msgs: { m: string; to: "ia" | "team" }[] = [
    { m: "Que horas vocês abrem?", to: "ia" },
    { m: "Meu pedido veio errado!", to: "team" },
    { m: "Faz 30% de desconto?", to: "team" },
    { m: "Tem bolo de cenoura?", to: "ia" },
  ];
  return (
    <Stage n={5} ms={900}>
      {(k) => (
        <div className="flex h-full flex-col justify-center gap-2.5">
          {msgs.map((x, i) => (
            <Pop key={x.m} on={k > i} className="flex items-center gap-2">
              <span className="flex-1 rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-[12.5px]">{x.m}</span>
              <span className="text-muted-foreground">→</span>
              <span
                className={cn(
                  "w-[96px] shrink-0 rounded-full px-2.5 py-1.5 text-center text-[11.5px] font-bold",
                  x.to === "ia" ? "bg-tc text-tc-ink" : "bg-[#ffb84d] text-[#2a1a00]",
                )}
              >
                {x.to === "ia" ? "IA responde" : "Chama a equipe"}
              </span>
            </Pop>
          ))}
        </div>
      )}
    </Stage>
  );
}

function ConnectArt() {
  const nodes = [
    { t: "Planilha", Icon: Sheet, x: 74, y: 18 },
    { t: "Agenda", Icon: CalendarDays, x: 78, y: 54 },
    { t: "Painel", Icon: LayoutDashboard, x: 72, y: 86 },
  ];
  return (
    <Stage n={4} ms={1000}>
      {(k) => (
        <div className="relative h-full">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {nodes.map((n, i) => (
              <motion.line
                key={n.t}
                x1={18}
                y1={54}
                x2={n.x - 8}
                y2={n.y}
                stroke="var(--tc)"
                strokeWidth={0.6}
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
                initial={false}
                animate={{ pathLength: k > i ? 1 : 0, opacity: k > i ? 0.8 : 0 }}
              />
            ))}
          </svg>
          {nodes.map((n, i) =>
            k > i ? (
              <motion.span
                key={`${n.t}-dot`}
                className="absolute h-2.5 w-2.5 rounded-sm bg-tc"
                style={{ marginLeft: -5, marginTop: -5 }}
                initial={{ left: "18%", top: "54%" }}
                animate={{ left: [`18%`, `${n.x - 8}%`], top: [`54%`, `${n.y}%`] }}
                transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.4, delay: i * 0.25 }}
              />
            ) : null,
          )}
          <div className="absolute left-[18%] top-[54%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25d366] text-[#04220f] sm:h-16 sm:w-16"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.div>
            <span className="mt-1.5 block text-center text-[11.5px] text-muted-foreground">WhatsApp</span>
          </div>
          {nodes.map(({ t, Icon, x, y }, i) => (
            <div key={t} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <div
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[12px] font-semibold ring-1 transition-colors duration-500 sm:gap-2 sm:px-3 sm:py-2 sm:text-[12.5px]",
                  k > i ? "bg-tc/15 text-foreground ring-tc/60" : "bg-[#0b1016] text-muted-foreground ring-white/10",
                )}
              >
                <Icon className={cn("h-4 w-4", k > i ? "text-tc" : "")} /> {t}
              </div>
            </div>
          ))}
        </div>
      )}
    </Stage>
  );
}

function TestArt() {
  const tests = ["Preço do bolo de 2 kg", "Pedido por áudio", "Cliente pede desconto", "Endereço de entrega", "Horário de domingo"];
  return (
    <Stage n={7} ms={650} hold={2400}>
      {(k) => (
        <Win title="Bateria de testes" className="h-full">
          <div className="flex h-full flex-col gap-2">
            {tests.map((t, i) => {
              const ran = k > i;
              const fail = i === 2 && k <= 5;
              return (
                <div key={t} className="flex items-center gap-2.5 text-[12.5px]">
                  {ran ? (
                    fail ? (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#ff5d5d] text-white">
                        <X className="h-3 w-3" strokeWidth={3} />
                      </span>
                    ) : (
                      <Done on />
                    )
                  ) : (
                    <span className="h-5 w-5 rounded-full ring-1 ring-white/20" />
                  )}
                  <span className={ran ? "text-foreground" : "text-muted-foreground"}>{t}</span>
                  {i === 2 && ran && (
                    <span className={cn("ml-auto text-[11px] font-semibold", fail ? "text-[#ff8a8a]" : "text-tc")}>
                      {fail ? "corrigindo…" : "corrigido"}
                    </span>
                  )}
                </div>
              );
            })}
            <div className="mt-auto flex items-center gap-2">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.span className="block h-full bg-tc" initial={false} animate={{ width: `${(Math.min(k, 5) / 5) * 100}%` }} />
              </span>
              <span className="text-[12px] font-bold text-tc">{Math.min(k, 5) - (k > 2 && k <= 5 ? 1 : 0)}/5</span>
            </div>
          </div>
        </Win>
      )}
    </Stage>
  );
}

function LiveArt() {
  const report = [55, 68, 61, 80, 92];
  return (
    <Stage n={5} ms={1000} hold={2000}>
      {(k) => (
        <div className="grid h-full grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
            <span className="flex items-center gap-1.5 text-[11px] text-tc">
              <motion.span className="h-1.5 w-1.5 rounded-full bg-tc" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              atendendo agora
            </span>
            <span className="text-[11px] text-muted-foreground">Conversas hoje</span>
            <motion.span key={k} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[34px] font-extrabold leading-none">
              {37 + k * 4}
            </motion.span>
            <div className="mt-auto flex flex-col gap-1.5">
              {[
                ["Respondidas pela IA", "92%"],
                ["Passadas à equipe", "8%"],
              ].map(([l, v]) => (
                <span key={l} className="flex justify-between text-[11.5px]">
                  <span className="text-muted-foreground">{l}</span>
                  <b>{v}</b>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col rounded-xl bg-[#0b1016] p-3 ring-1 ring-white/10">
            <span className="text-[11px] text-muted-foreground">Relatório do mês</span>
            <div className="mt-2 flex flex-1 items-end gap-1.5">
              {report.map((h, i) => (
                <motion.span
                  key={i}
                  className={cn("flex-1 rounded-t", i === report.length - 1 ? "bg-tc" : "bg-tc/35")}
                  initial={false}
                  animate={{ height: k > i - 1 ? `${h}%` : "6%" }}
                  transition={spring}
                />
              ))}
            </div>
            <Pop on={k >= 4} className="mt-2 rounded-md bg-tc/15 px-2 py-1 text-[11px] font-semibold text-tc">
              3 respostas melhoradas
            </Pop>
          </div>
        </div>
      )}
    </Stage>
  );
}

const ARTS: Record<Art, () => ReactNode> = {
  chat: ChatArt,
  sitemap: SitemapArt,
  style: StyleArt,
  build: BuildArt,
  review: ReviewArt,
  launch: LaunchArt,
  messy: MessyArt,
  wireframe: WireframeArt,
  rules: RulesArt,
  modules: ModulesArt,
  migrate: MigrateArt,
  daily: DailyArt,
  topics: TopicsArt,
  teach: TeachArt,
  limits: LimitsArt,
  connect: ConnectArt,
  test: TestArt,
  live: LiveArt,
};

export function StepArt({ art }: { art: Art }) {
  const A = ARTS[art];
  return <A />;
}

