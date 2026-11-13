"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AureaLogo } from "@/components/aurea-logo";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";

const LINKS = [
  { href: "/servicos/sites", label: "Sites", hint: "Sua empresa no Google e no WhatsApp", color: "#9b72ff" },
  { href: "/servicos/sistemas", label: "Sistemas", hint: "Vendas, clientes e caixa num painel só", color: "#ff8a3d" },
  { href: "/servicos/automacoes", label: "Automações", hint: "Uma IA que atende no seu WhatsApp", color: "#3ddc84" },
];

export function SiteHeader() {
  const path = usePathname();
  const home = path === "/";
  // menu do celular: no computador os links já aparecem no topo
  const [open, setOpen] = useState(false);
  // solid: logo pequeno visível; scrolled: fundo escuro desfocado atrás do menu
  const [solid, setSolid] = useState(!home);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setSolid(!home || window.scrollY > window.innerHeight * 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  // fecha o menu ao apertar Esc (ao tocar num link, o onClick fecha)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-[#070b10]/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          aria-label="Aurea, voltar ao início"
          className={cn(
            "w-[92px] text-foreground transition-[opacity,transform] duration-300",
            solid ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1.5 opacity-0",
          )}
          tabIndex={solid ? 0 : -1}
        >
          <AureaLogo title="" />
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden rounded-md px-3 py-2 text-[15px] text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground md:inline-block"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={whatsappLink("Olá! Vim pelo site da Aurea e quero conversar sobre um projeto.")}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[15px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Contato
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-celular"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-foreground transition-colors hover:bg-white/5 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-celular"
            aria-label="Serviços"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-[#070b10]/95 px-4 pb-5 pt-3 backdrop-blur-md md:hidden"
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-[17px] text-foreground/80 hover:bg-white/5"
            >
              Início
            </Link>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={path.startsWith(l.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/5",
                  path.startsWith(l.href) && "bg-white/[0.06]",
                )}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.color }} aria-hidden="true" />
                <span>
                  <span className="block text-[18px] font-semibold text-foreground">{l.label}</span>
                  <span className="block text-[15px] text-muted-foreground">{l.hint}</span>
                </span>
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
