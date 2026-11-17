"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Bubble, Typing, WA_PATTERN, type WaMsg } from "@/components/automacoes/whatsapp";
import { AuriIcon, type Outfit } from "@/components/mascot";
import { cn } from "@/lib/utils";

/*
  Demonstração do topo da página de automações: o WhatsApp de uma empresa (fictícia)
  sendo atendido pela IA e, ao lado, o painel mostrando o que ela fez em cada conversa:
  pedido criado, Pix gerado, horário reservado, equipe avisada.
*/

type Item = { m: WaMsg; log?: string };
type Scene = { shop: string; label: string; outfit: Outfit; items: Item[] };

const SCENES: Scene[] = [
  {
    shop: "Doceria da Lu",
    label: "Pedido com Pix",
    outfit: "chef",
    items: [
      { m: { from: "cliente", text: "Oi! Tem bolo de cenoura hoje?", time: "09:14" } },
      {
        m: { from: "ia", card: "menu", title: "Bolos de hoje", items: [["Cenoura com chocolate", "R$ 38"], ["Brigadeiro", "R$ 42"], ["Limão", "R$ 36"]], time: "09:14" },
        log: "Mostrou o cardápio do dia",
      },
      { m: { from: "cliente", text: "Quero o de cenoura, busco às 17h", time: "09:15" } },
      { m: { from: "ia", text: "Separado ✓ Pedido #2041, retirada às 17h. O pagamento é por Pix:", time: "09:15" }, log: "Criou o pedido #2041" },
      { m: { from: "ia", card: "pix", value: "R$ 38,00", time: "09:15" }, log: "Gerou o Pix" },
      { m: { from: "cliente", text: "Paguei!", time: "09:16" } },
      { m: { from: "ia", text: "Recebido ✓ Até as 17h!", time: "09:16" }, log: "Confirmou o pagamento" },
    ],
  },
  {
    shop: "Clínica Sorriso Leve",
    label: "Consulta marcada",
    outfit: "tie",
    items: [
      { m: { from: "cliente", audio: "0:09", time: "14:21" } },
      {
        m: { from: "ia", card: "slots", title: "Ouvi: limpeza com a Dra. Paula. Tenho estes horários:", slots: ["Qui · 14h", "Sex · 10h", "Sex · 16h"], time: "14:21" },
        log: "Entendeu o áudio e olhou a agenda",
      },
      { m: { from: "cliente", text: "Sex · 10h", time: "14:22" } },
      { m: { from: "ia", text: "Marcado ✓ Sexta às 10h. Fica aqui o endereço:", time: "14:22" }, log: "Reservou sexta às 10h" },
      { m: { from: "ia", card: "local", title: "Clínica Sorriso Leve", address: "Av. Brasil, 450 · Centro", time: "14:22" }, log: "Mandou a localização" },
      { m: { from: "ia", text: "Na quinta eu te mando um lembrete.", time: "14:22" }, log: "Agendou o lembrete" },
    ],
  },
  {
    shop: "Loja Casa Bela",
    label: "Chamou a equipe",
    outfit: "headset",
    items: [
      { m: { from: "cliente", text: "Meu sofá chegou com um rasgo no braço", time: "16:20" } },
      { m: { from: "ia", text: "Poxa, sinto muito! Pode me mandar uma foto e o número do pedido?", time: "16:20" } },
      { m: { from: "cliente", text: "Pedido 7732, a foto tá aqui", time: "16:21" }, log: "Achou o pedido #7732" },
      { m: { from: "ia", text: "Obrigada! Já chamei a Ana, da assistência, com o resumo e a foto.", time: "16:21" }, log: "Resumiu e chamou a Ana" },
      { m: { from: "sistema", text: "Ana entrou na conversa" } },
      { m: { from: "humano", text: "Oi! Sou a Ana. Vi tudo aqui, amanhã a troca já sai.", time: "16:23" }, log: "Ana assumiu o atendimento" },
    ],
  },
];

const BEFORE_MS = 1000; // pausa antes de cada mensagem do cliente
const TYPING_MS = 900; // "digitando…" antes de cada resposta
const HOLD_MS = 3200; // conversa parada no fim, antes da próxima

type State = { scene: number; shown: number; typing: boolean };

