/**
 * Próximos desafios (hero e seção "Próximos desafios" leem daqui). Apenas etapas oficiais e públicas,
 * sem localização em tempo real nem rotina. Etapas já encerradas saem sozinhas da tela.
 */
export type Challenge = {
  id: string;
  /** ISO yyyy-mm-dd (primeiro dia) */
  date: string;
  /** ISO yyyy-mm-dd, quando a etapa dura vários dias */
  endDate?: string;
  championship: string;
  stage?: string;
  track?: string;
  city?: string;
  category?: string;
  status?: string;
  /** página oficial da etapa */
  href?: string;
};

export const challenges: Challenge[] = [
  {
    id: "brasileiro-2026",
    date: "2026-11-16",
    endDate: "2026-11-21",
    championship: "61º Campeonato Brasileiro de Kart",
    track: "Speed Park Kartódromo Internacional de Birigui",
    city: "Birigui (SP)",
    category: "Mini 2T",
    status: "Inscrições até 09/11",
    href: "https://inscricoes.cba.org.br/pt/eventos/61o-campeonato-brasileiro-de-kart-2026-61o-campeonato-brasileiro-de-kart-2026-",
  },
];
