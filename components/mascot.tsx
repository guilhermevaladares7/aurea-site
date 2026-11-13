"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Auri — o mascote da Aurea, em pixel art.
 * Um bichinho dourado de pixels grandes, com uma estrelinha que brilha.
 * Tem roupas (capacete, headset, beca…) e expressões, para aparecer
 * "fantasiado" em cada parte do site. Os olhos andam um pixel na direção
 * do mouse, ele pisca, respira e, quando você clica, pula e fala.
 */

export type BitMood = "idle" | "happy" | "wave" | "think" | "work" | "wink" | "wow" | "love" | "focus";
export type Outfit =
  | "none"
  | "hardhat"
  | "headset"
  | "grad"
  | "beret"
  | "chef"
  | "shades"
  | "detective"
  | "crown"
  | "tie"
  | "cap"
  | "laptop";

const C = {
  body: "#e6c89a",
  shade: "#c39d68",
  light: "#f6e3c2",
  eye: "#141312",
  star: "#fff4de",
};

// corpo 16 × 6 (linhas 2–7). b = corpo, s = sombra, l = brilho
const BODY = [
  "...bbbbbbbbbb...",
  "..blbbbbbbbbbb..",
  "..bbbbbbbbbbbb..",
  "..bbbbbbbbbbbb..",
  "..bbbbbbbbbbbb..",
  "..ssssssssssss..",
];

type P = [x: number, y: number, w: number, h: number, fill: string, opacity?: number];

// acessórios em pixels: [x, y, largura, altura, cor]
const OUTFITS: Record<Exclude<Outfit, "none">, { pixels: P[]; hidesStar?: boolean; hidesEyes?: boolean }> = {
  hardhat: {
    hidesStar: true,
    pixels: [
      [7, -2, 2, 1, "#ffc43d"],
      [4, -1, 8, 1, "#ffc43d"],
      [3, 0, 10, 1, "#ffb020"],
      [1, 1, 14, 1, "#d98a00"],
      [5, -1, 1, 1, "#ffe08a"],
    ],
  },
  headset: {
    pixels: [
      [3, 0, 10, 1, "#2b3a46"],
      [2, 1, 1, 2, "#2b3a46"],
      [13, 1, 1, 2, "#2b3a46"],
      [1, 3, 2, 3, "#3b4f5e"],
      [13, 3, 2, 3, "#3b4f5e"],
      [13, 6, 1, 1, "#2b3a46"],
      [11, 7, 2, 1, "#2b3a46"],
      [10, 7, 1, 1, "#4fd8e6"],
    ],
  },
  grad: {
    hidesStar: true,
    pixels: [
      [1, 0, 14, 1, "#1b2530"],
      [4, 1, 8, 1, "#24313e"],
      [7, -1, 2, 1, "#1b2530"],
      [14, 1, 1, 2, "#ffd34d"],
      [14, 3, 1, 1, "#ffb020"],
    ],
  },
  beret: {
    hidesStar: true,
    pixels: [
      [8, -1, 1, 1, "#c93a30"],
      [5, 0, 8, 1, "#e2483d"],
      [3, 1, 11, 1, "#e2483d"],
    ],
  },
  chef: {
    hidesStar: true,
    pixels: [
      [4, -3, 3, 2, "#ffffff"],
      [7, -4, 3, 3, "#ffffff"],
      [10, -3, 3, 2, "#ffffff"],
      [4, -1, 9, 2, "#ffffff"],
      [3, 1, 11, 1, "#dfe7ea"],
    ],
  },
  shades: {
    hidesEyes: true,
    pixels: [
      [3, 3, 4, 2, "#0b0f12"],
      [9, 3, 4, 2, "#0b0f12"],
      [7, 3, 2, 1, "#0b0f12"],
      [4, 3, 1, 1, "#9fe9f1"],
      [10, 3, 1, 1, "#9fe9f1"],
    ],
  },
  detective: {
    hidesStar: true,
    pixels: [
      [4, -1, 8, 1, "#8a5a3b"],
      [3, 0, 10, 1, "#7a4d31"],
      [3, 1, 10, 1, "#3a2416"],
      [1, 1, 2, 1, "#8a5a3b"],
      [13, 1, 2, 1, "#8a5a3b"],
      // lupa na mão
      [16, 1, 3, 1, "#cfe8ee"],
      [16, 5, 3, 1, "#cfe8ee"],
      [15, 2, 1, 3, "#cfe8ee"],
      [19, 2, 1, 3, "#cfe8ee"],
      [16, 2, 3, 3, "#9fe9f1", 0.35],
      [15, 5, 1, 1, "#7a4d31"],
    ],
  },
  crown: {
    hidesStar: true,
    pixels: [
      [3, 0, 10, 2, "#4fd8e6"],
      [3, -1, 1, 1, "#4fd8e6"],
      [7, -2, 2, 2, "#4fd8e6"],
      [12, -1, 1, 1, "#4fd8e6"],
      [5, 0, 1, 1, "#e2483d"],
      [10, 0, 1, 1, "#e2483d"],
    ],
  },
  tie: {
    pixels: [
      [7, 5, 2, 1, "#e2483d"],
      [7, 6, 2, 1, "#b8322a"],
      [7, 7, 2, 1, "#e2483d"],
    ],
  },
  cap: {
    hidesStar: true,
    pixels: [
      [4, -1, 8, 1, "#3ddc84"],
      [3, 0, 10, 2, "#3ddc84"],
      [0, 1, 4, 1, "#2bb36a"],
      [8, 0, 2, 1, "#ffffff"],
    ],
  },
  laptop: {
    pixels: [
      [3, 5, 10, 3, "#cfd8dc"],
      [3, 8, 10, 1, "#90a4ae"],
      [7, 6, 2, 1, "#4fd8e6"],
    ],
  },
};

