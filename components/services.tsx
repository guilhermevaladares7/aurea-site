import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AuriIcon } from "@/components/mascot";
import { PowerOn, Rise } from "@/components/motion";
import { ServiceDemo, Submark } from "@/components/submark";
import { Tilt } from "@/components/tilt";
import { SERVICES } from "@/lib/services";

export function Services() {
  return (
    <section id="servicos" className="scroll-mt-20 px-4 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-end gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Rise>
            <h2 className="text-[clamp(48px,7.4vw,116px)] text-foreground">
              <Submark word="serviços" wordClass="text-primary" />
            </h2>
          </Rise>
          <Rise delay={0.08} as="p" className="max-w-[44ch] text-[19px] text-foreground lg:pb-3">
            Três frentes, um só time: da primeira página da sua empresa na internet à IA que responde
            seus clientes de madrugada. Clique em cada uma para ver como funciona e exemplos reais.
          </Rise>
        </div>

        <ul className="mt-24 grid gap-x-5 gap-y-24 md:grid-cols-2 lg:mt-32 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const examples = s.projects.map((p) => p.name);
            return (
              <li key={s.slug} className={`${s.theme} ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                <PowerOn delay={i * 0.12} className="h-full origin-center">
                  <Tilt className="h-full">
                    <Link
                      href={`/servicos/${s.slug}`}
                      className={`group relative flex h-full flex-col rounded-3xl bg-surface p-3 ring-1 ring-tc/15 transition-[background-color,box-shadow] hover:bg-surface-2 hover:ring-tc/50 ${
                        i === 2 ? "md:flex-row md:items-stretch lg:flex-col" : ""
                      }`}
                    >
                      {/* o Auri, fantasiado para o serviço, espia de cima do card */}
                      <span
                        aria-hidden="true"
                        className="absolute -top-[66px] right-8 w-[78px] transition-transform duration-300 ease-out [transform:translateZ(40px)] group-hover:-translate-y-3"
                      >
                        <AuriIcon outfit={s.outfit} mood="happy" className="w-full" />
                      </span>

                      <div className={`shrink-0 rounded-2xl bg-tc/[0.08] p-3 ${i === 2 ? "md:w-1/2 lg:w-auto" : ""}`}>
                        <div className="aspect-[4/3]">
                          <ServiceDemo slug={s.slug} />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
                        <p className="text-[32px]" aria-hidden="true">
                          <Submark word={s.sub} wordClass="text-tc" />
                        </p>
                        <h3 className="mt-4 text-[21px] font-bold leading-tight text-foreground">{s.title}</h3>
                        <p className="mt-2 text-[17px] text-foreground/85">{s.short}</p>
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Inclui">
                          {s.tags.map((t) => (
                            <li key={t} className="rounded-full bg-surface-2 px-3 py-1 text-[14px] text-foreground/85">
                              {t}
                            </li>
                          ))}
                        </ul>
                        {examples.length > 0 && (
                          <p className="mt-5 text-[15px] text-muted-foreground">
                            Exemplos: <span className="text-foreground/85">{examples.join(", ")}</span>
                          </p>
                        )}
                        <span className="mt-auto flex items-center justify-between pt-7 text-[17px] font-semibold text-tc">
                          Ver como funciona e exemplos
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-tc text-tc-ink transition-transform duration-300 group-hover:rotate-45">
                            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </span>
                      </div>
                    </Link>
                  </Tilt>
                </PowerOn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
