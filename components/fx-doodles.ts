import type { FxEnv } from "@/components/fx-planet";

/*
  Desenhos em pixel que flutuam no fundo das páginas de serviço, cada um com a sua animaçãozinha.
  - sites: terminal digitando, navegador montando a página, monitor, notebook, celular, servidor,
    wi-fi, rede, nuvem, banco de dados e etiquetas de código (<div>, { }, </>).
  - sistemas: rosca, indicador, linha de tendência, tabela, velocímetro, agenda, engrenagem,
    chaves liga/desliga, barras, quadro de tarefas e lista de conferência.
  Ficam bem apagados para não disputar com o texto e acendem quando o mouse chega perto.
*/

export type DoodleKind =
  | "terminal" | "browser" | "monitor" | "laptop" | "phone" | "server" | "wifi" | "net" | "cloud" | "db" | "tag"
  | "donut" | "kpi" | "spark" | "table" | "gauge" | "calendar" | "gear" | "toggles" | "bars" | "kanban" | "checks";

export const SITES_DOODLES: DoodleKind[] = [
  "terminal", "tag", "browser", "wifi", "server", "tag", "net", "laptop", "cloud", "monitor", "tag", "phone", "db", "terminal", "browser", "tag",
];
export const SISTEMAS_DOODLES: DoodleKind[] = [
  "donut", "kpi", "table", "gear", "spark", "calendar", "toggles", "gauge", "kanban", "bars", "checks", "kpi", "donut", "spark",
];

type Item = { kind: DoodleKind; fx: number; fy: number; depth: number; c: number; ph: number; n: number };
export type Field = { items: Item[]; cols: number; span: number };

// tamanho de cada desenho, em pixels do próprio desenho (largura, altura)
const SIZE: Record<DoodleKind, [number, number]> = {
  terminal: [36, 20], browser: [30, 21], monitor: [22, 18], laptop: [26, 15], phone: [11, 19], server: [16, 17],
  wifi: [15, 11], net: [27, 17], cloud: [18, 11], db: [12, 12], tag: [22, 6],
  donut: [17, 17], kpi: [26, 13], spark: [28, 14], table: [26, 16], gauge: [21, 12], calendar: [20, 18],
  gear: [13, 13], toggles: [18, 14], bars: [20, 14], kanban: [26, 16], checks: [18, 13],
};

const TAGS = ["<div>", "</div>", "{ }", "</>", "<a href>", "#id", ".classe", "<h1>", "200 OK", "https://", "<img>", "git push"];
const CMDS = ["npm run build", "git push", "ssh servidor", "ping site.com"];
const OUTS = ["✓ pronto", "✓ no ar", "✓ conectado", "12ms"];

function rnd(seed: number) {
  let s = seed % 2147483647;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Espalha os desenhos numa grade bagunçada que cobre duas telas de altura. */
export function makeField(kinds: DoodleKind[], w: number, h: number, seed = 11): Field {
  const r = rnd(seed);
  const cols = w < 640 ? 2 : w < 1100 ? 3 : 4;
  const rows = w < 640 ? 6 : 8;
  const items: Item[] = [];
  let n = 0;
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++) {
      items.push({
        kind: kinds[n % kinds.length],
        fx: (col + 0.12 + r() * 0.6) / cols,
        fy: (row + 0.15 + r() * 0.6) / rows,
        depth: 0.14 + r() * 0.3,
        c: w < 640 ? 3 : w < 1100 ? (r() < 0.4 ? 4 : 3) : r() < 0.4 ? 5 : 4,
        ph: r() * 20,
        n: n++,
      });
    }
  return { items, cols, span: h * 2 + 240 };
}

type Pen = {
  ctx: CanvasRenderingContext2D;
  ox: number;
  oy: number;
  c: number;
  a: number;
  rgb: string;
  rgb2: string;
  font: string;
};

