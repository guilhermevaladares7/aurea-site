// Dados de contato da Aurea.
export const SITE_URL = "https://auereastack.com.br";
export const WHATSAPP_NUMBER = "5533999657071"; // (33) 99965-7071
export const PHONE_LABEL = "(33) 99965-7071";
export const EMAIL = "glhrmvaladares@gmail.com";
export const GITHUB_URL = "https://github.com/guilhermevaladares7";
export const INSTAGRAM_URL = "https://www.instagram.com/guilherme_valladares/";
export const INSTAGRAM_HANDLE = "@guilherme_valladares";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
