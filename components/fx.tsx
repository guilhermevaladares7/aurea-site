"use client";

import { useEffect, useRef } from "react";
import { SISTEMAS_DOODLES, SITES_DOODLES, drawField, makeField } from "@/components/fx-doodles";
import { createPlanet, type FxEnv } from "@/components/fx-planet";

/*
  Efeitos de fundo e de cursor, um por tema:
  - home ("stars"): brilhos ciano
  - sites ("code" / "design"): pedaços de código no mouse; no fundo, o planeta em pixel e desenhos de código e rede
  - sistemas ("pixels"): pixels laranja, como gráficos de painel, e gráficos flutuando
  - automações ("bubbles" / "flow"): balões de conversa e uma rede de agentes
*/

export type FxVariant = "stars" | "code" | "pixels" | "bubbles";
export type BackdropVariant = "design" | "pixels" | "flow";

function themeColor(el: Element, fallback: string, name = "--tc") {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
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

/** Onde o efeito do mouse não aparece: textos, botões, cards e telas de exemplo. */
const CONTENT =
  "p,h1,h2,h3,h4,h5,li,dt,dd,blockquote,figcaption,label,input,textarea,a,button,summary,[role=button],img,video,figure,article,[data-ui],[role=dialog]";

export function CursorFx({ variant = "stars" }: { variant?: FxVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { ctx, size, resize } = setupCanvas(canvas);
    const rgb = hexToRgb(themeColor(canvas, "#36e2b4"));
    const bits: Bit[] = [];
    const ring = { x: -100, y: -100, tx: -100, ty: -100, r: 14, tr: 14 };
    let last = { x: 0, y: 0 };
    let raf = 0;
    // sobre texto ou informação o efeito some, para não atrapalhar a leitura
    let overContent = false;
    let vis = 1;
    let prev = performance.now();

    const spawn = (x: number, y: number) => {
      const n = variant === "pixels" ? 2 : 1;
      for (let i = 0; i < n; i++) {
        bits.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * (variant === "pixels" ? 2.4 : 0.8),
          vy: variant === "pixels" ? -Math.random() * 2 : -0.4 - Math.random() * 0.6,
          life: 0,
          max: variant === "bubbles" ? 800 : variant === "code" ? 700 : 550,
          g: GLYPHS[(Math.random() * GLYPHS.length) | 0],
          s: variant === "pixels" ? 3 + ((Math.random() * 3) | 0) : 1,
        });
      }
      if (bits.length > 50) bits.splice(0, bits.length - 50);
    };

    const onMove = (e: PointerEvent) => {
      ring.tx = e.clientX;
      ring.ty = e.clientY;
      const t = e.target as Element | null;
      overContent = !!t?.closest?.(CONTENT);
      if (overContent) {
        last = { x: e.clientX, y: e.clientY };
        return;
      }
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (dx * dx + dy * dy > (variant === "code" ? 1800 : 900)) {
        spawn(e.clientX, e.clientY);
        last = { x: e.clientX, y: e.clientY };
      }
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
      vis += ((overContent ? 0 : 1) - vis) * 0.18;

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
        const a = (1 - k) * 0.6 * vis;
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
      if (ring.tx > -50 && vis > 0.02) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(${rgb},${0.5 * vis})`;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();
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

export function Backdrop({ variant }: { variant: BackdropVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { ctx, size, resize } = setupCanvas(canvas);
    const rgb = hexToRgb(themeColor(canvas, "#36e2b4"));
    const rgb2 = hexToRgb(themeColor(canvas, "#36e2b4", "--tc2"));
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
      else field = makeField(variant === "design" ? SITES_DOODLES : SISTEMAS_DOODLES, size.w, size.h, variant === "design" ? 11 : 29);
    };

    /* ---- sites: desenhos de código e rede flutuando, com o planeta em pixel no rodapé ---- */
    const font = getComputedStyle(canvas).getPropertyValue("--font-pixel").trim() || "ui-monospace, monospace";
    const planet = variant === "design" ? createPlanet() : null;
    let field = makeField(variant === "design" ? SITES_DOODLES : SISTEMAS_DOODLES, size.w, size.h, variant === "design" ? 11 : 29);
    const env = (t: number): FxEnv => ({ w: size.w, h: size.h, t, scroll: window.scrollY, mouse, reduce, rgb, rgb2 });

    const drawDesign = (t: number) => {
      const e = env(t);
      // perto do planeta os desenhos somem, para ele aparecer limpo
      drawField(ctx, field, e, { font, alpha: 0.3, fadeFrom: 0.66, links: true });
      planet?.draw(ctx, e);
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
      if (variant === "design") drawDesign(t);
      else if (variant === "pixels") {
        drawPixels(t);
        // os gráficos ficam na parte de cima; embaixo quem manda são as ondas de barras
        drawField(ctx, field, env(t), { font, alpha: 0.3, fadeFrom: 0.6 });
      }
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