function Px({ p }: { p: P }) {
  const [x, y, w, h, fill, opacity] = p;
  return <rect x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />;
}

function Sprite({
  mood,
  outfit,
  look = { dx: 0, dy: 0 },
  blink = false,
  frame = 0,
  breathe = true,
}: {
  mood: BitMood;
  outfit: Outfit;
  look?: { dx: number; dy: number };
  blink?: boolean;
  frame?: number;
  breathe?: boolean;
}) {
  const acc = outfit === "none" ? null : OUTFITS[outfit];
  const up = breathe && frame % 2 === 1 ? -1 : 0;
  const eyeDx = mood === "think" ? 1 : mood === "work" || mood === "focus" ? 0 : look.dx;
  const eyeDy = mood === "think" ? -1 : mood === "work" ? 1 : look.dy;
  const happy = mood === "happy" || mood === "wave";
  const armUp = mood === "wave" && frame % 2 === 0;
  const typing = mood === "work";
  const E = C.eye;

  let eyes: P[];
  if (happy) {
    eyes = [[4, 4, 1, 1, E], [5, 3, 1, 1, E], [6, 4, 1, 1, E], [9, 4, 1, 1, E], [10, 3, 1, 1, E], [11, 4, 1, 1, E]];
  } else if (mood === "love") {
    const H = "#ff5d8f";
    eyes = [4, 9].flatMap((x) => [[x, 3, 1, 1, H], [x + 2, 3, 1, 1, H], [x, 4, 3, 1, H], [x + 1, 5, 1, 1, H]] as P[]);
  } else if (mood === "wow") {
    eyes = [[4, 3, 2, 2, E], [9, 3, 2, 2, E], [7, 6, 2, 1, E]];
  } else if (mood === "wink") {
    eyes = [[4, 4, 2, 1, E], [10 + eyeDx, 3 + eyeDy, 1, 2, E], [7, 6, 2, 1, C.shade]];
  } else if (mood === "focus") {
    eyes = [[4, 4, 2, 1, E], [9, 4, 2, 1, E]];
  } else if (blink) {
    eyes = [[4 + eyeDx, 4 + Math.max(0, eyeDy), 2, 1, E], [9 + eyeDx, 4 + Math.max(0, eyeDy), 2, 1, E]];
  } else {
    eyes = [[5 + eyeDx, 3 + eyeDy, 1, 2, E], [10 + eyeDx, 3 + eyeDy, 1, 2, E]];
  }

  return (
    <>
      {/* pernas */}
      {[3, 5, 10, 12].map((x, i) => (
        <rect key={x} x={x} y={7} width={1} height={typing && i % 2 === frame % 2 ? 2 : 3} fill={C.shade} />
      ))}
      <g transform={`translate(0 ${up})`}>
        {/* braços */}
        <rect x={0} y={armUp ? 4 : 5} width={2} height={1} fill={C.body} />
        {armUp ? (
          <>
            <rect x={14} y={4} width={1} height={1} fill={C.body} />
            <rect x={15} y={3} width={1} height={1} fill={C.body} />
          </>
        ) : (
          <rect x={14} y={typing && frame % 2 ? 6 : 5} width={2} height={1} fill={C.body} />
        )}
        {/* corpo */}
        {BODY.map((row, r) =>
          [...row].map((ch, c) =>
            ch === "." ? null : (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r + 2}
                width={1}
                height={1}
                fill={ch === "s" ? C.shade : ch === "l" ? C.light : C.body}
              />
            ),
          ),
        )}
        {!acc?.hidesEyes && eyes.map((p, i) => <Px key={`e${i}`} p={p} />)}
        {acc?.pixels.map((p, i) => <Px key={`a${i}`} p={p} />)}
        {!acc?.hidesStar && (
          <g opacity={mood === "think" ? (frame % 2 ? 0.25 : 1) : frame === 3 ? 0.35 : 1}>
            <rect x={13} y={-1} width={1} height={1} fill={C.star} />
            <rect x={12} y={0} width={3} height={1} fill={C.star} />
            <rect x={13} y={1} width={1} height={1} fill={C.star} />
          </g>
        )}
      </g>
    </>
  );
}

