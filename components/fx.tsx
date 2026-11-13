"use client";

import { useEffect, useRef } from "react";

/*
  Efeitos de fundo e de cursor, um por tema:
  - home ("stars"): brilhos ciano
  - sites ("code"): pedaços de HTML/CSS
  - sistemas ("pixels"): pixels laranja, como gráficos de painel
  - automações ("bubbles" / "flow"): balões de conversa e uma rede de agentes
*/

export type FxVariant = "stars" | "code" | "pixels" | "bubbles";
export type BackdropVariant = "code" | "pixels" | "flow";

function themeColor(el: Element, fallback: string) {
  const v = getComputedStyle(el).getPropertyValue("--tc").trim();
  if (!v || v.startsWith("var(")) return fallback;
  return v;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function setupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const size = { w: 0, h: 0 };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size.w = window.innerWidth;
    size.h = window.innerHeight;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  return { ctx, size, resize };
}

/* ------------------------------------------------------------------ */
/* Rastro do cursor                                                     */
/* ------------------------------------------------------------------ */

const GLYPHS = ["</>", "<div>", "{ }", ";", "#fff", "css", "=>", "<a>", "h1", "px", "flex", "::"];

type Bit = { x: number; y: number; vx: number; vy: number; life: number; max: number; g: string; s: number };

