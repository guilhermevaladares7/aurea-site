import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Agents, ScrollChat, TryChat } from "@/components/automacoes/sections";
import { AgentTerminal } from "@/components/demos/agent-terminal";
import { AiDemo } from "@/components/demos/ai-demo";
import { SiteDemo } from "@/components/demos/site-demo";
import { EndToast } from "@/components/end-toast";
import { Backdrop, CursorFx } from "@/components/fx";
import { Rise } from "@/components/motion";
import { HowItWorks } from "@/components/how/how-it-works";
import { H2, IncludesFaq, OtherServices, ServiceHero } from "@/components/service-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteProjects } from "@/components/sites/sections";
import { WhyAurea, WhySite } from "@/components/sites/why";
import { AdminShell, DashboardScreen } from "@/components/sistemas/admin-screens";
import { CalendaShowcase, PanelTour } from "@/components/sistemas/sections";
import { Starfield } from "@/components/starfield";
import { HOW } from "@/lib/how";
import { SERVICES, getService } from "@/lib/services";

// Só existem as três páginas geradas no build; qualquer outro endereço dá 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const url = `/servicos/${s.slug}/`;
  return {
    title: s.title,
    description: s.short,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Aurea",
      url,
      title: `${s.title} · Aurea`,
      description: s.short,
      // ao definir openGraph aqui, a imagem do layout não é herdada: repete a mesma
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Aurea: sites, sistemas e automações com IA" }],
    },
  };
}

export default async function ServicePage({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const how = HOW[s.slug];
  const fx = s.slug === "sites" ? "code" : s.slug === "sistemas" ? "pixels" : "bubbles";
  const backdrop = s.slug === "sites" ? "design" : s.slug === "sistemas" ? "pixels" : "flow";

  return (
    <div className={`${s.theme} flex min-h-full flex-1 flex-col`}>
      <Starfield count={160} />
      <Backdrop variant={backdrop} />
      <CursorFx variant={fx} />
      <SiteHeader />
      <main className="flex-1 overflow-x-clip px-4 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          {s.slug === "sites" && (
            <>
              <ServiceHero
                service={s}
                bit="Bora construir o seu site?"
                demo={
                  <div className="aspect-[4/3]">
                    <SiteDemo />
                  </div>
                }
              />
              <WhySite />
              <WhyAurea />
              <HowItWorks intro={how.intro} steps={how.steps} />
              <SiteProjects projects={s.projects} intro={s.projectsIntro} />
            </>
          )}

          {s.slug === "sistemas" && (
            <>
              <ServiceHero
                service={s}
                bit="Bem-vindo ao painel!"
                demo={
                  <div className="h-[420px] sm:h-[460px]">
                    <AdminShell active="dashboard" compact>
                      <DashboardScreen />
                    </AdminShell>
                  </div>
                }
              />
              <HowItWorks intro={how.intro} steps={how.steps} />
              <PanelTour />
              <CalendaShowcase />
            </>
          )}

          {s.slug === "automacoes" && (
            <>
              <ServiceHero
                service={s}
                bit="Alô! Sou o agente de atendimento."
                demo={
                  <div className="aspect-[4/4.4] sm:aspect-[4/3.6]">
                    <AiDemo large />
                  </div>
                }
              />
              <HowItWorks intro={how.intro} steps={how.steps} />
              <ScrollChat />
              <Agents />
              <TryChat />
              <section className="grid items-center gap-10 pt-32 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:pt-44" aria-labelledby="bastidor">
                <div>
                  <Rise>
                    <h2 id="bastidor" className={H2}>
                      Por trás da conversa
                    </h2>
                  </Rise>
                  <Rise as="p" delay={0.08} className="mt-6 max-w-[48ch] text-[19px] text-foreground">
                    Enquanto o cliente vê só a resposta no WhatsApp, o agente da Aurea está trabalhando: lê o cardápio,
                    confere a planilha, consulta a agenda, cria o pedido no painel e só então responde.
                  </Rise>
                  <Rise as="p" delay={0.12} className="mt-4 max-w-[48ch] text-[17px] text-muted-foreground">
                    Cada passo fica registrado, então você sempre sabe o que a IA fez e por quê.
                  </Rise>
                </div>
                <Rise delay={0.1}>
                  <AgentTerminal />
                </Rise>
              </section>
            </>
          )}

          <IncludesFaq service={s} />
          <OtherServices current={s.slug} />
        </div>
      </main>
      <SiteFooter />
      <EndToast service={s.slug} />
    </div>
  );
}
