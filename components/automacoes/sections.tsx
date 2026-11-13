"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Mascot, type BitMood, type Outfit } from "@/components/mascot";
import { Rise } from "@/components/motion";
import { H2 } from "@/components/service-sections";
import { useTicker } from "@/components/demos/use-ticker";
import { cn } from "@/lib/utils";
import { Bubble, Phone, Typing, type WaMsg } from "./whatsapp";

/* ------------------------------------------------------------------ */
/* Conversas que se escrevem conforme a rolagem                         */
/* ------------------------------------------------------------------ */

type Chapter = {
  name: string;
  kind: string;
  title: string;
  text: string;
  outfit: Outfit;
  mood: BitMood;
  did: string[];
  msgs: WaMsg[];
};

const CHAPTERS: Chapter[] = [
  {
    name: "Doceria da Lu",
    kind: "Doceria",
    title: "Pedido completo, com sinal no Pix",
    text: "A cliente pergunta, vê o cardápio, escolhe e paga o sinal. A dona só vê o pedido pronto no painel.",
    outfit: "chef",
    mood: "happy",
    did: ["Mostrou o cardápio", "Calculou o preço", "Criou o pedido #2041", "Gerou o Pix do sinal", "Agendou o lembrete"],
    msgs: [
      { from: "cliente", text: "Oi! Vocês fazem bolo de aniversário?", time: "10:02" },
      { from: "ia", card: "menu", title: "Bolos de aniversário (kg)", items: [["Brigadeiro", "R$ 70"], ["Ninho com morango", "R$ 85"], ["Cenoura com chocolate", "R$ 60"]], time: "10:02" },
      { from: "cliente", text: "Quero o de brigadeiro, 2 kg, pra sábado", time: "10:03" },
      { from: "ia", text: "Brigadeiro 2 kg fica R$ 140. Sábado de manhã ou à tarde?", time: "10:03" },
      { from: "cliente", text: "De manhã", time: "10:04" },
      { from: "ia", text: "Fechado! Pedido #2041 · sábado às 9h. O sinal de 50% é por Pix:", time: "10:04" },
      { from: "ia", card: "pix", value: "R$ 70,00", time: "10:04" },
      { from: "cliente", text: "Paguei!", time: "10:06" },
      { from: "ia", text: "Recebido ✓ Na sexta eu te lembro do horário.", time: "10:06" },
    ],
  },
  {
    name: "Clínica Sorriso Leve",
    kind: "Clínica",
    title: "Consulta marcada sem fila",
    text: "A IA olha a agenda de verdade, oferece os horários livres, cadastra a paciente e manda a localização.",
    outfit: "tie",
    mood: "focus",
    did: ["Consultou a agenda", "Reservou o horário", "Cadastrou a paciente", "Enviou a localização", "Lembrete na véspera"],
    msgs: [
      { from: "cliente", text: "Boa tarde, queria marcar uma limpeza", time: "14:21" },
      { from: "ia", card: "slots", title: "Claro! Tenho estes horários livres:", slots: ["Qui · 14h", "Sex · 10h", "Sex · 16h"], time: "14:21" },
      { from: "cliente", text: "Sex · 10h", time: "14:22" },
      { from: "ia", text: "Marcado ✓ Sexta às 10h com a Dra. Paula. Qual o seu nome completo?", time: "14:22" },
      { from: "cliente", text: "Renata Alves", time: "14:23" },
      { from: "ia", text: "Obrigada, Renata! Fica aqui o endereço:", time: "14:23" },
      { from: "ia", card: "local", title: "Clínica Sorriso Leve", address: "Av. Brasil, 450 · Centro", time: "14:23" },
      { from: "ia", text: "Na quinta eu te mando um lembrete.", time: "14:23" },
    ],
  },
];