/** Retângulo em pixels do desenho. `alt` usa a cor de apoio. */
function R(p: Pen, x: number, y: number, w: number, h: number, alpha = 1, alt = false) {
  p.ctx.fillStyle = `rgba(${alt ? p.rgb2 : p.rgb},${Math.min(1, p.a * alpha)})`;
  p.ctx.fillRect(p.ox + x * p.c, p.oy + y * p.c, w * p.c, h * p.c);
}
function frame(p: Pen, x: number, y: number, w: number, h: number, alpha = 1, alt = false) {
  R(p, x, y, w, 1, alpha, alt);
  R(p, x, y + h - 1, w, 1, alpha, alt);
  R(p, x, y + 1, 1, h - 2, alpha, alt);
  R(p, x + w - 1, y + 1, 1, h - 2, alpha, alt);
}
function text(p: Pen, s: string, x: number, y: number, size: number, alpha = 1, alt = false) {
  p.ctx.font = `${Math.round(size * p.c)}px ${p.font}`;
  p.ctx.textBaseline = "top";
  p.ctx.fillStyle = `rgba(${alt ? p.rgb2 : p.rgb},${Math.min(1, p.a * alpha)})`;
  p.ctx.fillText(s, p.ox + x * p.c, p.oy + y * p.c);
}
function rows(p: Pen, art: string[], x: number, y: number, alpha: (row: number) => number, alt = false) {
  for (let r = 0; r < art.length; r++) {
    const a = alpha(r);
    for (let q = 0; q < art[r].length; q++) if (art[r][q] === "#") R(p, x + q, y + r, 1, 1, a, alt);
  }
}

const WIFI = [
  "...#########...",
  ".##.........##.",
  "#.............#",
  "....#######....",
  "..##.......##..",
  "...............",
  ".....#####.....",
  "....#.....#....",
  "...............",
  "......###......",
  "......###......",
];
const CLOUD = [
  ".....#####........",
  "....#.....###.....",
  "..##.........#....",
  ".#............###.",
  "#................#",
  "#................#",
  ".################.",
];
const GEAR = [
  ".....###.....",
  ".#...###...#.",
  "..#########..",
  "..##.....##..",
  "..#..###..#..",
  "###.#...#.###",
  "###.#...#.###",
  "###.#...#.###",
  "..#..###..#..",
  "..##.....##..",
  "..#########..",
  ".#...###...#.",
  ".....###.....",
];

