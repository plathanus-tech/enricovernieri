import { Button } from "./Button";
import { Placeholder } from "./Placeholder";
import { RaceNumber } from "./RaceNumber";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { challenges, type Challenge } from "@/content/events";
import { formatDate } from "@/lib/format";
import { whatsappLink } from "@/content/site";

const parts = (c: Challenge) => {
  const iso = c.date;
  const d = new Date(iso + "T00:00:00Z");
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    endDay: c.endDate ? String(new Date(c.endDate + "T00:00:00Z").getUTCDate()).padStart(2, "0") : null,
    month: formatDate(iso, { month: "long" }),
    year: d.getUTCFullYear(),
    weekday: formatDate(iso, { weekday: "long" }),
  };
};

/** Título da etapa: vira link (abre em nova aba) quando a etapa tem `href` em events.ts. */
function TitleLink({ href, children, arrow = true }: { href?: string; children: React.ReactNode; arrow?: boolean }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group/t inline decoration-mint decoration-2 underline-offset-[0.14em] transition-colors hover:text-mint hover:underline">
      {children}
      {arrow && (
        <span aria-hidden className="ml-[0.25em] inline-block text-[0.6em] text-mint transition-transform group-hover/t:-translate-y-0.5 group-hover/t:translate-x-0.5">↗</span>
      )}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

function Featured({ c }: { c: Challenge }) {
  const p = parts(c);
  const where = [c.track, c.city].filter(Boolean).join(" · ");
  return (
    <article aria-label={`Próxima etapa: ${c.championship}`} className="relative grid overflow-hidden bg-ink-2 md:grid-cols-[auto_1fr]">
      <div className="slant-r bg-mint px-8 py-8 text-ink md:px-12 md:py-10">
        <p className="eyebrow">Próxima etapa</p>
        <div className="mt-1 flex items-end gap-3">
          <RaceNumber value={p.day} className="text-[clamp(6rem,14vw,10rem)]" label={`dia ${p.day}`} />
        </div>
        {p.endDay && <p className="display mt-2 text-3xl">a {p.endDay}</p>}
        <p className="display text-3xl">
          {p.month} <span className="text-ink/60">{p.year}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center gap-3 px-6 py-8 md:px-12">
        <p className="eyebrow capitalize text-mint">{p.weekday}</p>
        <h3 className="display text-[clamp(2.2rem,5vw,4rem)]">
          <TitleLink href={c.href} arrow={false}>{c.championship}</TitleLink>
        </h3>
        {c.stage && <p className="display text-2xl text-white/80">{c.stage}</p>}
        {where && <p className="text-lg text-white/80">{where}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          {c.category && <span className="border border-white/40 px-3 py-1 font-display text-base font-bold italic uppercase">{c.category}</span>}
          {c.status && <span className="bg-white px-3 py-1 font-display text-base font-bold italic uppercase text-ink">{c.status}</span>}
        </div>
        {c.href && (
          <div className="mt-3">
            <Button href={c.href} variant="ghost-dark" external>Ver no site da CBA</Button>
          </div>
        )}
      </div>
    </article>
  );
}

function Compact({ c }: { c: Challenge }) {
  const p = parts(c);
  const where = [c.track, c.city].filter(Boolean).join(" · ");
  return (
    <li className="grid grid-cols-[auto_1fr] items-center gap-5 border-b border-line-dark py-5 sm:grid-cols-[7rem_1fr_auto]">
      <div className="text-mint">
        <RaceNumber value={p.day} className="text-5xl" label={`dia ${p.day}`} />
        <p className="eyebrow mt-1 text-white/80">{p.endDay ? `a ${p.endDay} ` : ""}{p.month.slice(0, 3)} {p.year}</p>
      </div>
      <div>
        <h4 className="display text-2xl md:text-3xl">
          <TitleLink href={c.href}>
            {c.championship}
            {c.stage ? ` · ${c.stage}` : ""}
          </TitleLink>
        </h4>
        {where && <p className="text-white/70">{where}</p>}
      </div>
      {(c.category || c.status) && <p className="eyebrow col-span-2 text-mute-dark sm:col-span-1">{[c.category, c.status].filter(Boolean).join(" · ")}</p>}
    </li>
  );
}

export function Challenges() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = challenges.filter((c) => (c.endDate ?? c.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const [next, ...rest] = upcoming;

  return (
    <section id="desafios" aria-labelledby="desafios-title" className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading eyebrow="Calendário" className="max-w-3xl">
          <span id="desafios-title">Próximos desafios</span>
        </SectionHeading>

        {next ? (
          <div className="mt-12 grid gap-8">
            <Reveal>
              <Featured c={next} />
            </Reveal>
            {rest.length > 0 && (
              <ul aria-label="Etapas seguintes" className="border-t border-line-dark">
                {rest.map((c) => (
                  <Compact key={c.id} c={c} />
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="relative overflow-hidden bg-ink-2 p-8 md:p-12 lg:col-span-7">
              <p className="eyebrow text-mint">Calendário em preparação</p>
              <p className="display mt-3 text-[clamp(2.2rem,5vw,3.8rem)]">A próxima largada ainda vai ser anunciada</p>
              <p className="mt-4 max-w-xl text-lg text-white/80">
                As etapas e campeonatos da próxima temporada aparecem aqui assim que forem confirmados, com data, kartódromo e categoria.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={whatsappLink()} external>Falar com os responsáveis</Button>
              </div>
            </div>
            <div className="grid content-start gap-4 lg:col-span-5">
              <Placeholder>
                Estrutura pronta para a etapa principal: data, campeonato, etapa, kartódromo, cidade, categoria e status. Preencher em <code className="text-mint">src/content/events.ts</code>.
              </Placeholder>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
