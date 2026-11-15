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
    <section id="parceria" style={AFIO_BLUE} className="scroll-mt-24 px-4 pt-24 sm:px-8 lg:pt-28" aria-labelledby="parceria-h">
      <div className="mx-auto max-w-[1120px]">
        <Rise>
          <h2 id="parceria-h" className="mb-5 text-[clamp(24px,2.4vw,32px)] text-foreground">
            <Submark word="parcerias" wordClass="text-tc" />
          </h2>
        </Rise>
        <Rise>
          <a
            href={AFIO_CONECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-7 rounded-3xl bg-surface p-5 ring-1 ring-tc/15 transition-[background-color,box-shadow] hover:bg-surface-2 hover:ring-tc/50 sm:p-7 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-10 lg:p-9"
          >
            <div>
              <h3 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(26px,2.7vw,38px)] font-extrabold leading-none tracking-[-0.035em]">
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
              <p className="mt-5 max-w-[36ch] text-[18px] leading-snug text-foreground">
                Vários números de WhatsApp num painel só, sem QR code. Cada atendente entra com o próprio login.
              </p>
              <span className="mt-6 flex items-center gap-4 text-[17px] font-semibold text-tc">
                Conhecer o AFIO conect
                <span className="grid h-10 w-10 place-items-center rounded-full bg-tc text-tc-ink transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="sr-only">(abre o site da AFIO em outra aba)</span>
              </span>
            </div>

            {/* a tela do atendente do AFIO conect, em miniatura e animada */}
            <AfioScreen />
          </a>
        </Rise>
      </div>
    </section>
  );
}
