// Uma função só, com dois usos:
//   GET  ?dias=7|30|90 com Authorization: Bearer <token>  → a API que o servidor da AFIO lê
//   POST com { pagina, tipo, alvo?, ref?, de? }            → a coleta enviada pelo site (components/metrics.tsx)
import { bancoSupabase } from "../_shared/banco.ts";
import { criarApi, criarColeta } from "../_shared/metricas.ts";

const banco = bancoSupabase((nome) => Deno.env.get(nome));
const api = criarApi({ token: Deno.env.get("METRICAS_AFIO_TOKEN"), banco });
const coleta = criarColeta({ segredo: Deno.env.get("METRICAS_SEGREDO"), banco });

Deno.serve((req) => (req.method === "POST" ? coleta(req) : api(req)));
