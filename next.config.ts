import type { NextConfig } from "next";

// No GitHub Pages o site fica em guilhermevaladares7.github.io/aurea-site,
// e o Pages só serve arquivos prontos. O workflow de deploy liga GITHUB_PAGES=true;
// no seu computador (npm run dev / build) nada muda.
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/aurea-site" : "";

const nextConfig: NextConfig = {
  // O site é todo estático: sem Cache Components (o export estático do Pages não aceita)
  ...(pages ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    // o otimizador de imagens precisa de servidor; no Pages as imagens vão como estão
    unoptimized: pages,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
