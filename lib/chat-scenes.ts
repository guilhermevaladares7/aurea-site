// Conversas de exemplo da demonstração de automação (WhatsApp).

export type Msg = { from: "cliente" | "ia"; text?: string; audio?: string; time: string };

export const SCENES: { label: string; msgs: Msg[] }[] = [
  {
    label: "pedido novo",
    msgs: [
      { from: "cliente", text: "Oi! Tem bolo de cenoura hoje?", time: "09:14" },
      { from: "ia", text: "Tem sim! O inteiro sai R$ 38. Quer que eu separe um?", time: "09:14" },
      { from: "cliente", text: "Quero, busco às 17h", time: "09:15" },
      { from: "ia", text: "Separado ✓ Retirada hoje às 17h", time: "09:15" },
    ],
  },
  {
    label: "por áudio",
    msgs: [
      { from: "cliente", audio: "0:07", time: "11:02" },
      { from: "ia", text: "Ouvi: 2 dúzias de pão de queijo pra sábado. Certo?", time: "11:02" },
      { from: "cliente", text: "Isso mesmo", time: "11:03" },
      { from: "ia", text: "Anotado ✓ Entrega no sábado às 8h", time: "11:03" },
    ],
  },
  {
    label: "troca de data",
    msgs: [
      { from: "cliente", text: "Dá pra passar minha entrega pra segunda?", time: "14:37" },
      { from: "ia", text: "Segunda tenho horário às 14h. Posso trocar?", time: "14:37" },
      { from: "cliente", text: "Pode trocar", time: "14:38" },
      { from: "ia", text: "Trocado ✓ Entrega na segunda às 14h", time: "14:38" },
    ],
  },
  {
    label: "pediu uma pessoa",
    msgs: [
      { from: "cliente", text: "Prefiro falar com uma pessoa", time: "16:20" },
      { from: "ia", text: "Claro! Já chamei alguém da equipe com o resumo da conversa.", time: "16:20" },
      { from: "cliente", text: "Obrigado!", time: "16:21" },
      { from: "ia", text: "Por nada! Sigo por aqui também.", time: "16:21" },
    ],
  },
];
