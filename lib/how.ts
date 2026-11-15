// "Como funciona" de cada serviço: as etapas, do primeiro papo até o projeto rodando.
import type { BitMood, Outfit } from "@/components/mascot";
import type { ServiceSlug } from "@/lib/services";

export type Art =
  | "chat"
  | "sitemap"
  | "style"
  | "build"
  | "review"
  | "launch"
  | "messy"
  | "wireframe"
  | "rules"
  | "modules"
  | "migrate"
  | "daily"
  | "topics"
  | "teach"
  | "limits"
  | "connect"
  | "test"
  | "live";

export type HowStep = {
  /** nome curto da etapa */
  title: string;
  /** a frase principal, em destaque */
  head: string;
  /** a explicação, com mais detalhes */
  text: string;
  /** o que o cliente tem em mãos no fim da etapa */
  get: string;
  art: Art;
  outfit: Outfit;
  mood: BitMood;
  bit: string;
};

type S = [title: string, head: string, text: string, get: string, art: Art, outfit: Outfit, mood: BitMood, bit: string];
const mk = (rows: S[]): HowStep[] =>
  rows.map(([title, head, text, get, art, outfit, mood, bit]) => ({ title, head, text, get, art, outfit, mood, bit }));

export const HOW: Record<ServiceSlug, { intro: string; steps: HowStep[] }> = {
  sites: {
    intro: "Do primeiro áudio no WhatsApp até o site no Google. Nada vai para o ar sem a sua aprovação.",
    steps: mk([
      ["Conversa", "Você me conta, eu anoto tudo.", "Pelo WhatsApp, por texto ou áudio: você conta o que a empresa faz e manda logo, fotos e Instagram.", "O resumo do que o site vai ter.", "chat", "headset", "happy", "Pode mandar áudio, eu anoto tudo."],
      ["Mapa do site", "Cada página com um objetivo.", "Organizo as páginas e escrevo os textos em linguagem simples. Você só confere se faltou algo.", "O mapa das páginas e os textos.", "sitemap", "detective", "think", "Início, sobre, produtos, contato…"],
      ["Visual", "Com a cara da sua marca.", "Cores, letras e fotos escolhidas a partir da sua logo. Você vê a página inicial e diz do que gostou.", "A página inicial para aprovar.", "style", "beret", "focus", "Essa cor combina com a sua logo!"],
      ["Construção", "Feito primeiro para o celular.", "Programo o site, ligo o WhatsApp e o formulário e te mando um link de teste.", "Um link de teste funcionando.", "build", "hardhat", "work", "Obra em andamento!"],
      ["Ajustes", "Ajusto até ficar do seu jeito.", "Trocar foto, texto ou a ordem das seções: você pede pelo WhatsApp e eu ajusto.", "O site final, aprovado por você.", "review", "beret", "wink", "Mais um retoque aqui…"],
      ["No ar", "No seu domínio e no Google.", "Registro o domínio no seu nome, deixo o site seguro e cadastro a empresa no Google.", "O site no ar, pronto para divulgar.", "launch", "crown", "wave", "No ar! Pode compartilhar."],
    ]),
  },

  sistemas: {
    intro: "O sistema nasce do jeito que a sua empresa já trabalha e chega por partes, já com dados reais.",
    steps: mk([
      ["Entender o processo", "Primeiro eu observo a rotina.", "Olho as planilhas e converso com quem usa no dia a dia para achar onde as coisas se perdem.", "A lista do que o sistema precisa fazer.", "messy", "detective", "think", "Hmm… essa planilha esconde segredos."],
      ["Desenhar as telas", "Você vê antes de eu programar.", "Desenho o painel, os cadastros e os relatórios com os seus dados. Mudar nessa fase é rápido.", "As telas do jeito que vão ficar.", "wireframe", "beret", "focus", "Primeiro o desenho, depois o código."],
      ["Regras do negócio", "As contas saem certas sozinhas.", "Desconto, parcelas, frete, comissão: o que alguém faz de cabeça vira cálculo automático.", "Nada de conta errada no balcão.", "rules", "tie", "think", "À vista? Aplica 5% de desconto."],
      ["Construção por partes", "Fica pronto por partes, e você já usa.", "Login, cadastros, vendas, relatórios: cada parte entregue já pode ser usada com dados de verdade.", "Uma parte nova a cada entrega.", "modules", "laptop", "work", "Compilando a parte 2 de 4…"],
      ["Implantação", "Equipe treinada desde o primeiro dia.", "Levo os dados das planilhas para o sistema, crio o login de cada pessoa e treino a equipe.", "Todo mundo usando, com os dados de sempre.", "migrate", "grad", "happy", "Aula dada! Agora é com vocês."],
      ["Dia a dia", "Números ao vivo e backup todo dia.", "Relatórios que se atualizam sozinhos, backup toda madrugada e telas novas quando a empresa cresce.", "Um sistema que cresce com a empresa.", "daily", "tie", "happy", "Fechamento do dia pronto!"],
    ]),
  },

  automacoes: {
    intro: "A IA só atende depois de aprender sobre a sua empresa e passar nos testes. Você decide até onde ela vai.",
    steps: mk([
      ["Mapear as conversas", "Descubro o que mais se repete.", "Leio as conversas do seu WhatsApp e separo as perguntas por assunto, para saber o que automatizar primeiro.", "A lista do que automatizar primeiro.", "topics", "detective", "think", "Qual pergunta você mais responde?"],
      ["Ensinar a IA", "A IA aprende sobre a sua empresa.", "Cardápio, horários, endereço, regras e o seu jeito de falar viram a base que a IA consulta antes de responder.", "Uma IA que conhece o seu negócio.", "teach", "grad", "focus", "Estudando o seu cardápio…"],
      ["Definir os limites", "Você decide até onde ela vai.", "Reclamação, desconto fora da tabela, pedido grande: a IA passa a conversa para a equipe, com um resumo.", "Nenhuma promessa que você não faria.", "limits", "tie", "focus", "Desconto especial? Chamo a equipe."],
      ["Conectar", "Pedido anotado sem ninguém digitar.", "Ligo a IA ao seu WhatsApp e ao que você já usa: o pedido vai para a planilha e o horário para a agenda.", "Tudo chegando no lugar certo.", "connect", "hardhat", "work", "Plugando os cabos!"],
      ["Testar antes", "Testada antes de atender alguém.", "A IA responde uma bateria de perguntas reais, e você conversa com ela como se fosse cliente.", "A IA aprovada por você.", "test", "laptop", "focus", "Teste 18 de 20… passou!"],
      ["Ligar e acompanhar", "Atende 24h e melhora todo mês.", "Você acompanha as conversas pelo painel, e todo mês eu ajusto o que ela respondeu mal.", "O relatório do mês, com as melhorias.", "live", "headset", "happy", "Relatório do mês chegando!"],
    ]),
  },
};
