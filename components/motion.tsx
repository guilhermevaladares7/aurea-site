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

/**
 * Antes este componente fazia cada bloco de texto subir e aparecer ao entrar na tela.
 * Isso repetido em toda seção cansava e tirava a seriedade da página, então agora ele só
 * mostra o conteúdo. As animações que ficaram são as que têm motivo: a abertura, o Auri e as demonstrações.
 */
export function Rise({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  /** mantido só para não quebrar quem ainda passa o atraso */
  delay?: number;
  className?: string;
  as?: "div" | "p" | "li" | "span";
}) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
