import { PricingSection, type PricingPlan } from "@/components/ui/pricing";
import { whatsappLink } from "@/lib/site";

// Valores de exemplo — ajuste para a sua tabela real antes de publicar.
const plans: PricingPlan[] = [
  {
    name: "Site",
    price: "89",
    yearlyPrice: "71",
    period: "mês",
    note: "implantação à parte",
    description: "Para a empresa que precisa aparecer bem na internet.",
    features: [
      "Site institucional de até 5 páginas",
      "Domínio e hospedagem inclusos",
      "Formulário e botão de WhatsApp",
      "Troca de textos e fotos todo mês",
      "SEO básico para o Google",
    ],
    buttonText: "Quero um site",
    href: whatsappLink("Olá! Tenho interesse no plano Site da Aurea."),
  },
  {
    name: "Sistema",
    price: "249",
    yearlyPrice: "199",
    period: "mês",
    note: "implantação à parte",
    description: "Para organizar vendas, pedidos e clientes num painel só seu.",
    features: [
      "Painel administrativo sob medida",
      "Login com níveis de acesso",
      "Relatórios e gráficos em tempo real",
      "Backup diário",
      "Suporte em até 24 h úteis",
    ],
    buttonText: "Quero um sistema",
    href: whatsappLink("Olá! Tenho interesse no plano Sistema da Aurea."),
    isPopular: true,
  },
  {
    name: "Automação IA",
    price: "349",
    yearlyPrice: "279",
    period: "mês",
    note: "implantação à parte",
    description: "Para atender mais sem contratar mais.",
    features: [
      "Atendente de IA no WhatsApp",
      "Entende texto e áudio",
      "Integração com planilha, CRM e agenda",
      "Treinada com as informações da sua empresa",
      "Suporte prioritário",
    ],
    buttonText: "Quero automatizar",
    href: whatsappLink("Olá! Tenho interesse no plano Automação IA da Aurea."),
  },
];

export function Plans() {
  return (
    <section aria-label="Planos" className="scroll-mt-16 pt-16 lg:pt-28" id="planos">
      <PricingSection
        plans={plans}
        title={
          <>
            <span className="wordmark">aurea</span>{" "}
            <span className="submark text-[1.1em] font-normal">planos</span>
          </>
        }
        description={"Preço mensal, sem fidelidade escondida.\nManutenção e suporte já vêm dentro."}
      />
    </section>
  );
}
