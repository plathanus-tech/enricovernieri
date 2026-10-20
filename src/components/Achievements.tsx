import Image from "next/image";
import { RaceNumber } from "./RaceNumber";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SpeedingNumber } from "./SpeedingNumber";
import { cups, mainChampionships, positionIn, positionLabel, results, totals } from "@/content/results";

const matrixYears = [2023, 2024, 2025, 2026];
const short: Record<string, string> = {
  "Campeonato Brasileiro": "Brasileiro",
  "Campeonato Sul-Brasileiro": "Sul-Brasileiro",
  "Campeonato Catarinense": "Catarinense",
  "Campeonato Gaúcho": "Gaúcho",
  "Campeonato Paranaense": "Paranaense",
};

function Cell({ position, event, year }: { position: number | null; event: string; year: number }) {
  if (position === null)
    return (
      <td className="px-2 py-4 text-center align-middle">
        <span aria-hidden className="text-2xl text-ink/30">–</span>
        <span className="sr-only">{`${event} ${year}: sem resultado informado`}</span>
      </td>
    );
  const podium = position <= 3;
  return (
    <td className="px-1.5 py-3 text-center align-middle sm:px-3">
      <div className={`mx-auto flex min-h-16 max-w-[7.5rem] flex-col items-center justify-center px-2 py-2 ${position === 1 ? "bg-mint text-ink" : podium ? "bg-ink text-mint" : "text-ink"}`}>
        <span className="sr-only">{`${event} ${year}: ${positionLabel(position)}`}</span>
        <span aria-hidden className="flex items-start gap-0.5">
          <RaceNumber value={position} className="text-[2.2rem] sm:text-[2.8rem]" />
          <span className="display mt-1 text-lg">º</span>
        </span>
        {podium && (
          <span aria-hidden className="eyebrow -mt-0.5 text-[0.7rem]">
            {position === 1 ? "Campeão" : position === 2 ? "Vice" : "Pódio"}
          </span>
        )}
      </div>
    </td>
  );
}

export function Achievements() {
  return (
    <section id="conquistas" aria-labelledby="conquistas-title" className="on-light relative overflow-hidden bg-paper py-24 text-ink md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading eyebrow="Títulos e conquistas" tone="light" className="max-w-4xl">
          <span id="conquistas-title">Resultados que mostram a evolução</span>
        </SectionHeading>

        {/* destaques */}
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden bg-ink p-7 text-white md:p-10 lg:col-span-5">
            <p className="eyebrow text-mint">Títulos conquistados</p>
            <div className="mt-2 flex items-end gap-4">
              <SpeedingNumber value={totals.titles} from={0} duration={1} maxBlur={12} className="text-[clamp(9rem,22vw,15rem)] text-mint" label={`${totals.titles} títulos`} />
              <span className="display pb-6 text-4xl md:text-5xl">títulos</span>
            </div>
            <ul className="mt-2 grid gap-2 border-t border-line-dark pt-5 font-display text-xl font-bold italic uppercase tracking-wide">
              {results
                .filter((r) => r.position === 1)
                .map((r) => (
                  <li key={r.event + r.year} className="flex items-center gap-3">
                    <span aria-hidden className="h-2.5 w-2.5 -skew-x-12 bg-mint" />
                    {r.event}
                    <span className="ml-auto text-mute-dark">{r.year}</span>
                  </li>
                ))}
            </ul>
          </Reveal>

          <div className="grid gap-6 lg:col-span-7">
            <Reveal delay={0.1} className="grid grid-cols-3 border-y-2 border-ink">
              {[
                { v: totals.vices, l: "vice-campeonatos" },
                { v: totals.podiums, l: "pódios" },
                { v: totals.seasons, l: "temporadas" },
              ].map((s, i) => (
                <div key={s.l} className={`px-3 py-6 sm:px-6 ${i ? "border-l border-line-light" : ""}`}>
                  <SpeedingNumber value={s.v} duration={1.2} maxBlur={9} className="text-[clamp(3.6rem,9vw,6.5rem)]" label={`${s.v} ${s.l}`} />
                  <p className="eyebrow mt-2 text-mute-light">{s.l}</p>
                </div>
              ))}
            </Reveal>
            <p className="max-w-xl text-sm text-mute-light">
              Títulos e vice-campeonatos contados sobre os resultados informados de 2022 a 2026 (lista completa abaixo). No kart, pódio são os 5 primeiros colocados, e o total de pódios foi informado pela família. A temporada 2026 está em andamento e será atualizada a cada etapa.
            </p>
            <Reveal variant="wipe">
              <figure>
                <div className="relative aspect-[750/417] overflow-hidden rounded-md bg-ink-3">
                  <Image
                    src="/photos/cba-prize-giving.jpg"
                    alt="Enrico de terno, segurando o troféu da CBA, diante do painel da cerimônia de premiação da CBA em São Paulo"
                    fill
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 45%" }}
                  />
                </div>
                <figcaption className="eyebrow mt-2 text-mute-light">Cerimônia de premiação da CBA, em São Paulo (30/03/2026)</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* evolução nos campeonatos */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="display text-4xl md:text-5xl">Evolução nos campeonatos</h3>
            <p className="mt-4 text-lg text-mute-light">
              Do 23º lugar no Brasileiro de 2023 ao vice-campeonato em 2025. O mesmo caminho aparece no Catarinense e no Gaúcho, e em 2026 veio o título paranaense.
            </p>
            <p className="mt-3 text-sm text-mute-light">O traço (–) indica que não há resultado informado nessa temporada.</p>
          </div>
          <div className="overflow-x-auto lg:col-span-8" role="region" aria-label="Tabela de posições por campeonato" tabIndex={0}>
            <table className="w-full min-w-[520px] border-collapse">
              <caption className="sr-only">Posição final do Enrico nos principais campeonatos, de 2023 a 2026</caption>
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="eyebrow py-3 text-left text-mute-light">Campeonato</th>
                  {matrixYears.map((y) => (
                    <th key={y} scope="col" className="display py-3 text-center text-2xl">{y}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mainChampionships.map((c) => (
                  <tr key={c} className="border-b border-line-light">
                    <th scope="row" className="display w-[24%] py-3 pr-2 text-left text-xl sm:text-3xl">{short[c]}</th>
                    {matrixYears.map((y) => (
                      <Cell key={y} position={positionIn(c, y)} event={c} year={y} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* copas */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h3 className="display text-4xl md:text-5xl lg:col-span-4">Copas</h3>
          <ul className="divide-y divide-line-light border-y-2 border-ink lg:col-span-8">
            {cups.map((cup) => {
              const rows = results.filter((r) => r.event === cup).sort((a, b) => a.year - b.year);
              return (
                <li key={cup} className="grid items-center gap-3 py-5 sm:grid-cols-[1fr_auto]">
                  <p className="display text-3xl sm:text-4xl">{cup}</p>
                  <ul className="flex flex-wrap gap-2">
                    {rows.map((r) => (
                      <li
                        key={r.year}
                        className={`flex items-baseline gap-2 px-3 py-1.5 font-display text-lg font-bold italic uppercase ${r.position === 1 ? "bg-mint" : r.position === 2 ? "bg-ink text-mint" : "border border-ink/40"}`}
                      >
                        <span>{r.year}</span>
                        <span>{positionLabel(r.position)}{r.note ? ` · ${r.note}` : ""}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
