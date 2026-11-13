"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AureaLogo } from "@/components/aurea-logo";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";

const LINKS = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#planos", label: "Planos" },
];

export function SiteHeader() {
  const home = usePathname() === "/";
  const [solid, setSolid] = useState(!home);

  useEffect(() => {
    if (!home) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-background/95" : "bg-transparent",
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
        </nav>
      </div>
    </header>
  );
}
