/**
 * Marcas parceiras confirmadas. Lista vazia até os responsáveis confirmarem quais marcas apoiam hoje
 * e enviarem os logos originais (SVG/PNG transparente). Não use logos de terceiros sem autorização.
 */
export type Sponsor = {
  name: string;
  href?: string;
  /** versão monocromática (preta, fundo transparente) em /public/sponsors/mono. No site ela é exibida preta sobre o quadro claro e branca sobre o escuro. */
  logo: string;
  /** dimensões do arquivo */
  width: number;
  height: number;
  /** altura de exibição em px (ajusta o peso visual entre logos largos e quadrados) */
  h: number;
  /** rótulo opcional, ex.: "Equipe" */
  role?: string;
};

/**
 * Marcas parceiras. Todos os logos são exibidos em uma só cor (preto ou branco), alternando quadros claros e escuros em tabuleiro.
 * Os arquivos monocromáticos foram gerados a partir dos logos originais recebidos da família (Mormaii, Plathanus, Reis Motorsports,
 * MAS Taekwondo, Sprada, Beewell, Apex Hub e Linvix; o da Linvix, recebido em fundo azul, teve o fundo removido). Nenhum desenho foi alterado, só a cor.
 * Para incluir outra marca, gere o logo em preto com fundo transparente em /public/sponsors/mono e acrescente uma linha aqui.
 * Confirmar com os responsáveis quais marcas estão ativas. A Autoimpact não patrocina mais.
 */
export const sponsors: Sponsor[] = [
  { name: "Mormaii", logo: "/sponsors/mono/mormaii.png", width: 1084, height: 600, h: 64 },
  { name: "Plathanus Software & Design", logo: "/sponsors/mono/plathanus.png", width: 3671, height: 600, h: 42 },
  { name: "Reis Motorsports", logo: "/sponsors/mono/reis-motorsports.png", width: 464, height: 600, h: 104, role: "Equipe" },
  { name: "MAS Martial Arts System, Pedra Branca Taekwondo", logo: "/sponsors/mono/mas-taekwondo.png", width: 642, height: 600, h: 104 },
  { name: "Sprada Fisioterapia e Pilates", logo: "/sponsors/mono/sprada.png", width: 507, height: 600, h: 108 },
  { name: "Beewell", logo: "/sponsors/mono/beewell.png", width: 2223, height: 405, h: 34 },
  { name: "Apex Hub", logo: "/sponsors/mono/apex-hub.png", width: 1342, height: 409, h: 56 },
  { name: "Linvix Tecnologia", logo: "/sponsors/mono/linvix.png", width: 1750, height: 267, h: 34 },
];

/**
 * Vídeos de campanhas e conteúdos com marcas, publicados pelas próprias marcas.
 * Instagram: usa o embed oficial (nada é baixado nem copiado). "src" é o trecho da URL do post, ex.: "reel/ABC123".
 * "poster" é a imagem de pré-visualização exibida antes do clique (em /public/campaigns). Sem ela, o card mostra uma capa tipográfica.
 */
export type CampaignVideo = {
  id: string;
  brand: string;
  title: string;
  description?: string;
  /** imagem de capa (opcional) */
  poster?: string;
  /** escurece a capa (0 a 1); útil quando a imagem tem pouca resolução ou é muito clara */
  posterDim?: number;
  kind: "instagram" | "youtube" | "vimeo" | "file";
  src: string;
  /** conta que publicou, sem @ */
  handle?: string;
  /** link da publicação original (para instagram é montado a partir de src) */
  href?: string;
};

