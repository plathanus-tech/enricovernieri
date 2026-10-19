import { positionLabel, results } from "./results";
import type { Media } from "./story";

/**
 * Temporadas para a variante "Começo + resultados por ano" da história.
 * Os fatos de 2022–2025 vêm de results.ts; os de 2026, da matéria do Portal Palhoça (14/09/2026).
 */
export type Season = {
  year: number;
  /** Palavra gigante ao fundo do slide, em contorno. */
  ghost: string;
  title: string;
  text: string;
  facts: string[];
  media: Media;
  source?: { label: string; href: string };
};

const factsOf = (year: number) =>
  results
    .filter((r) => r.year === year)
    .sort((a, b) => a.position - b.position)
    .map((r) => `${positionLabel(r.position)} · ${r.event.replace("Campeonato ", "")}${r.note ? ` (${r.note})` : ""}`);

export const seasons: Season[] = [
  {
    year: 2022,
    ghost: "Estreia",
    title: "A estreia nas pistas",
    text: "Na Copa Ingleses, categoria Mirim, o Enrico estreia com ótimo desempenho e termina entre os primeiros colocados.",
    facts: factsOf(2022),
    media: { kind: "image", src: "/photos/kart-action-1.png", alt: "Enrico acelerando no kart número 5", position: "60% 50%" },
  },
  {
    year: 2023,
    ghost: "Vice",
    title: "Entre os grandes",
    text: "Começa a disputar os principais campeonatos de kart do Brasil e conquista o primeiro vice-campeonato, na Copa Velopark.",
    facts: factsOf(2023),
    media: { kind: "image", src: "/photos/paddock-mechanic.png", alt: "Bastidores no paddock: ajuste no capacete antes da corrida", position: "50% 50%" },
  },
  {
    year: 2024,
    ghost: "Dois vices",
    title: "Subindo de nível",
    text: "A evolução aparece nos resultados: dois vice-campeonatos e posições melhores nos campeonatos nacionais.",
    facts: factsOf(2024),
    media: { kind: "image", src: "/photos/portrait-2.png", alt: "Enrico de capacete entre os karts no paddock", position: "50% 30%" },
  },
  {
    year: 2025,
    ghost: "Campeão",
    title: "O ano dos títulos",
    text: "Três títulos e o vice-campeonato brasileiro: o ápice de uma temporada de evolução constante.",
    facts: factsOf(2025),
    media: { kind: "image", src: "/photos/kart-action-2.png", alt: "Enrico contornando uma curva com o kart número 5", position: "55% 55%" },
  },
  {
    year: 2026,
    ghost: "Paranaense",
    title: "Campeão paranaense",
    text: "Vice-campeão na primeira etapa da Copa Pato-Branquense e, na 62ª edição do Campeonato Paranaense, em Pato Branco (PR), campeão da categoria Cadete entre 17 pilotos. Foi o 7º no treino classificatório, terminou a primeira bateria em 3º, na chuva, venceu a segunda e a final.",
    facts: [...factsOf(2026), "Kartódromo Ayrton Senna, Pato Branco (PR)"],
    media: { kind: "slot", note: "Foto do título paranaense (troféu, pódio ou comemoração)." },
    source: {
      label: "Portal Palhoça, 14/09/2026",
      href: "https://www.portalpalhoca.com.br/noticia/esporte/piloto-de-kart-de-palhoca-conquista-titulo-paranaense/",
    },
  },
];