export function ScrollChat() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [pos, setPos] = useState({ ch: 0, count: 0 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const total = CHAPTERS.length;
    const x = Math.min(total - 0.0001, Math.max(0, p * total));
    const ch = Math.floor(x);
    const local = x - ch;
    const n = CHAPTERS[ch].msgs.length;
    const count = Math.min(n, Math.floor(local * (n + 2)));
    setPos((prev) => (prev.ch === ch && prev.count === count ? prev : { ch, count }));
  });

  const c = CHAPTERS[Math.min(pos.ch, CHAPTERS.length - 1)];
  const shown = c.msgs.slice(0, pos.count);
  const next = c.msgs[pos.count];
  const typing = next && next.from !== "cliente" && next.from !== "sistema" && pos.count > 0;
  const didCount = Math.round((pos.count / c.msgs.length) * c.did.length);

  return (
    <section ref={ref} className="relative mt-32 lg:mt-44" style={{ height: `${CHAPTERS.length * 120 + 40}vh` }} aria-labelledby="conversas-h">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center py-20">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_400px_1fr] lg:gap-10">
          {/* texto do capítulo */}
          <div className="order-2 lg:order-1">
            <h2 id="conversas-h" className="hidden text-[clamp(30px,3.4vw,52px)] font-extrabold leading-[0.95] tracking-[-0.035em] [font-stretch:112%] lg:block">
              Role e veja a IA atendendo
            </h2>
            <ol className="mt-4 flex gap-2 lg:mt-8 lg:flex-col">
              {CHAPTERS.map((x, i) => (
                <li
                  key={x.name}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] transition-colors",
                    i === pos.ch ? "bg-surface-2 text-foreground" : "text-foreground/45",
                  )}
                >
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", i === pos.ch ? "bg-tc" : "bg-white/20")} />
                  <span className={cn(i !== pos.ch && "hidden lg:inline")}>{x.kind}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* celular */}
          <div className="order-1 lg:order-2">
            <Phone name={c.name} status={typing ? "digitando…" : "online"} outfit={c.outfit} className="h-[min(50svh,600px)] w-[min(100%,380px)] lg:h-[min(68svh,640px)]">
              <AnimatePresence initial={false}>
                {shown.map((m, i) => (
                  <motion.div
                    key={`${pos.ch}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="flex flex-col"
                  >
                    <Bubble m={m} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && <Typing />}
              {pos.count === 0 && (
                <p className="self-center rounded-md bg-[#182229] px-3 py-1 text-[12px] text-[#8696a0]">Role a página para a conversa acontecer</p>
              )}
            </Phone>
          </div>

          {/* o que a IA fez */}
          <div className="order-3">
            <AnimatePresence mode="wait">
              <motion.div key={pos.ch} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                <div className="flex items-end gap-4">
                  <div className="w-[70px] shrink-0 lg:w-[96px]">
                    <Mascot size="100%" outfit={c.outfit} mood={c.mood} lines={[c.title]} />
                  </div>
                  <div>
                    <p className="pixel text-[15px] text-tc">{c.kind}</p>
                    <h3 className="text-[20px] font-bold leading-tight lg:text-[24px]">{c.title}</h3>
                  </div>
                </div>
                <p className="mt-3 hidden max-w-[40ch] text-[16px] text-foreground/80 lg:block">{c.text}</p>
                <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
                  {c.did.map((d, i) => (
                    <li
                      key={d}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1 text-[13px] transition-all duration-300 lg:text-[15px]",
                        i < didCount ? "bg-tc/15 text-foreground" : "bg-white/5 text-foreground/35",
                      )}
                    >
                      <span className={cn("grid h-4 w-4 place-items-center rounded-full", i < didCount ? "bg-tc text-tc-ink" : "bg-white/10")}>
                        {i < didCount && <Check className="h-3 w-3" aria-hidden="true" />}
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Teste você mesmo                                                     */
/* ------------------------------------------------------------------ */

type Node = { bot: WaMsg[]; options: { label: string; go: string }[]; log?: string[] };

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function tree(t: string, cake = "", day = ""): Record<string, Node> {
  return {
    start: {
      bot: [{ from: "ia", text: "Oi! Eu sou a atendente virtual da Doceria da Lu. Como posso ajudar?", time: t }],
      options: [
        { label: "Ver cardápio", go: "menu" },
        { label: "Fazer um pedido", go: "order" },
        { label: "Horário e endereço", go: "info" },
        { label: "Falar com uma pessoa", go: "human" },
      ],
    },
    menu: {
      bot: [{ from: "ia", card: "menu", title: "Bolos (kg)", items: [["Brigadeiro", "R$ 70"], ["Ninho com morango", "R$ 85"], ["Cenoura", "R$ 60"]], time: t }],
      options: [
        { label: "Fazer um pedido", go: "order" },
        { label: "Recomeçar", go: "start" },
      ],
      log: ["Cardápio enviado"],
    },
    order: {
      bot: [{ from: "ia", text: "Oba! Qual bolo você quer?", time: t }],
      options: [
        { label: "Brigadeiro", go: "cake:Brigadeiro" },
        { label: "Ninho com morango", go: "cake:Ninho com morango" },
        { label: "Cenoura", go: "cake:Cenoura" },
      ],
    },
    cake: {
      bot: [{ from: "ia", text: `${cake}, ótima escolha! Pra quando?`, time: t }],
      options: [
        { label: "Amanhã", go: "day:amanhã" },
        { label: "Sábado", go: "day:sábado" },
        { label: "Domingo", go: "day:domingo" },
      ],
      log: [`Sabor escolhido: ${cake}`],
    },
    day: {
      bot: [
        { from: "ia", text: `Fechado! Bolo de ${cake.toLowerCase()} para ${day}. O sinal é por Pix:`, time: t },
        { from: "ia", card: "pix", value: "R$ 35,00", time: t },
      ],
      options: [{ label: "Recomeçar", go: "start" }],
      log: ["Agenda consultada", "Pedido criado no painel", "Pix do sinal gerado"],
    },
    info: {
      bot: [
        { from: "ia", text: "Abrimos de terça a sábado, das 8h às 18h.", time: t },
        { from: "ia", card: "local", title: "Doceria da Lu", address: "Rua das Acácias, 88", time: t },
      ],
      options: [
        { label: "Fazer um pedido", go: "order" },
        { label: "Recomeçar", go: "start" },
      ],
      log: ["Horário e endereço enviados"],
    },
    human: {
      bot: [
        { from: "ia", text: "Claro! Já chamei a Lu com o resumo da conversa.", time: t },
        { from: "sistema", text: "Lu entrou na conversa" },
        { from: "humano", text: "Oi! Sou eu, a Lu. Em que posso ajudar?", time: t },
      ],
      options: [{ label: "Recomeçar", go: "start" }],
      log: ["Equipe avisada", "IA pausada nesta conversa"],
    },
  };
}

export function TryChat() {
  const [msgs, setMsgs] = useState<WaMsg[]>([]);
  const [options, setOptions] = useState<Node["options"]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const ctx = useRef({ cake: "" });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = (go: string, userLabel?: string) => {
    timers.current.forEach(clearTimeout);
    const t = now();
    let key = go;
    let day = "";
    if (go.startsWith("cake:")) {
      ctx.current.cake = go.slice(5);
      key = "cake";
    } else if (go.startsWith("day:")) {
      day = go.slice(4);
      key = "day";
    }
    const node = tree(t, ctx.current.cake, day)[key];
    if (key === "start") {
      setMsgs([]);
      setLog([]);
    }
    if (userLabel) setMsgs((m) => [...m, { from: "cliente", text: userLabel, time: t }]);
    setOptions([]);
    setTyping(true);
    node.bot.forEach((b, i) => {
      timers.current.push(
        setTimeout(() => {
          setMsgs((m) => [...m, b]);
          if (i === node.bot.length - 1) {
            setTyping(false);
            setOptions(node.options);
            if (node.log) setLog((l) => [...l, ...node.log!]);
          }
        }, 800 + i * 700),
      );
    });
  };

  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });
  useEffect(() => {
    const first = setTimeout(() => runRef.current("start"), 300);
    const list = timers.current;
    return () => {
      clearTimeout(first);
      list.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="pt-32 lg:pt-44" aria-labelledby="teste-h">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px_1fr] lg:gap-10">
        <div>
          <Rise>
            <h2 id="teste-h" className={H2}>
              Teste você mesmo
            </h2>
          </Rise>
          <Rise as="p" delay={0.06} className="mt-6 max-w-[42ch] text-[18px] text-foreground">
            Faça de conta que você é cliente da Doceria da Lu. Toque nas opções embaixo da conversa e veja a atendente
            responder e o que ela faz por trás.
          </Rise>
        </div>

        <Phone
          name="Doceria da Lu"
          status={typing ? "digitando…" : "online"}
          outfit="chef"
          className="h-[600px] w-[min(100%,380px)]"
          footer={
            <div className="flex min-h-[64px] flex-wrap items-center justify-center gap-2 bg-[#202c33] px-3 py-3">
              {options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => run(o.go, o.go === "start" ? undefined : o.label)}
                  className="rounded-full bg-[#2a3942] px-3.5 py-2 text-[13px] font-semibold text-[#53bdeb] transition-colors hover:bg-[#33444f]"
                >
                  {o.go === "start" && <RotateCcw className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />}
                  {o.label}
                </button>
              ))}
              {options.length === 0 && <span className="text-[13px] text-white/40">…</span>}
            </div>
          }
        >
          <div className="flex flex-col gap-1.5" aria-live="polite">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
                <Bubble m={m} />
              </motion.div>
            ))}
            {typing && <Typing />}
          </div>
        </Phone>

        <div>
          <div className="flex items-end gap-4">
            <div className="w-[84px] shrink-0">
              <Mascot size="100%" outfit="chef" mood={log.length ? "happy" : "idle"} lines={["Pode testar à vontade!", "Eu sou a atendente da doceria hoje."]} />
            </div>
            <p className="pixel text-[17px] leading-tight text-tc">O que a IA fez por trás</p>
          </div>
          <ul className="mt-5 space-y-2" aria-live="polite">
            <AnimatePresence initial={false}>
              {log.map((l, i) => (
                <motion.li
                  key={`${l}-${i}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2.5 rounded-xl bg-surface px-4 py-2.5 text-[15px]"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-tc text-tc-ink">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {l}
                </motion.li>
              ))}
            </AnimatePresence>
            {log.length === 0 && <li className="text-[15px] text-muted-foreground">Ainda nada. Escolha uma opção no celular.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* O Auri fantasiado de 4 agentes                                       */
/* ------------------------------------------------------------------ */

const AGENTS: { name: string; role: string; text: string; outfit: Outfit; mood: BitMood; line: string; ui: "chat" | "orders" | "agenda" | "report" }[] = [
  {
    name: "Atendente",
    role: "Responde na hora",
    text: "Lê a mensagem, entende texto e áudio e responde com as informações da empresa.",
    outfit: "headset",
    mood: "happy",
    line: "Alô! Em que posso ajudar?",
    ui: "chat",
  },
  {
    name: "Pedidos",
    role: "Anota e lança",
    text: "Monta o pedido, confere preço e estoque, gera o Pix e joga tudo no painel.",
    outfit: "chef",
    mood: "work",
    line: "Saindo um pedido!",
    ui: "orders",
  },
  {
    name: "Agenda",
    role: "Marca e lembra",
    text: "Consulta os horários livres, marca, remarca e manda lembrete na véspera.",
    outfit: "cap",
    mood: "focus",
    line: "Sexta às 10h tá livre.",
    ui: "agenda",
  },
  {
    name: "Supervisor",
    role: "Chama a equipe",
    text: "Percebe quando precisa de uma pessoa, passa o resumo e faz o relatório do mês.",
    outfit: "tie",
    mood: "think",
    line: "Esse aqui é com a equipe.",
    ui: "report",
  },
];

/** Tela de cada agente. Quando o agente está trabalhando, a cena roda; senão fica parada no fim. */
function AgentUi({ kind, play }: { kind: (typeof AGENTS)[number]["ui"]; play: boolean }) {
  const hidden = play ? { opacity: 0, x: -10 } : false;
  if (kind === "chat")
    return (
      <div className="flex flex-col gap-1 text-[12px]">
        <motion.span initial={hidden} animate={{ opacity: 1, x: 0 }} className="self-end rounded-md bg-[#005c4b] px-2 py-1">
          Vocês abrem domingo?
        </motion.span>
        <motion.span initial={play ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="self-start rounded-md bg-[#202c33] px-2 py-1">
          Domingo das 8h às 12h!
        </motion.span>
      </div>
    );
  if (kind === "orders")
    return (
      <ul className="space-y-1 text-[12px]">
        {["#2041 · Bolo brigadeiro", "#2042 · 30 brigadeiros", "#2043 · Torta de limão"].map((o, i) => (
          <motion.li key={o} initial={hidden} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.35 }} className="flex justify-between rounded bg-white/5 px-2 py-1">
            {o}
            <span className="text-tc">novo</span>
          </motion.li>
        ))}
      </ul>
    );
  if (kind === "agenda")
    return (
      <div className="grid grid-cols-5 gap-1 text-center text-[11px]">
        {["seg", "ter", "qua", "qui", "sex"].map((d, i) => (
          <span key={d} className="flex flex-col gap-1">
            <span className="text-muted-foreground">{d}</span>
            {[0, 1, 2].map((r) => (
              <motion.span
                key={r}
                initial={play ? { opacity: 0.15 } : false}
                animate={{ opacity: (i + r) % 3 === 0 ? 1 : 0.15 }}
                transition={{ delay: 0.12 * (i + r) }}
                className="h-3 rounded-sm bg-tc"
              />
            ))}
          </span>
        ))}
      </div>
    );
  return (
    <div className="flex h-[52px] items-end gap-1.5">
      {[40, 65, 50, 80, 72, 95].map((h, i) => (
        <motion.span key={i} initial={play ? { height: 0 } : false} animate={{ height: `${h}%` }} transition={{ delay: 0.12 * i, duration: 0.6 }} className="flex-1 rounded-t bg-tc/80" />
      ))}
    </div>
  );
}

const AGENT_MS = [2800, 2800, 2800, 2800];

export function Agents() {
  // um agente trabalha de cada vez e passa a vez para o próximo, como numa esteira
  const { ref, step: active, round } = useTicker(AGENT_MS);
  return (
    <section className="pt-32 lg:pt-44" aria-labelledby="agentes-h">
      <div className="grid items-end gap-4 lg:grid-cols-2">
        <Rise>
          <h2 id="agentes-h" className={H2}>
            Quatro agentes, um time só
          </h2>
        </Rise>
        <Rise as="p" delay={0.06} className="max-w-[48ch] text-[18px] text-foreground lg:justify-self-end">
          Cada conversa passa pelos quatro, um depois do outro: o atendente responde, o de pedidos anota, o da agenda
          marca e o supervisor confere.
        </Rise>
      </div>

      <div ref={ref} className="relative mt-16">
        {/* esteira que liga os agentes, com a tarefa passando de um para o outro */}
        <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[86px] hidden h-[3px] rounded-full bg-white/8 lg:block">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full bg-tc/50"
            initial={false}
            animate={{ width: `${(active / 3) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-tc shadow-[0_0_18px_var(--tc)]"
            initial={false}
            animate={{ left: `${(active / 3) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a, i) => {
            const on = active === i;
            return (
              <Rise
                as="li"
                key={a.name}
                delay={i * 0.1}
                className={cn(
                  "flex flex-col rounded-3xl p-6 ring-1 transition-[background-color,box-shadow] duration-500",
                  on ? "bg-surface-2 ring-tc/60 shadow-[0_0_40px_-12px_var(--tc)]" : "bg-surface ring-transparent",
                )}
              >
                <motion.div
                  className="mx-auto w-[124px]"
                  animate={on ? { y: -8, scale: 1.06 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <Mascot
                    size="100%"
                    outfit={a.outfit}
                    mood={on ? a.mood : "idle"}
                    say={on ? a.line : null}
                    lines={[a.line]}
                    label={`Auri como agente de ${a.name}. Clique para ele falar.`}
                  />
                </motion.div>
                <p className="pixel mt-4 flex items-center justify-center gap-2 text-[15px] text-tc">
                  Agente {i + 1}
                  {on && <motion.span className="h-2 w-2 rounded-full bg-tc" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />}
                </p>
                <h3 className="mt-1 text-center text-[24px] font-bold leading-tight">{a.name}</h3>
                <p className="text-center text-[15px] text-muted-foreground">{a.role}</p>
                <p className="mt-3 text-[16px] text-foreground">{a.text}</p>
                <div data-ui className={cn("mt-5 rounded-xl bg-[#0b141a] p-3 transition-opacity duration-500", on ? "opacity-100" : "opacity-60")}>
                  <AgentUi key={on ? `play-${round}` : "idle"} kind={a.ui} play={on} />
                </div>
              </Rise>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
