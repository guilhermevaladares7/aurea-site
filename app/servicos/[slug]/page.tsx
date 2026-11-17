import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScrollChat, TryChat } from "@/components/automacoes/sections";
import { AiDeskDemo } from "@/components/demos/ai-desk";
import { SiteBuildDemo } from "@/components/demos/site-build";
import { EndToast } from "@/components/end-toast";
import { Backdrop } from "@/components/fx";
import { HowItWorks } from "@/components/how/how-it-works";
import { Faq, Includes, OtherServices, ServiceHero } from "@/components/service-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CodeToSite } from "@/components/sites/code-to-site";
import { SiteProjects } from "@/components/sites/sections";
import { WhyAurea } from "@/components/sites/why";
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
  const backdrop = s.slug === "sites" ? "design" : s.slug === "sistemas" ? "pixels" : "flow";

  return (
    <div data-page={s.slug} className={`${s.theme} flex min-h-full flex-1 flex-col`}>
      <Starfield count={160} warm={s.slug === "sites" ? "#8fd0ff" : undefined} />
      <Backdrop variant={backdrop} />
      <SiteHeader />
      <main className="flex-1 overflow-x-clip px-4 sm:px-8">
        <div className="mx-auto max-w-[1240px]">
          {s.slug === "sites" && (
            <>
              <ServiceHero
                service={s}
                bit="Bora construir o seu site?"
                demo={
                  <div className="aspect-[4/3.6] sm:aspect-[4/3]">
                    <SiteBuildDemo />
                  </div>
                }
              />
              <Includes service={s} />
              <HowItWorks intro={how.intro} steps={how.steps} />
              <CodeToSite />
              <SiteProjects projects={s.projects} intro={s.projectsIntro} />
              <WhyAurea />
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
              <Includes service={s} />
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
                  <div className="h-[520px] sm:h-[500px]">
                    <AiDeskDemo />
                  </div>
                }
              />
              <Includes service={s} />
              <HowItWorks intro={how.intro} steps={how.steps} />
              <ScrollChat />
              <TryChat />
            </>
          )}

          <Faq service={s} />
          <OtherServices current={s.slug} />
        </div>
      </main>
      <SiteFooter />
      <EndToast service={s.slug} />
    </div>
  );
}
