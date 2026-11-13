"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Conta passos em loop (0..steps-1) só enquanto o elemento está visível.
 * `durations` permite um tempo diferente para cada passo.
 */
export function useTicker(durations: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setStep((s) => {
        const next = (s + 1) % durations.length;
        if (next === 0) setRound((r) => r + 1);
        return next;
      });
    }, durations[step]);
    return () => clearTimeout(t);
  }, [inView, step, durations]);

  return { ref, step, round, inView };
}
