/**
 * Linha do tempo. Apenas fatos presentes na apresentação do piloto.
 * As fotos não têm data confirmada: foram usadas como ilustração, sem legenda com ano.
 * Para trocar uma foto ou incluir um vídeo, edite `media`.
 */
export type Media =
  | { kind: "image"; src: string; alt: string; position?: string }
  | { kind: "video"; src: string; poster: string; label: string }
  | { kind: "slot"; note: string }
  /** Capítulo só de texto (sem foto nem aviso de foto). */
  | { kind: "none" };

export type Chapter = {
  id: string;
  /** Texto pequeno acima do numeral. */
  kicker: string;
  /** Numeral em glifos oficiais. Vazio = usa `word`. */
  numeral?: string;
  word?: string;
  title: string;
  text: string;
  facts?: string[];
  tone: "dark" | "light";
  media: Media;
};

export const chapters: Chapter[] = [
  {
    id: "2016",
    kicker: "Ano",
    numeral: "2016",
    title: "Nasce um piloto",
    text: "Enrico nasce em Palhoça, Santa Catarina. É daqui, da região, que ele leva o orgulho de representar nas pistas.",
    tone: "dark",
    media: { kind: "slot", note: "GIF ou foto de infância do Enrico, ou do primeiro contato com um kart (se houver)." },
  },
  {
    id: "aos-6",
    kicker: "Aos",
    numeral: "6",
    word: "anos",
    title: "A paixão aparece cedo",
    text: "O amor pelo automobilismo começa ainda criança. Para o Enrico, o kart nunca foi só velocidade: é estratégia, dedicação e confiança em cada detalhe.",
    tone: "light",
    media: { kind: "image", src: "/photos/portrait-1.png", alt: "Enrico de capacete e macacão de corrida, de braços cruzados e com o olhar atento (foto em preto e branco)", position: "50% 25%" },
  },
  {
    id: "2021",
    kicker: "Ano",
    numeral: "2021",
    title: "Começam os treinos",
    text: "Desde 2021, o Enrico treina com dedicação para evoluir a cada volta.",
    tone: "dark",
    media: { kind: "slot", note: "Vídeo curto de treino (10 a 20 segundos, na vertical ou horizontal)." },
  },
  {
    id: "2022",
    kicker: "Ano",
    numeral: "2022",
    title: "A estreia nas pistas",
    text: "Na Copa Ingleses, categoria Mirim, o Enrico estreia com ótimo desempenho e termina entre os primeiros colocados.",
    facts: ["4º lugar na Copa Ingleses"],
    tone: "light",
    media: { kind: "image", src: "/photos/kart-action-1.png", alt: "Enrico pilotando o kart número 5 em uma curva da pista (foto em preto e branco)", position: "60% 50%" },
  },
  {
    id: "2023",
    kicker: "Ano",
    numeral: "2023",
    title: "Os grandes campeonatos",
    text: "Desde 2023, ele disputa os principais campeonatos de kart do Brasil: Brasileiro, Sul-Brasileiro, Catarinense e Gaúcho. É também o ano do primeiro vice-campeonato.",
    facts: ["Vice-campeão da Copa Velopark", "4º no Campeonato Gaúcho", "11º no Catarinense", "15º no Sul-Brasileiro", "23º no Brasileiro"],
    tone: "dark",
    media: { kind: "image", src: "/photos/paddock-mechanic.png", alt: "Enrico de capacete, no kart, enquanto um homem de boné confere o equipamento ao lado (foto em preto e branco)", position: "50% 50%" },
  },
  {
    id: "2024",
    kicker: "Ano",
    numeral: "2024",
    title: "Subindo de nível",
    text: "A evolução aparece nos resultados: dois vice-campeonatos e posições melhores nos campeonatos nacionais.",
    facts: ["Vice-campeão Catarinense", "Vice-campeão da Copa Beto Carrero", "8º no Sul-Brasileiro", "19º no Brasileiro"],
    tone: "light",
    media: { kind: "image", src: "/photos/portrait-2.png", alt: "Enrico de capacete e macacão, de braços cruzados, em pé entre os karts no paddock (foto em preto e branco)", position: "50% 30%" },
  },
  {
    id: "2025",
    kicker: "Ano",
    numeral: "2025",
    title: "O ano dos títulos",
    text: "Três títulos e o vice-campeonato brasileiro: o ápice de uma temporada de evolução constante.",
    facts: ["Vice-campeão Brasileiro", "Campeão Gaúcho", "Campeão da Copa Beto Carrero", "Campeão da Copa Sicredi Lages", "3º no Catarinense"],
    tone: "dark",
    media: { kind: "image", src: "/photos/kart-action-2.png", alt: "Enrico contornando uma curva com o kart número 5, de capacete branco (foto em preto e branco)", position: "55% 55%" },
  },
  {
    id: "2026",
    kicker: "Ano",
    numeral: "2026",
    title: "Campeão paranaense",
    text: "Vice-campeão na primeira etapa da Copa Pato-Branquense e, na 62ª edição do Campeonato Paranaense de Kart, em Pato Branco (PR), campeão da categoria Cadete entre 17 pilotos. Foi o 7º no treino classificatório, subiu ao pódio na primeira bateria, venceu a segunda e a final.",
    facts: ["Campeão Paranaense, categoria Cadete", "Vice-campeão da Copa Pato-Branquense (1ª etapa)"],
    tone: "light",
    media: { kind: "image", src: "/photos/podio-kartclube.png", alt: "Enrico no alto do pódio, de troféu erguido, no Kart Clube de Pato Branco (PR)", position: "50% 50%" },
  },
  {
    id: "proximo",
    kicker: "O próximo capítulo",
    word: "a seguir",
    title: "A história continua",
    text: "Cada corrida é uma nova oportunidade de aprender, evoluir e chegar mais perto dos seus sonhos.",
    tone: "dark",
    media: { kind: "none" },
  },
];
