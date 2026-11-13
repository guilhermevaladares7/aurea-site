"use client";

import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  LayoutGrid,
  Package,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AuriIcon } from "@/components/mascot";
import { cn } from "@/lib/utils";

/*
  Telas ilustrativas de um painel administrativo (dados de exemplo).
  Feitas em HTML para parecerem um sistema de verdade e animarem ao aparecer.
*/

export type ScreenId = "dashboard" | "agenda" | "clientes" | "financeiro" | "estoque" | "permissoes";

export const SCREENS: { id: ScreenId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "dashboard", label: "Painel", icon: LayoutGrid },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "financeiro", label: "Financeiro", icon: Wallet },
  { id: "estoque", label: "Estoque", icon: Package },
  { id: "permissoes", label: "Permissões", icon: ShieldCheck },
];

const brl = (n: number, d = 0) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: d, maximumFractionDigits: d });
const ease = [0.22, 1, 0.36, 1] as const;
const item = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: 0.05 * i, ease },
});

/** Moldura do sistema: barra lateral + barra de cima. */
export function AdminShell({ active, children, compact = false }: { active: ScreenId; children: ReactNode; compact?: boolean }) {
  return (
    <div data-ui className="flex h-full overflow-hidden rounded-xl bg-[#0b1016] text-[12px] text-foreground">
      <aside className={cn("hidden shrink-0 flex-col gap-1 bg-[#0f161e] p-3 sm:flex", compact ? "w-[150px]" : "w-[176px]")}>
        <div className="mb-3 flex items-center gap-2 px-1">
          <AuriIcon outfit="tie" className="w-7" />
          <span className="font-bold leading-tight">
            Sua empresa
            <span className="block text-[10px] font-normal text-muted-foreground">Painel</span>
          </span>
        </div>
        {SCREENS.map((s) => (
          <span
            key={s.id}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-2",
              s.id === active ? "bg-sistemas text-[#1f0c00] font-semibold" : "text-foreground/75",
            )}
          >
            <s.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {s.label}
          </span>
        ))}
        <span className="mt-auto flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2 text-[11px]">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-sistemas/80 text-[10px] font-bold text-[#1f0c00]">M</span>
          Marina · Dona
        </span>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-[15px] font-bold">{SCREENS.find((s) => s.id === active)?.label}</span>
          <span className="ml-auto hidden items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-muted-foreground md:flex">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Buscar em tudo
          </span>
          <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-white/5">
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            <i className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-sistemas" />
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Painel ---------------- */

const DAYS = [32, 41, 38, 45, 52, 47, 39, 55, 61, 58, 49, 66, 72, 64, 59, 68, 74, 70, 63, 77, 82, 79, 71, 85, 90, 84, 78, 92, 96, 101];

export function DashboardScreen() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);
  const max = Math.max(...DAYS);
  const pts = DAYS.map((v, i) => `${(i / (DAYS.length - 1)) * 100},${40 - (v / max) * 36}`);
  const line = `M${pts.join(" L")}`;
  const area = `${line} L100,40 L0,40 Z`;
  const kpis = [
    { label: "Vendas do mês", value: 48320, fmt: "brl", delta: "+12%" },
    { label: "Pedidos", value: 312, fmt: "n", delta: "+8%" },
    { label: "Ticket médio", value: 154.87, fmt: "brl2", delta: "+4%" },
    { label: "Clientes novos", value: 46, fmt: "n", delta: "+19%" },
  ];
  const pay = [
    { k: "Pix", v: 41 },
    { k: "Crédito", v: 33 },
    { k: "Débito", v: 16 },
    { k: "Dinheiro", v: 10 },
  ];
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-3">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} {...item(i)} className="rounded-lg bg-white/[0.04] p-3">
            <span className="block text-[11px] text-muted-foreground">{k.label}</span>
            <span className="mt-1 block text-[17px] font-bold tabular-nums">
              <NumberFlow
                value={ready ? k.value : 0}
                locales="pt-BR"
                format={
                  k.fmt === "n"
                    ? undefined
                    : { style: "currency", currency: "BRL", maximumFractionDigits: k.fmt === "brl2" ? 2 : 0, minimumFractionDigits: k.fmt === "brl2" ? 2 : 0 }
                }
              />
            </span>
            <span className="text-[11px] text-ia">{k.delta} vs. mês passado</span>
          </motion.div>
        ))}
      </div>
      <div className="grid min-h-0 gap-3 lg:grid-cols-[1.6fr_1fr]">
        <motion.div {...item(4)} className="flex flex-col rounded-lg bg-white/[0.04] p-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Vendas por dia · novembro</span>
            <span className="text-muted-foreground">últimos 30 dias</span>
          </div>
          <svg viewBox="0 0 100 42" preserveAspectRatio="none" className="mt-2 h-full min-h-[90px] w-full">
            {[10, 20, 30].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,.06)" strokeWidth=".3" />
            ))}
            <motion.path d={area} fill="rgba(255,138,61,.14)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} />
            <motion.path
              d={line}
              fill="none"
              stroke="#ff8a3d"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
        <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3">
          <motion.div {...item(5)} className="rounded-lg bg-white/[0.04] p-3">
            <span className="font-semibold">Forma de pagamento</span>
            <ul className="mt-2 space-y-1.5">
              {pay.map((p, i) => (
                <li key={p.k} className="grid grid-cols-[56px_1fr_30px] items-center gap-2">
                  <span className="text-muted-foreground">{p.k}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.span
                      className="block h-full rounded-full bg-sistemas"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.v * 2}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease }}
                    />
                  </span>
                  <span className="text-right tabular-nums">{p.v}%</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...item(6)} className="hidden overflow-hidden rounded-lg bg-white/[0.04] p-3 lg:block">
            <span className="font-semibold">Últimos pedidos</span>
            <ul className="mt-2 space-y-1">
              {[
                ["#1312", "Sofá retrátil", 3290],
                ["#1311", "Mesa 6 lugares", 2150],
                ["#1310", "Guarda-roupa", 1890],
              ].map(([id, p, v]) => (
                <li key={id as string} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{id}</span>
                  <span className="truncate">{p}</span>
                  <span className="tabular-nums text-sistemas">{brl(v as number)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Agenda ---------------- */

const EVENTS = [
  { d: 0, h: 9, len: 2, t: "Entrega", w: "Sofá 3 lugares · Rua das Flores, 120", c: "bg-sistemas/85 text-[#1f0c00]" },
  { d: 0, h: 14, len: 1, t: "Visita", w: "Medir cozinha · Dona Célia", c: "bg-ia/80 text-[#021a0c]" },
  { d: 1, h: 10, len: 3, t: "Montagem", w: "Guarda-roupa 6 portas", c: "bg-primary/85 text-[#03161a]" },
  { d: 2, h: 8, len: 1, t: "Entrega", w: "Mesa + 6 cadeiras", c: "bg-sistemas/85 text-[#1f0c00]" },
  { d: 2, h: 15, len: 2, t: "Assistência", w: "Ajuste de porta", c: "bg-white/80 text-[#0b1016]" },
  { d: 3, h: 11, len: 2, t: "Montagem", w: "Painel de TV", c: "bg-primary/85 text-[#03161a]" },
  { d: 4, h: 9, len: 1, t: "Entrega", w: "Colchão casal", c: "bg-sistemas/85 text-[#1f0c00]" },
  { d: 4, h: 13, len: 3, t: "Montagem", w: "Cozinha planejada", c: "bg-primary/85 text-[#03161a]" },
  { d: 5, h: 8, len: 2, t: "Entrega", w: "Rack + estante (roça)", c: "bg-sistemas/85 text-[#1f0c00]" },
];

export function AgendaScreen() {
  const days = ["Seg 17", "Ter 18", "Qua 19", "Qui 20", "Sex 21", "Sáb 22"];
  const H0 = 8;
  const HN = 10;
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {[
          ["Entrega", "bg-sistemas"],
          ["Montagem", "bg-primary"],
          ["Visita", "bg-ia"],
          ["Assistência", "bg-white"],
        ].map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5 text-muted-foreground">
            <i className={cn("h-2 w-2 rounded-sm", c)} />
            {k}
          </span>
        ))}
        <span className="ml-auto rounded-md bg-sistemas px-2.5 py-1 font-semibold text-[#1f0c00]">+ Agendar</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[34px_repeat(6,1fr)] gap-x-1.5">
        <div />
        {days.map((d) => (
          <span key={d} className="pb-1 text-center font-semibold text-foreground/85">
            {d}
          </span>
        ))}
        <div className="relative">
          {Array.from({ length: HN }).map((_, i) => (
            <span key={i} className="absolute text-[10px] text-muted-foreground" style={{ top: `${(i / HN) * 100}%` }}>
              {H0 + i}h
            </span>
          ))}
        </div>
        {days.map((d, di) => (
          <div key={d} className="relative min-h-[180px] rounded-md bg-white/[0.03]">
            {EVENTS.filter((e) => e.d === di).map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + (di + i) * 0.06, ease }}
                className={cn("absolute inset-x-0.5 overflow-hidden rounded-md px-1.5 py-1 leading-tight", e.c)}
                style={{ top: `${((e.h - H0) / HN) * 100}%`, height: `${(e.len / HN) * 100 - 1}%` }}
              >
                <span className="block text-[10px] font-bold">{e.t}</span>
                <span className="block text-[10px] opacity-80">{e.w}</span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Clientes ---------------- */

const CLIENTS = [
  { n: "Maria Souza", t: "(33) 9••••-1203", last: "12/11", total: 6420, ok: true },
  { n: "Marcos Lima", t: "(33) 9••••-8871", last: "08/11", total: 2150, ok: false },
  { n: "Ana Paula Rocha", t: "(33) 9••••-4410", last: "05/11", total: 9890, ok: true },
  { n: "João Pedro Alves", t: "(33) 9••••-2290", last: "29/10", total: 1340, ok: true },
  { n: "Carla Dias", t: "(33) 9••••-7735", last: "21/10", total: 3780, ok: false },
  { n: "Mariana Teixeira", t: "(33) 9••••-0057", last: "18/10", total: 5210, ok: true },
];

export function ClientesScreen() {
  const query = "mar";
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTyped((n) => (n >= query.length + 6 ? 0 : n + 1)), 420);
    return () => clearInterval(t);
  }, []);
  const q = query.slice(0, Math.min(typed, query.length));
  const rows = CLIENTS.filter((c) => c.n.toLowerCase().includes(q));
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="flex flex-1 items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{q}</span>
          <i className="cursor-blink -ml-1.5 h-3.5 w-px bg-sistemas" />
          {!q && <span className="text-muted-foreground">Nome, telefone ou produto</span>}
        </span>
        <span className="rounded-lg bg-sistemas px-3 py-2 font-semibold text-[#1f0c00]">+ Novo cliente</span>
      </div>
      <div className="flex gap-1.5">
        {["Todos", "Em dia", "Atrasou"].map((f, i) => (
          <span key={f} className={cn("rounded-full px-2.5 py-1", i === 0 ? "bg-white/15" : "bg-white/5 text-muted-foreground")}>
            {f}
          </span>
        ))}
        <span className="ml-auto self-center text-muted-foreground">{rows.length} clientes</span>
      </div>
      <table className="w-full table-fixed text-left">
        <thead className="text-[11px] text-muted-foreground">
          <tr>
            <th className="w-[38%] pb-1 font-normal">Cliente</th>
            <th className="hidden pb-1 font-normal md:table-cell">Telefone</th>
            <th className="pb-1 font-normal">Última compra</th>
            <th className="pb-1 text-right font-normal">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <motion.tr key={c.n} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/5">
              <td className="py-2">
                <span className="flex items-center gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[10px] font-bold">{c.n[0]}</span>
                  <span className="truncate">{c.n}</span>
                  {!c.ok && <span className="shrink-0 rounded-full bg-destructive/20 px-1.5 text-[10px] text-destructive">atrasou</span>}
                </span>
              </td>
              <td className="hidden py-2 text-muted-foreground md:table-cell">{c.t}</td>
              <td className="py-2 text-muted-foreground">{c.last}</td>
              <td className="py-2 text-right tabular-nums">{brl(c.total)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Financeiro ---------------- */

const MONTHS = [
  { m: "jun", r: 31200, d: 22400 },
  { m: "jul", r: 35800, d: 24100 },
  { m: "ago", r: 33100, d: 23800 },
  { m: "set", r: 39900, d: 26200 },
  { m: "out", r: 43100, d: 27900 },
  { m: "nov", r: 48320, d: 29650 },
];

export function FinanceiroScreen() {
  const max = 50000;
  const last = MONTHS[MONTHS.length - 1];
  return (
    <div className="grid h-full gap-3 lg:grid-cols-[1.5fr_1fr]">
      <motion.div {...item(0)} className="flex flex-col rounded-lg bg-white/[0.04] p-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Entradas e saídas</span>
          <span className="flex gap-3 text-muted-foreground">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-sistemas" />Entradas</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-white/30" />Saídas</span>
          </span>
        </div>
        <div className="mt-3 flex min-h-[130px] flex-1 items-end gap-3">
          {MONTHS.map((x, i) => (
            <div key={x.m} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="flex h-full w-full items-end justify-center gap-1">
                <motion.span className="w-1/2 rounded-t bg-sistemas" initial={{ height: 0 }} animate={{ height: `${(x.r / max) * 100}%` }} transition={{ duration: 0.7, delay: 0.1 * i, ease }} />
                <motion.span className="w-1/2 rounded-t bg-white/25" initial={{ height: 0 }} animate={{ height: `${(x.d / max) * 100}%` }} transition={{ duration: 0.7, delay: 0.1 * i + 0.05, ease }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{x.m}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="flex flex-col gap-3">
        <motion.div {...item(1)} className="rounded-lg bg-sistemas/15 p-3">
          <span className="text-muted-foreground">Sobrou em novembro</span>
          <span className="mt-1 block text-[22px] font-bold tabular-nums text-sistemas">{brl(last.r - last.d)}</span>
          <span className="text-[11px] text-muted-foreground">
            {brl(last.r)} entraram · {brl(last.d)} saíram
          </span>
        </motion.div>
        <motion.div {...item(2)} className="flex-1 rounded-lg bg-white/[0.04] p-3">
          <span className="font-semibold">Contas a pagar</span>
          <ul className="mt-2 space-y-1.5">
            {[
              ["Fornecedor de MDF", "25/11", 8400, false],
              ["Aluguel do galpão", "28/11", 4200, false],
              ["Frete da fábrica", "20/11", 1350, true],
            ].map(([n, d, v, paid]) => (
              <li key={n as string} className="flex items-center gap-2">
                <span className={cn("grid h-4 w-4 place-items-center rounded", paid ? "bg-ia text-[#021a0c]" : "bg-white/10")}>
                  {paid ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
                </span>
                <span className={cn("flex-1 truncate", paid && "text-muted-foreground line-through")}>{n}</span>
                <span className="text-muted-foreground">{d}</span>
                <span className="tabular-nums">{brl(v as number)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Estoque ---------------- */

const STOCK = [
  { p: "Sofá retrátil 3 lugares", q: 4, min: 3 },
  { p: "Cadeira estofada", q: 22, min: 12 },
  { p: "Colchão casal", q: 2, min: 5 },
  { p: "Guarda-roupa 6 portas", q: 6, min: 3 },
  { p: "Mesa 6 lugares", q: 1, min: 2 },
  { p: "Rack para TV", q: 9, min: 4 },
];

export function EstoqueScreen() {
  const low = STOCK.filter((s) => s.q < s.min);
  return (
    <div className="flex h-full flex-col gap-2.5">
      <motion.div {...item(0)} className="flex items-center gap-2 rounded-lg bg-sistemas/15 px-3 py-2 text-sistemas">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        {low.length} produtos abaixo do mínimo: {low.map((l) => l.p.split(" ")[0]).join(", ")}
      </motion.div>
      <ul className="grid gap-2 md:grid-cols-2">
        {STOCK.map((s, i) => {
          const pct = Math.min(100, (s.q / (s.min * 3)) * 100);
          const isLow = s.q < s.min;
          return (
            <motion.li key={s.p} {...item(i + 1)} className="rounded-lg bg-white/[0.04] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">{s.p}</span>
                <span className={cn("tabular-nums", isLow ? "text-sistemas" : "text-muted-foreground")}>
                  {s.q} un. · mín. {s.min}
                </span>
              </div>
              <span className="mt-2 block h-2 overflow-hidden rounded-full bg-white/5">
                <motion.span
                  className={cn("block h-full rounded-full", isLow ? "bg-sistemas" : "bg-ia/80")}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease }}
                />
              </span>
              {isLow && <span className="mt-1.5 inline-block rounded bg-sistemas px-1.5 text-[10px] font-semibold text-[#1f0c00]">Repor</span>}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------- Permissões ---------------- */

const PEOPLE = [
  { n: "Marina", r: "Dona", p: [1, 1, 1, 1, 1] },
  { n: "Rafael", r: "Gerente", p: [1, 1, 1, 1, 0] },
  { n: "Júlia", r: "Atendente", p: [1, 1, 0, 0, 0] },
  { n: "Seu Zé", r: "Montador", p: [0, 1, 0, 0, 0] },
];
const PERMS = ["Vender", "Agenda", "Financeiro", "Relatórios", "Regras"];

export function PermissoesScreen() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Quem pode ver e mexer em cada parte</span>
        <span className="rounded-lg bg-sistemas px-3 py-1.5 font-semibold text-[#1f0c00]">+ Convidar</span>
      </div>
      <table className="w-full text-left">
        <thead className="text-[11px] text-muted-foreground">
          <tr>
            <th className="pb-2 font-normal">Pessoa</th>
            {PERMS.map((p) => (
              <th key={p} className="pb-2 text-center font-normal">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PEOPLE.map((u, ui) => (
            <tr key={u.n} className="border-t border-white/5">
              <td className="py-2.5">
                <span className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[11px] font-bold">{u.n[0]}</span>
                  <span className="leading-tight">
                    {u.n}
                    <span className="block text-[10px] text-muted-foreground">{u.r}</span>
                  </span>
                </span>
              </td>
              {u.p.map((on, pi) => (
                <td key={pi} className="py-2.5 text-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 + (ui * 5 + pi) * 0.03 }}
                    className={cn("mx-auto grid h-5 w-5 place-items-center rounded-md", on ? "bg-sistemas text-[#1f0c00]" : "bg-white/5")}
                  >
                    {on ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
                  </motion.span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-auto text-[11px] text-muted-foreground">O montador só vê a agenda dele. O financeiro fica só com a dona e o gerente.</p>
    </div>
  );
}

export function Screen({ id }: { id: ScreenId }) {
  switch (id) {
    case "dashboard":
      return <DashboardScreen />;
    case "agenda":
      return <AgendaScreen />;
    case "clientes":
      return <ClientesScreen />;
    case "financeiro":
      return <FinanceiroScreen />;
    case "estoque":
      return <EstoqueScreen />;
    default:
      return <PermissoesScreen />;
  }
}