export function AiDeskDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [st, setSt] = useState<State>({ scene: 0, shown: 0, typing: false });
  const [served, setServed] = useState(46);

  const sc = SCENES[st.scene];
  const next = sc.items[st.shown]?.m;

  useEffect(() => {
    if (!inView) return;
    let ms: number;
    let go: () => void;
    if (!next) {
      ms = HOLD_MS;
      go = () => {
        setServed((n) => n + 1);
        setSt((p) => ({ scene: (p.scene + 1) % SCENES.length, shown: 0, typing: false }));
      };
    } else if (next.from === "cliente") {
      ms = BEFORE_MS;
      go = () => setSt((p) => ({ ...p, shown: p.shown + 1 }));
    } else if (next.from === "sistema") {
      ms = 900;
      go = () => setSt((p) => ({ ...p, shown: p.shown + 1 }));
    } else if (!st.typing) {
      ms = 350;
      go = () => setSt((p) => ({ ...p, typing: true }));
    } else {
      ms = TYPING_MS;
      go = () => setSt((p) => ({ ...p, shown: p.shown + 1, typing: false }));
    }
    const t = setTimeout(go, ms);
    return () => clearTimeout(t);
  }, [inView, st, next]);

  const logs = sc.items.slice(0, st.shown).flatMap((it) => (it.log ? [{ t: it.log, time: "time" in it.m ? it.m.time : "" }] : []));
  const last = logs[logs.length - 1];

  return (
    <div ref={ref} data-ui className="@container flex h-full overflow-hidden rounded-xl bg-[#0b141a]">
      {/* conversa no WhatsApp */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2.5 bg-[#1f2c33] px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2a3942]">
            <AuriIcon outfit={sc.outfit} className="w-6" />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[14px] font-semibold text-[#e9edef]">{sc.shop}</span>
            <span className="block text-[12px] text-[#25d366]">{st.typing ? "digitando…" : "online · atendido pela IA"}</span>
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={sc.label}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="shrink-0 rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] text-white/70"
            >
              {sc.label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* no celular o painel não cabe ao lado: a última ação aparece numa faixa */}
        <div className="flex h-7 items-center gap-2 bg-[#11201b] px-3 text-[12px] text-[#7ee2a8] @[560px]:hidden">
          <AnimatePresence mode="wait">
            {last && (
              <motion.span key={last.t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-1.5 truncate">
                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {last.t}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden p-3" style={{ backgroundImage: WA_PATTERN }} aria-live="polite" key={st.scene}>
          {sc.items.slice(0, st.shown).map((it, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="flex flex-col"
            >
              <Bubble m={it.m} />
            </motion.div>
          ))}
          {st.typing && <Typing />}
        </div>

        <div className="flex items-center gap-2 bg-[#1f2c33] px-3 py-2">
          <span className="flex-1 rounded-full bg-[#2a3942] px-3 py-1.5 text-[12px] text-white/50">Mensagem</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#00a884] text-[#0b141a]">
            <Mic className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* painel da loja: o que a IA fez */}
      <aside className="hidden w-[38%] shrink-0 flex-col border-l border-white/8 bg-[#0e1714] p-3 text-[12px] text-foreground @[560px]:flex">
        <div className="flex items-center gap-2">
          <AuriIcon outfit="headset" className="w-6" />
          <span className="leading-tight">
            <span className="block font-semibold">Painel da IA</span>
            <span className="block text-[11px] text-foreground/55">ao vivo</span>
          </span>
          <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-[#25d366]" aria-hidden="true" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="rounded-lg bg-white/[0.05] p-2">
            <span className="block text-[10px] text-foreground/55">Atendidos hoje</span>
            <span className="block text-[18px] font-bold tabular-nums">{served}</span>
          </span>
          <span className="rounded-lg bg-white/[0.05] p-2">
            <span className="block text-[10px] text-foreground/55">Tempo de resposta</span>
            <span className="block text-[18px] font-bold tabular-nums">4 s</span>
          </span>
        </div>

        <p className="mt-4 text-[11px] text-foreground/55">Nesta conversa</p>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {logs.map((l) => (
              <motion.li
                key={`${st.scene}-${l.t}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 rounded-lg bg-[#25d366]/10 px-2 py-1.5"
              >
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#25d366] text-[#04220f]">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 leading-snug">{l.t}</span>
                <span className="shrink-0 text-[10px] text-foreground/45 tabular-nums">{l.time}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {logs.length === 0 && <li className="rounded-lg bg-white/[0.04] px-2 py-1.5 text-foreground/45">Esperando o cliente…</li>}
        </ul>

        <p className={cn("mt-auto pt-3 text-[11px] leading-snug text-foreground/55")}>
          Tudo fica registrado. Você entra na conversa quando quiser.
        </p>
      </aside>
    </div>
  );
}
