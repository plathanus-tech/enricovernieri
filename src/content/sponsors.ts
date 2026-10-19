/**
 * Marcas parceiras confirmadas. Lista vazia até os responsáveis confirmarem quais marcas apoiam hoje
 * e enviarem os logos originais (SVG/PNG transparente). Não use logos de terceiros sem autorização.
 */
export type Sponsor = {
  name: string;
  href?: string;
  /** arquivo em /public/sponsors (preferir SVG; PNG com fundo transparente) */
  logo: string;
  /** dimensões originais do arquivo */
  width: number;
  height: number;
  /** altura de exibição em px (ajusta o peso visual entre logos largos e quadrados) */
  h: number;
  /** fundo do quadro: logos brancos pedem "dark"; logos escuros pedem "light" */
  tone: "dark" | "light";
  /** rótulo opcional, ex.: "Equipe" */
  role?: string;
};

/**
 * Logos recebidos da família (pasta Logo). Os originais foram preservados: SVG quando o arquivo era vetorial
 * (Mormaii veio de EPS, Beewell de SVG); PNG nos demais. MAS Taekwondo veio com fundo preto e foi recortado, sem alterar o desenho.
 * Confirmar com os responsáveis quais marcas estão ativas e se há logos de Linvix e Techspeed. A Autoimpact não patrocina mais.
 */
export const sponsors: Sponsor[] = [
  { name: "Mormaii", logo: "/sponsors/mormaii.svg", width: 763, height: 423, h: 64, tone: "light" },
  { name: "Plathanus Software & Design", logo: "/sponsors/plathanus.png", width: 208, height: 34, h: 30, tone: "dark" },
  { name: "Reis Motorsports", logo: "/sponsors/reis-motorsports.png", width: 660, height: 854, h: 104, tone: "light", role: "Equipe" },
  { name: "MAS Martial Arts System, Pedra Branca Taekwondo", logo: "/sponsors/mas-taekwondo.png", width: 412, height: 385, h: 112, tone: "dark" },
  { name: "Sprada Fisioterapia e Pilates", logo: "/sponsors/sprada-pb.svg", width: 726, height: 859, h: 108, tone: "light" },
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
    id: "next-shipping-meta-batida",
    brand: "Next Shipping",
    title: "Meta batida, pé no acelerador",
    description: "Ação de kart da Next Shipping para comemorar a meta do semestre do time.",
    poster: "/campaigns/next-meta.jpg",
    kind: "instagram",
    src: "reel/DOMPnbpiEZD",
    handle: "nextshipping",
  },
];
