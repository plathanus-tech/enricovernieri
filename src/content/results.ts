/**
 * Resultados informados na apresentação do piloto (2022–2024), nos relatórios de atividades esportivas 2025 e 2026 (PIE, atualizado em 02/09/2026)
 * e, para o título paranaense de 2026, na matéria do Portal Palhoça (14/09/2026).
 * position: 1 = campeão, 2 = vice, n = enésimo colocado.
 * A temporada 2026 está em andamento: acrescentar aqui os próximos resultados (Open do Brasileiro e Campeonato Brasileiro).
 */
export type Result = { year: number; event: string; position: number; /** detalhe curto, ex.: "1ª etapa" */ note?: string };

export const results: Result[] = [
  { year: 2026, event: "Campeonato Paranaense", position: 1 },
  { year: 2026, event: "Campeonato Pato-Branquense", position: 1 },
  { year: 2026, event: "Campeonato Gaúcho", position: 3 },
  { year: 2026, event: "Campeonato Sul-Brasileiro", position: 4 },
  { year: 2025, event: "Campeonato Brasileiro", position: 2 },
  { year: 2025, event: "Campeonato Gaúcho", position: 1 },
  { year: 2025, event: "Copa Beto Carrero", position: 1 },
  { year: 2025, event: "Copa Sicredi Lages", position: 1 },
  { year: 2025, event: "Campeonato Catarinense", position: 3 },
  { year: 2024, event: "Campeonato Catarinense", position: 2 },
  { year: 2024, event: "Copa Beto Carrero", position: 2 },
  { year: 2024, event: "Campeonato Sul-Brasileiro", position: 8 },
  { year: 2024, event: "Campeonato Brasileiro", position: 19 },
  { year: 2023, event: "Copa Velopark", position: 2 },
  { year: 2023, event: "Campeonato Gaúcho", position: 4 },
  { year: 2023, event: "Campeonato Catarinense", position: 11 },
  { year: 2023, event: "Campeonato Sul-Brasileiro", position: 15 },
  { year: 2023, event: "Campeonato Brasileiro", position: 23 },
  { year: 2022, event: "Copa Ingleses", position: 4 },
];

export const years = [2026, 2025, 2024, 2023, 2022];

export const positionLabel = (p: number) =>
  p === 1 ? "Campeão" : p === 2 ? "Vice-campeão" : `${p}º lugar`;

/** Totais calculados somente sobre os resultados listados acima. */
export const totals = {
  titles: results.filter((r) => r.position === 1).length,
  vices: results.filter((r) => r.position === 2).length,
  /** Pódios no total, informado pela família. No kart, pódio são os 5 primeiros colocados, em etapas de todas as temporadas (não só os resultados listados acima). */
  podiums: 24,
  seasons: new Set(results.map((r) => r.year)).size,
};

export const mainChampionships = [
  "Campeonato Brasileiro",
  "Campeonato Sul-Brasileiro",
  "Campeonato Catarinense",
  "Campeonato Gaúcho",
  "Campeonato Paranaense",
] as const;

export const cups = ["Campeonato Pato-Branquense", "Copa Beto Carrero", "Copa Sicredi Lages", "Copa Velopark", "Copa Ingleses"] as const;

export const resultIn = (event: string, year: number) => results.find((r) => r.event === event && r.year === year) ?? null;

export const positionIn = (event: string, year: number) => resultIn(event, year)?.position ?? null;