export function CursorFx({ variant = "stars" }: { variant?: FxVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { ctx, size, resize } = setupCanvas(canvas);
    const rgb = hexToRgb(themeColor(canvas, "#4fd8e6"));
    const bits: Bit[] = [];
    const ring = { x: -100, y: -100, tx: -100, ty: -100, r: 14, tr: 14 };
    let last = { x: 0, y: 0 };
    let raf = 0;
    let prev = performance.now();

    const spawn = (x: number, y: number) => {
      const n = variant === "pixels" ? 3 : 1;
      for (let i = 0; i < n; i++) {
        bits.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * (variant === "pixels" ? 2.4 : 0.8),
          vy: variant === "pixels" ? -Math.random() * 2 : -0.4 - Math.random() * 0.6,
          life: 0,
          max: variant === "bubbles" ? 1100 : variant === "code" ? 950 : 750,
          g: GLYPHS[(Math.random() * GLYPHS.length) | 0],
          s: variant === "pixels" ? 3 + ((Math.random() * 3) | 0) : 1,
        });
      }
      if (bits.length > 160) bits.splice(0, bits.length - 160);
    };

    const onMove = (e: PointerEvent) => {
      ring.tx = e.clientX;
      ring.ty = e.clientY;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (dx * dx + dy * dy > (variant === "code" ? 900 : 260)) {
        spawn(e.clientX, e.clientY);
        last = { x: e.clientX, y: e.clientY };
      }
      const t = e.target as Element | null;
      ring.tr = t?.closest?.("a,button,summary,[role=button]") ? 24 : 14;
    };
    const onLeave = () => {
      ring.tx = -100;
      ring.ty = -100;
    };

    const draw = (now: number) => {
      // aba escondida: não desenha nada (economiza bateria)
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dt = Math.min(48, now - prev);
      prev = now;
      ctx.clearRect(0, 0, size.w, size.h);

      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.life += dt;
        if (b.life > b.max) {
          bits.splice(i, 1);
          continue;
        }
        const k = b.life / b.max;
        b.x += b.vx;
        b.y += b.vy;
        if (variant === "pixels") b.vy += 0.12;
        const a = (1 - k) * 0.9;
        ctx.fillStyle = `rgba(${rgb},${a})`;
        ctx.strokeStyle = `rgba(${rgb},${a})`;
        if (variant === "code") {
          ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillText(b.g, b.x + 10, b.y + 18);
        } else if (variant === "pixels") {
          ctx.fillRect(Math.round(b.x), Math.round(b.y), b.s, b.s);
        } else if (variant === "bubbles") {
          const w = 18;
          const h = 12;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(b.x + 8, b.y + 6, w, h, 4);
          ctx.stroke();
          for (let d = 0; d < 3; d++) ctx.fillRect(b.x + 12 + d * 4, b.y + 11, 2, 2);
        } else {
          const s = 2;
          const cx = Math.round(b.x);
          const cy = Math.round(b.y);
          ctx.fillRect(cx, cy - s, s, s * 3);
          ctx.fillRect(cx - s, cy, s * 3, s);
        }
      }

      // anel que segue o mouse com atraso
      ring.x += (ring.tx - ring.x) * 0.22;
      ring.y += (ring.ty - ring.y) * 0.22;
      ring.r += (ring.tr - ring.r) * 0.2;
      if (ring.tx > -50) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(${rgb},0.75)`;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();
        if (ring.tr > 14) {
          ctx.fillStyle = `rgba(${rgb},0.12)`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]" />;
}

/* ------------------------------------------------------------------ */
/* Fundos animados                                                      */
/* ------------------------------------------------------------------ */

const CODE_LINES = [
  "<!doctype html>",
  '<html lang="pt-BR">',
  "<head>",
  '  <meta name="viewport" content="width=device-width">',
  "  <title>Sua empresa</title>",
  '  <link rel="stylesheet" href="style.css">',
  "</head>",
  "<body>",
  '  <header class="topo">',
  '    <a class="logo" href="/">Sua marca</a>',
  "    <nav>Início · Sobre · Contato</nav>",
  "  </header>",
  '  <section class="hero">',
  "    <h1>Bem-vindo ao seu site</h1>",
  '    <a class="btn" href="https://wa.me/">WhatsApp</a>',
  "  </section>",
  "</body>",
  ".hero {",
  "  display: grid;",
  "  place-items: center;",
  "  min-height: 100svh;",
  "}",
  ".btn {",
  "  background: #5b8cff;",
  "  border-radius: 12px;",
  "  transition: transform .2s;",
  "}",
  ".btn:hover { transform: translateY(-2px); }",
  "@media (max-width: 640px) {",
  "  h1 { font-size: 2.4rem; }",
  "}",
];

const SCRAMBLE = "<>/{}#;:=*01";

export function Backdrop({ variant }: { variant: BackdropVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { ctx, size, resize } = setupCanvas(canvas);
    const rgb = hexToRgb(themeColor(canvas, "#4fd8e6"));
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    const t0 = performance.now();

    /* ---- estado da rede (automações) ---- */
    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];
    const packets: { a: number; b: number; k: number }[] = [];
    const makeNodes = () => {
      const n = Math.round((size.w * size.h) / 30000);
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * size.w,
        y: Math.random() * size.h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };
    makeNodes();

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onResize = () => {
      resize();
      if (variant === "flow") makeNodes();
    };

    /* ---- código sendo digitado (sites) ---- */
    const drawCode = (t: number) => {
      const lh = 22;
      const colW = 440;
      const cols = Math.max(1, Math.ceil(size.w / colW) + 1);
      const rows = Math.ceil(size.h / lh) + 2;
      const shift = (window.scrollY * 0.25) % lh;
      ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
      const cps = 34; // caracteres por segundo
      for (let c = 0; c < cols; c++) {
        const x0 = c * colW + 24 - ((c % 2) * colW) / 3;
        // cada coluna digita em loop, com o próprio atraso
        const total = rows * 26;
        const typed = reduce ? total : ((t * cps + c * 400) % (total + 120));
        let budget = typed;
        for (let r = 0; r < rows; r++) {
          const line = CODE_LINES[(r + c * 7) % CODE_LINES.length];
          const show = Math.max(0, Math.min(line.length, Math.floor(budget)));
          budget -= 26;
          if (show <= 0) break;
          const y = r * lh + 30 - shift;
          const dyM = Math.abs(y - mouse.y);
          const near = dyM < 120 && mouse.x > x0 - 140 && mouse.x < x0 + colW;
          if (!near) {
            ctx.fillStyle = `rgba(${rgb},0.16)`;
            ctx.fillText(line.slice(0, show), x0, y);
          } else {
            // perto do mouse: letras se espalham e embaralham
            let cx = x0;
            for (let i = 0; i < show; i++) {
              const ch = line[i];
              const w = ctx.measureText(ch).width;
              const dx = cx - mouse.x;
              const dy = y - mouse.y;
              const d = Math.sqrt(dx * dx + dy * dy) || 1;
              const f = d < 120 ? Math.pow(1 - d / 120, 2) : 0;
              const ox = (dx / d) * f * 28;
              const oy = (dy / d) * f * 28;
              const glyph = f > 0.35 && Math.random() < 0.3 ? SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0] : ch;
              ctx.fillStyle = `rgba(${rgb},${0.16 + f * 0.7})`;
              ctx.fillText(glyph, cx + ox, y + oy);
              cx += w;
            }
          }
          // cursor piscando no fim da linha que está sendo digitada
          if (show < line.length && Math.floor(t * 2) % 2 === 0) {
            ctx.fillStyle = `rgba(${rgb},0.5)`;
            ctx.fillRect(x0 + ctx.measureText(line.slice(0, show)).width + 2, y - 11, 7, 14);
          }
        }
      }
    };

    /* ---- pixels de gráfico (sistemas) ---- */
    const drawPixels = (t: number) => {
      const cell = 16;
      const cols = Math.ceil(size.w / cell);
      const rows = Math.ceil(size.h / cell);
      const R = 150;
      for (let i = 0; i < cols; i++) {
        // barras: soma de ondas lentas, como um gráfico vivo
        const v =
          0.28 +
          0.14 * Math.sin(i * 0.23 + t * 0.7) +
          0.1 * Math.sin(i * 0.071 - t * 0.45) +
          0.06 * Math.sin(i * 0.9 + Math.floor(t * 1.5));
        const lit = Math.floor(v * rows * 0.55);
        // linha de tendência por cima
        const ly = Math.floor(rows * (0.28 + 0.1 * Math.sin(i * 0.12 + t * 0.5) + 0.05 * Math.sin(i * 0.4 - t)));
        for (let r = 0; r < rows; r++) {
          const x = i * cell;
          const y = r * cell;
          const fromBottom = rows - r;
          const isBar = fromBottom <= lit;
          const isLine = r === ly;
          const dx = x + cell / 2 - mouse.x;
          const dy = y + cell / 2 - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const f = d < R ? 1 - d / R : 0;
          if (!isBar && !isLine && f === 0) {
            if ((i + r) % 4 === 0) {
              ctx.fillStyle = `rgba(${rgb},0.05)`;
              ctx.fillRect(x + 7, y + 7, 2, 2);
            }
            continue;
          }
          const base = isLine ? 0.4 : isBar ? 0.07 + (fromBottom === lit ? 0.12 : 0) : 0.02;
          const a = Math.min(0.9, base + f * f * 0.55);
          const s = (cell - 4) * (1 + f * 0.6);
          ctx.fillStyle = `rgba(${rgb},${a})`;
          ctx.fillRect(x + cell / 2 - s / 2 - (dx / (d || 1)) * f * 10, y + cell / 2 - s / 2 - (dy / (d || 1)) * f * 10, s, s);
        }
      }
    };

    /* ---- rede de agentes (automações) ---- */
    const drawFlow = (t: number) => {
      const R = 170;
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > size.w) n.vx *= -1;
        if (n.y < 0 || n.y > size.h) n.vy *= -1;
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140 && d > 0) {
          n.x += (dx / d) * (1 - d / 140) * 3;
          n.y += (dy / d) * (1 - d / 140) * 3;
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < R) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / R) * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            if (!reduce && Math.random() < 0.0009) packets.push({ a: i, b: j, k: 0 });
          }
        }
        // o mouse vira um nó e se conecta aos vizinhos
        const n = nodes[i];
        const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (dm < 220) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - dm / 220) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${rgb},0.35)`;
        ctx.beginPath();
        ctx.roundRect(n.x - 5, n.y - 4, 10, 8, 3);
        ctx.fill();
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.k += 0.012;
        if (p.k >= 1 || !nodes[p.a] || !nodes[p.b]) {
          packets.splice(i, 1);
          continue;
        }
        const a = nodes[p.a];
        const b = nodes[p.b];
        ctx.fillStyle = `rgba(${rgb},0.9)`;
        ctx.fillRect(a.x + (b.x - a.x) * p.k - 2, a.y + (b.y - a.y) * p.k - 2, 4, 4);
      }
      drawChatIcons(t);
      drawSeaweed(t);
    };

    /* ---- balão de conversa em pixel art, piscando (automações) ---- */
    const CHAT = [
      ".....######.....",
      "...##......##...",
      "..#..........#..",
      ".#............#.",
      ".#...##.......#.",
      "#...###........#",
      "#...##.........#",
      "#....##........#",
      "#.....##..##...#",
      "#......#####...#",
      ".#.......##...#.",
      ".#............#.",
      "..#..........#..",
      ".##.##......##..",
      ".#.#..######....",
      "##..............",
    ];
    const chatSpots = [
      { fx: 0.84, fy: 0.2, cell: 9, ph: 0 },
      { fx: 0.1, fy: 0.42, cell: 6, ph: 2.1 },
      { fx: 0.7, fy: 0.68, cell: 5, ph: 4.2 },
    ];
    function drawChatIcons(t: number) {
      for (const s of chatSpots) {
        const ox = s.fx * size.w;
        const oy = s.fy * size.h;
        const w = 16 * s.cell;
        const d = Math.hypot(ox + w / 2 - mouse.x, oy + w / 2 - mouse.y);
        const near = d < 260 ? 1 - d / 260 : 0;
        // pisca em degraus, como pixel art, e acende quando o mouse chega perto
        const blink = Math.floor(t * 2 + s.ph) % 3 === 0 ? 0.45 : 0.18;
        ctx.fillStyle = `rgba(${rgb},${Math.min(0.9, (reduce ? 0.2 : blink) + near * 0.5)})`;
        for (let r = 0; r < 16; r++)
          for (let c = 0; c < 16; c++) if (CHAT[r][c] === "#") ctx.fillRect(ox + c * s.cell, oy + r * s.cell, s.cell - 1, s.cell - 1);
      }
    }

    /* ---- algas em pixel no rodapé da tela, balançando e fugindo do mouse ---- */
    const weeds = Array.from({ length: 14 }, (_, i) => ({ fx: (i + 0.5) / 14 + (Math.sin(i * 7.3) * 0.02), h: 9 + ((i * 5) % 9), ph: i * 1.7 }));
    function drawSeaweed(t: number) {
      const cell = 9;
      for (const w of weeds) {
        const baseX = w.fx * size.w;
        for (let j = 0; j < w.h; j++) {
          const k = j / w.h;
          let x = baseX + (reduce ? 0 : Math.sin(t * 1.4 + w.ph + j * 0.35) * j * 1.1);
          const y = size.h - (j + 1) * cell;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) x += (dx / (dist || 1)) * (1 - dist / 180) * 60 * k;
          const tip = j >= w.h - 2;
          const glow = tip && Math.floor(t * 3 + w.ph) % 4 === 0;
          ctx.fillStyle = `rgba(${rgb},${glow ? 0.85 : 0.14 + k * 0.22})`;
          ctx.fillRect(Math.round(x / 3) * 3, y, cell - 1, cell - 1);
          // folhinhas alternadas
          if (j % 3 === 1) ctx.fillRect(Math.round(x / 3) * 3 + (j % 2 ? cell : -cell), y, cell - 1, cell - 1);
        }
      }
    }

    const draw = (now: number) => {
      // aba escondida: não desenha nada (economiza bateria)
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, size.w, size.h);
      if (variant === "code") drawCode(t);
      else if (variant === "pixels") drawPixels(t);
      else drawFlow(t);
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5]" />;
}
