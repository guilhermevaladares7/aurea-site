// Conteúdo dos três serviços da Aurea: usado nos cards da home e nas páginas de detalhe.
import type { BitMood, Outfit } from "@/components/mascot";

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

export type Step = {
  title: string;
  text: string;
  /** como o Auri aparece nesse passo */
  outfit: Outfit;
  mood: BitMood;
  bit: string;
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
  steps: Step[];
  includes: string[];
  projects: Project[];
  projectsIntro: string;
  faq: { q: string; a: string }[];
};

const GH = "https://github.com/guilhermevaladares7";
const PAGES = "https://guilhermevaladares7.github.io";

export const SERVICES: Service[] = [
  {
    slug: "sites",
    sub: "sites",
    title: "Sites institucionais",
    short: "Sua empresa apresentada num site rápido, bonito no celular e fácil de achar no Google.",
    lead:
      "Um site feito para a sua empresa, não um modelo pronto com o seu nome. Ele abre rápido no celular, explica o que você faz em poucos segundos e leva o cliente direto para o WhatsApp.",
    tags: ["Até 5 páginas", "Responsivo", "SEO", "Botão de WhatsApp"],
    cta: "Quero um site",
    theme: "theme-sites",
    outfit: "hardhat",
    steps: [
      {
        title: "Conversa",
        text: "Você me conta o que a empresa faz, para quem vende e o que o cliente precisa saber. Fotos, logo e textos que você já tem entram aqui.",
        outfit: "headset",
        mood: "happy",
        bit: "Pode mandar áudio, eu anoto tudo.",
      },
      {
        title: "Primeira versão",
        text: "Monto o site pensando primeiro no celular e te mando um link para abrir no seu próprio telefone.",
        outfit: "hardhat",
        mood: "work",
        bit: "Obra em andamento!",
      },
      {
        title: "Ajustes",
        text: "Você pede as mudanças de texto, foto e ordem das seções. Ajusto até ficar com a cara da empresa.",
        outfit: "beret",
        mood: "focus",
        bit: "Mais um retoque aqui…",
      },
      {
        title: "No ar",
        text: "Publico no seu domínio, cadastro no Google e deixo o botão de WhatsApp e o formulário funcionando.",
        outfit: "crown",
        mood: "wave",
        bit: "No ar! Pode compartilhar.",
      },
    ],
    includes: [
      "Até 5 páginas (início, sobre, serviços ou produtos, contato…)",
      "Layout feito para celular, tablet e computador",
      "Botão de WhatsApp e formulário de contato",
      "Domínio e hospedagem configurados",
      "SEO básico: título, descrição e cadastro no Google",
      "Troca de textos e fotos todo mês no plano",
    ],
    projectsIntro: "Alguns sites que eu fiz e que estão no ar agora:",
    projects: [
      {
        name: "Áurea Outdoor",
        what: "Móveis sofisticados para piscinas, varandas e jardins, sob encomenda.",
        did: "Catálogo com os modelos, escolha de cor da estrutura e da trama, e pedido de orçamento pelo WhatsApp.",
        tags: ["HTML", "CSS", "JavaScript", "Catálogo"],
        image: "/projetos/aureaoutdoor.jpg",
        imageAlt: "Página inicial do site da Áurea Outdoor com uma mesa redonda de madeira no jardim",
        live: `${PAGES}/aureaoutdoor/`,
        repo: `${GH}/aureaoutdoor`,
      },
      {
        name: "Biofarma",
        what: "Farmácia de manipulação no Centro de Caratinga.",
        did: "Site com a farmácia, os produtos, endereço e horário à vista e atendimento direto pelo WhatsApp.",
        tags: ["HTML", "CSS", "JavaScript", "Domínio próprio"],
        image: "/projetos/biofarma.jpg",
        imageAlt: "Página inicial do site da Biofarma com a foto do balcão da farmácia",
        live: "https://biofarmacaratinga.com.br/",
        repo: `${GH}/biofarma-site`,
      },
      {
        name: "TechSur Soluções em TI",
        what: "Consultoria de TI para empresas de Caratinga e região.",
        did: "Site com os serviços, nuvem privada e uma calculadora que mostra quanto custa uma parada no sistema.",
        tags: ["HTML", "CSS", "JavaScript", "Calculadora"],
        image: "/projetos/techsur-mg.jpg",
        imageAlt: "Página inicial do site da TechSur com um rack de servidores ilustrado",
        live: `${PAGES}/site-techsur-mg/`,
        repo: `${GH}/site-techsur-mg`,
      },
    ],
    faq: [
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
    tags: ["Dashboard", "Login e permissões", "Relatórios", "Sob medida"],
    cta: "Quero um sistema",
    theme: "theme-sistemas",
    outfit: "tie",
    steps: [
      {
        title: "Entender o processo",
        text: "Olho como vocês trabalham hoje: planilhas, papel, grupos de WhatsApp. Daí sai a lista do que o sistema precisa fazer.",
        outfit: "detective",
        mood: "think",
        bit: "Hmm… essa planilha esconde segredos.",
      },
      {
        title: "Telas primeiro",
        text: "Desenho as telas principais e você aprova antes de eu escrever o sistema de verdade.",
        outfit: "beret",
        mood: "focus",
        bit: "Primeiro o desenho, depois o código.",
      },
      {
        title: "Entregas por partes",
        text: "O sistema vai ficando pronto por partes, e você já testa cada uma com dados reais.",
        outfit: "laptop",
        mood: "work",
        bit: "Compilando a parte 2 de 4…",
      },
      {
        title: "Implantação",
        text: "Coloco no ar, migro os dados das planilhas, treino a equipe e deixo backup diário ligado.",
        outfit: "grad",
        mood: "happy",
        bit: "Aula dada! Agora é com vocês.",
      },
    ],
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
    projectsIntro: "Sistemas que eu já desenvolvi:",
    projects: [
      {
        name: "Calenda",
        what: "Sistema de gestão da Calenda Móveis.",
        did: "Calculadora de venda que aplica as regras de desconto, parcelas e entrega da loja, orçamentos, clientes, agenda, entregas, assistência, histórico e fechamento de caixa com planilhas para o Excel.",
        tags: ["Painel web", "Regras da loja", "Excel", "Login"],
        image: "/projetos/calenda-44.jpg",
        imageAlt: "Tela de fechamento do Calenda com vendas por forma de pagamento",
        note: "Código privado: o sistema usa dados reais da loja.",
      },
      {
        name: "Biofarma API",
        what: "O sistema por trás do site da Biofarma.",
        did: "Recebe os pedidos de orçamento de receitas, controla o status de cada orçamento e avisa pelo WhatsApp.",
        tags: ["Java", "Spring Boot", "API REST", "WhatsApp"],
        modules: ["Orçamentos", "Status do orçamento", "Aviso no WhatsApp", "Dados da farmácia"],
        repo: `${GH}/biofarma-api`,
      },
      {
        name: "Sistema de Informação Hospitalar",
        what: "Gestão de um hospital, do cadastro à alta.",
        did: "Pacientes, profissionais, consultas, emergências, cirurgias, internações, quartos e o histórico médico de cada paciente.",
        tags: ["Java 21", "Spring Boot", "MySQL", "Testes"],
        modules: ["Pacientes", "Consultas", "Emergência", "Cirurgias", "Internações", "Quartos", "Histórico médico"],
        repo: `${GH}/sistema-hospitalar`,
        note: "Trabalho da faculdade (PUC Minas), feito em dupla.",
      },
      {
        name: "Catálogo de produtos",
        what: "Uma tela rápida para achar produtos.",
        did: "Lista os produtos de uma API, busca por nome e abre os detalhes sem recarregar a página.",
        tags: ["React", "Vite", "API REST"],
        modules: ["Lista de produtos", "Busca por nome", "Detalhe do produto"],
        repo: `${GH}/catalogo-produto`,
        note: "Trabalho da faculdade (PUC Minas).",
      },
    ],
    faq: [
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
    tags: ["IA", "WhatsApp", "Planilhas e CRM", "Agenda"],
    cta: "Quero automatizar",
    theme: "theme-automacoes",
    outfit: "headset",
    steps: [
      {
        title: "Escolher o que automatizar",
        text: "Listamos as perguntas e tarefas que mais tomam tempo: preço, horário, pedido, agendamento, segunda via.",
        outfit: "detective",
        mood: "think",
        bit: "Qual pergunta você mais responde?",
      },
      {
        title: "Ensinar a IA",
        text: "A IA aprende com as informações da sua empresa: cardápio, tabela de preços, regras, endereço e jeito de falar.",
        outfit: "grad",
        mood: "focus",
        bit: "Estudando o seu cardápio…",
      },
      {
        title: "Conectar",
        text: "Ligo a IA ao seu WhatsApp e ao que você já usa: planilha, agenda, sistema ou CRM.",
        outfit: "hardhat",
        mood: "work",
        bit: "Plugando os cabos!",
      },
      {
        title: "Acompanhar",
        text: "Todo mês você recebe um resumo das conversas, e eu ajusto o que a IA respondeu mal.",
        outfit: "headset",
        mood: "happy",
        bit: "Relatório do mês chegando!",
      },
    ],
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
