"use client";

import { useEffect, useRef } from "react";

/**
 * Céu estrelado fixo atrás da página inteira (canvas).
 * As estrelas piscam devagar e se deslocam um pouco com o scroll (paralaxe).
 */
export function Starfield({ count = 220 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;

    type S = { x: number; y: number; r: number; phase: number; speed: number; depth: number; warm: boolean };
    let stars: S[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // no celular (toque), metade das estrelas
      const n = window.matchMedia("(pointer: coarse)").matches ? Math.round(count / 2) : count;
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 2,
        r: Math.random() * 1.2 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
        depth: 0.05 + Math.random() * 0.25,
        warm: Math.random() < 0.12,
      }));
    };

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const scroll = window.scrollY;
      const R = 150;
      for (const s of stars) {
        let x = s.x;
        let y = (((s.y - scroll * s.depth) % (h * 2)) + h * 2) % (h * 2);
        if (y > h) continue;
        // as estrelas perto do mouse se afastam, como uma lente
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        let near = 0;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          near = 1 - d / R;
          x += (dx / d) * near * near * 46;
          y += (dy / d) * near * near * 46;
        }
        const a = reduce ? 0.6 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.speed + s.phase));
        ctx.globalAlpha = Math.min(1, a + near * 0.6);
        ctx.fillStyle = s.warm || near > 0.4 ? "#36e2b4" : "#e8f2f4";
        ctx.beginPath();
        ctx.arc(x, y, s.r * (1 + near), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      draw(0);
      window.addEventListener("scroll", () => draw(0), { passive: true });
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
