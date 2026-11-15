import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { AureaLogo } from "@/components/aurea-logo";
import { Rise } from "@/components/motion";
import { AfioScreen } from "@/components/partner-screen";
import { Submark } from "@/components/submark";

const AFIO_CONECT_URL = "https://afioapp.com.br/conecta";

/** Logo da AFIO (o mesmo desenho usado em afioapp.com.br). */
function AfioLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1704 360" fill="currentColor" role="img" aria-label="AFIO" className={className}>
      <defs>
        <mask id="afio-slit" maskUnits="userSpaceOnUse" x="0" y="0" width="1704" height="360">
          <rect width="1704" height="360" fill="#fff" />
          <path d="M1590 201L1710 172V184L1590 213Z" fill="#000" />
        </mask>
      </defs>
      <path d="M258 16H388L527 343H440L420 297H216L262 233H392L330 80H310L118 343H22Z" />
      <path d="M582 16H960L918 88H665V343H582Z" />
      <path d="M712 155H923L882 220H667Z" />
      <path d="M1053 16H1140V343H1053Z" />
      <path
        d="M1346 16H1580A110 110 0 0 1 1690 126V233A110 110 0 0 1 1580 343H1346A110 110 0 0 1 1236 233V126A110 110 0 0 1 1346 16ZM1384 80H1538A70 70 0 0 1 1608 150V210A70 70 0 0 1 1538 280H1384A70 70 0 0 1 1314 210V150A70 70 0 0 1 1384 80Z"
        fillRule="evenodd"
        mask="url(#afio-slit)"
      />
    </svg>
  );
}

// azul da identidade do AFIO conect
const AFIO_BLUE = { ["--tc" as string]: "#6ea8ff", ["--tc-ink" as string]: "#06142e" } as CSSProperties;

/** Parceria com a AFIO: o AFIO conect, central de números de WhatsApp. */
export function Partner() {
  return (
    <section id="parceria" style={AFIO_BLUE} className="scroll-mt-24 px-4 pt-20 sm:px-8 lg:pt-24" aria-labelledby="parceria-h">
      <div className="mx-auto max-w-[980px]">
        <Rise>
          <h2 id="parceria-h" className="mb-4 text-[20px] text-foreground/80">
            <Submark word="parcerias" wordClass="text-tc" />
          </h2>
        </Rise>
        <Rise>
          <a
            href={AFIO_CONECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-5 rounded-2xl bg-surface/70 p-4 ring-1 ring-white/8 transition-[background-color,box-shadow] hover:bg-surface hover:ring-tc/40 sm:flex-row sm:items-center sm:gap-7 sm:p-5"
          >
            {/* a tela do atendente do AFIO conect, em miniatura e animada */}
            <div className="h-[152px] w-[240px] shrink-0 overflow-hidden rounded-xl">
              <div className="w-[600px] origin-top-left scale-[0.4]">
                <AfioScreen />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[22px] font-extrabold leading-none tracking-[-0.03em] sm:text-[24px]">
                <span className="inline-block w-[3.4em] text-foreground">
                  <AureaLogo title="Aurea" />
                </span>
                <span aria-hidden="true" className="text-muted-foreground">×</span>
                <span className="sr-only">e</span>
                <span className="inline-flex items-baseline gap-[0.2em]">
                  <AfioLogo className="h-[0.72em] w-auto self-center text-foreground" />
                  <span className="submark text-tc">conect</span>
                </span>
              </h3>
              <p className="mt-2.5 max-w-[44ch] text-[16px] leading-snug text-muted-foreground">
                Vários números de WhatsApp num painel só, sem QR code.
              </p>
            </div>

            <span className="flex shrink-0 items-center gap-3 text-[15px] font-semibold text-tc">
              Conhecer
              <span className="grid h-9 w-9 place-items-center rounded-full bg-tc/15 text-tc ring-1 ring-tc/40 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="sr-only">o AFIO conect (abre o site da AFIO em outra aba)</span>
            </span>
          </a>
        </Rise>
      </div>
    </section>
  );
}
