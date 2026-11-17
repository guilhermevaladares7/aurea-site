"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CakeSlice,
  Clock,
  Coffee,
  Croissant,
  Lock,
  MapPin,
  MessageCircle,
  Scissors,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useTicker } from "./use-ticker";

/*
  Demonstração do topo da página de sites: um site completo de um cliente (fictício)
  se montando peça por peça, sendo publicado e recebendo o primeiro contato.
  Cada exemplo tem a sua cor e o seu jeito, para mostrar que o site é feito com a cara da marca.
*/

type Sample = {
  domain: string;
  name: string;
  short: string;
  line: string;
  text: string;
  cta: string;
  brand: string;
  ink: string;
  bg: string;
  photo: string;
  alt: string;
  rating: string;
  reviews: string;
  hours: string;
  address: string;
  items: { icon: LucideIcon; t: string; d: string }[];
  first: string;
};

const SAMPLES: Sample[] = [
  {
    domain: "padariasolnascente.com.br",
    name: "Padaria Sol Nascente",
    short: "Sol Nascente",
    line: "Pão quentinho a partir das 6h",
    text: "Fornada nova de hora em hora e encomenda para festa.",
    cta: "Encomendar no WhatsApp",
    brand: "#f5a524",
    ink: "#2a1800",
    bg: "#16110a",
    photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&q=70&auto=format&fit=crop",
    alt: "Pães artesanais sobre uma bancada de madeira",
    rating: "4,9",
    reviews: "312 avaliações",
    hours: "Aberto agora · até 20h",
    address: "Rua das Flores, 120 · Centro",
    items: [
      { icon: Croissant, t: "Pães da casa", d: "Saindo do forno" },
      { icon: CakeSlice, t: "Bolos e tortas", d: "Sob encomenda" },
      { icon: Coffee, t: "Café da manhã", d: "Mesa no salão" },
    ],
    first: "Oi! Vi o site, quero encomendar um bolo pra sábado.",
  },
  {
    domain: "barbeariadozeca.com.br",
    name: "Barbearia do Zeca",
    short: "Zeca",
    line: "Corte e barba com hora marcada",
    text: "Sem fila: escolha o horário e o barbeiro pelo site.",
    cta: "Agendar horário",
    brand: "#e8e2d4",
    ink: "#141210",
    bg: "#111214",
    photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=640&q=70&auto=format&fit=crop",
    alt: "Cadeira e ferramentas de barbearia",
    rating: "5,0",
    reviews: "184 avaliações",
    hours: "Aberto agora · até 21h",
    address: "Av. Brasil, 88 · Jardim América",
    items: [
      { icon: Scissors, t: "Corte", d: "Na tesoura ou máquina" },
      { icon: Sparkles, t: "Barba", d: "Com toalha quente" },
      { icon: Star, t: "Dia do noivo", d: "Pacote completo" },
    ],
    first: "Fala, Zeca! Tem horário amanhã às 18h?",
  },
  {
    domain: "cafedapraca.com.br",
    name: "Café da Praça",
    short: "Café da Praça",
    line: "Café especial e bolo do dia",
    text: "Grãos da região, torra da casa e mesa na calçada.",
    cta: "Ver cardápio",
    brand: "#7fd1b9",
    ink: "#03231a",
    bg: "#0c1513",
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&q=70&auto=format&fit=crop",
    alt: "Xícara de café sobre a mesa",
    rating: "4,8",
    reviews: "526 avaliações",
    hours: "Aberto agora · até 19h",
    address: "Praça da Matriz, 15 · Centro",
    items: [
      { icon: Coffee, t: "Cafés especiais", d: "Coado, espresso, gelado" },
      { icon: CakeSlice, t: "Bolo do dia", d: "Feito aqui" },
      { icon: Croissant, t: "Salgados", d: "Pão de queijo e mais" },
    ],
    first: "Boa tarde! Vocês aceitam reserva para 8 pessoas?",
  },
];

// 0 vazio · 1 topo · 2 título · 3 foto · 4 botões e nota · 5 serviços · 6 endereço e WhatsApp
// 7 cursor vai até Publicar · 8 clique · 9 no ar · 10 chega a primeira mensagem
const DURATIONS = [600, 500, 600, 600, 650, 700, 700, 900, 400, 1300, 3400];

