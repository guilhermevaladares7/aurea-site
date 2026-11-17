/*
  O planeta em pixel art da página de sites.
  Fica preso no rodapé da tela: aparece só o topo dele, de uma borda à outra, ocupando uns 20% da altura.
  Ele gira devagar (e um pouco mais quando a página rola), tem luzes de cidade no lado escuro,
  anéis de órbita, dois satélites passando por cima e, de tempos em tempos, um foguete que decola:
  é o site "indo para o ar".
*/

export type FxEnv = {
  w: number;
  h: number;
  /** segundos desde que a página abriu */
  t: number;
  scroll: number;
  mouse: { x: number; y: number };
  reduce: boolean;
  /** cor do tema e cor de apoio, no formato "r,g,b" */
  rgb: string;
  rgb2: string;
  /** 1 no topo e no fim da página, 0 no meio: o fundo recua enquanto a pessoa lê */
  presence?: number;
};

/* ---- ruído 3D simples, para desenhar a superfície sem costura ---- */
function h3(x: number, y: number, z: number) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const fx = x - xi;
  const fy = y - yi;
  const fz = z - zi;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const w = fz * fz * (3 - 2 * fz);
  const l = (a: number, b: number, k: number) => a + (b - a) * k;
  return l(
    l(l(h3(xi, yi, zi), h3(xi + 1, yi, zi), u), l(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), u), v),
    l(l(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), u), l(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), u), v),
    w,
  );
}
function fbm(x: number, y: number, z: number, oct: number) {
  let a = 0.5;
  let s = 0;
  let n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * noise3(x, y, z);
    n += a;
    a *= 0.5;
    x *= 2.03;
    y *= 2.03;
    z *= 2.03;
  }
  return s / n;
}

// do mais fundo ao mais alto: vinho, carmim, rosa e os picos claros
const LAND: [number, number, number][] = [
  [52, 10, 32],
  [84, 15, 45],
  [122, 21, 59],
  [160, 28, 76],
  [194, 46, 98],
  [222, 92, 136],
];
const NIGHT: [number, number, number] = [16, 8, 24];
const RIM: [number, number, number] = [143, 208, 255];
const CITY: [number, number, number] = [176, 224, 255];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// satélite: painéis (#) e corpo (+)
const SAT = ["###.+.###", "###+++###", "###.+.###"];
// um mini navegador em órbita
const WIN = ["#########", "#+.+....#", "#########", "#.......#", "#.+++...#", "#.......#", "#########"];
const ROCKET = ["..#..", ".###.", ".#+#.", ".###.", ".###.", "#####", "#.#.#"];

function sprite(ctx: CanvasRenderingContext2D, rows: string[], x: number, y: number, c: number, a: string, b: string) {
  for (let r = 0; r < rows.length; r++)
    for (let q = 0; q < rows[r].length; q++) {
      const ch = rows[r][q];
      if (ch === ".") continue;
      ctx.fillStyle = ch === "#" ? a : b;
      ctx.fillRect(Math.round(x) + q * c, Math.round(y) + r * c, c, c);
    }
}

