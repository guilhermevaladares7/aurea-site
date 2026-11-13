"use client";

import Image from "next/image";
import { Rise } from "@/components/motion";
import { H2, ProjectLinks, Tags } from "@/components/service-sections";
import type { Project } from "@/lib/services";
import { asset } from "@/lib/asset";

/* ------------------------------------------------------------------ */
/* Projetos de sites                                                    */
/* ------------------------------------------------------------------ */

function Shot({ p }: { p: Project }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface-2">
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
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      )}
    </div>
  );
}

export function SiteProjects({ projects, intro }: { projects: Project[]; intro: string }) {
  const [first, ...rest] = projects;
  return (
    <section id="exemplos" className="scroll-mt-24 pt-32 lg:pt-44" aria-labelledby="exemplos-h">
      <div className="grid items-end gap-4 lg:grid-cols-2">
        <Rise>
          <h2 id="exemplos-h" className={H2}>
            Sites no ar
          </h2>
        </Rise>
        <Rise as="p" delay={0.06} className="max-w-[48ch] text-[18px] text-foreground lg:justify-self-end">
          {intro}
        </Rise>
      </div>

      <Rise className="mt-12">
        <article className="group grid gap-6 rounded-3xl bg-surface p-3 lg:grid-cols-[1.4fr_1fr]">
          <Shot p={first} />
          <div className="flex flex-col px-3 pb-3 lg:py-6">
            <h3 className="text-[30px] font-bold leading-tight">{first.name}</h3>
            <p className="mt-1 text-[16px] text-muted-foreground">{first.what}</p>
            <p className="mt-3 text-[17px] text-foreground">{first.did}</p>
            <Tags tags={first.tags} />
            <div className="mt-auto">
              <ProjectLinks p={first} />
            </div>
          </div>
        </article>
      </Rise>

      <ul className="mt-6 grid gap-6 md:grid-cols-2">
        {rest.map((p, i) => (
          <Rise as="li" key={p.name} delay={i * 0.08} className="group flex flex-col rounded-3xl bg-surface p-3">
            <Shot p={p} />
            <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
              <h3 className="text-[24px] font-bold leading-tight">{p.name}</h3>
              <p className="mt-1 text-[16px] text-muted-foreground">{p.what}</p>
              <p className="mt-3 text-[17px] text-foreground">{p.did}</p>
              <Tags tags={p.tags} />
              <div className="mt-auto">
                <ProjectLinks p={p} />
              </div>
            </div>
          </Rise>
        ))}
      </ul>
    </section>
  );
}
