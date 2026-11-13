import { AureaLogo } from "@/components/aurea-logo";
import { AiDemo } from "@/components/demos/ai-demo";
import { PanelDemo } from "@/components/demos/panel-demo";
import { SiteDemo } from "@/components/demos/site-demo";
import type { ServiceSlug } from "@/lib/services";
import { cn } from "@/lib/utils";

/** Sub-marca no estilo "AUREA sites": logo + palavra em itálico serifado. */
export function Submark({ word, className, wordClass }: { word: string; className?: string; wordClass?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-[0.22em] leading-none", className)}>
      <span className="inline-block w-[3.5em] translate-y-[0.05em] text-foreground">
        <AureaLogo title="Aurea" />
      </span>
      <span className={cn("submark text-[1.12em]", wordClass)}>{word}</span>
    </span>
  );
}

/** A demonstração ao vivo de cada serviço. */
export function ServiceDemo({ slug, large = false }: { slug: ServiceSlug; large?: boolean }) {
  if (slug === "sites") return <SiteDemo />;
  if (slug === "sistemas") return <PanelDemo />;
  return <AiDemo large={large} />;
}
