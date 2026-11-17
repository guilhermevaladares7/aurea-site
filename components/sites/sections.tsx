"use client";

import Image from "next/image";
import { ProjectLinks, Section, Tags } from "@/components/service-sections";
import type { Project } from "@/lib/services";
import { asset } from "@/lib/asset";

/* ------------------------------------------------------------------ */
/* Projetos de sites                                                    */
/* ------------------------------------------------------------------ */

function Shot({ p }: { p: Project }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-2 ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 px-3 py-2" aria-hidden="true">
        <i className="h-2 w-2 rounded-full bg-white/20" />
        <i className="h-2 w-2 rounded-full bg-white/20" />
        <i className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-2 truncate text-[12px] text-muted-foreground">{p.live?.replace(/^https?:\/\//, "")}</span>
      </div>
      {p.image && (
        <div className="overflow-hidden">
          <Image
            src={asset(p.image)}
            alt={p.imageAlt ?? p.name}
            width={1440}
            height={900}
            sizes="(min-width: 1024px) 480px, 100vw"
            className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      )}
    </div>
  );
}

/** Os sites que já estão no ar: uma lista, cada um com a tela ao lado do que foi feito. */
export function SiteProjects({ projects, intro }: { projects: Project[]; intro: string }) {
  return (
    <Section id="exemplos" headId="exemplos-h" title="Sites no ar" intro={intro}>
      <ul className="divide-y divide-white/10">
        {projects.map((p) => (
          <li key={p.name} className="group grid gap-6 py-8 first:pt-0 last:pb-0 md:grid-cols-[1.2fr_1fr] md:gap-10">
            <Shot p={p} />
            <div className="flex flex-col">
              <h3 className="text-[24px] font-bold leading-tight tracking-[-0.01em]">{p.name}</h3>
              <p className="mt-1 text-[16px] text-muted-foreground">{p.what}</p>
              <p className="mt-4 text-[17px] leading-relaxed text-foreground/85">{p.did}</p>
              <Tags tags={p.tags} />
              <div className="mt-auto">
                <ProjectLinks p={p} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