export const campaignVideos: CampaignVideo[] = [
  {
    id: "mormaii-semana-das-criancas",
    brand: "Mormaii Óculos",
    title: "Semana das Crianças: o Enrico conta sua trajetória",
    description: "Vídeo publicado pela Mormaii em que o Enrico fala sobre o caminho dele no kart.",
    poster: "/campaigns/mormaii.jpg",
    kind: "instagram",
    src: "reel/DPrnu8lkUJL",
    handle: "mormaiioculos",
  },
  {
    id: "plathanus-dia-na-empresa",
    brand: "Plathanus",
    title: "Um dia na Plathanus",
    description: "Vídeo publicado no perfil do Enrico, em que ele mostra o escritório da Plathanus, uma das empresas que apoiam sua trajetória.",
    poster: "/campaigns/plathanus-divulgacao-2.png",
    posterDim: 0.32,
    kind: "instagram",
    src: "reel/DJ-fhq-ug5o",
    handle: "enricovernieri",
  },
  {
    id: "next-shipping-meta-batida",
    brand: "Next Shipping",
    title: "Meta batida, pé no acelerador",
    description: "Ação de kart da Next Shipping para comemorar a meta do semestre do time.",
    poster: "/campaigns/next-meta.jpg",
    kind: "instagram",
    src: "reel/DOMPnbpiEZD",
    handle: "nextshipping",
  },
  {
    id: "next-shipping-espirito-de-campeao",
    brand: "Next Shipping",
    title: "Sonho, disciplina e o espírito de campeão",
    description: "Campanha da Next Shipping com o Enrico, inspirada no ídolo Ayrton Senna.",
    poster: "/campaigns/next-senna.jpg",
    kind: "instagram",
    src: "p/DHeQ6tUyxAL",
    handle: "nextshipping",
  },
  {
    id: "linvix-caixa-livre",
    brand: "Linvix Tecnologia",
    title: "Caixa Livre na prática",
    description: "Vídeo publicado em parceria com a Linvix Tecnologia, mostrando o autoatendimento Caixa Livre em uma loja.",
    poster: "/campaigns/linvix-DaEZcyUSAA7.jpg",
    kind: "instagram",
    src: "reel/DaEZcyUSAA7",
    handle: "enricovernieri",
  },
  {
    id: "next-shipping-premiacao",
    brand: "Next Shipping",
    title: "Participação na premiação Next Shipping",
    description: "Como embaixador da marca, o Enrico recebe os colaboradores no Kartódromo Beto Carrero, faz uma volta com o kart, acompanha as corridas deles e participa da entrega dos prêmios.",
    poster: "/campaigns/next-premiacao.jpg",
    kind: "instagram",
    src: "reel/DNePkZ7SnZJ",
    handle: "enricovernieri",
  },
  {
    id: "mormaii-agradecimento",
    brand: "Mormaii Óculos",
    title: "Agradecimento à Mormaii Óculos",
    description: "Em vídeo de agradecimento, o Enrico conta como a Mormaii apoia o sonho dele, com modelos de óculos incríveis para cada momento do seu dia.",
    poster: "/campaigns/mormaii-agradecimento.jpg",
    kind: "instagram",
    src: "reel/DIfHCW4OvUm",
    handle: "enricovernieri",
  },
  {
    id: "mormaii-dia-do-esportista",
    brand: "Mormaii Óculos",
    title: "Dia do Esportista com a Mormaii",
    description: "Em homenagem ao Dia do Esportista, a Mormaii publica um vídeo em que o Enrico fala sobre sua paixão pelo esporte e como a trajetória dele começou.",
    poster: "/campaigns/mormaii-dia-do-esportista.jpg",
    kind: "instagram",
    src: "reel/DGQZWI0xvAA",
    handle: "mormaiioculos",
  },
  {
    id: "mormaii-treino",
    brand: "Mormaii Óculos",
    title: "Treino com Mormaii Óculos",
    description: "A Mormaii mostra um treino do Enrico, sempre acompanhado dos óculos da marca.",
    poster: "/campaigns/mormaii-treino.jpg",
    kind: "instagram",
    src: "reel/DHJLu5FxYRz",
    handle: "mormaiioculos",
  },
];
