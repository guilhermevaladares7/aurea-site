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
      ["Conversa", "Você me conta, eu anoto tudo.", "Pelo WhatsApp mesmo, por texto ou áudio. Você fala o que a empresa faz, quem são os clientes e manda o que já tem: logo, fotos, Instagram. Enquanto isso, eu estudo os concorrentes da sua região.", "O resumo do que o site vai ter.", "chat", "headset", "happy", "Pode mandar áudio, eu anoto tudo."],
      ["Mapa do site", "Cada página com um objetivo.", "Organizo as páginas e escrevo os textos em linguagem simples, pensando no caminho que o cliente faz até chegar no seu WhatsApp. Você só confere se faltou algum produto ou serviço.", "O mapa das páginas e os textos.", "sitemap", "detective", "think", "Início, sobre, produtos, contato…"],
      ["Visual", "Com a cara da sua marca.", "Cores, letras e fotos escolhidas a partir da sua logo, nada de modelo pronto. Você vê a página inicial no celular e no computador e me diz do que gostou.", "A página inicial para aprovar.", "style", "beret", "focus", "Essa cor combina com a sua logo!"],
      ["Construção", "Feito primeiro para o celular.", "Com o visual aprovado, eu programo o site, deixo tudo rápido e ligo o botão de WhatsApp e o formulário. Você recebe um link de teste para abrir no seu telefone e mostrar para quem quiser.", "Um link de teste funcionando.", "build", "hardhat", "work", "Obra em andamento!"],
      ["Ajustes", "Ajusto até ficar do seu jeito.", "Trocar foto, mudar texto, mudar a ordem das seções: você manda as mudanças pelo WhatsApp e eu te aviso a cada rodada.", "O site final, aprovado por você.", "review", "beret", "wink", "Mais um retoque aqui…"],
      ["No ar", "No seu domínio e no Google.", "Registro o domínio no seu nome, deixo o site seguro com https e cadastro a empresa no Google. Depois, as mudanças do dia a dia você pede pelo WhatsApp.", "O site no ar, pronto para divulgar.", "launch", "crown", "wave", "No ar! Pode compartilhar."],
    ]),
  },

  sistemas: {
    intro: "O sistema nasce do jeito que a sua empresa já trabalha e chega por partes, já com dados reais.",
    steps: mk([
      ["Entender o processo", "Primeiro eu observo a rotina.", "Olho as planilhas, o caderno e os grupos de WhatsApp e converso com quem usa no dia a dia. Assim descubro cada tarefa, regra e exceção, e onde as coisas se perdem.", "A lista do que o sistema precisa fazer.", "messy", "detective", "think", "Hmm… essa planilha esconde segredos."],
      ["Desenhar as telas", "Você vê antes de eu programar.", "Desenho o painel, os cadastros e os relatórios com os dados da sua empresa. Mudar nessa fase é rápido e não gera retrabalho.", "As telas do jeito que vão ficar.", "wireframe", "beret", "focus", "Primeiro o desenho, depois o código."],
      ["Regras do negócio", "As contas saem certas sozinhas.", "Desconto à vista, parcelas, frete, comissão: o que hoje alguém faz de cabeça vira cálculo automático, sempre do mesmo jeito. Testo cada regra com exemplos reais da loja.", "Nada de conta errada no balcão.", "rules", "tie", "think", "À vista? Aplica 5% de desconto."],
      ["Construção por partes", "Fica pronto por partes, e você já usa.", "Login, cadastros, vendas, relatórios: cada módulo entregue já pode ser usado e testado com dados de verdade, sem esperar o sistema inteiro.", "Uma parte nova a cada entrega.", "modules", "laptop", "work", "Compilando a parte 2 de 4…"],
      ["Implantação", "Equipe treinada desde o primeiro dia.", "Levo os dados das planilhas para o sistema, crio o login de cada pessoa com o que ela pode ver e mexer e treino a equipe.", "Todo mundo usando, com os dados de sempre.", "migrate", "grad", "happy", "Aula dada! Agora é com vocês."],
      ["Dia a dia", "Números ao vivo e backup todo dia.", "Os relatórios se atualizam sozinhos e o backup roda toda madrugada. Eu cuido do servidor, e quando a empresa cresce o sistema ganha telas novas.", "Um sistema que cresce com a empresa.", "daily", "tie", "happy", "Fechamento do dia pronto!"],
    ]),
  },

  automacoes: {
    intro: "A IA só atende depois de aprender sobre a sua empresa e passar nos testes. Você decide até onde ela vai.",
    steps: mk([
      ["Mapear as conversas", "Descubro o que mais se repete.", "Leio as conversas do seu WhatsApp e separo as perguntas por assunto. Assim fica claro o que toma mais tempo da equipe e vale automatizar primeiro.", "A lista do que automatizar primeiro.", "topics", "detective", "think", "Qual pergunta você mais responde?"],
      ["Ensinar a IA", "A IA aprende sobre a sua empresa.", "Cardápio, preços, horários, endereço, regras e o jeito de falar com o cliente viram uma base que a IA consulta antes de cada resposta.", "Uma IA que conhece o seu negócio.", "teach", "grad", "focus", "Estudando o seu cardápio…"],
      ["Definir os limites", "Você decide até onde ela vai.", "Reclamação, desconto fora da tabela, pedido grande: nesses casos a IA passa a conversa para a pessoa certa da equipe, com um resumo do que o cliente quer.", "Nenhuma promessa que você não faria.", "limits", "tie", "focus", "Desconto especial? Chamo a equipe."],
      ["Conectar", "Pedido anotado sem ninguém digitar.", "Ligo a IA ao seu WhatsApp e ao que você já usa. O pedido vai para a planilha, o horário para a agenda e o cliente para o painel.", "Tudo chegando no lugar certo.", "connect", "hardhat", "work", "Plugando os cabos!"],
      ["Testar antes", "Testada antes de atender alguém.", "A IA passa por uma bateria de perguntas reais, inclusive as difíceis. Você também conversa com ela como se fosse cliente, e eu corrijo cada resposta errada.", "A IA aprovada por você.", "test", "laptop", "focus", "Teste 18 de 20… passou!"],
      ["Ligar e acompanhar", "Atende 24h e melhora todo mês.", "Você acompanha as conversas pelo painel e entra em qualquer uma quando quiser. Todo mês eu mando um resumo e ajusto o que ela respondeu mal.", "O relatório do mês, com as melhorias.", "live", "headset", "happy", "Relatório do mês chegando!"],
    ]),
  },
};
