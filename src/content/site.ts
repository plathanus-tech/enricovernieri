/**
 * Configuração global e dados de contato.
 * Tudo aqui veio da apresentação de patrocínio do piloto. Confirmar com os responsáveis antes de publicar.
 */
export const site = {
  name: "Enrico Vernieri",
  number: 5,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Enrico Vernieri, piloto de kart de Palhoça (SC). Vice-campeão brasileiro de kart em 2025. Conheça a trajetória e faça parte dela.",
  /** Mostra caixas tracejadas onde ainda falta conteúdo real (calendário, patrocinadores, vídeos, notícias). Desligar antes de publicar. */
  showPlaceholders: true,
  contact: {
    // Contato dos responsáveis, conforme a apresentação do piloto.
    whatsappDisplay: "48 99115-1370",
    whatsappNumber: "5548991151370",
    whatsappMessage:
      "Olá! Vim pelo site do Enrico Vernieri e gostaria de conversar sobre patrocínio.",
    email: null as string | null, // não informado
    instagramHandle: "enricovernieri",
    instagramUrl: "https://www.instagram.com/enricovernieri",
  },
  mediaKit: {
    url: "/docs/apresentacao-patrocinio-enrico-vernieri.pdf",
    sizeLabel: "PDF · 5,2 MB",
    previews: ["/docs/deck-p1.jpg", "/docs/deck-p3.jpg", "/docs/deck-p17.jpg"],
  },
} as const;

export const whatsappLink = () =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(site.contact.whatsappMessage)}`;

export const nav = [
  { id: "quem-sou", label: "Quem sou" },
  { id: "historia", label: "História" },
  { id: "conquistas", label: "Conquistas" },
  { id: "desafios", label: "Próximos desafios" },
  { id: "patrocinadores", label: "Patrocinadores" },
  { id: "noticias", label: "Notícias" },
] as const;
