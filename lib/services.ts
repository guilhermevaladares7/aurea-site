// Conteúdo dos três serviços da Aurea: usado nos cards da home e nas páginas de detalhe.
import type { Outfit } from "@/components/mascot";

export type ServiceSlug = "sites" | "sistemas" | "automacoes";

export type Project = {
  name: string;
  what: string;
  /** o que foi feito, em uma frase */
  did: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  /** módulos/telas, para sistemas sem print público */
  modules?: string[];
  live?: string;
  repo?: string;
  note?: string;
};

export type Service = {
  slug: ServiceSlug;
  sub: string;
  title: string;
  short: string;
  lead: string;
  tags: string[];
  cta: string;
  theme: string; // classe .theme-*
  outfit: Outfit; // roupa do Auri neste serviço
  includes: string[];
  projects: Project[];
  projectsIntro: string;
  faq: { q: string; a: string }[];
};

const PAGES = "https://guilhermevaladares7.github.io";

export const SERVICES: Service[] = [
  {
    slug: "sites",
    sub: "sites",
    title: "Sites institucionais",
    short: "Sua empresa apresentada num site rápido, bonito no celular e fácil de achar no Google.",
    lead:
      "Um site feito para a sua empresa, não um modelo pronto com o seu nome. Ele abre rápido no celular, explica o que você faz em poucos segundos e leva o cliente direto para o WhatsApp.",
    tags: ["Até 5 páginas", "Bonito no celular", "Aparece no Google", "Botão de WhatsApp"],
    cta: "Quero um site",
    theme: "theme-sites",
    outfit: "hardhat",
    includes: [
      "Até 5 páginas (início, sobre, serviços ou produtos, contato…)",
      "Bonito e fácil de usar no celular, no tablet e no computador",
      "Botão de WhatsApp e formulário de contato",
      "Domínio e hospedagem configurados",
      "Configurado para aparecer no Google: título, descrição e cadastro da empresa",
      "Troca de textos e fotos todo mês no plano",
    ],
    projectsIntro: "Alguns sites que eu fiz e que estão no ar agora:",
    projects: [
      {
        name: "Áurea Outdoor",
        what: "Móveis sofisticados para piscinas, varandas e jardins, sob encomenda.",
        did: "Catálogo com os modelos, escolha de cor da estrutura e da trama, e pedido de orçamento pelo WhatsApp.",
        tags: ["Catálogo", "Orçamento pelo WhatsApp"],
        image: "/projetos/aureaoutdoor.jpg",
        imageAlt: "Página inicial do site da Áurea Outdoor com uma mesa redonda de madeira no jardim",
        live: `${PAGES}/aureaoutdoor/`,
      },
      {
        name: "Biofarma",
        what: "Farmácia de manipulação no Centro de Caratinga.",
        did: "Site com a farmácia, os produtos, endereço e horário à vista e atendimento direto pelo WhatsApp.",
        tags: ["Domínio próprio", "Atendimento pelo WhatsApp"],
        image: "/projetos/biofarma.jpg",
        imageAlt: "Página inicial do site da Biofarma com a foto do balcão da farmácia",
        live: "https://biofarmacaratinga.com.br/",
      },
      {
        name: "TechSur Soluções em TI",
        what: "Consultoria de TI para empresas de Caratinga e região.",
        did: "Site com os serviços, nuvem privada e uma calculadora que mostra quanto custa uma parada no sistema.",
        tags: ["Página de serviços", "Calculadora"],
        image: "/projetos/techsur-mg.jpg",
        imageAlt: "Página inicial do site da TechSur com um rack de servidores ilustrado",
        live: `${PAGES}/site-techsur-mg/`,
      },
    ],
    faq: [
      { q: "Como é feito o orçamento?", a: "Cada site é diferente, então o valor sai depois de uma conversa rápida sobre a sua empresa. Você recebe uma proposta por escrito com o que vai ser feito, o prazo, o valor e se existe algum custo mensal. Sem compromisso." },
      { q: "Quanto tempo leva?", a: "Um site de até 5 páginas costuma ficar pronto em uma a duas semanas, dependendo de quando chegam os textos e as fotos." },
      { q: "Preciso ter domínio e hospedagem?", a: "Não. Eu registro e configuro para você, e eles ficam no seu nome." },
      { q: "Consigo mudar o site depois?", a: "Sim. No plano mensal você me manda as mudanças pelo WhatsApp e eu atualizo." },
      { q: "O site aparece no Google?", a: "Sim. Eu configuro título, descrição e o cadastro no Google para a sua empresa ser encontrada pelo nome e pela cidade." },
    ],
  },
  {
    slug: "sistemas",
    sub: "sistemas",
    title: "Sistemas e painéis administrativos",
    short: "Vendas, clientes, agenda, entregas e caixa num painel só seu, com login e relatórios que se atualizam sozinhos.",
    lead:
      "Quando a planilha e o caderno não dão mais conta, um sistema feito sob medida organiza o dia a dia: cada pessoa entra com o seu login, vê o que precisa, as regras da loja são aplicadas sozinhas e o fechamento sai pronto.",
    tags: ["Painel com os números", "Login para cada pessoa", "Relatórios", "Sob medida"],
    cta: "Quero um sistema",
    theme: "theme-sistemas",
    outfit: "tie",
    includes: [
      "Painel com os números do dia, da semana e do mês",
      "Login com níveis de acesso (dono, gerente, atendente…)",
      "Cadastros sob medida: clientes, pedidos, agenda, estoque",
      "Regras do negócio aplicadas sozinhas (desconto, parcelas, frete)",
      "Relatórios e exportação para Excel",
      "Backup diário e hospedagem configurada",
      "Integração com WhatsApp e com o seu site",
      "Funciona no computador e no celular, sem instalar nada",
    ],
    projectsIntro: "Um sistema que já roda no dia a dia de uma loja de verdade:",
    projects: [
      {
        name: "Calenda",
        what: "Sistema de gestão da Calenda Móveis.",
        did: "Calculadora de venda que aplica as regras de desconto, parcelas e entrega da loja, orçamentos, clientes, agenda, entregas, assistência, histórico e fechamento de caixa com planilhas para o Excel.",
        tags: ["Abre no navegador", "Regras da loja", "Exporta para Excel", "Login"],
        image: "/projetos/calenda-44.jpg",
        imageAlt: "Tela de fechamento do Calenda com vendas por forma de pagamento",
        note: "Código privado: o sistema usa dados reais da loja.",
      },
    ],
    faq: [
      { q: "Como é feito o orçamento?", a: "O valor depende do que o sistema precisa fazer, por isso ele sai depois que eu entendo a rotina da sua empresa. Você recebe uma proposta por escrito com o que vai ser feito, o prazo, o valor e se existe algum custo mensal. Sem compromisso." },
      { q: "Quanto tempo leva?", a: "Depende do tamanho do sistema, e o prazo de cada parte vem na proposta. Como ele é entregue por partes, a equipe começa a usar antes de ficar tudo pronto." },
      { q: "Funciona no celular?", a: "Sim. O painel abre no navegador do computador e do celular, sem instalar nada." },
      { q: "E as minhas planilhas de hoje?", a: "Eu importo os dados delas para o sistema na implantação, para ninguém precisar digitar tudo de novo." },
      { q: "Quem pode ver o quê?", a: "Cada pessoa tem o seu login, e você define o que cada uma pode ver e mexer." },
      { q: "E se eu precisar de uma tela nova depois?", a: "O sistema cresce com a empresa. Novas telas e relatórios entram como evolução do plano." },
      { q: "Meus dados ficam seguros?", a: "Ficam num banco de dados com acesso por login, conexão segura e backup todos os dias." },
    ],
  },
  {
    slug: "automacoes",
    sub: "automações",
    title: "Automações com IA",
    short: "Uma IA que atende no WhatsApp, entende áudio, anota pedidos e avisa a equipe, a qualquer hora.",
    lead:
      "A IA responde seus clientes no WhatsApp com as informações da sua empresa, entende texto e áudio, anota pedidos, marca horários e chama alguém da equipe quando precisa. Tudo o que ela faz fica registrado no seu painel.",
    tags: ["Atende no WhatsApp", "Entende áudio", "Anota pedidos", "Marca horários"],
    cta: "Quero automatizar",
    theme: "theme-automacoes",
    outfit: "headset",
    includes: [
      "Atendente de IA no WhatsApp, 24 horas",
      "Entende mensagens de texto e de áudio",
      "Anota pedidos e marca horários sozinha",
      "Chama uma pessoa da equipe quando o cliente pede",
      "Integração com planilha, agenda, CRM ou sistema próprio",
      "Relatório mensal das conversas",
    ],
    projectsIntro: "Os primeiros projetos de automação estão sendo montados agora. Enquanto isso, veja na prática o que a IA faz em cada situação:",
    projects: [],
    faq: [
      { q: "Como é feito o orçamento?", a: "O valor depende do que a IA vai fazer e com o que ela vai se conectar, por isso ele sai depois de uma conversa sobre o seu atendimento. Você recebe uma proposta por escrito com o que vai ser feito, o prazo, o valor e se existe algum custo mensal. Sem compromisso." },
      { q: "Quanto tempo leva para começar?", a: "O prazo vem na proposta. Antes de atender clientes de verdade, a IA passa pelos testes e só entra no ar com a sua aprovação." },
      { q: "A IA pode inventar coisa?", a: "Ela responde só com as informações que você aprovou. Quando não sabe, ela avisa o cliente e chama a equipe." },
      { q: "Preciso trocar de número?", a: "Não. A IA funciona no WhatsApp Business que a empresa já usa." },
      { q: "E se eu quiser responder eu mesmo?", a: "Você pode entrar em qualquer conversa a qualquer momento, e a IA para de responder naquela conversa." },
      { q: "Ela entende áudio mesmo?", a: "Sim. Ela transcreve o áudio, repete o pedido para o cliente confirmar e só então anota." },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
