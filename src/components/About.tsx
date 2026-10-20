"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { RaceNumber } from "./RaceNumber";
import { pilot } from "@/content/pilot";
import { site } from "@/content/site";
import { withBase } from "@/lib/base-path";

type Slot = { label: string; value: ReactNode };
type Tab = {
  id: string;
  label: string;
  title: string;
  /** `placeholder`: enquanto `site.showPlaceholders` estiver ligado, mostra um aviso pedindo a foto no lugar de `src`. */
  image: { src: string; alt: string; position: string; placeholder?: string; /** vídeo no lugar da foto: `src` vira a imagem de capa (poster) */ video?: { src: string; label: string } };
  slots?: Slot[];
  body: ReactNode;
};

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Vídeo curto no lugar da foto, com o mesmo tratamento em preto e branco. Começa parado, sem som; o botão alterna reproduzir e pausar. */
function TabVideo({ src, poster, label, position }: { src: string; poster: string; label: string; position: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };
  return (
    <div className="absolute inset-0">
      <video
        ref={ref}
        src={withBase(src)}
        poster={withBase(poster)}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover grayscale contrast-[1.05]"
        style={{ objectPosition: position }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
        className="absolute left-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-ink/45 text-white backdrop-blur-sm transition-colors hover:border-mint hover:text-mint"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l11-6.5z" />}
        </svg>
      </button>
    </div>
  );
}

type PrepItem =
  | { kind: "video"; src: string; poster: string; label: string; alt: string; position: string }
  | { kind: "image"; src: string; alt: string; position: string };

/** Miniaturas da aba "Preparação". A foto fica no meio, entre os dois vídeos de fisioterapia. */
const prep: PrepItem[] = [
  {
    kind: "video",
    src: "/videos/fisioterapia-1.mp4",
    poster: "/videos/fisioterapia-1-poster.jpg",
    label: "Vídeo: Enrico em exercícios de fisioterapia esportiva, com luzes coloridas",
    alt: "Enrico sentado na maca de fisioterapia, tocando botões que acendem em cores diferentes",
    position: "70% 50%",
  },
  {
    kind: "image",
    src: "/photos/preparacao-enrico.jpg",
    alt: "Enrico, de camiseta roxa e preta, ao lado de um homem de boné da Reis Motorsports, os dois olhando atentos para a pista",
    position: "40% 50%",
  },
  {
    kind: "video",
    src: "/videos/fisioterapia-2.mp4",
    poster: "/videos/fisioterapia-2-poster.jpg",
    label: "Vídeo: Enrico pegando bastões coloridos soltos no ar, em um exercício de reflexo",
    alt: "Enrico olhando para cima, de braços abertos, durante um exercício de reflexo com bastões coloridos",
    position: "30% 50%",
  },
];

/** Miniaturas da aba "Fora das pistas": tênis de mesa, bicicleta e taekwondo. */
const fora: PrepItem[] = [
  {
    kind: "video",
    src: "/videos/tenis-de-mesa.mp4",
    poster: "/videos/tenis-de-mesa-poster.jpg",
    label: "Vídeo: Enrico jogando tênis de mesa em casa",
    alt: "Enrico segurando uma raquete de tênis de mesa e uma bolinha laranja, em uma sala",
    position: "8% 50%",
  },
  {
    kind: "video",
    src: "/videos/bicicleta.mp4",
    poster: "/videos/bicicleta-poster.jpg",
    label: "Vídeo: Enrico andando de bicicleta em uma rua",
    alt: "Enrico, de capacete e casaco verde, visto de costas, andando de bicicleta em uma rua",
    position: "50% 50%",
  },
  {
    kind: "video",
    src: "/videos/taekwondo-aula.mp4",
    poster: "/videos/taekwondo-aula-poster.jpg",
    label: "Vídeo: Enrico em uma aula de taekwondo, quebrando uma tábua com um chute",
    alt: "Enrico de kimono dando um chute em uma tábua segurada pelo instrutor, em uma aula de taekwondo",
    position: "45% 50%",
  },
];

/** Miniaturas clicáveis; ao clicar, a foto ou o vídeo abre ampliado numa janela (dialog nativo: Esc e clique fora fecham). */
function MediaGallery({ items, label }: { items: PrepItem[]; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState<PrepItem | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open?.kind === "video") void video.current?.play().catch(() => {});
  }, [open]);

  return (
    <>
      <ul role="group" aria-label={label} className="mt-5 grid grid-cols-3 gap-2 md:gap-3">
        {items.map((it) => (
          <li key={it.src}>
            <button
              type="button"
              onClick={() => setOpen(it)}
              aria-label={it.kind === "video" ? `Assistir ampliado: ${it.label}` : `Ver ampliada: ${it.alt}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden bg-ink-3 focus-visible:outline-offset-4"
            >
              <Image
                src={it.kind === "video" ? it.poster : it.src}
                alt=""
                fill
                sizes="(min-width:1024px) 12vw, 28vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                style={{ objectPosition: it.position }}
              />
              {it.kind === "video" && (
                <span aria-hidden className="absolute bottom-2 left-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-ink/55 text-white backdrop-blur-sm transition-colors group-hover:border-mint group-hover:text-mint">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={open ? (open.kind === "video" ? open.label : open.alt) : "Mídia ampliada"}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
        className="m-auto max-h-[92svh] w-[min(92vw,720px)] overflow-visible bg-transparent p-0 text-white backdrop:bg-black/85"
      >
        {open && (
          <div className="relative">
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              aria-label="Fechar"
              className="absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center border border-white/40 text-white transition-colors hover:border-mint hover:text-mint"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 5l14 14M19 5 5 19" />
              </svg>
            </button>
            {open.kind === "video" ? (
              <video ref={video} src={withBase(open.src)} poster={withBase(open.poster)} controls playsInline loop aria-label={open.label} className="mx-auto max-h-[85svh] w-auto max-w-full bg-black" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={withBase(open.src)} alt={open.alt} className="mx-auto max-h-[85svh] w-auto max-w-full" />
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

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
        { label: "Categoria", value: "Mini 2T" },
        { label: "Treinando desde", value: pilot.startedAt },
      ],
      body: (
        <p>
          Piloto de kart de Palhoça (SC). A paixão pelo automobilismo começou cedo, aos {pilot.startedAtAge} anos, e desde {pilot.startedAt} ele treina com dedicação, sempre buscando evoluir e acelerar rumo aos seus sonhos.
        </p>
      ),
    },
    {
      id: "pista",
      label: "Na pista",
      title: "Evolução volta a volta",
      image: { src: "/photos/evolucao-enrico.jpg", alt: "Enrico, de capacete verde e laranja, pilotando o kart verde número 5 em uma curva da pista, com outros karts logo atrás", position: "38% 60%" },
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
      image: {
        src: "/videos/taekwondo-poster.jpg",
        alt: "Enrico, de cabelo curto, aplicando um chute no ar durante um treino de taekwondo com um colega em um tatame",
        position: "50% 55%",
        video: { src: "/videos/taekwondo.mp4", label: "Vídeo: Enrico praticando taekwondo com um colega em um tatame" },
      },
      body: (
        <>
          <p>
            Aos poucos, o kart também ensina a lidar com a pressão, a frustração e a emoção das conquistas. A cada experiência, Enrico amadurece, com a família sempre por perto, apoiando cada etapa dessa jornada.
          </p>
          <MediaGallery items={fora} label="Vídeos de fora das pistas" />
        </>
      ),
    },
    {
      id: "preparacao",
      label: "Preparação",
      title: "Como ele se prepara",
      image: { src: "/photos/paddock-mechanic.png", alt: "Enrico de capacete, no kart, enquanto o mecânico da equipe, de boné, confere o equipamento ao lado (foto em preto e branco)", position: "50% 50%" },
      slots: [
        { label: "Treinos desde", value: pilot.trainingSince },
        { label: "Equipe", value: "Reis Motorsports" },
      ],
      body: (
        <>
          <p>
            A preparação para o Paranaense de 2026 exigiu dedicação e ajustes para enfrentar uma etapa desafiadora. Mesmo largando em 7º lugar, Enrico evoluiu ao longo das corridas: terminou a primeira bateria em 3º, venceu a segunda e conquistou a vitória na final.
          </p>
          <MediaGallery items={prep} label="Fotos e vídeos de preparação" />
        </>
      ),
    },
    {
      id: "sonho",
      label: "O sonho",
      title: "Para onde ele vai",
      image: { src: "/photos/para-onde-vai-enrico.jpg", alt: "Enrico, de capacete verde e laranja, ergue o punho fechado a bordo do kart número 5, em uma curva da pista", position: "42% 55%" },
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
                      ) : tab.image.video ? (
                        <TabVideo src={tab.image.video.src} poster={tab.image.src} label={tab.image.video.label} position={tab.image.position} />
                      ) : (
                        <Image src={tab.image.src} alt={tab.image.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover grayscale" style={{ objectPosition: tab.image.position }} />
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
