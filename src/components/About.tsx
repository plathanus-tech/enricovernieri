"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { RaceNumber } from "./RaceNumber";
import { Placeholder } from "./Placeholder";
import { pilot } from "@/content/pilot";
import { site } from "@/content/site";

type Slot = { label: string; value: ReactNode };
type Tab = {
  id: string;
  label: string;
  title: string;
  /** `placeholder`: enquanto `site.showPlaceholders` estiver ligado, mostra um aviso pedindo a foto no lugar de `src`. */
  image: { src: string; alt: string; position: string; placeholder?: string };
  slots?: Slot[];
  body: ReactNode;
};

const ease = [0.2, 0.8, 0.2, 1] as const;

function buildTabs(next?: string): Tab[] {
  return [
    {
      id: "piloto",
      label: "O piloto",
      title: "Quem é o Enrico",
      image: { src: "/photos/portrait-1.png", alt: "Enrico de capacete e macacão de corrida, de braços cruzados e com o olhar atento, no paddock (foto em preto e branco)", position: "50% 22%" },
      slots: [
        { label: "Nascido em", value: pilot.born },
        { label: "Cidade", value: "Palhoça (SC)" },
        { label: "Categoria", value: "Cadete" },
        { label: "Treinando desde", value: pilot.trainingSince },
      ],
      body: (
        <p>
          Piloto de kart de Palhoça (SC). A paixão pelo automobilismo começou cedo, aos {pilot.startedAtAge} anos, e desde {pilot.trainingSince} ele treina com dedicação, sempre buscando evoluir e acelerar rumo aos seus sonhos.
        </p>
      ),
    },
    {
      id: "pista",
      label: "Na pista",
      title: "Evolução volta a volta",
      image: { src: "/photos/kart-action-1.png", alt: "Enrico pilotando o kart número 5 em uma curva da pista (foto em preto e branco)", position: "60% 50%" },
      slots: [
        { label: "Estreia", value: `${pilot.debut.year}, ${pilot.debut.event}` },
        { label: "Grandes campeonatos", value: `Desde ${pilot.inTheMainChampionshipsSince}` },
        { label: "Em 2025", value: "Vice brasileiro" },
        { label: "Em 2026", value: "Campeão paranaense" },
      ],
      body: (
        <ul className="grid gap-2">
          {pilot.championships.map((c) => (
            <li key={c} className="flex items-center gap-3">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 -skew-x-12 bg-mint" />
              {c}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "fora",
      label: "Fora das pistas",
      title: "Uma criança em formação",
      image: { src: "/photos/portrait-2.png", alt: "Enrico de capacete e macacão, de braços cruzados, em pé entre os karts no paddock (foto em preto e branco)", position: "50% 30%", placeholder: "Foto espontânea do Enrico praticando taekwondo" },
      body: (
        <>
          <p>
            Aos poucos, o kart também ensina a lidar com a pressão, a frustração e a emoção das conquistas. A cada experiência, Enrico amadurece, com a família sempre por perto, apoiando cada etapa dessa jornada.
          </p>
          <Placeholder className="mt-4">Hobbies, escola e o que ele gosta de fazer. Texto na voz do Enrico, aprovado pelos responsáveis.</Placeholder>
        </>
      ),
    },
    {
      id: "preparacao",
      label: "Preparação",
      title: "Como ele se prepara",
      image: { src: "/photos/paddock-mechanic.png", alt: "Enrico de capacete, no kart, enquanto um homem de boné confere o equipamento ao lado (foto em preto e branco)", position: "50% 50%" },
      slots: [
        { label: "Treinos desde", value: pilot.trainingSince },
        { label: "Equipe", value: "Reis Motorsports" },
      ],
      body: (
        <>
          <p>
            No Paranaense de 2026, os treinos foram difíceis e ele largou apenas em 7º. Na corrida, foi subindo: terminou a primeira bateria em 3º, venceu a segunda e a final.
          </p>
          <Placeholder className="mt-4">Fotos ou vídeo curto de treino e concentração antes da largada.</Placeholder>
        </>
      ),
    },
    {
      id: "sonho",
      label: "O sonho",
      title: "Para onde ele vai",
      image: { src: "/photos/kart-action-2.png", alt: "Enrico contornando uma curva com o kart número 5, de capacete branco (foto em preto e branco)", position: "55% 55%" },
      slots: [
        { label: "Ídolo", value: pilot.idol },
        ...(next ? [{ label: "Próximo desafio", value: next }] : []),
      ],
      body: (
        <>
          <blockquote className="border-l-4 border-mint pl-4 text-lg leading-snug text-white">“{pilot.creed}”</blockquote>
          <p className="mt-4 opacity-75">Seguir evoluindo a cada corrida, conquistar novos desafios e representar com orgulho sua região.</p>
        </>
      ),
    },
  ];
}

export function About({ nextChallenge, tone = "dark" }: { nextChallenge?: string; tone?: "dark" | "light" }) {
  const L = tone === "light";
  const tabs = buildTabs(nextChallenge);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const tab = tabs[active];

  const onKey = (e: KeyboardEvent) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (active + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <section id="quem-sou" aria-labelledby="quem-sou-title" className={`relative isolate overflow-clip py-24 md:py-32 ${L ? "on-light bg-paper text-ink" : "bg-ink-2"}`}>
      <div aria-hidden className={`pointer-events-none absolute -left-[8vw] top-1/2 -z-10 -translate-y-1/2 select-none text-[min(120vw,1100px)] ${L ? "text-ink/[0.06]" : "text-white/[0.05]"}`}>
        <RaceNumber value={pilot ? 5 : 5} outline />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className={`eyebrow flex items-center gap-3 ${L ? "text-mint-ink" : "text-mint"}`}>
          <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
          <span>Quem sou</span>
        </p>
        <h2 id="quem-sou-title" className="sr-only">Quem sou</h2>
        <p className={`mt-5 max-w-xl text-lg ${L ? "text-mute-light" : "text-mute-dark"}`}>Conheça o piloto, sua trajetória, suas conquistas e o sonho que o move a cada corrida.</p>

        <LayoutGroup>
          <div className="mt-12 flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
            {/* seletor: no celular fica fixo logo abaixo do menu enquanto a seção é rolada, para trocar de aba sem voltar ao topo */}
            <div className={`min-w-0 max-lg:sticky max-lg:top-[var(--header-h)] max-lg:z-30 max-lg:-mx-5 max-lg:border-b max-lg:py-2 lg:col-span-3 ${L ? "max-lg:border-line-light max-lg:bg-paper" : "max-lg:border-line-dark max-lg:bg-ink-2"}`}>
              <div role="tablist" aria-label="Perfil do piloto" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-2 overflow-x-auto px-5 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
                {tabs.map((t, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={t.id}
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                      role="tab"
                      id={`tab-${t.id}`}
                      aria-selected={on}
                      aria-controls="painel-perfil"
                      tabIndex={on ? 0 : -1}
                      onClick={() => setActive(i)}
                      className={`relative flex min-h-12 shrink-0 items-center gap-3 border px-4 py-2 text-left transition-colors lg:border-0 lg:border-b lg:px-3 lg:py-4 ${L ? "border-line-light lg:border-line-light" : "border-line-dark lg:border-line-dark"} ${on ? "border-mint text-ink lg:text-ink" : L ? "text-ink/80 hover:text-mint-ink" : "text-white/80 hover:text-mint"}`}
                    >
                      {on && <motion.span layoutId="tab-bg" aria-hidden className="absolute inset-0 -z-0 bg-mint" transition={{ duration: reduce ? 0 : 0.35, ease }} />}
                      <span className="relative z-10 font-display text-sm font-bold italic tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display relative z-10 text-xl lg:text-3xl">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* retrato */}
            <div className="relative min-w-0 lg:col-span-5">
              <div className="relative mx-auto aspect-square w-full max-w-[520px] lg:aspect-[4/5] lg:max-w-none">
                <div aria-hidden className="slant-r absolute -right-3 -top-3 bottom-3 left-3 bg-mint" />
                <div className="slant-r absolute inset-0 overflow-hidden bg-ink-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={tab.image.src + tab.id}
                      className="absolute inset-0"
                      initial={reduce ? false : { opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      {tab.image.placeholder && site.showPlaceholders ? (
                        <div className="absolute inset-0 flex items-start justify-center p-8 pt-[22%] text-center">
                          <div className="w-full max-w-[16rem] border-2 border-dashed border-white/35 p-5 text-sm text-mute-dark">
                            <span className="mb-1 block font-display text-xs font-bold uppercase italic tracking-[0.18em]">Foto a definir</span>
                            {tab.image.placeholder}
                          </div>
                        </div>
                      ) : (
                        <Image src={tab.image.src} alt={tab.image.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" style={{ objectPosition: tab.image.position }} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 pb-5 pl-[calc(8%+1.25rem)] pr-[calc(4%+0.75rem)] md:pb-7">
                    <div>
                      <p className="eyebrow text-mint">Piloto de kart</p>
                      <p className="display mt-1 text-[clamp(2rem,4.5vw,3.4rem)]">Enrico Vernieri</p>
                    </div>
                    <RaceNumber value={pilot ? 5 : 5} className="text-[clamp(4rem,9vw,7rem)] text-mint" label="Número 5" />
                  </div>
                </div>
              </div>
            </div>

            {/* painel */}
            <div className="min-w-0 lg:col-span-4" role="tabpanel" id="painel-perfil" aria-labelledby={`tab-${tab.id}`} tabIndex={0}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab.id}
                  initial={reduce ? false : { opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, ease }}
                  className={`border-t-4 border-mint p-6 md:p-8 ${L ? "bg-paper-2 [&_.text-white]:text-ink [&_.text-white\/75]:text-mute-light [&_.text-mute-dark]:text-mute-light [&_.border-white\/35]:border-ink/40" : "bg-ink/60"}`}
                >
                  <h3 className="display text-4xl md:text-5xl">{tab.title}</h3>
                  {tab.slots && (
                    <dl className={`mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-y py-5 ${L ? "border-line-light" : "border-line-dark"}`}>
                      {tab.slots.map((s) => (
                        <div key={s.label} className={tab.slots && tab.slots.length === 1 ? "col-span-2" : ""}>
                          <dt className={`eyebrow ${L ? "text-mute-light" : "text-mute-dark"}`}>{s.label}</dt>
                          <dd className={`display mt-1 text-2xl md:text-3xl ${L ? "text-ink" : "text-white"}`}>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div className={`mt-6 text-base leading-relaxed ${L ? "text-ink/85" : "text-white/85"}`}>{tab.body}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
