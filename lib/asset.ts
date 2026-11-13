// Caminho de um arquivo da pasta public/, já com o prefixo do site.
// No GitHub Pages o site fica em /aurea-site, e o next/image e o <video>
// não colocam esse prefixo sozinhos em caminhos de texto.
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
