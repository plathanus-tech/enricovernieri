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
    media: { kind: "image", src: "/photos/nasce-um-piloto.jpg", alt: "Enrico ainda criança, de macacão de corrida roxo, sorrindo ao lado da pista, com capacetes aos pés", position: "50% 22%" },
  },
  {
    id: "aos-4",
    kicker: "Aos",
    numeral: "4",
    word: "anos",
    title: "A paixão aparece cedo",
    text: "O amor pelo automobilismo começa ainda criança. Em junho de 2021, aos 4 anos, o Enrico começa no kart, que para ele nunca foi só velocidade: é estratégia, dedicação e confiança em cada detalhe.",
    tone: "light",
    media: { kind: "video", src: "/videos/aos-4-anos.mp4", poster: "/videos/aos-4-anos-poster.jpg", label: "Vídeo dos primeiros treinos do Enrico no kart, ainda pequeno, em dois momentos" },
  },
  {
    id: "2021",
    kicker: "Ano",
    numeral: "2021",
    title: "Começam os treinos",
    text: "Desde junho de 2021, o Enrico treina com dedicação para evoluir a cada volta.",
    tone: "dark",
    media: { kind: "image", src: "/photos/comecam-os-treinos.jpg", alt: "Enrico pequeno, de capacete azul e luvas verdes, ao volante de um kart com o número 5, nos boxes", position: "62% 38%" },
  },
  {
    id: "2022",
    kicker: "Ano",
    numeral: "2022",
    title: "A estreia nas pistas",
    text: "Na Copa Ingleses, categoria Mirim, o Enrico estreia com ótimo desempenho e termina entre os primeiros colocados.",
    facts: ["4º lugar na Copa Ingleses"],
    tone: "light",
    media: { kind: "image", src: "/photos/estreia-nas-pistas.jpg", alt: "Enrico, de capacete branco e macacão roxo, pilotando um kart de lado em alta velocidade, com a pista e os pneus pintados desfocados ao fundo", position: "62% 58%" },
  },
  {
    id: "2023",
    kicker: "Ano",
    numeral: "2023",
    title: "Os grandes campeonatos",
    text: "Desde 2023, ele disputa os principais campeonatos de kart do Brasil: Brasileiro, Sul-Brasileiro, Catarinense e Gaúcho. É também o ano do primeiro vice-campeonato.",
    facts: ["Vice-campeão da Copa Velopark", "4º no Campeonato Gaúcho", "11º no Catarinense", "15º no Sul-Brasileiro", "23º no Brasileiro"],
    tone: "dark",
    media: { kind: "image", src: "/photos/grandes-campeonatos.jpg", alt: "Enrico, de macacão verde, sentado no chão com o troféu da Velopark Cup nas mãos, ao lado de outro menino e de dois homens de boné, todos sorrindo", position: "58% 45%" },
  },
  {
    id: "2024",
    kicker: "Ano",
    numeral: "2024",
    title: "Subindo de nível",
    text: "A evolução aparece nos resultados: dois vice-campeonatos e posições melhores nos campeonatos nacionais.",
    facts: ["Vice-campeão Catarinense", "Vice-campeão da Copa Beto Carrero", "8º no Sul-Brasileiro", "19º no Brasileiro"],
    tone: "light",
    media: { kind: "video", src: "/videos/subindo-de-nivel-2024.mp4", poster: "/videos/subindo-de-nivel-2024-poster.jpg", label: "Vídeo da temporada 2024 do Enrico, com imagens das corridas e da premiação no Kartódromo Beto Carrero" },
  },
  {
    id: "2025",
    kicker: "Ano",
    numeral: "2025",
    title: "O ano dos títulos",
    text: "Três títulos e o vice-campeonato brasileiro: o ápice de uma temporada de evolução constante.",
    facts: ["Vice-campeão Brasileiro", "Campeão Gaúcho", "Campeão da Copa Beto Carrero", "Campeão da Copa Sicredi Lages", "3º no Catarinense"],
    tone: "dark",
    media: { kind: "video", src: "/videos/campeao-2025.mp4", poster: "/videos/campeao-2025-poster.jpg", label: "Vídeo da temporada 2025 do Enrico, com imagens do título da Copa Beto Carrero e das corridas" },
  },
  {
    id: "2026",
    kicker: "Ano",
    numeral: "2026",
    title: "Campeão paranaense e pato-branquense",
    text: "Na 62ª edição do Campeonato Paranaense de Kart, em Pato Branco (PR), é campeão da categoria Cadete entre 17 pilotos: foi o 7º no treino classificatório, subiu ao pódio na primeira bateria, venceu a segunda e a final.",
    facts: ["Campeão Paranaense, categoria Cadete", "Campeão do Campeonato Pato-Branquense", "3º no Campeonato Gaúcho", "4º no Sul-Brasileiro"],
    tone: "light",
    media: { kind: "image", src: "/photos/campeao-paranaense-enrico.jpg", alt: "Enrico no alto do pódio do Campeonato Paranaense, de óculos escuros e com o troféu erguido, em Pato Branco (PR)", position: "47% 50%" },
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