function draw(p: Pen, it: Item, t: number) {
  const T = t + it.ph;
  switch (it.kind) {
    /* ------------------------------ sites ------------------------------ */
    case "terminal": {
      frame(p, 0, 0, 36, 20);
      R(p, 1, 4, 34, 1, 0.6);
      for (let i = 0; i < 3; i++) R(p, 2 + i * 2, 2, 1, 1, 1, i === 0);
      const cyc = T % 7;
      const k = Math.floor(T / 7 + it.n) % CMDS.length;
      const typed = Math.min(CMDS[k].length, Math.floor(cyc * 9));
      text(p, `$ ${CMDS[k].slice(0, typed)}`, 2, 6.4, 3.6, 1.5);
      if (typed < CMDS[k].length || Math.floor(T * 2) % 2 === 0) {
        if (cyc < 2.6) R(p, 2 + (typed + 2) * 1.95, 7, 1.4, 3, 1.4, true);
      }
      if (cyc > 2.6) text(p, OUTS[k], 2, 12, 3.6, 1.8, true);
      break;
    }
    case "browser": {
      frame(p, 0, 0, 30, 21);
      R(p, 1, 4, 28, 1, 0.6);
      R(p, 2, 2, 1, 1);
      R(p, 4, 2, 1, 1);
      frame(p, 8, 1, 19, 3, 0.5);
      // a página vai se montando, bloco por bloco
      const s = Math.floor(T * 1.2) % 8;
      if (s >= 1) R(p, 2, 7, 12, 6, 0.7);
      if (s >= 2) {
        R(p, 16, 7, 11, 1);
        R(p, 16, 9, 8, 1, 0.7);
      }
      if (s >= 3) R(p, 16, 11, 7, 2, 1.6, true);
      for (let i = 0; i < 3; i++) if (s >= 4 + i) frame(p, 2 + i * 9, 15, 8, 4, 0.8);
      break;
    }
    case "monitor": {
      frame(p, 0, 0, 22, 14);
      R(p, 9, 14, 4, 2);
      R(p, 6, 16, 10, 1);
      text(p, "</>", 5, 3.4, 5.4, 1.6, true);
      if (Math.floor(T * 2) % 2 === 0) R(p, 16, 9, 2, 1, 1.4);
      break;
    }
    case "laptop": {
      frame(p, 3, 0, 20, 12);
      R(p, 0, 13, 26, 2);
      // linhas de código aparecendo uma a uma
      const lines: [number, number, boolean][] = [[0, 6, false], [2, 9, true], [2, 5, false], [4, 8, false], [2, 4, true], [0, 3, false]];
      const n = Math.floor(T * 1.6) % (lines.length + 3);
      for (let i = 0; i < Math.min(n, lines.length); i++) R(p, 5 + lines[i][0], 2 + i * 1.5, lines[i][1], 0.8, 1.2, lines[i][2]);
      break;
    }
    case "phone": {
      frame(p, 0, 0, 11, 19);
      R(p, 4, 1, 3, 0.6, 0.7);
      const s = Math.floor(T * 1.1) % 6;
      if (s >= 1) R(p, 2, 3, 7, 4, 0.7);
      if (s >= 2) R(p, 2, 8, 6, 1);
      if (s >= 3) R(p, 2, 10, 4, 1, 0.7);
      if (s >= 4) R(p, 2, 13, 7, 2, 1.6, true);
      break;
    }
    case "server": {
      for (let i = 0; i < 3; i++) {
        frame(p, 0, i * 6, 16, 5);
        R(p, 9, i * 6 + 2, 5, 1, 0.6);
        // luzes piscando, cada uma no seu ritmo
        const on = Math.floor(T * (2 + i) + i * 1.3) % 3 !== 0;
        R(p, 2, i * 6 + 2, 1, 1, on ? 2.4 : 0.5, true);
        R(p, 4, i * 6 + 2, 1, 1, Math.floor(T * 5 + i) % 2 ? 2 : 0.5);
      }
      break;
    }
    case "wifi": {
      // as ondas acendem de dentro para fora
      const s = Math.floor(T * 2.2) % 5;
      rows(p, WIFI, 0, 0, (r) => {
        const lvl = r >= 9 ? 0 : r >= 6 ? 1 : r >= 3 ? 2 : 3;
        return s >= lvl ? (lvl === s ? 2.2 : 1.2) : 0.35;
      }, true);
      break;
    }
    case "net": {
      // um roteador no meio e quatro pontos ligados a ele, com pacotes indo e voltando
      const hub: [number, number] = [13, 8];
      const ends: [number, number][] = [[1, 8], [25, 8], [13, 1], [13, 15]];
      R(p, 3, 8, 21, 1, 0.5);
      R(p, 13, 2, 1, 13, 0.5);
      R(p, hub[0] - 2, hub[1] - 2, 5, 5, 1.3, true);
      ends.forEach(([x, y], i) => {
        frame(p, x - 1, y - 1, 3, 3);
        const u = (T * 0.6 + i * 0.27) % 1;
        const k = i % 2 ? u : 1 - u;
        R(p, hub[0] + (x - hub[0]) * k, hub[1] + (y - hub[1]) * k, 1, 1, 3, i % 2 === 0);
      });
      break;
    }
    case "cloud": {
      rows(p, CLOUD, 0, 0, () => 1);
      // setinha de envio subindo
      const u = (T * 0.8) % 1;
      const y = 9 - u * 6;
      R(p, 8.5, y, 1, 3, 2 * (1 - u * 0.6), true);
      R(p, 7.5, y + 1, 3, 1, 2 * (1 - u * 0.6), true);
      break;
    }
    case "db": {
      for (let i = 0; i < 4; i++) {
        R(p, 1, i * 3.4, 10, 1);
        R(p, 0, i * 3.4 + 1, 1, i < 3 ? 2.4 : 0);
        R(p, 11, i * 3.4 + 1, 1, i < 3 ? 2.4 : 0);
      }
      const i = Math.floor(T * 1.5) % 3;
      R(p, 3, i * 3.4 + 1.6, 6, 1, 1.8, true);
      break;
    }
    case "tag": {
      const s = TAGS[it.n % TAGS.length];
      text(p, s, 0, 0, 5.2, 1.3, it.n % 2 === 0);
      break;
    }

    /* ----------------------------- sistemas ----------------------------- */
    case "donut": {
      // rosca que vai se preenchendo
      const fill = ((T * 0.12) % 1) * Math.PI * 2;
      for (let y = 0; y < 17; y++)
        for (let x = 0; x < 17; x++) {
          const dx = x - 8;
          const dy = y - 8;
          const d = Math.hypot(dx, dy);
          if (d < 4.6 || d > 8.2) continue;
          const ang = (Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2);
          R(p, x, y, 1, 1, ang < fill ? 1.7 : 0.45);
        }
      text(p, `${Math.round((fill / (Math.PI * 2)) * 100)}`, 5.3, 6.2, 3.6, 1.6);
      break;
    }
    case "kpi": {
      frame(p, 0, 0, 26, 13);
      R(p, 2, 2, 9, 1, 0.7);
      const v = Math.floor(((T * 0.25) % 1) * 240) + 12;
      text(p, `+${v}`, 2, 4.6, 5.6, 1.6);
      // setinha para cima
      R(p, 21, 5, 1, 5, 1.6);
      R(p, 20, 6, 3, 1, 1.6);
      R(p, 19, 7, 5, 1, 0.9);
      break;
    }
    case "spark": {
      frame(p, 0, 0, 28, 14);
      const pts = [9, 8, 9, 7, 8, 6, 7, 5, 6, 4, 5, 3];
      const n = Math.floor(T * 3) % (pts.length + 5);
      for (let i = 0; i < Math.min(n, pts.length); i++) {
        R(p, 2 + i * 2, pts[i], 2, 1, 1.6);
        if (i > 0 && pts[i] !== pts[i - 1]) R(p, 2 + i * 2, Math.min(pts[i], pts[i - 1]), 1, Math.abs(pts[i] - pts[i - 1]) + 1, 1.6);
        R(p, 2 + i * 2, pts[i] + 1, 2, 11 - pts[i], 0.25);
      }
      const last = Math.min(n, pts.length) - 1;
      if (last >= 0 && Math.floor(T * 4) % 2 === 0) R(p, 1.5 + last * 2 + 1, pts[last] - 1, 2, 2, 2.6);
      break;
    }
    case "table": {
      frame(p, 0, 0, 26, 16);
      R(p, 1, 1, 24, 3, 0.45);
      const hot = Math.floor(T * 0.9) % 4;
      for (let r = 0; r < 4; r++) {
        const y = 5 + r * 2.6;
        if (r === hot) R(p, 1, y - 0.6, 24, 2.2, 0.4);
        R(p, 2, y, 6, 1, r === hot ? 1.8 : 0.8);
        R(p, 10, y, 8, 1, r === hot ? 1.4 : 0.6);
        R(p, 20, y, 4, 1, r === hot ? 1.8 : 0.8);
      }
      break;
    }
    case "gauge": {
      for (let y = 0; y < 11; y++)
        for (let x = 0; x < 21; x++) {
          const d = Math.hypot(x - 10, y - 10);
          if (d >= 8.6 && d <= 10.4) R(p, x, y, 1, 1, x < 7 ? 0.6 : x < 14 ? 1 : 1.6);
        }
      // ponteiro balançando
      const ang = -Math.PI / 2 + Math.sin(T * 0.9) * 1.1;
      for (let i = 1; i < 8; i++) R(p, 10 + Math.round(Math.cos(ang) * i), 10 + Math.round(Math.sin(ang) * i), 1, 1, 2);
      R(p, 9, 10, 3, 2, 1.6);
      break;
    }
    case "calendar": {
      frame(p, 0, 0, 20, 18);
      R(p, 1, 1, 18, 3, 0.5);
      R(p, 4, -1, 1, 3, 1.4);
      R(p, 15, -1, 1, 3, 1.4);
      const day = Math.floor(T * 1.3) % 15;
      for (let r = 0; r < 3; r++)
        for (let q = 0; q < 5; q++) {
          const i = r * 5 + q;
          R(p, 2 + q * 3.4, 6 + r * 3.8, 2, 2, i === day ? 2.6 : i < day ? 1 : 0.45);
        }
      break;
    }
    case "gear": {
      // gira em passos, como engrenagem de relógio
      const ctx = p.ctx;
      const half = 6.5 * p.c;
      ctx.save();
      ctx.translate(p.ox + half, p.oy + half);
      ctx.rotate((Math.floor(T * 3) % 8) * (Math.PI / 8));
      const q: Pen = { ...p, ox: -half, oy: -half };
      rows(q, GEAR, 0, 0, () => 1.1);
      ctx.restore();
      break;
    }
    case "toggles": {
      for (let i = 0; i < 3; i++) {
        const on = Math.floor(T * 0.7 + i * 0.8) % 2 === 0;
        frame(p, 0, i * 5, 8, 4, on ? 1.5 : 0.7);
        R(p, on ? 4.5 : 1.5, i * 5 + 1, 2, 2, on ? 2.4 : 0.9);
        R(p, 10, i * 5 + 1.5, i === 1 ? 5 : 8, 1, 0.7);
      }
      break;
    }
    case "bars": {
      R(p, 0, 0, 1, 14, 0.7);
      R(p, 0, 13, 20, 1, 0.7);
      for (let i = 0; i < 5; i++) {
        const v = 3 + Math.round((0.5 + 0.5 * Math.sin(T * 0.9 + i * 1.3)) * 8);
        R(p, 3 + i * 3.4, 13 - v, 2, v, i === 4 ? 1.9 : 0.9);
      }
      break;
    }
    case "kanban": {
      for (let q = 0; q < 3; q++) {
        frame(p, q * 9, 0, 8, 16, 0.6);
        R(p, q * 9 + 2, 2, 4, 1, 0.9);
      }
      // um cartão anda de coluna em coluna
      const col = Math.floor(T * 0.6) % 3;
      for (let q = 0; q < 3; q++) {
        const cards = q === col ? 3 : q < col ? 1 : 2;
        for (let i = 0; i < cards; i++) R(p, q * 9 + 2, 5 + i * 3.4, 4, 2.2, q === col && i === cards - 1 ? 2.2 : 0.8);
      }
      break;
    }
    case "checks": {
      const done = Math.floor(T * 0.9) % 5;
      for (let i = 0; i < 4; i++) {
        frame(p, 0, i * 3.4, 3, 3, 1);
        if (i < done) R(p, 1, i * 3.4 + 1, 1, 1, 2.6);
        R(p, 5, i * 3.4 + 1, i % 2 ? 9 : 12, 1, i < done ? 0.5 : 1);
      }
      break;
    }
  }
}

