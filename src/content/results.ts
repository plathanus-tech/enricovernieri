/**
 * Resultados informados na apresentação do piloto (2022–2025) e, para 2026, na matéria do Portal Palhoça (14/09/2026).
 * position: 1 = campeão, 2 = vice, n = enésimo colocado.
 * A temporada 2026 está em andamento: acrescentar aqui os próximos resultados (Brasileiro, Open do Brasileiro, Catarinense).
 * Copa Pato-Branquense 2026: vice na 1ª etapa, informado pela família (post do Instagram de 30/05/2026).
 */
export type Result = { year: number; event: string; position: number; /** detalhe curto, ex.: "1ª etapa" */ note?: string };

export const results: Result[] = [
  { year: 2026, event: "Campeonato Paranaense", position: 1 },
  { year: 2026, event: "Copa Pato-Branquense", note: "1ª etapa", position: 2 },
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
  podiums: results.filter((r) => r.position <= 3).length,
  seasons: new Set(results.map((r) => r.year)).size,
};

export const mainChampionships = [
  "Campeonato Brasileiro",
  "Campeonato Sul-Brasileiro",
  "Campeonato Catarinense",
  "Campeonato Gaúcho",
  "Campeonato Paranaense",
] as const;

export const cups = ["Copa Pato-Branquense", "Copa Beto Carrero", "Copa Sicredi Lages", "Copa Velopark", "Copa Ingleses"] as const;

export const positionIn = (event: string, year: number) =>
  results.find((r) => r.event === event && r.year === year)?.position ?? null;