export function createPlanet() {
  const off = document.createElement("canvas");
  const octx = off.getContext("2d")!;
  let img: ImageData | null = null;
  let lastStep = -1;
  let lastKey = "";
  // foguete: nasce num ponto da superfície e sobe
  const rocket = { next: 5, x: 0, y0: 0, t0: -1 };
  const trail: { x: number; y: number; born: number }[] = [];

  /** Onde o planeta fica e o tamanho de cada pixel dele. */
  function geometry(w: number, h: number) {
    const cap = h * 0.2; // altura da parte que aparece
    // largo o bastante para ir de uma borda à outra da tela (e passar um pouco); em tela estreita, nunca menor que 1/3 à mostra
    const half = w * 0.56;
    const R = Math.max((half * half + cap * cap) / (2 * cap), cap * 1.5);
    const cell = Math.max(4, Math.min(8, Math.round(cap / 30)));
    const cx = w / 2;
    const top = Math.round(h - cap);
    return { R, cell, cx, top, cy: top + R, cap };
  }

  // eixo de giro quase apontado para quem olha: o terreno desliza de lado ao longo do horizonte
  const AX = (() => {
    const v = [0.14, 0.3, 1];
    const n = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / n, v[1] / n, v[2] / n];
  })();

  function paint(env: FxEnv) {
    const { R, cell, cx, top, cap } = geometry(env.w, env.h);
    const Rc = R / cell;
    const cw = Math.min(Math.ceil(Rc * 2), Math.ceil(env.w / cell)) + 2;
    const ch = Math.ceil(cap / cell) + 2;
    if (!img || off.width !== cw || off.height !== ch) {
      off.width = cw;
      off.height = ch;
      img = octx.createImageData(cw, ch);
    }
    const d = img.data;
    d.fill(0);
    // o terreno anda uns 12 px por segundo no horizonte, seja o planeta grande ou pequeno
    const rot = ((env.reduce ? 40 : env.t * 12) + env.scroll * 0.25) / R;
    const ca = Math.cos(rot);
    const sa = Math.sin(rot);
    // quanto maior o planeta na tela, mais miúdo o desenho do terreno
    const zoom = Math.pow(Math.max(1, R / (cap * 1.5)), 0.72);
    const f1 = 2.1 * zoom;
    const f2 = 3.4 * zoom;
    const kc = Rc / 1.35;
    // luz vindo da direita e de cima: o lado esquerdo fica de noite
    const L = [0.75, -0.36, 0.5];
    const ln = Math.hypot(L[0], L[1], L[2]);
    const left = cx - (cw * cell) / 2;
    const mxc = (env.mouse.x - left) / cell;
    const myc = (env.mouse.y - top) / cell + 1;
    const MR = 150 / cell;

    for (let j = 0; j < ch; j++) {
      for (let i = 0; i < cw; i++) {
        const nx = (i + 0.5 - cw / 2) / Rc;
        const ny = (j + 0.5 - 1 - Rc) / Rc;
        const r2 = nx * nx + ny * ny;
        if (r2 > 1) continue;
        const nz = Math.sqrt(1 - r2);
        // gira o ponto em volta do eixo (fórmula de Rodrigues)
        const dp = (AX[0] * nx + AX[1] * ny + AX[2] * nz) * (1 - ca);
        const xr = nx * ca + (AX[1] * nz - AX[2] * ny) * sa + AX[0] * dp;
        const yr = ny * ca + (AX[2] * nx - AX[0] * nz) * sa + AX[1] * dp;
        const zr = nz * ca + (AX[0] * ny - AX[1] * nx) * sa + AX[2] * dp;

        const n = fbm(xr * f1 + 11, yr * f1 + 7, zr * f1 + 3, 4);
        const k = Math.max(0, Math.min(0.999, (n - 0.3) / 0.42));
        let [r, g, b] = LAND[Math.floor(k * LAND.length)];
        // cânions: riscos escuros cortando o terreno
        const rg = Math.abs(fbm(xr * f2 + 40, yr * f2 + 40, zr * f2 + 40, 2) * 2 - 1);
        if (rg < 0.04 && k > 0.3) {
          r *= 0.5;
          g *= 0.5;
          b *= 0.55;
        }

        const dot = (nx * L[0] + ny * L[1] + nz * L[2]) / ln;
        const lit = Math.max(0, Math.min(1, dot * 1.05 + 0.16));
        // sombra em degraus com pontilhado, como pixel art
        const q = Math.max(0, Math.min(1, Math.floor((lit + (BAYER[(j & 3) * 4 + (i & 3)] / 16 - 0.5) * 0.2) * 5) / 4));
        const sh = 0.16 + q * 0.84;
        r = NIGHT[0] + (r - NIGHT[0]) * sh;
        g = NIGHT[1] + (g - NIGHT[1]) * sh;
        b = NIGHT[2] + (b - NIGHT[2]) * sh;

        // luzes de cidade no lado escuro, piscando
        if (q <= 0.25 && k > 0.35) {
          const hc = h3(Math.floor(xr * kc), Math.floor(yr * kc), Math.floor(zr * kc));
          if (hc > 0.975 && (env.reduce || Math.sin(env.t * 1.6 + hc * 400) > -0.5)) {
            [r, g, b] = CITY;
          }
        }
        // linha azul da atmosfera na borda do planeta (uns 4 pixels dele)
        const depth = (1 - Math.sqrt(r2)) * Rc;
        if (depth < 4) {
          const m = (1 - depth / 4) * (0.3 + lit * 0.55);
          r += (RIM[0] - r) * m;
          g += (RIM[1] - g) * m;
          b += (RIM[2] - b) * m;
        }
        // perto do mouse a superfície acende
        const dm = Math.hypot(i - mxc, j - myc);
        if (dm < MR) {
          const f = Math.pow(1 - dm / MR, 2) * 0.55;
          r += (255 - r) * f;
          g += (190 - g) * f;
          b += (215 - b) * f;
        }
        const o = (j * cw + i) * 4;
        d[o] = r;
        d[o + 1] = g;
        d[o + 2] = b;
        d[o + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
  }

  function draw(ctx: CanvasRenderingContext2D, env: FxEnv) {
    const { w, h, t, reduce, rgb, rgb2 } = env;
    const { R, cell, cx, top, cy, cap } = geometry(w, h);

    // no meio da página o planeta afunda no horizonte, para não disputar com o texto
    ctx.save();
    ctx.translate(0, Math.round((1 - (env.presence ?? 1)) * cap * 0.55));

    // brilho da atmosfera atrás do planeta
    const glow = ctx.createRadialGradient(cx, cy, R - 6, cx, cy, R + cap * 1.1);
    glow.addColorStop(0, `rgba(${rgb},0.2)`);
    glow.addColorStop(0.3, `rgba(${rgb},0.07)`);
    glow.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, top - cap * 1.2, w, h - top + cap * 1.2);

    // anéis de órbita: uma linha fina e duas pontilhadas que giram. Só a parte que cabe na tela é desenhada.
    const move = reduce ? 0 : t * 5;
    const ring = (rad: number, gap: number, s: number, dir: number, holes = 0) => {
      const span = Math.asin(Math.min(1, (w / 2 + 12) / rad));
      const da = gap / rad;
      const shift = ((((move * dir) / rad) % da) + da) % da;
      for (let a = -span + shift; a < span; a += da) {
        if (holes && ((((a * rad - move) % holes) + holes) % holes) < holes * 0.12) continue;
        const y = cy - Math.cos(a) * rad;
        if (y > h + 4) continue;
        ctx.fillRect(Math.round(cx + Math.sin(a) * rad - s / 2), Math.round(y - s / 2), s, s);
      }
    };
    const r1 = R + Math.max(16, cap * 0.13);
    const r2 = R + cap * 0.36;
    const r3 = R + cap * 0.6;
    ctx.fillStyle = `rgba(${rgb},0.5)`;
    ring(r1, 3, 2, 1, 420);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ring(r2, 16, 2, 1);
    ctx.fillStyle = `rgba(${rgb2},0.3)`;
    ring(r3, 34, 3, -0.7);

    // o planeta: recalcula a superfície 12 vezes por segundo, em passos, como animação de pixel
    const step = reduce ? 0 : Math.floor(t * 12);
    const key = `${w}x${h}:${Math.round(env.scroll / 3)}:${Math.round(env.mouse.x / 6)}:${Math.round(env.mouse.y / 6)}`;
    if (step !== lastStep || key !== lastKey) {
      paint(env);
      lastStep = step;
      lastKey = key;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, Math.round(cx - (off.width * cell) / 2), top - cell, off.width * cell, off.height * cell);

    // satélites passando por cima, de uma borda à outra
    const c = Math.max(2, Math.round(cell * 0.5));
    const pass = (period: number, ph: number, rad: number, rows: string[]) => {
      const u = reduce ? ph : (t / period + ph) % 1;
      const ang = (u - 0.5) * 2 * Math.asin(Math.min(1, (w / 2 + 60) / rad));
      const x = cx + Math.sin(ang) * rad - (rows[0].length * c) / 2;
      const y = cy - Math.cos(ang) * rad - (rows.length * c) / 2;
      if (y > h) return;
      sprite(ctx, rows, x, y, c, `rgba(${rgb2},0.85)`, `rgba(${rgb},0.95)`);
      // luzinha piscando
      if (reduce || Math.floor(t * 2 + ph * 9) % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(Math.round(x) + Math.floor(rows[0].length / 2) * c, Math.round(y) - c, c, c);
      }
    };
    pass(50, 0.2, r2, SAT);
    pass(68, 0.62, r3, WIN);

    // foguete: de tempos em tempos um site "vai para o ar"
    if (!reduce) {
      if (rocket.t0 < 0 && t > rocket.next) {
        const dx = (Math.random() - 0.5) * w * 0.72;
        rocket.x = cx + dx;
        rocket.y0 = cy - Math.sqrt(Math.max(0, R * R - dx * dx));
        rocket.t0 = t;
      }
      if (rocket.t0 >= 0) {
        const k = t - rocket.t0;
        const rc = Math.max(2, Math.round(cell * 0.55));
        const rx = rocket.x - (5 * rc) / 2;
        // meio segundo de contagem (pisca no chão) e depois sobe acelerando
        const fly = Math.max(0, k - 0.6);
        const y = rocket.y0 - ROCKET.length * rc - fly * fly * h * 0.055;
        const life = fly / 2.4;
        const a = life < 0.55 ? 1 : Math.max(0, 1 - (life - 0.55) / 0.45);
        if (fly > 0 && Math.random() < 0.7) trail.push({ x: rocket.x + (Math.random() - 0.5) * rc * 3, y: y + ROCKET.length * rc + rc, born: t });
        if (k > 0.6 || Math.floor(k * 8) % 2 === 0) {
          sprite(ctx, ROCKET, rx, y, rc, `rgba(240,236,242,${0.9 * a})`, `rgba(${rgb2},${a})`);
          if (fly > 0) {
            ctx.fillStyle = `rgba(${rgb},${a})`;
            const fl = 1 + (Math.floor(t * 14) % 3);
            ctx.fillRect(Math.round(rx) + 2 * rc, Math.round(y) + ROCKET.length * rc, rc, fl * rc);
            ctx.fillStyle = `rgba(255,214,150,${a})`;
            ctx.fillRect(Math.round(rx) + 2 * rc, Math.round(y) + ROCKET.length * rc, rc, rc);
          }
        }
        if (life >= 1) {
          rocket.t0 = -1;
          rocket.next = t + 13 + Math.random() * 8;
        }
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        const age = (t - p.born) / 0.7;
        if (age > 1) {
          trail.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(${rgb},${(1 - age) * 0.5})`;
        const s = Math.max(2, Math.round(cell * 0.5));
        ctx.fillRect(Math.round(p.x), Math.round(p.y + age * 14), s, s);
      }
    }
    ctx.restore();
  }

  return { draw };
}