export type FieldOpts = {
  font: string;
  /** alpha de base dos desenhos */
  alpha?: number;
  /** abaixo desta fração da altura os desenhos vão sumindo (para não brigar com o que fica no rodapé) */
  fadeFrom?: number;
  /** linhas pontilhadas com pacotes entre desenhos vizinhos, como uma rede */
  links?: boolean;
};

export function drawField(ctx: CanvasRenderingContext2D, field: Field, env: FxEnv, opts: FieldOpts) {
  const { w, h, t, scroll, mouse, reduce } = env;
  const base = opts.alpha ?? 0.2;
  const T = reduce ? 3.2 : t;
  const pos = field.items.map((it) => {
    const [sw, sh] = SIZE[it.kind];
    const y = ((((it.fy * field.span - scroll * it.depth) % field.span) + field.span) % field.span) - 140 + (reduce ? 0 : Math.sin(t * 0.5 + it.ph) * 7);
    const x = Math.min(w - sw * it.c - 8, Math.max(8, it.fx * w - (sw * it.c) / 2));
    const cx = x + (sw * it.c) / 2;
    const cy = y + (sh * it.c) / 2;
    const d = Math.hypot(cx - mouse.x, cy - mouse.y);
    const near = d < 240 ? 1 - d / 240 : 0;
    let fade = 1;
    if (opts.fadeFrom !== undefined) fade = Math.max(0, Math.min(1, (opts.fadeFrom * h - cy) / (h * 0.14) + 1));
    // no topo da tela ficam o logo e o menu: ali os desenhos também somem
    fade *= Math.max(0, Math.min(1, (y - 56) / 50));
    return { it, x: Math.round(x), y: Math.round(y), cx, cy, near, fade, vis: y > -160 && y < h + 20 };
  });

  // a rede: pontilhado entre vizinhos da mesma linha, com um pacote correndo
  if (opts.links) {
    for (let i = 0; i < pos.length - 1; i++) {
      if ((i + 1) % field.cols === 0) continue;
      const a = pos[i];
      const b = pos[i + 1];
      if (!a.vis || !b.vis) continue;
      const len = Math.hypot(b.cx - a.cx, b.cy - a.cy);
      const f = Math.min(a.fade, b.fade);
      const lit = Math.max(a.near, b.near);
      ctx.fillStyle = `rgba(${env.rgb},${(0.1 + lit * 0.3) * f})`;
      for (let s = 40; s < len - 40; s += 12) ctx.fillRect(Math.round(a.cx + ((b.cx - a.cx) * s) / len), Math.round(a.cy + ((b.cy - a.cy) * s) / len), 2, 2);
      if (!reduce) {
        const u = (t * 0.22 + i * 0.37) % 1;
        const s = 40 + u * (len - 80);
        ctx.fillStyle = `rgba(${env.rgb2},${0.75 * f})`;
        ctx.fillRect(Math.round(a.cx + ((b.cx - a.cx) * s) / len) - 2, Math.round(a.cy + ((b.cy - a.cy) * s) / len) - 2, 5, 5);
      }
    }
  }

  for (const q of pos) {
    if (!q.vis || q.fade <= 0.01) continue;
    draw(
      { ctx, ox: q.x, oy: q.y, c: q.it.c, a: (base + q.near * 0.45) * q.fade, rgb: env.rgb, rgb2: env.rgb2, font: opts.font },
      q.it,
      T,
    );
  }
}
