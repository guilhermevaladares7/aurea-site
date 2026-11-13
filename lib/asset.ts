// Caminho de um arquivo da pasta public/, já com o prefixo do site.
// Hoje o site fica na raiz do domínio e o prefixo é vazio; se um dia voltar a
// ficar numa subpasta, o next/image e o <video> não colocam o prefixo sozinhos.
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
