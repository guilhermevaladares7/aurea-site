"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Mascot, type BitMood, type Outfit } from "@/components/mascot";
import { H2 } from "@/components/service-sections";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Do código ao site: o HTML/CSS se escreve com a rolagem               */
/* ------------------------------------------------------------------ */

const CODE: { file: "index.html" | "style.css"; text: string }[] = [
  { file: "index.html", text: "<header>" },
  { file: "index.html", text: "  <strong>Café da Praça</strong>" },
  { file: "index.html", text: "  <nav>Cardápio  Sobre  Contato</nav>" },
  { file: "index.html", text: "</header>" },
  { file: "index.html", text: '<section class="hero">' },
  { file: "index.html", text: "  <h1>Café especial e bolo do dia</h1>" },
  { file: "index.html", text: "  <p>Aberto todo dia, das 7h às 19h.</p>" },
  { file: "index.html", text: '  <img src="cafe.jpg" alt="Café">' },
  { file: "index.html", text: '  <a class="btn" href="wa.me/…">Pedir no WhatsApp</a>' },
  { file: "index.html", text: "</section>" },
  { file: "style.css", text: ".hero {" },
  { file: "style.css", text: "  display: grid;" },
  { file: "style.css", text: "  grid-template-columns: 1fr 1fr;" },
  { file: "style.css", text: "  background: #0d1b3a;" },
  { file: "style.css", text: "  font-family: 'Archivo', sans-serif;" },
  { file: "style.css", text: "}" },
  { file: "style.css", text: ".btn {" },
  { file: "style.css", text: "  background: #ff3d7f;" },
  { file: "style.css", text: "  border-radius: 999px;" },
  { file: "style.css", text: "}" },
];
const TOTAL = CODE.reduce((a, l) => a + l.text.length, 0);
// onde cada linha começa, contando os caracteres de todas as anteriores
const OFFSETS = CODE.map((_, i) => CODE.slice(0, i).reduce((a, l) => a + l.text.length, 0));

