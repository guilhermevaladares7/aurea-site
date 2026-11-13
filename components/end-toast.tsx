"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AuriIcon, type BitMood, type Outfit } from "@/components/mascot";
import { whatsappLink } from "@/lib/site";

const COPY: Record<string, { title: string; text: string; cta: string; msg: string; outfit: Outfit; mood: BitMood }> = {
  home: {
    title: "Chegou até o fim!",
    text: "Me conta o que a sua empresa precisa que eu te mostro o caminho.",
    cta: "Chamar no WhatsApp",
    msg: "Olá! Rolei o site da Aurea até o fim e quero conversar sobre um projeto.",
    outfit: "none",
    mood: "wave",
  },
  sites: {
    title: "Bora pôr sua empresa no ar?",
    text: "Eu monto um site rápido, bonito no celular e com o seu WhatsApp na frente.",
    cta: "Quero meu site",
    msg: "Olá! Vi a página de sites da Aurea e quero um site para a minha empresa.",
    outfit: "hardhat",
    mood: "happy",
  },
  sistemas: {
    title: "Chega de planilha bagunçada?",
    text: "Vamos montar um painel só seu, com login, relatórios e tudo no lugar.",
    cta: "Quero meu sistema",
    msg: "Olá! Vi a página de sistemas da Aurea e quero um sistema para a minha empresa.",
    outfit: "tie",
    mood: "happy",
  },
  automacoes: {
    title: "Uma IA atendendo 24h?",
    text: "Eu configuro a IA no seu WhatsApp e conecto com o que você já usa.",
    cta: "Quero automatizar",
    msg: "Olá! Vi a página de automações da Aurea e quero uma IA no meu WhatsApp.",
    outfit: "headset",
    mood: "happy",
  },
};

/** Aviso no centro, embaixo, quando a pessoa chega ao fim da página. */
export function EndToast({ service = "home" }: { service?: "home" | "sites" | "sistemas" | "automacoes" }) {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);
  const c = COPY[service];

  // só aparece quando a pessoa chega ao fim e para ali por ~1,5 s
  useEffect(() => {
    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(idle);
      const end = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160;
      if (!end) setShow(false);
      else idle = setTimeout(() => setShow(true), 1500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && !closed && (
        <motion.div
          role="dialog"
          aria-label={c.title}
          initial={{ opacity: 0, y: 60, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 60, x: "-50%" }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-3 left-1/2 z-[60] w-[min(560px,calc(100vw-24px))] sm:bottom-6"
        >
          <div className="relative flex items-center gap-3 rounded-2xl bg-surface-2/95 p-2.5 pr-12 ring-1 ring-tc/40 backdrop-blur-md sm:gap-4 sm:rounded-3xl sm:p-5 sm:pr-5">
            <motion.div
              className="w-10 shrink-0 sm:w-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.4, ease: "easeOut" }}
            >
              <AuriIcon outfit={c.outfit} mood={c.mood} className="w-full" />
            </motion.div>
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:block">
              <p className="min-w-0 flex-1 text-[15px] font-bold leading-tight text-foreground sm:text-[20px]">{c.title}</p>
              <p className="mt-1 hidden text-[15px] leading-snug text-foreground sm:block">{c.text}</p>
              <a
                href={whatsappLink(c.msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-md bg-tc px-3 py-2 text-[14px] font-semibold text-tc-ink transition-transform hover:-translate-y-0.5 sm:mt-3 sm:px-4 sm:text-[15px]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {c.cta}
              </a>
            </div>
            <button
              type="button"
              onClick={() => setClosed(true)}
              aria-label="Fechar aviso"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full sm:right-3 sm:top-3 sm:translate-y-0 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