const VIEWBOX = "-2 -4 22 15";

/** Auri parado, sem interação: para avatares, ícones e notificações. */
export function AuriIcon({
  className,
  outfit = "none",
  mood = "idle",
}: {
  className?: string;
  outfit?: Outfit;
  mood?: BitMood;
}) {
  return (
    <svg viewBox={VIEWBOX} className={cn("pixelated block h-auto overflow-visible", className)} aria-hidden="true">
      <Sprite mood={mood} outfit={outfit} breathe={false} />
    </svg>
  );
}

const DEFAULT_LINES = [
  "Oi! Eu sou o Auri, o ajudante da Aurea.",
  "Site lento? Aqui não entra.",
  "Ctrl+S é o meu cardio.",
  "Me chama no WhatsApp. Eu não mordo, só compilo.",
  "Eu automatizo. Você toma café.",
];

type MascotProps = {
  size?: number | string;
  mood?: BitMood;
  outfit?: Outfit;
  say?: string | null;
  lines?: string[];
  bubbleSide?: "left" | "right" | "top";
  className?: string;
  label?: string;
};

export function Mascot({
  size = 140,
  mood = "idle",
  outfit = "none",
  say = null,
  lines = DEFAULT_LINES,
  bubbleSide = "top",
  className,
  label = "Auri, o mascote da Aurea. Clique para ele falar.",
}: MascotProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ dx: 0, dy: 0 });
  const [blink, setBlink] = useState(false);
  const [frame, setFrame] = useState(0);
  const [talk, setTalk] = useState<string | null>(null);
  const [localMood, setLocalMood] = useState<BitMood | null>(null);
  const [jump, setJump] = useState(0);
  const lineIndex = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // olhos andam um pixel na direção do mouse
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dxp = e.clientX - (r.left + r.width / 2);
      const dyp = e.clientY - (r.top + r.height * 0.4);
      const dx = Math.abs(dxp) < r.width * 0.6 ? 0 : Math.sign(dxp);
      const dy = dyp > r.height * 0.6 ? 1 : 0;
      setLook((p) => (p.dx === dx && p.dy === dy ? p : { dx, dy }));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // piscadas aleatórias
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        schedule();
      }, 2200 + Math.random() * 3000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // quadros da animação (respirar, acenar, digitar) — passo a passo, como sprite
  useEffect(() => {
    const t = setInterval(() => setFrame((f) => (f + 1) % 4), 320);
    return () => clearInterval(t);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const speak = useCallback(() => {
    const line = lines[lineIndex.current % lines.length];
    lineIndex.current += 1;
    setTalk(line);
    setLocalMood("happy");
    setJump((j) => j + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setTalk(null);
      setLocalMood(null);
    }, 2800);
  }, [lines]);

  const current = localMood ?? mood;
  const bubble = talk ?? say;

  return (
    <div className={cn("relative inline-block select-none align-top text-[16px] leading-none", className)} style={{ width: size }}>
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble}
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "linear" }}
            style={bubbleSide === "top" ? { x: "-50%" } : undefined}
            className={cn(
              "absolute z-20 w-max max-w-[15rem]",
              bubbleSide === "top" && "bottom-[96%] left-1/2 mb-2",
              bubbleSide === "right" && "left-[92%] top-0",
              bubbleSide === "left" && "right-[92%] top-0",
            )}
          >
            <span className="pixel-box pixel block bg-foreground px-3.5 py-2 text-[15px] leading-snug text-background">
              {bubble}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        onClick={speak}
        aria-label={label}
        className="block w-full cursor-pointer focus-visible:outline-offset-4"
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          className="block"
          key={jump}
          initial={false}
          animate={jump ? { y: [0, -18, -18, 0] } : { y: 0 }}
          transition={{ duration: 0.4, times: [0, 0.3, 0.6, 1], ease: "linear" }}
        >
          <svg viewBox={VIEWBOX} className="pixelated block h-auto w-full overflow-visible" aria-hidden="true">
            <Sprite mood={current} outfit={outfit} look={look} blink={blink} frame={frame} />
          </svg>
        </motion.span>
      </motion.button>
    </div>
  );
}
