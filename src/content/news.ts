/** Notícias reais da carreira. Itens com `body` geram uma página /noticias/[slug]; itens com `externalUrl` levam à matéria original. */
export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Resultado" | "Campeonato" | "Conquista" | "Preparação" | "Parceiros";
  /** ISO yyyy-mm-dd */
  date: string;
  image?: { src: string; alt: string };
  /** Texto da página própria. Omitido quando a notícia só aponta para uma matéria externa. */
  body?: string[];
  /** Matéria publicada por outro veículo: o card abre o link em nova aba. Resumo escrito por nós, sem copiar o texto original. */
  externalUrl?: string;
  /** Nome do veículo, exibido junto ao link externo. */
  source?: string;
};

export const news: NewsItem[] = [
  {
    slug: "campeao-paranaense-2026",
    title: "Piloto de kart de Palhoça conquista título paranaense",
    excerpt: "Enrico vence a categoria Cadete na 62ª edição do Campeonato Paranaense, em Pato Branco (PR), e é campeão estadual.",
    category: "Conquista",
    date: "2026-09-14",
    image: { src: "/news/portal-palhoca-paranaense.jpg", alt: "Enrico, de capacete verde e laranja, na frente do pelotão de karts durante a prova" },
    externalUrl: "https://www.portalpalhoca.com.br/noticia/esporte/piloto-de-kart-de-palhoca-conquista-titulo-paranaense/",
    source: "Portal Palhoça",
  },
  {
    slug: "premiado-cba-fgav-2026",
    title: "Piloto Enrico Vernieri é premiado em eventos nacional e estadual do automobilismo",
    excerpt: "Pelo desempenho na temporada 2025, Enrico é homenageado em cerimônias da CBA, em São Paulo, e da Federação Gaúcha de Automobilismo, em Novo Hamburgo.",
    category: "Conquista",
    date: "2026-04-11",
    image: { src: "/photos/premiacao-cba.jpg", alt: "Enrico de terno, segurando o troféu da CBA, diante do painel de uma cerimônia de premiação" },
    externalUrl: "https://www.jornalminuano.com.br/noticia/2026/04/11/piloto-enrico-vernieri-e-premiado-em-eventos-nacional-e-estadual-do-automobilismo",
    source: "Jornal Minuano",
  },
  {
    slug: "vice-brasileiro-mirim-2025",
    title: "Vice-campeão brasileiro na Mirim, Enrico Vernieri confirma evolução como destaque nacional",
    excerpt: "Em uma edição com mais de 650 inscrições e clima instável, Enrico termina a temporada 2025 como vice-campeão brasileiro da Mirim, destacado pela consistência.",
    category: "Resultado",
    date: "2025-12-04",
    image: { src: "/news/kartmotor-vice-2025.jpg", alt: "Enrico de capacete verde, laranja e azul, pilotando o kart verde número 5 em uma curva da pista" },
    externalUrl: "https://kartmotor.com.br/noticias/vice-campeao-brasileiro-na-mirim-enrico-vernieri-confirma-evolucao-como-destaque-nacional-42552",
    source: "Portal Kart Motor",
  },
  {
    slug: "campeao-copa-beto-carrero-mirim-2025",
    title: "Enrico Vernieri conquista o título da Copa Beto Carrero 2025, na categoria Mirim",
    excerpt: "Aos 9 anos, Enrico fecha a Copa Beto Carrero, disputada em cinco etapas entre fevereiro e outubro, com o título da Mirim e o 2º lugar no Brasileiro Open.",
    category: "Conquista",
    date: "2025-10-26",
    image: { src: "/news/portal-palhoca-beto-carrero.png", alt: "Colagem de fotos do Enrico: no pódio com o troféu, pilotando o kart roxo, com o troféu ao lado de dois adultos e posando no autódromo" },
    externalUrl: "https://www.portalpalhoca.com.br/noticia/esporte/enrico-vernieri-conquista-o-titulo-da-copa-beto-carrero-2025-na-categoria-mirim/",
    source: "Portal Palhoça",
  },
];
