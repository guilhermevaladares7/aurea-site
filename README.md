# Aurea

Site da **Aurea**: sites institucionais, sistemas e painéis administrativos e automações com IA para pequenas e médias empresas.

Feito com Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn e Framer Motion.

## O que tem no site

- **Início:** o nome AUREA se monta com pixels e se desfaz ao rolar, com o Auri (o mascote em pixel art) em cima.
- **Serviços:** uma página para cada um, cada uma com o seu tema:
  - `/servicos/sites` (azul): código HTML/CSS que se escreve com a rolagem e sites no ar.
  - `/servicos/sistemas` (laranja): vídeo do Calenda, passeio pelas telas de um painel e projetos.
  - `/servicos/automacoes` (verde): WhatsApp que conversa com a rolagem, os 4 agentes e um chat para testar.
- **Planos** com preço mensal/anual.

## Rodar no computador

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Para gerar a versão de produção:

```bash
npm run build
npm start
```

## Publicação (GitHub Pages)

O site fica em **https://guilhermevaladares7.github.io/aurea-site/**.

A cada push na `main`, o workflow `.github/workflows/deploy.yml` gera a versão estática (com `GITHUB_PAGES=true`) e publica no GitHub Pages. O andamento aparece na aba **Actions** do repositório.

Para testar a versão do Pages no computador:

```bash
GITHUB_PAGES=true npm run build
```

O resultado fica na pasta `out/`. Imagens e vídeos da pasta `public/` devem usar `asset("/caminho")` (de `lib/asset.ts`) para funcionar debaixo de `/aurea-site`.

## Onde mudar as coisas

| O quê | Arquivo |
| --- | --- |
| WhatsApp, e-mail, GitHub e Instagram | `lib/site.ts` |
| Textos, passos, projetos e perguntas de cada serviço | `lib/services.ts` |
| Planos e preços | `components/plans.tsx` |
| Cores e temas | `app/globals.css` |
| O mascote (roupas e expressões) | `components/mascot.tsx` |
| Prints e vídeo dos projetos | `public/projetos/` |
