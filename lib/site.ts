// Dados de contato da Aurea.
export const SITE_URL = "https://auereastack.com.br";
export const WHATSAPP_NUMBER = "5533999657071"; // (33) 99965-7071
export const PHONE_LABEL = "(33) 99965-7071";
export const EMAIL = "glhrmvaladares@gmail.com";
export const GITHUB_URL = "https://github.com/guilhermevaladares7";
export const INSTAGRAM_URL = "https://www.instagram.com/guilherme_valladares/";
export const INSTAGRAM_HANDLE = "@guilherme_valladares";

// Contagem de visitas (Cloudflare Web Analytics). É o código público do site no painel da Cloudflare;
// enquanto estiver vazio, o site não carrega nada de contagem.
export const CF_ANALYTICS_TOKEN = "793efac542a64e9abb54fada531b7af8";

// Endereços de entrada por canal (bio do Instagram etc.): mostram a página inicial e contam à parte.
// Cada um precisa da sua pasta em app/, como app/ig.
export const ENTRY_PATHS = ["/ig"];

// Coleta de visitas e cliques para o painel da AFIO (função "metricas-afio" no Supabase).
// O site só envia (POST); ler os números exige o token da AFIO. Vazio desliga a coleta.
export const METRICAS_URL = "https://fdytdthvdkdilhkgpeov.supabase.co/functions/v1/metricas-afio";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
