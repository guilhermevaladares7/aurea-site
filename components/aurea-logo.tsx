import { cn } from "@/lib/utils";

/**
 * Logotipo AUREA redesenhado em SVG a partir da arte enviada.
 * Cada letra é um path, para dar para "digitar" o logo letra por letra.
 * Coordenadas no mesmo espaço da arte original (2000 × 1116).
 */

const A_PATH =
  "M380 671 L488 443 L525 443 L633 671 L594 671 L551 581 L506 613 L443 613 L417 671 Z M458 581 L551 581 L506 483 Z";

export const LETTERS = [
  { d: A_PATH, right: 633 },
  {
    d: "M652 443 H689 V572 C689 614 713 640 755 640 C797 640 821 614 821 572 V443 H858 V572 C858 637 816 675 755 675 C694 675 652 637 652 572 Z",
    right: 858,
  },
  {
    d: "M909 443 H1022 C1074 443 1104 469 1104 512 C1104 549 1082 570 1047 579 L1115 671 H1075 L1012 583 H946 V671 H909 Z M946 478 V583 L975 553 H1020 C1051 553 1067 539 1067 515 C1067 491 1051 478 1020 478 Z",
    right: 1115,
  },
  {
    d: "M1156 443 H1333 V478 H1193 V540 H1312 V572 H1193 V636 H1340 L1325 671 H1156 Z",
    right: 1340,
  },
  { d: A_PATH, right: 1620, dx: 988 },
];

export const LOGO_VIEWBOX = { x: 370, y: 430, w: 1350, h: 250 };

export function AureaLogo({
  letters = LETTERS.length,
  cursor = false,
  cursorBlink = false,
  className,
  title = "Aurea",
}: {
  letters?: number;
  cursor?: boolean;
  cursorBlink?: boolean;
  className?: string;
  title?: string;
}) {
  const shown = LETTERS.slice(0, letters);
  const cursorX = (shown.at(-1)?.right ?? LOGO_VIEWBOX.x) + 22;
  const { x, y, w, h } = LOGO_VIEWBOX;

  return (
    <svg
      viewBox={cursor ? `${x} ${y} ${w} ${h}` : `${x} ${y} ${1630 - x} ${h}`}
      role="img"
      aria-label={title}
      className={cn("block h-auto w-full fill-current", className)}
    >
      {shown.map((l, i) => (
        <path key={i} d={l.d} fillRule="evenodd" transform={l.dx ? `translate(${l.dx} 0)` : undefined} />
      ))}
      {cursor && (
        // cursor "sublinhado" (_): uma barra vertical pareceria a letra I
        <rect
          x={cursorX}
          y={640}
          width={74}
          height={31}
          className={cn("fill-primary", cursorBlink && "cursor-blink")}
        />
      )}
    </svg>
  );
}
