"use client";

import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTicker } from "./use-ticker";

// Pedidos fictícios que vão "entrando" no painel, um por passo.
const ORDERS = [
  { id: 1041, who: "Ana P.", value: 89.9 },
  { id: 1042, who: "Carlos M.", value: 142 },
  { id: 1043, who: "Júlia R.", value: 64.5 },
  { id: 1044, who: "Marcos T.", value: 210 },
  { id: 1045, who: "Bia S.", value: 97.4 },
  { id: 1046, who: "Rafael L.", value: 158 },
];
const BASE_SALES = 3180;
const BASE_ORDERS = 31;
const WEEK = [62, 48, 71, 55, 80, 66]; // seg–sáb (altura relativa)

const DURATIONS = [1500, 1500, 1500, 1500, 1500, 1500, 2400];

export function PanelDemo() {
  const { ref, step } = useTicker(DURATIONS);
  const shown = ORDERS.slice(0, Math.min(step, ORDERS.length));
  const sales = BASE_SALES + shown.reduce((a, o) => a + o.value, 0);
  const count = BASE_ORDERS + shown.length;
  const ticket = sales / count;
  const today = 30 + (shown.length / ORDERS.length) * 62;
  const brl = { style: "currency", currency: "BRL", maximumFractionDigits: 0 } as const;

  return (
    <div ref={ref} data-ui className="flex h-full flex-col gap-2.5 overflow-hidden rounded-xl bg-[#0e0f11] p-3 text-[11px]">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">Painel · hoje</span>
        <span className="flex items-center gap-1.5 text-sistemas">
          <motion.i
            className="h-1.5 w-1.5 rounded-full bg-sistemas"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          ao vivo
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Vendas">
          <NumberFlow value={Math.round(sales)} locales="pt-BR" format={brl} />
        </Kpi>
        <Kpi label="Pedidos">
          <NumberFlow value={count} locales="pt-BR" />
        </Kpi>
        <Kpi label="Ticket médio">
          <NumberFlow value={Math.round(ticket)} locales="pt-BR" format={brl} />
        </Kpi>
      </div>

      <div className="grid flex-1 grid-cols-[1fr_1.25fr] gap-2">
        {/* gráfico da semana */}
        <div className="flex flex-col rounded-lg bg-surface p-2">
          <span className="text-muted-foreground">Semana</span>
          <div className="mt-auto flex h-[72px] items-end gap-1">
            {WEEK.map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-white/15" style={{ height: `${h}%` }} />
            ))}
            <motion.div
              className="flex-1 rounded-sm bg-sistemas"
              animate={{ height: `${today}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
            <span>seg</span>
            <span>dom</span>
          </div>
        </div>

        {/* últimos pedidos */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-surface p-2">
          <span className="text-muted-foreground">Últimos pedidos</span>
          <ul className="mt-1.5 space-y-1">
            <AnimatePresence initial={false}>
              {[...shown].reverse().slice(0, 4).map((o) => (
                <motion.li
                  key={o.id}
                  layout
                  initial={{ opacity: 0, x: -10, backgroundColor: "rgba(92,200,255,0.25)" }}
                  animate={{ opacity: 1, x: 0, backgroundColor: "rgba(92,200,255,0)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-between rounded px-1 py-0.5"
                >
                  <span className="text-muted-foreground">#{o.id}</span>
                  <span className="truncate px-1 text-foreground">{o.who}</span>
                  <span className="tabular-nums text-sistemas">
                    {o.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
            {shown.length === 0 && <li className="text-muted-foreground">Aguardando pedidos…</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-surface px-2 py-1.5">
      <span className="block text-[10px] text-muted-foreground">{label}</span>
      <span className="block text-[14px] font-bold tabular-nums text-foreground">{children}</span>
    </div>
  );
}
