/** Notícias reais da carreira. Itens com `body` geram uma página /noticias/[slug]; itens com `externalUrl` levam à matéria original. */
export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Resultado" | "Campeonato" | "Conquista" | "Preparação" | "Parceiros" | "Novidade";
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
  {
    slug: "curvados-vice-brasileiro-2025",
    title: "Enrico Vernieri transforma sonho familiar em conquista nacional com o vice do Brasileiro de Kart",
    excerpt: "Piloto da Reis Motorsport, Enrico termina o Brasileiro de Kart como vice-campeão, no Kartódromo Internacional Beto Carrero, em Penha (SC).",
    category: "Resultado",
    date: "2025-12-04",
    image: { src: "/news/curvados-vice-brasileiro-2025.jpg", alt: "Enrico, de óculos escuros e macacão, segura um troféu ao lado de uma mulher e de um homem de boné, em um evento de kart" },
    externalUrl: "https://www.curvados.com.br/home/enrico-vernieri-transforma-sonho-familiar-em-conquista-nacional-com-o-vice-do-brasileiro-de-kart",
    source: "Curva do S",
  },
  {
    slug: "highspeed-copa-beto-carrero-2025",
    title: "Enrico Vernieri conquista Copa Beto Carrero e foca no Brasileiro de Kart em casa",
    excerpt: "Aos 9 anos e com três temporadas no kartismo, Enrico acumula títulos, conquista a Copa Beto Carrero e já mira o Brasileiro, que será disputado no mesmo kartódromo.",
    category: "Conquista",
    date: "2025-10-30",
    image: { src: "/news/highspeed-copa-beto-carrero-2025.jpg", alt: "Três karts em uma curva da pista do Kartódromo Beto Carrero, com palmeiras e morros ao fundo" },
    externalUrl: "https://www.highspeedbrazil.com.br/enrico-vernieri-conquista-copa-beto-carrero-e-foca-no-brasileiro-de-kart-em-casa/",
    source: "Portal High Speed Brazil",
  },
  {
    slug: "portal-palhoca-premiacao-sao-paulo-2026",
    title: "Jovem piloto de Palhoça recebe premiação em São Paulo",
    excerpt: "Aos 9 anos, morador da Pedra Branca, Enrico recebe da CBA o prêmio pelo vice-campeonato brasileiro de kart na categoria Mirim.",
    category: "Conquista",
    date: "2026-03-31",
    image: { src: "/news/portal-palhoca-premiacao-sp-2026.jpg", alt: "Premiados da CBA Kart em um palco, segurando troféus, durante a cerimônia" },
    externalUrl: "https://www.portalpalhoca.com.br/noticia/esporte/jovem-piloto-de-palhoca-recebe-premiacao-em-sao-paulo/",
    source: "Portal Palhoça",
  },
  {
    slug: "jwnews-vice-catarinense-2024",
    title: "Enrico Vernieri conquista o vice-campeonato catarinense de kart e anuncia a chegada de um novo patrocinador",
    excerpt: "Vice-campeão catarinense de kart, o Enrico passa a contar com o apoio da Mormaii e integra o Programa Atleta Mormaii Óculos.",
    category: "Resultado",
    date: "2024-08-13",
    externalUrl: "https://jwnews.com.br/2024/08/13/enrico-vernieri-conquista-o-vice-campeonato-catarinense-de-kart-e-anuncia-a-chegada-de-um-novo-patrocinador/",
    source: "JW News",
  },
  {
    slug: "esportefantastico-primeiro-podio-2023",
    title: "Representante da 4ª geração da família no automobilismo, Enrico Vernieri comemora a conquista de seu primeiro pódio",
    excerpt: "A matéria apresenta o Enrico como representante da 4ª geração de uma família ligada ao automobilismo desde as décadas de 1950 e 1960 e comemora seu primeiro pódio no kart.",
    category: "Resultado",
    date: "2023-03-29",
    image: { src: "/news/esportefantastico-primeiro-podio-2023.jpg", alt: "Enrico de capacete verde e azul em uma curva da pista, pilotando um kart verde com o número 5" },
    externalUrl: "https://esportefantastico.com.br/noticia/33001/representante-da-4o-geracao-da-familia-no-automobilismo-enrico-vernieri-comemora-a-conquista-de-seu-primeiro-podio",
    source: "Esporte Fantástico",
  },
  {
    slug: "minuano-vice-brasileiro-2025",
    title: "Enrico Vernieri é vice-campeão brasileiro de kart",
    excerpt: "O Jornal Minuano, de Bagé (RS), registra o vice-campeonato brasileiro de kart conquistado pelo Enrico.",
    category: "Resultado",
    date: "2025-12-02",
    image: { src: "/news/minuano-vice-brasileiro-2025.jpg", alt: "Enrico sentado em um kart verde, cercado por integrantes da equipe, nos boxes de uma prova" },
    externalUrl: "https://www.jornalminuano.com.br/noticia/2025/12/02/enrico-vernieri-e-vice-campeao-brasileiro-de-kart",
    source: "Jornal Minuano",
  },
  {
    slug: "minuano-livro-curva-zero-2026",
    title: "Empreendedor bajeense lança livro que relaciona lições do kart à liderança",
    excerpt: "Pascoal Vernieri, pai do Enrico, lança o livro Curva Zero, que usa experiências do automobilismo para falar de liderança e empreendedorismo.",
    category: "Novidade",
    date: "2026-07-30",
    image: { src: "/news/minuano-livro-curva-zero-2026.jpg", alt: "Pascoal Vernieri, de óculos, segurando o livro Curva Zero, com um telão ao fundo" },
    externalUrl: "https://www.jornalminuano.com.br/noticia/2026/07/30/empreendedor-bajeense-lanca-livro-que-relaciona-licoes-do-kart-a-lideranca",
    source: "Jornal Minuano",
  },
  {
    slug: "curvados-livro-curva-zero-2026",
    title: "Empresário e pai de piloto lança livro que transforma as lições do kart em ensinamentos sobre liderança e empreendedorismo",
    excerpt: "Em evento na AEMFLO, em Florianópolis, o pai do Enrico lança o livro Curva Zero, que transforma lições do kart em ensinamentos sobre liderança.",
    category: "Novidade",
    date: "2026-07-27",
    image: { src: "/news/curvados-livro-curva-zero-2026.jpg", alt: "Quatro pessoas, entre elas uma criança, posam ao lado de macacões e capacetes de corrida em um ambiente corporativo" },
    externalUrl: "https://www.curvados.com.br/home/empresrio-e-pai-de-piloto-lana-livro-que-transforma-as-lies-do-kart-em-ensinamentos-sobre-liderana-e-empreendedorismo",
    source: "Curva do S",
  },
];
