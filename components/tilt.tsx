"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/** Inclina o conteúdo em 3D seguindo o mouse, com um brilho que acompanha. */
export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(400px circle at ${x} ${y}, color-mix(in srgb, var(--tc) 16%, transparent), transparent 60%)`,
  );

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div className={`[perspective:1200px] ${className ?? ""}`}>
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [.group:hover_&]:opacity-100"
          style={{ background: glow }}
        />
      </motion.div>
    </div>
  );
}
