"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { LETTERS } from "@/components/aurea-logo";

/**
 * O logotipo AUREA feito de pixels.
 * Na entrada, os pixels vêm de todos os lados e montam o nome (da esquerda
 * para a direita, com um brilho quando chegam). Ao rolar a página, o nome
 * encolhe e se desfaz em pixels que sobem. Perto do mouse, os pixels fogem.
 *
 * O canvas cobre o palco inteiro; o lugar do logo é dado por `slotRef`.
 */

type Particle = {
  hx: number; // posição final (casa)
  hy: number;
  sx: number; // posição inicial
  sy: number;
  x: number;
  y: number;
  dx: number; // para onde vai ao se desfazer
  dy: number;
  delay: number;
  phase: number;
  cyan: boolean;
};

const ICE = "232,242,244";
const CYAN = "79,216,230";

export function ParticleLogo({
  slotRef,
  progress,
  run,
  onFormed,
  onReady,
}: {
  slotRef: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  run: number;
  onFormed?: () => void;
  onReady?: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const formedRef = useRef(onFormed);
  const readyRef = useRef(onReady);
  useEffect(() => {
    formedRef.current = onFormed;
    readyRef.current = onReady;
  });

  useEffect(() => {
    const canvas = ref.current;
    const stage = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !stage || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let gap = 4;
    let cx = 0;
    let cy = 0;
    let parts: Particle[] = [];
    let start = performance.now();
    let formed = false;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const build = (fresh: boolean) => {
      const slot = slotRef.current;
      if (!slot) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth;
      H = stage.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sr = slot.getBoundingClientRect();
      const pr = stage.getBoundingClientRect();
      const ox = sr.left - pr.left;
      const oy = sr.top - pr.top;
      const sw = sr.width;
      const sh = sr.height;
      cx = ox + sw / 2;
      cy = oy + sh / 2;

      // desenha o logo num canvas escondido e lê onde tem tinta
      const off = document.createElement("canvas");
      off.width = Math.ceil(sw);
      off.height = Math.ceil(sh);
      const o = off.getContext("2d");
      if (!o) return;
      const scale = sw / 1260;
      o.setTransform(scale, 0, 0, scale, -370 * scale, -430 * scale);
      o.fillStyle = "#fff";
      for (const l of LETTERS) {
        o.save();
        if (l.dx) o.translate(l.dx, 0);
        o.fill(new Path2D(l.d), "evenodd");
        o.restore();
      }
      gap = Math.max(3, Math.round(sw / 290));
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const next: Particle[] = [];
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          const px = Math.min(off.width - 1, x + (gap >> 1));
          const py = Math.min(off.height - 1, y + (gap >> 1));
          if (data[(py * off.width + px) * 4 + 3] > 120) {
            const hx = ox + x;
            const hy = oy + y;
            const a = Math.random() * Math.PI * 2;
            next.push({
              hx,
              hy,
              sx: hx + Math.cos(a) * (W * (0.35 + Math.random() * 0.5)),
              sy: hy + Math.sin(a) * (H * (0.35 + Math.random() * 0.5)),
              x: hx,
              y: hy,
              dx: (Math.random() - 0.5) * W * 0.7,
              dy: -H * (0.25 + Math.random() * 0.6),
              delay: (x / off.width) * 0.9 + Math.random() * 0.35,
              phase: Math.random() * Math.PI * 2,
              cyan: Math.random() < 0.14,
            });
          }
        }
      }
      parts = next;
      if (fresh) {
        start = performance.now();
        formed = reduce;
      }
      readyRef.current?.();
    };

    const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const p = Math.min(1, Math.max(0, progress.get()));
      const shrink = 1 - 0.32 * p;
      const e = reduce ? 0 : Math.pow(Math.min(1, Math.max(0, (p - 0.04) / 0.85)), 1.6);
      const fade = reduce ? 1 - p : 1 - e;
      ctx.clearRect(0, 0, W, H);
      if (fade <= 0.01) return;

      let allIn = true;
      const size = Math.max(2, gap - 1);
      const R = 110;
      for (const q of parts) {
        const k = reduce ? 1 : Math.min(1, Math.max(0, (t - q.delay) / 0.95));
        if (k < 1) allIn = false;
        const ek = easeOut(k);
        // casa (encolhendo ao rolar) + desfazendo
        let tx = cx + (q.hx - cx) * shrink + q.dx * e;
        let ty = cy + (q.hy - cy) * shrink + q.dy * e;
        if (k < 1) {
          tx = q.sx + (tx - q.sx) * ek;
          ty = q.sy + (ty - q.sy) * ek;
        }
        // foge do mouse
        const mx = tx - mouse.x;
        const my = ty - mouse.y;
        const d2 = mx * mx + my * my;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = Math.pow(1 - d / R, 2) * 42;
          tx += (mx / d) * f;
          ty += (my / d) * f;
        }
        if (k < 1) {
          q.x = tx;
          q.y = ty;
        } else {
          q.x += (tx - q.x) * 0.22;
          q.y += (ty - q.y) * 0.22;
        }
        const flash = k > 0.75 && k < 1 ? 1 : 0;
        const tw = 0.82 + 0.18 * Math.sin(t * 2.2 + q.phase);
        const a = (k < 1 ? ek : tw) * fade;
        ctx.fillStyle = `rgba(${q.cyan || flash ? CYAN : ICE},${a})`;
        const s = size * (1 - 0.5 * e) * (flash ? 1.4 : 1);
        ctx.fillRect(q.x, q.y, s, s);
      }
      if (allIn && !formed) {
        formed = true;
        formedRef.current?.();
      }
    };

    const loop = (now: number) => {
      const r = stage.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (ev: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      mouse.x = ev.clientX - r.left;
      mouse.y = ev.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => build(false);

    // espera as fontes/layout assentarem antes de medir o lugar do logo
    const kick = setTimeout(() => {
      build(true);
      if (reduce) formedRef.current?.();
      raf = requestAnimationFrame(loop);
    }, 120);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      clearTimeout(kick);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [slotRef, progress, run]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
