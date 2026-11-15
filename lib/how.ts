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
      ["Visual e textos", "Com a cara da sua marca.", "Escrevo os textos em linguagem simples e monto a página inicial com as cores da sua logo. Você diz do que gostou.", "A página inicial para aprovar.", "style", "beret", "focus", "Essa cor combina com a sua logo!"],
      ["Construção", "Ajusto até ficar do seu jeito.", "Te mando um link de teste já com WhatsApp e formulário. Quer trocar foto ou texto? Pede pelo WhatsApp.", "O site final, aprovado por você.", "build", "hardhat", "work", "Obra em andamento!"],
      ["No ar", "No seu domínio e no Google.", "Registro o domínio no seu nome, deixo o site seguro e cadastro a empresa no Google.", "O site no ar, pronto para divulgar.", "launch", "crown", "wave", "No ar! Pode compartilhar."],
    ]),
  },

  sistemas: {
    intro: "O sistema nasce do jeito que a sua empresa já trabalha e chega por partes, já com dados reais.",
    steps: mk([
      ["Entender o processo", "Primeiro eu observo a rotina.", "Olho as planilhas e converso com quem usa no dia a dia para achar onde as coisas se perdem.", "A lista do que o sistema precisa fazer.", "messy", "detective", "think", "Hmm… essa planilha esconde segredos."],
      ["Desenhar as telas", "Você vê antes de eu programar.", "Desenho o painel, os cadastros e os relatórios com os seus dados, já com as regras de desconto, parcelas e frete.", "As telas do jeito que vão ficar.", "wireframe", "beret", "focus", "Primeiro o desenho, depois o código."],
      ["Construção por partes", "Fica pronto por partes, e você já usa.", "Cada parte entregue já funciona com dados de verdade. Levo as planilhas para o sistema e treino a equipe.", "Todo mundo usando, com os dados de sempre.", "modules", "laptop", "work", "Compilando a parte 2 de 4…"],
      ["Dia a dia", "Números ao vivo e backup todo dia.", "Relatórios que se atualizam sozinhos, backup toda madrugada e telas novas quando a empresa cresce.", "Um sistema que cresce com a empresa.", "daily", "tie", "happy", "Fechamento do dia pronto!"],
    ]),
  },

  automacoes: {
    intro: "A IA só atende depois de aprender sobre a sua empresa e passar nos testes. Você decide até onde ela vai.",
    steps: mk([
      ["Mapear as conversas", "Descubro o que mais se repete.", "Leio as conversas do seu WhatsApp e separo as perguntas por assunto, para saber o que automatizar primeiro.", "A lista do que automatizar primeiro.", "topics", "detective", "think", "Qual pergunta você mais responde?"],
      ["Ensinar a IA", "A IA aprende sobre a sua empresa.", "Cardápio, horários, regras e o seu jeito de falar. Você decide o que ela passa para a equipe, como reclamação ou desconto.", "Uma IA que conhece o seu negócio.", "teach", "grad", "focus", "Estudando o seu cardápio…"],
      ["Conectar e testar", "Testada antes de atender alguém.", "Ligo a IA ao seu WhatsApp, à planilha e à agenda, e você conversa com ela como se fosse cliente.", "A IA aprovada por você.", "test", "laptop", "focus", "Teste 18 de 20… passou!"],
      ["Ligar e acompanhar", "Atende 24h e melhora todo mês.", "Você acompanha as conversas pelo painel, e todo mês eu ajusto o que ela respondeu mal.", "O relatório do mês, com as melhorias.", "live", "headset", "happy", "Relatório do mês chegando!"],
    ]),
  },
};
