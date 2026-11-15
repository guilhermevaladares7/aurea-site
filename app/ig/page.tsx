import type { Metadata } from "next";
import Home from "../page";

// Endereço para a bio do Instagram: mostra a página inicial, mas entra na contagem de visitas
// como /ig, então dá para saber quantas pessoas vieram de lá. Fica fora do Google (a oficial é a "/").
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function InstagramEntry() {
  return <Home />;
}
