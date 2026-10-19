"use client";

import Image from "next/image";
import { useCallback, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Placeholder } from "./Placeholder";
import { RaceNumber } from "./RaceNumber";
import { Reveal } from "./Reveal";
import { pilot } from "@/content/pilot";
import { seasons } from "@/content/seasons";

const ease = [0.2, 0.8, 0.2, 1] as const;

const grid = {
  backgroundImage:
    "linear-gradient(to right, rgb(10 11 10 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(10 11 10 / 0.05) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
};

function Label({ children, right }: { children: string; right?: string }) {
  return (
    <div className="flex items-center justify-between border-t-2 border-ink pt-4">
      <p className="eyebrow flex items-center gap-4 text-ink">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink" />
        {children}
      </p>
      {right && <p className="eyebrow text-mute-light">{right}</p>}
    </div>
  );
}

function Arrow({ dir, onClick, label }: { dir: "prev" | "next"; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-12 w-14 -skew-x-12 items-center justify-center bg-ink text-white transition-colors hover:bg-mint hover:text-ink"
    >
      <svg aria-hidden viewBox="0 0 24 24" className={`h-5 w-5 skew-x-12 ${dir === "prev" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="square" />
      </svg>
    </button>
  );
}

export function StoryBeginnings() {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([seasons.length - 1, 0]);
  const season = seasons[index];

  const go = useCallback((to: number) => {
    setState(([cur]) => {
      const next = (to + seasons.length) % seasons.length;
      return [next, to > cur ? 1 : -1];
    });
  }, []);
  const step = (d: number) => setState(([cur]) => [(cur + d + seasons.length) % seasons.length, d]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const slide = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 70 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -70 }),
  };

  return (
    <section aria-labelledby="comeco-title" className="on-light relative overflow-hidden bg-paper text-ink" style={grid}>
      {/* 1. Começo */}
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">
        <Label right="Capítulo 01">Começo</Label>
        <h2 id="comeco-title" className="sr-only">Começo e resultados por ano</h2>

        <Reveal variant="wipe" className="mt-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-ink-3 md:aspect-[21/9]">
            <Image src="/photos/kart-action-1.png" alt="Enrico acelerando no kart número 5" fill sizes="100vw" className="object-cover object-[60%_55%]" priority={false} />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <p className="text-[clamp(1.6rem,3.6vw,3rem)] font-semibold leading-[1.12] tracking-tight">
              Uma paixão que virou rotina e depois sonho. Aos {pilot.startedAtAge} anos, o Enrico já sabia onde queria estar: dentro de um kart. Desde {pilot.trainingSince} ele treina com dedicação e, em {pilot.debut.year}, estreia na {pilot.debut.event}, categoria {pilot.debut.category}.
            </p>
          </Reveal>
          <dl className="grid grid-cols-3 content-start gap-4 border-t-2 border-ink pt-4 lg:col-span-4 lg:grid-cols-1 lg:border-t-0 lg:pt-0">
            {[
              { l: "Primeira paixão", v: `Aos ${pilot.startedAtAge}` },
              { l: "Treinos desde", v: String(pilot.trainingSince) },
              { l: "Estreia", v: String(pilot.debut.year) },
            ].map((s) => (
              <div key={s.l} className="lg:flex lg:items-end lg:justify-between lg:border-b lg:border-line-light lg:pb-3">
                <dt className="eyebrow text-mute-light">{s.l}</dt>
                <dd className="mt-1"><RaceNumber value={s.v.replace("Aos ", "")} className="text-5xl lg:text-6xl" label={s.v} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 2. Resultados por ano */}
      <div className="relative bg-paper-2/70 py-16 md:py-24" onKeyDown={onKey}>
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Label right={`${String(index + 1).padStart(2, "0")} / ${String(seasons.length).padStart(2, "0")}`}>Resultados por ano</Label>

          <div className="relative mt-8 min-h-[34rem] md:min-h-[38rem]" role="group" aria-roledescription="carrossel" aria-label="Temporadas do Enrico">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.article
                key={season.year}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.01 : 0.45, ease }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) step(1);
                  else if (info.offset.x > 80) step(-1);
                }}
                className="relative grid cursor-grab gap-8 active:cursor-grabbing md:grid-cols-12 md:items-center"
                aria-label={`Temporada ${season.year}`}
              >
                {/* palavra gigante ao fundo */}
                <p aria-hidden className="display pointer-events-none absolute right-0 top-0 -z-0 select-none whitespace-nowrap text-right text-[clamp(5rem,17vw,15rem)] text-transparent [-webkit-text-stroke:2px_rgb(10_11_10_/_0.11)] md:top-4">
                  {season.ghost}
                </p>

                <div className="relative z-10 md:col-span-5">
                  <div className="relative mx-auto mb-10 max-w-[440px] -rotate-2 md:mx-0 md:mb-0">
                    <div aria-hidden className="absolute -bottom-3 -right-3 left-3 top-3 rounded-md bg-mint" />
                    <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-ink-3">
                      {season.media.kind === "image" ? (
                        <Image src={season.media.src} alt={season.media.alt} fill sizes="(min-width:768px) 36vw, 90vw" className="object-cover" style={{ objectPosition: season.media.position }} draggable={false} />
                      ) : season.media.kind === "slot" ? (
                        <Placeholder className="h-full w-full !border-white/40">{season.media.note}</Placeholder>
                      ) : null}
                    </div>
                    <RaceNumber value={season.year} className="absolute -bottom-6 -left-3 text-[clamp(4.2rem,9vw,7rem)] text-ink drop-shadow-[0_0_0_#fff] [filter:drop-shadow(3px_3px_0_var(--color-mint))]" label={`Ano ${season.year}`} />
                  </div>
                </div>

                <div className="relative z-10 md:col-span-7 md:pl-6">
                  <h3 className="display text-[clamp(2.4rem,5.4vw,4.6rem)]">{season.title}</h3>
                  <p className="mt-4 max-w-xl text-lg text-mute-light">{season.text}</p>
                  <ul className="mt-6 grid max-w-xl gap-1">
                    {season.facts.map((f) => (
                      <li key={f} className="flex items-center gap-3 border-b border-line-light py-2 font-display text-xl font-bold italic uppercase tracking-wide">
                        <span aria-hidden className="h-2.5 w-2.5 shrink-0 -skew-x-12 bg-ink" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {season.source && (
                    <p className="mt-4 text-sm text-mute-light">
                      Fonte:{" "}
                      <a href={season.source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-mint-ink">
                        {season.source.label}
                      </a>
                    </p>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* controles */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-5">
            <div className="flex gap-2">
              <Arrow dir="prev" label="Temporada anterior" onClick={() => step(-1)} />
              <Arrow dir="next" label="Próxima temporada" onClick={() => step(1)} />
            </div>
            <ul className="flex flex-wrap gap-1.5" aria-label="Ir para a temporada">
              {seasons.map((s, i) => (
                <li key={s.year}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === index ? "true" : undefined}
                    className={`min-h-11 min-w-16 px-3 font-display text-xl font-extrabold italic transition-colors ${i === index ? "bg-ink text-mint" : "border border-ink/40 hover:bg-ink hover:text-white"}`}
                  >
                    {s.year}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p role="status" aria-live="polite" className="sr-only">{`Temporada ${season.year}: ${season.title}`}</p>
        </div>
      </div>

      {/* 3. Frase */}
      <div className="bg-ink px-5 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-[1100px]">
          <Label right="Capítulo 02">Em suas palavras</Label>
          <blockquote className="display mt-10 text-[clamp(2.2rem,6vw,5rem)] [&_*]:text-white">
            <span className="text-mint">“</span>
            {pilot.creed}
            <span className="text-mint">”</span>
          </blockquote>
          <p className="eyebrow mt-6 text-mint">Enrico Vernieri</p>
        </div>
      </div>
    </section>
  );
}
