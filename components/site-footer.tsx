import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { AureaLogo } from "@/components/aurea-logo";
import { GithubIcon, InstagramIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { EMAIL, GITHUB_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_LABEL, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer id="contato" className="mt-28 px-4 pb-8 sm:px-8 lg:mt-44">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-center gap-10 rounded-[40px] bg-surface px-6 py-12 sm:px-12 lg:grid-cols-[1fr_auto] lg:py-16">
          <div>
            <Rise>
              <h2 className="text-[clamp(38px,5vw,76px)] font-extrabold leading-[0.95] tracking-[-0.035em] [font-stretch:112%]">
                Bora tirar sua ideia do papel?
              </h2>
            </Rise>
            <Rise as="p" delay={0.08} className="mt-5 max-w-[46ch] text-[19px] text-foreground/90">
              Me conta o que você precisa. Respondo no mesmo dia útil com uma proposta clara, sem
              compromisso.
            </Rise>
            <Rise delay={0.16} className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink("Olá! Quero tirar uma ideia do papel com a Aurea.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[16px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp {PHONE_LABEL}
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent("Projeto com a Aurea")}`}
                className="inline-flex items-center gap-2 rounded-md bg-white/8 px-6 py-3.5 text-[16px] font-semibold transition-colors hover:bg-white/14"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {EMAIL}
              </a>
            </Rise>
          </div>
          <div className="flex justify-center lg:pr-10">
            <Mascot size={190} mood="wave" bubbleSide="left" />
          </div>
        </div>

        <div className="mt-16 text-foreground" aria-hidden="true">
          <AureaLogo title="" />
        </div>

        <div className="mt-10 flex flex-col gap-6 text-[15px] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/servicos/sites" className="hover:text-foreground">Sites</Link>
            <Link href="/servicos/sistemas" className="hover:text-foreground">Sistemas</Link>
            <Link href="/servicos/automacoes" className="hover:text-foreground">Automações com IA</Link>
            <Link href="/#planos" className="hover:text-foreground">Planos</Link>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-foreground/85 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <GithubIcon className="h-5 w-5" />
              GitHub
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-foreground/85 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <InstagramIcon className="h-5 w-5" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-2 text-[14px] text-muted-foreground sm:flex-row">
          <span>© 2026 Aurea. Sites, sistemas e automações com IA.</span>
          <span>
            Fotos das demonstrações:{" "}
            <a className="underline underline-offset-4 hover:text-foreground" href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