export function SiteBuildDemo() {
  const { ref, step, round } = useTicker(DURATIONS);
  const s = SAMPLES[round % SAMPLES.length];
  const pop = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 380, damping: 26 },
  };
  const live = step >= 9;

  return (
    <div ref={ref} data-ui className="@container flex h-full flex-col overflow-hidden rounded-xl bg-[#0e0f11] text-[11px] @[480px]:text-[12px] @[600px]:text-[13px]">
      {/* barra do navegador */}
      <div className="flex items-center gap-2 bg-surface-2 px-3 py-2">
        <span className="flex gap-1" aria-hidden="true">
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-background/70 px-2 py-1 text-[10px] text-muted-foreground">
          <Lock className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
          {s.domain}
        </span>
        <motion.span
          animate={step === 8 ? { scale: [1, 0.88, 1] } : { scale: 1 }}
          className={
            "rounded-md px-2 py-1 text-[10px] font-semibold transition-colors " +
            (step >= 8 ? "bg-sites text-primary-foreground" : "bg-white/10 text-foreground")
          }
        >
          {live ? "No ar ✓" : "Publicar"}
        </motion.span>
      </div>

      {/* o site sendo montado, com a cor do cliente */}
      <div className="relative flex-1 overflow-hidden transition-colors duration-500" style={{ background: step >= 1 ? s.bg : "#0e0f11" }} key={round}>
        <div className="flex h-full flex-col p-3 @[480px]:p-4">
          {step >= 1 && (
            <motion.div {...pop} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <span className="h-3 w-3 rounded-full" style={{ background: s.brand }} />
                {s.short}
              </span>
              <span className="hidden gap-3 text-foreground/60 @[360px]:flex">
                <span>Início</span>
                <span>Serviços</span>
                <span>Sobre</span>
                <span>Contato</span>
              </span>
            </motion.div>
          )}

          <div className="mt-3 grid grid-cols-[1.15fr_1fr] gap-3 @[480px]:mt-4 @[480px]:gap-4">
            <div className="min-w-0">
              {step >= 2 && (
                <motion.div {...pop}>
                  <p className="text-[16px] font-extrabold leading-[1.05] tracking-tight text-foreground [font-stretch:115%] @[480px]:text-[22px] @[600px]:text-[27px]">
                    {s.line}
                  </p>
                  <p className="mt-1.5 hidden text-foreground/60 @[360px]:block">{s.text}</p>
                </motion.div>
              )}
              {step >= 4 && (
                <motion.div {...pop} className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md px-2.5 py-1.5 font-semibold" style={{ background: s.brand, color: s.ink }}>
                    {s.cta}
                  </span>
                  <span className="hidden rounded-md px-2.5 py-1.5 text-foreground/80 ring-1 ring-white/15 @[420px]:inline-block">
                    Como chegar
                  </span>
                </motion.div>
              )}
              {step >= 4 && (
                <motion.p {...pop} className="mt-2 flex items-center gap-1 text-foreground/70">
                  <Star className="h-3 w-3 fill-[#ffc94d] text-[#ffc94d]" aria-hidden="true" />
                  <b className="text-foreground">{s.rating}</b> no Google
                  <span className="hidden @[420px]:inline">· {s.reviews}</span>
                </motion.p>
              )}
            </div>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <Image src={s.photo} alt={s.alt} fill sizes="260px" className="object-cover" />
                <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                  <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                  {s.hours}
                </span>
              </motion.div>
            )}
          </div>

          {/* o que a empresa oferece */}
          {step >= 5 && (
            <motion.ul {...pop} className="mt-3 hidden grid-cols-3 gap-2 @[360px]:grid @[480px]:mt-4">
              {s.items.map((it, i) => (
                <motion.li
                  key={it.t}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-lg bg-white/[0.05] p-2 ring-1 ring-white/8"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-md" style={{ background: `${s.brand}26`, color: s.brand }}>
                    <it.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 block font-semibold leading-tight text-foreground">{it.t}</span>
                  <span className="block text-[10px] text-foreground/55 @[600px]:text-[11px]">{it.d}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {/* rodapé do site: endereço */}
          {step >= 6 && (
            <motion.div {...pop} className="mt-auto flex items-center gap-1.5 border-t border-white/10 pt-2 text-foreground/60">
              <MapPin className="h-3 w-3 shrink-0" style={{ color: s.brand }} aria-hidden="true" />
              <span className="truncate">{s.address}</span>
            </motion.div>
          )}
        </div>

        {/* botão flutuante de WhatsApp */}
        {step >= 6 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            className="absolute bottom-8 right-3 grid h-8 w-8 place-items-center rounded-full bg-[#25d366] text-[#04220f] shadow-lg @[480px]:bottom-10 @[480px]:h-9 @[480px]:w-9"
            aria-hidden="true"
          >
            <MessageCircle className="h-4 w-4" />
          </motion.span>
        )}

        {/* cursor do mouse */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="absolute h-4 w-4 drop-shadow"
          initial={{ left: "40%", top: "70%", opacity: 0 }}
          animate={
            step >= 7 && step < 9
              ? { left: "90%", top: "-4%", opacity: 1 }
              : { left: "40%", top: "70%", opacity: step >= 6 && step < 9 ? 1 : 0 }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <path d="M2 1 L2 13 L5.5 10 L8 15 L10 14 L7.5 9 L12 9 Z" fill="#f1eee8" stroke="#0a0a0b" strokeWidth="1" />
        </motion.svg>

        {/* publicado e, logo depois, o primeiro cliente chamando */}
        <AnimatePresence>
          {live && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-3 right-3 top-3 flex flex-col gap-1.5"
            >
              <span className="flex items-center justify-between rounded-lg bg-sites px-3 py-2 font-semibold text-primary-foreground shadow-lg">
                <span>Site publicado ✓</span>
                <span className="tabular-nums">carregou em 0,8 s</span>
              </span>
              {step >= 10 && (
                <motion.span
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  className="flex items-start gap-2 rounded-lg bg-[#202c33] px-3 py-2 text-[#e9edef] shadow-lg"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#25d366] text-[#04220f]">
                    <MessageCircle className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] text-white/55">WhatsApp · veio pelo site</span>
                    <span className="block leading-snug">{s.first}</span>
                  </span>
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
