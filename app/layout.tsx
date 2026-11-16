import type { Metadata } from "next";
import { Archivo, Newsreader, Pixelify_Sans } from "next/font/google";
import { Metrics } from "@/components/metrics";
import { PageLoader } from "@/components/page-loader";
import Script from "next/script";
import { CF_ANALYTICS_TOKEN, SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic"],
});

// só para o mascote em pixel art e o terminal do agente
const pixelify = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // base dos links absolutos (imagem de prévia, canonical) quando o site é compartilhado
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aurea · Sites, sistemas e automações com IA",
    template: "%s · Aurea",
  },
  description:
    "A Aurea cria sites institucionais, sistemas e painéis administrativos e automações com IA para pequenas e médias empresas.",
  // a imagem de prévia vem de app/opengraph-image.png
  openGraph: { type: "website", locale: "pt_BR", siteName: "Aurea", url: "/" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${archivo.variable} ${newsreader.variable} ${pixelify.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* sem JavaScript, a tela de carregando não teria como sumir */}
        <noscript>
          <style>{".page-loader{display:none!important}"}</style>
        </noscript>
        <PageLoader />
        {children}
        {/* visitas e cliques para o painel da AFIO */}
        <Metrics />
        {/* contagem de visitas, sem cookies; conta também a troca de página dentro do site */}
        {CF_ANALYTICS_TOKEN && (
          <Script
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_ANALYTICS_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
