import { positionIn, positionLabel } from "@/content/results";

/**
 * Seleção curta de feitos que servem de "assinatura" da trajetória. Cada item é buscado em results.ts (nada é digitado à mão):
 * se um resultado sair de lá, o item some da faixa. O Campeonato Catarinense ficou de fora de propósito:
 * a apresentação do piloto e a imprensa divergem sobre a posição em 2025.
 */
const PICKS = [
  { event: "Campeonato Paranaense", year: 2026 },
  { event: "Campeonato Brasileiro", year: 2025 },
  { event: "Campeonato Gaúcho", year: 2025 },
  { event: "Copa Beto Carrero", year: 2025 },
  { event: "Copa Sicredi Lages", year: 2025 },
  { event: "Copa Pato-Branquense", year: 2026, note: "1ª etapa" },
  { event: "Copa Beto Carrero", year: 2024 },
  { event: "Copa Velopark", year: 2023 },
] as const;

const items = PICKS.flatMap((p) => {
  const pos = positionIn(p.event, p.year);
  if (pos === null || pos > 2) return [];
  const note = "note" in p ? ` (${p.note})` : "";
  return [`${positionLabel(pos)} ${p.event.replace("Campeonato ", "")} ${p.year}${note}`];
});

function Cross() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square">
      <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    </svg>
  );
}

/** Uma volta completa do conteúdo, repetida para que cada metade da faixa seja mais larga que qualquer tela. */
function Group() {
  return (
    <div className="flex shrink-0 items-center">
      {[0, 1].flatMap((rep) =>
        items.map((t) => (
          <span key={`${rep}-${t}`} className="flex items-center gap-5 whitespace-nowrap pr-5 font-display text-[0.95rem] font-extrabold italic uppercase leading-none tracking-wider md:gap-6 md:pr-6 md:text-[1.15rem]">
            {t}
            <Cross />
          </span>
        )),
      )}
    </div>
  );
}

/**
 * Faixa verde logo abaixo do hero. Animação só com CSS (transform), em loop contínuo e sem emenda: o trilho tem duas cópias idênticas
 * e se desloca exatamente metade da largura. Pausa ao passar o mouse (só em dispositivos com hover) e fica parada com movimento reduzido.
 */
export function AchievementsStrip() {
  if (items.length === 0) return null;
  return (
    <section aria-label="Principais conquistas" className="strip group relative z-10 flex h-11 items-center overflow-hidden bg-mint text-ink md:h-12">
      <p className="sr-only">Principais conquistas: {items.join("; ")}.</p>
      <div aria-hidden className="marquee-track strip-track">
        <Group />
        <Group />
      </div>
    </section>
  );
}
