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

  useEffect(() => {
    const onScroll = () => {
      const end = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160;
      setShow(end);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          className="fixed bottom-4 left-1/2 z-[60] w-[min(560px,calc(100vw-24px))] sm:bottom-6"
        >
          <div className="relative flex items-center gap-4 rounded-3xl bg-surface-2 p-4 pr-5 ring-1 ring-tc/40 sm:p-5">
            <motion.div
              className="w-16 shrink-0 sm:w-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.4, ease: "easeOut" }}
            >
              <AuriIcon outfit={c.outfit} mood={c.mood} className="w-full" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="pixel text-[17px] leading-tight text-tc">{c.title}</p>
              <p className="mt-1 text-[15px] leading-snug text-foreground/90">{c.text}</p>
              <a
                href={whatsappLink(c.msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-tc px-4 py-2 text-[15px] font-semibold text-tc-ink transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {c.cta}
              </a>
            </div>
            <button
              type="button"
              onClick={() => setClosed(true)}
              aria-label="Fechar aviso"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
