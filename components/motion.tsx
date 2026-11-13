"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrada assinatura da vdrdev: "liga" como um monitor de tubo.
 * Começa como uma linha fina e clara, abre na vertical e assenta o brilho.
 */
export function PowerOn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ scaleY: 0.012, scaleX: 0.6, opacity: 0, filter: "brightness(3)" }}
      whileInView={{
        scaleY: [0.012, 0.012, 1],
        scaleX: [0.6, 1, 1],
        opacity: [0, 1, 1],
        filter: ["brightness(3)", "brightness(3)", "brightness(1)"],
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, times: [0, 0.35, 1], ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Sobe e aparece, uma vez, quando entra na tela. */
export function Rise({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  );
}
