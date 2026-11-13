"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AureaLogo } from "@/components/aurea-logo";

/**
 * Tela de carregando: o nome AUREA piscando sobre o fundo desfocado.
 * Aparece ao abrir o site (até a página terminar de carregar) e ao trocar de página.
 */
export function PageLoader() {
  const pathname = usePathname();
  const [booting, setBooting] = useState(true);
  // de qual página saímos; enquanto ainda estivermos nela, a próxima está carregando
  const [leaving, setLeaving] = useState<string | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const done = () => (t = setTimeout(() => setBooting(false), 350));
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    // garantia: nunca fica preso na tela de carregando
    const safety = setTimeout(() => setBooting(false), 6000);
    return () => {
      clearTimeout(t);
      clearTimeout(safety);
      window.removeEventListener("load", done);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      setLeaving(location.pathname);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const show = booting || (leaving !== null && leaving === pathname);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="page-loader fixed inset-0 z-[100] grid place-items-center bg-background/55 backdrop-blur-xl"
          role="status"
          aria-label="Carregando"
        >
          <motion.div
            className="w-[min(60vw,300px)] text-foreground"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AureaLogo title="" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
