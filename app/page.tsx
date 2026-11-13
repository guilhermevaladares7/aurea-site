import { EndToast } from "@/components/end-toast";
import { CursorFx } from "@/components/fx";
import { Hero } from "@/components/hero";
import { MarqueeBand } from "@/components/marquee-band";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Starfield } from "@/components/starfield";

export default function Home() {
  return (
    <>
      <Starfield />
      <CursorFx variant="stars" />
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Services />
        <MarqueeBand />
      </main>
      <SiteFooter />
      <EndToast service="home" />
    </>
  );
}
