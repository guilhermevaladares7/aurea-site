"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Check, Clock, Globe, MapPin, MessageCircle, Search, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AuriIcon } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { H2 } from "@/components/service-sections";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Por que ter um site: a busca no Google, com e sem site               */
/* ------------------------------------------------------------------ */

const REASONS = [
  { icon: BadgeCheck, t: "Passa confiança", d: "Antes do primeiro contato, o cliente já vê que a empresa é séria e organizada." },
  { icon: Search, t: "Aparece no Google", d: "Quem procura o que você vende na sua cidade encontra você, e não só o concorrente." },
  { icon: Globe, t: "É seu, não do algoritmo", d: "No Instagram, a rede decide quem vê. O site é o seu endereço fixo na internet." },
  { icon: Clock, t: "Atende 24 horas", d: "Produtos, horário e endereço sempre à mão, com um botão direto para o seu WhatsApp." },
];

function GoogleMock({ withSite }: { withSite: boolean }) {
  return (
    <div data-ui className="overflow-hidden rounded-3xl bg-[#0b1016] ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-tc/70" />
        <span className="ml-3 flex flex-1 items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-[14px] text-foreground">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          padaria boa vista
        </span>
      </div>
      <div className="relative min-h-[330px] p-4 sm:p-5">
        <AnimatePresence mode="wait" initial={false}>
          {withSite ? (
            <motion.div key="com" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
              <div className="rounded-2xl bg-tc/10 p-4 ring-1 ring-tc/50">
                <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" /> padariaboavista.com.br
                </span>
                <span className="mt-1 block text-[19px] font-bold text-tc">Padaria Boa Vista · Pão quentinho desde 1998</span>
                <span className="mt-1 flex items-center gap-1 text-[13px] text-[#ffb84d]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  ))}
                  <span className="ml-1 text-muted-foreground">Aberto agora · Centro</span>
                </span>
                <span className="mt-3 flex flex-wrap gap-2">
                  {["Cardápio", "Encomendas", "Como chegar"].map((l) => (
                    <span key={l} className="rounded-full bg-white/8 px-3 py-1 text-[13px]">
                      {l}
                    </span>
                  ))}
                  <span className="flex items-center gap-1.5 rounded-full bg-[#25d366] px-3 py-1 text-[13px] font-semibold text-[#04220f]">
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp
                  </span>
                </span>
              </div>
              <div className="rounded-2xl p-4 opacity-50 ring-1 ring-white/8">
                <span className="block text-[12px] text-muted-foreground">paesecia.com.br</span>
                <span className="block text-[16px] font-semibold">Pães &amp; Cia</span>
              </div>
              <p className="mt-1 flex items-center gap-2 text-[15px] font-semibold text-tc">
                <Check className="h-5 w-5" aria-hidden="true" /> O cliente encontra você e chama no WhatsApp.
              </p>
            </motion.div>
          ) : (
            <motion.div key="sem" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
              <div className="rounded-2xl p-4 ring-1 ring-white/10">
                <span className="block text-[12px] text-muted-foreground">paesecia.com.br</span>
                <span className="mt-1 block text-[19px] font-bold">Pães &amp; Cia · A melhor padaria da cidade</span>
                <span className="mt-1 flex items-center gap-1 text-[13px] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Concorrente · 900 m de você
                </span>
              </div>
              <div className="rounded-2xl p-4 opacity-70 ring-1 ring-white/8">
                <span className="block text-[12px] text-muted-foreground">instagram.com › padariaboavista</span>
                <span className="block text-[16px] font-semibold">Padaria Boa Vista (@padariaboavista)</span>
                <span className="block text-[13px] text-muted-foreground">Último post há 5 semanas</span>
              </div>
              <div className="rounded-2xl p-4 opacity-50 ring-1 ring-white/8">
                <span className="block text-[12px] text-muted-foreground">guia-local.com</span>
                <span className="block text-[16px] font-semibold">Padarias no centro: telefone desatualizado</span>
              </div>
              <p className="mt-1 flex items-center gap-2 text-[15px] font-semibold text-[#ff8a8a]">
                <X className="h-5 w-5" aria-hidden="true" /> O cliente não acha você e chama o concorrente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function WhySite() {
  const [withSite, setWithSite] = useState(false);
  const [auto, setAuto] = useState(true);

  // alterna sozinho até a pessoa clicar
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setWithSite((v) => !v), 4200);
    return () => clearInterval(id);
  }, [auto]);

  const pick = (v: boolean) => {
    setAuto(false);
    setWithSite(v);
  };

  return (
    <section className="pt-28 lg:pt-36" aria-labelledby="porque-h">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <Rise>
            <h2 id="porque-h" className={H2}>
              Seu cliente vai procurar você no Google.
            </h2>
          </Rise>
          <Rise as="p" delay={0.06} className="mt-6 max-w-[46ch] text-[20px] leading-relaxed text-foreground">
            Quando alguém ouve falar da sua empresa, a primeira coisa que faz é pesquisar o nome. O que aparece ali decide
            se ele chama você ou o concorrente.
          </Rise>
          <Rise delay={0.12} className="mt-8 inline-flex rounded-full bg-surface p-1.5 ring-1 ring-white/10">
            {[
              { v: false, l: "Sem site" },
              { v: true, l: "Com site da Aurea" },
            ].map((o) => (
              <button
                key={o.l}
                type="button"
                onClick={() => pick(o.v)}
                aria-pressed={withSite === o.v}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-[16px] font-semibold transition-colors",
                  withSite === o.v ? "text-tc-ink" : "text-foreground hover:text-tc",
                )}
              >
                {withSite === o.v && (
                  <motion.span layoutId="porque-pill" className="absolute inset-0 rounded-full bg-tc" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{o.l}</span>
              </button>
            ))}
          </Rise>
        </div>

        <Rise delay={0.08} className="relative">
          <GoogleMock withSite={withSite} />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-8 -right-2 w-[78px] sm:-right-6 sm:w-[96px]"
            animate={{ y: withSite ? [0, -12, 0] : 0, rotate: withSite ? 0 : -6 }}
            transition={{ duration: 0.6 }}
            key={String(withSite)}
          >
            <AuriIcon outfit="hardhat" mood={withSite ? "love" : "wow"} className="w-full" />
          </motion.div>
        </Rise>
      </div>

      <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((r, i) => (
          <Rise as="li" key={r.t} delay={i * 0.08} className="group rounded-3xl bg-surface p-6 ring-1 ring-white/5 transition-colors hover:bg-surface-2 hover:ring-tc/40">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tc/15 text-tc transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-6deg]">
              <r.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-[22px] font-bold leading-tight">{r.t}</h3>
            <p className="mt-2 text-[17px] leading-snug text-foreground">{r.d}</p>
          </Rise>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Por que com a Aurea                                                  */
/* ------------------------------------------------------------------ */

const COMPARE: [string, string][] = [
  ["Modelo igual ao de milhares de empresas", "Feito com a cara da sua marca"],
  ["Você escreve todos os textos sozinho", "Eu escrevo os textos junto com você"],
  ["Pesado e difícil de usar no celular", "Rápido e pensado primeiro para o celular"],
  ["Ninguém configura o Google para você", "Cadastro no Google incluído"],
  ["Suporte por e-mail ou chamado", "Você fala direto comigo no WhatsApp"],
];

export function WhyAurea() {
  return (
    <section className="pt-28 lg:pt-36" aria-labelledby="aurea-h">
      <div className="grid items-end gap-6 lg:grid-cols-2">
        <Rise>
          <h2 id="aurea-h" className={H2}>
            Por que fazer com a Aurea
          </h2>
        </Rise>
        <Rise as="p" delay={0.06} className="max-w-[46ch] text-[20px] leading-relaxed text-foreground lg:justify-self-end">
          Um site de modelo pronto até fica no ar. Mas ele não foi feito para vender o que a sua empresa vende.
        </Rise>
      </div>

      <div className="mt-12 overflow-hidden rounded-3xl ring-1 ring-white/10">
        <div className="grid grid-cols-2 text-[14px] font-semibold uppercase tracking-[0.12em] sm:text-[15px]">
          <span className="bg-surface px-4 py-4 text-muted-foreground sm:px-6">Site de modelo pronto</span>
          <span className="flex items-center gap-2 bg-tc/15 px-4 py-4 text-tc sm:px-6">
            <AuriIcon outfit="hardhat" mood="happy" className="w-7" /> Site da Aurea
          </span>
        </div>
        <ul>
          {COMPARE.map(([bad, good], i) => (
            <motion.li
              key={good}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: i * 0.08 }}
              className="grid grid-cols-2 border-t border-white/8"
            >
              <span className="flex items-start gap-3 bg-surface/70 px-4 py-4 text-[16px] text-muted-foreground sm:px-6 sm:py-5 sm:text-[17px]">
                <X className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8a8a]/80" aria-hidden="true" />
                {bad}
              </span>
              <span className="flex items-start gap-3 bg-tc/[0.07] px-4 py-4 text-[16px] font-semibold text-foreground sm:px-6 sm:py-5 sm:text-[18px]">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 400, damping: 18 }}
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tc text-tc-ink"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </motion.span>
                {good}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <Rise delay={0.1} className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={whatsappLink("Olá! Vi a página de sites da Aurea e quero um site para a minha empresa.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-tc px-6 py-3.5 text-[17px] font-semibold text-tc-ink transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Quero meu site
        </a>
        <span className="text-[16px] text-muted-foreground">Conversa sem compromisso, direto comigo.</span>
      </Rise>
    </section>
  );
}