/** pinta tags, atributos, textos entre aspas e propriedades de CSS */
function Highlight({ text }: { text: string }) {
  // com um grupo de captura, o split deixa os pedaços reconhecidos nos índices ímpares
  const parts = text.split(/(<\/?[a-z0-9]+|"[^"]*"|'[^']*'|[a-z-]+(?==)|[a-z-]+(?=:)|#[0-9a-f]{3,6}|[{}>])/gi);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        let c = "text-foreground";
        if (i % 2 === 1) {
          if (/^<\/?[a-z]/i.test(p) || p === ">") c = "text-[#7aa2ff]";
          else if (/^["']/.test(p)) c = "text-[#9fe0a8]";
          else if (/^#[0-9a-f]/i.test(p)) c = "text-[#ffb070]";
          else if (p === "{" || p === "}") c = "text-foreground/50";
          else c = "text-[#4fd8e6]";
        }
        return (
          <span key={i} className={c}>
            {p}
          </span>
        );
      })}
    </>
  );
}

const STAGE_TALK: { at: number; line: string; outfit: Outfit; mood: BitMood }[] = [
  { at: 0, line: "Role pra baixo que eu escrevo o site.", outfit: "hardhat", mood: "wave" },
  { at: 4, line: "Primeiro a estrutura, o HTML.", outfit: "hardhat", mood: "work" },
  { at: 10, line: "Está cru, né? Agora entra o CSS.", outfit: "beret", mood: "focus" },
  { at: 16, line: "Olha a diferença!", outfit: "beret", mood: "wow" },
  { at: 20, line: "Pronto pra ir pro ar!", outfit: "crown", mood: "happy" },
];

export function CodeToSite() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [chars, setChars] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const c = Math.round(Math.min(1, Math.max(0, (p - 0.05) / 0.85)) * TOTAL);
    setChars((prev) => (prev === c ? prev : c));
  });

  // quantas linhas já estão completas, e a parcial
  const typed = CODE.map((l, i) => Math.max(0, Math.min(l.text.length, chars - OFFSETS[i])));
  const done = (i: number) => typed[i] >= CODE[i].text.length;
  const cur = typed.findIndex((n, i) => n < CODE[i].text.length);
  const file = CODE[cur === -1 ? CODE.length - 1 : cur].file;
  const linesDone = cur === -1 ? CODE.length : cur;
  const talk = [...STAGE_TALK].reverse().find((s) => linesDone >= s.at) ?? STAGE_TALK[0];

  const has = {
    brand: done(1),
    nav: done(2),
    h1: done(5),
    p: done(6),
    img: done(7),
    btn: done(8),
    grid: done(12),
    bg: done(13),
    font: done(14),
    btnBg: done(17),
    round: done(18),
    live: cur === -1,
  };

  return (
    <section ref={ref} className="relative h-[300vh] border-t border-white/10" aria-labelledby="codigo-h">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-5 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 id="codigo-h" className={H2}>
              Do código ao site
            </h2>
            <p className="mt-2 text-[17px] text-foreground/75">Role a página e veja o site sendo escrito, linha por linha.</p>
          </div>
          <div className="flex items-end gap-3">
            <motion.p key={talk.line} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="hidden rounded-xl bg-surface-2 px-3 py-2 text-[15px] text-foreground ring-1 ring-white/10 sm:block">
              {talk.line}
            </motion.p>
            <div className="w-[64px] shrink-0 sm:w-[80px]">
              <Mascot size="100%" outfit={talk.outfit} mood={talk.mood} lines={[talk.line]} />
            </div>
          </div>
        </div>

        <div className="grid min-h-0 gap-4 lg:grid-cols-2">
          {/* editor */}
          <div data-ui className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-[#0a1020] ring-1 ring-white/10">
            <div className="flex gap-1 bg-[#0f1830] px-3 pt-2 text-[13px]">
              {(["index.html", "style.css"] as const).map((f) => (
                <span key={f} className={cn("rounded-t-md px-3 py-1.5", f === file ? "bg-[#0a1020] text-foreground" : "text-foreground/45")}>
                  {f}
                </span>
              ))}
            </div>
            <pre className="h-[34svh] overflow-hidden p-4 font-mono text-[12.5px] leading-[1.7] lg:h-[52svh] lg:text-[14px]">
              <code>
                {CODE.map((l, i) =>
                  l.file !== file ? null : (
                    <div key={i} className="flex">
                      <span className="w-7 shrink-0 select-none text-right text-foreground/25">{i + 1}</span>
                      <span className="ml-4 whitespace-pre">
                        <Highlight text={l.text.slice(0, typed[i])} />
                        {i === cur && <span className="cursor-blink ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-sites" />}
                      </span>
                    </div>
                  ),
                )}
              </code>
            </pre>
          </div>

          {/* prévia */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-white/10">
            <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
              <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
              <span className="ml-3 flex-1 truncate rounded-md bg-background/60 px-3 py-1 text-[12px] text-muted-foreground">cafedapraca.com.br</span>
              <span className={cn("rounded-md px-2 py-1 text-[11px] font-semibold transition-colors", has.live ? "bg-sites text-tc-ink" : "bg-white/10 text-foreground/60")}>
                {has.live ? "No ar ✓" : "Prévia"}
              </span>
            </div>
            <div
              data-ui
              className={cn(
                "relative h-[34svh] overflow-hidden p-5 transition-colors duration-700 lg:h-[52svh]",
                has.bg ? "bg-[#0d1b3a] text-white" : "bg-white text-black",
              )}
              style={{ fontFamily: has.font ? "var(--font-archivo)" : "Times New Roman, serif" }}
            >
              <div className={cn("flex items-center justify-between gap-3 text-[14px]", has.bg && "pb-3")}>
                {has.brand && <strong>Café da Praça</strong>}
                {has.nav && <span className={cn(has.bg ? "text-white/70" : "")}>Cardápio · Sobre · Contato</span>}
              </div>
              <motion.div layout className={cn("mt-3 gap-5", has.grid ? "grid grid-cols-2 items-center" : "block")}>
                <motion.div layout>
                  {has.h1 && <h3 className={cn("font-bold leading-tight", has.font ? "text-[clamp(20px,2.4vw,34px)] tracking-tight" : "text-[26px]")}>Café especial e bolo do dia</h3>}
                  {has.p && <p className="mt-2 text-[14px] opacity-80">Aberto todo dia, das 7h às 19h.</p>}
                  {has.btn && (
                    <a
                      className={cn(
                        "mt-4 inline-block text-[14px] transition-all duration-500",
                        has.btnBg ? "bg-sites px-4 py-2 font-semibold text-tc-ink no-underline" : "text-[#0000ee] underline",
                        has.round ? "rounded-full" : "rounded-none",
                      )}
                    >
                      Pedir no WhatsApp
                    </a>
                  )}
                </motion.div>
                {has.img && (
                  <motion.div layout className={cn("relative overflow-hidden", has.grid ? "aspect-[4/3] rounded-xl" : "mt-3 aspect-[16/9] w-[60%]")}>
                    <Image
                      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&q=70&auto=format&fit=crop"
                      alt="Xícara de café sobre a mesa"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </motion.div>
              {chars === 0 && <p className="text-[14px] text-black/40">(página em branco)</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

