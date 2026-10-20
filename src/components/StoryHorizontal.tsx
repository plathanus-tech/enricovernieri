"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { LoopVideo } from "./LoopVideo";
import { Placeholder } from "./Placeholder";
import { RaceNumber } from "./RaceNumber";
import { Story } from "./Story";
import { chapters, type Chapter } from "@/content/story";

/** progresso de um painel na tela: 1 = entrando pela direita, 0 = saindo pela esquerda */
function usePanelProgress(x: MotionValue<number>, vw: number, leftRef: React.RefObject<number>) {
  return useTransform(x, (v) => ((leftRef.current ?? 0) + v) / (vw || 1));
}

function Fact({ p, i, dark, children }: { p: MotionValue<number>; i: number; dark: boolean; children: React.ReactNode }) {
  const start = 0.66 - i * 0.05;
  const opacity = useTransform(p, [start, start - 0.12], [0, 1]);
  const x = useTransform(p, [start, start - 0.12], [60, 0]);
  return (
    <motion.li style={{ opacity, x }} className={`flex items-center gap-3 border-b py-[clamp(0.15rem,0.7svh,0.5rem)] font-display text-base font-bold md:text-[clamp(0.9rem,2.5svh,1.25rem)] italic uppercase leading-tight tracking-wide ${dark ? "border-line-dark" : "border-line-light"}`}>
      <span aria-hidden className={`h-2.5 w-2.5 shrink-0 -skew-x-12 ${dark ? "bg-mint" : "bg-ink"}`} />
      {children}
    </motion.li>
  );
}

/** `still`: painel da faixa deslizável (celular). O conteúdo aparece completo, sem animações presas à rolagem. */
function ChapterPanel({ c, x, vw, register, still = false }: { c: Chapter; x: MotionValue<number>; vw: number; register: (id: string, left: number) => void; still?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const leftRef = useRef(0);
  const dark = c.tone === "dark";

  useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      leftRef.current = ref.current.offsetLeft;
      register(c.id, ref.current.offsetLeft);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [c.id, register]);

  const live = usePanelProgress(x, vw, leftRef);
  const calm = useMotionValue(0.28);
  const p = still ? calm : live;
  const snap = still ? "snap-start" : "";
  const numeralX = useTransform(p, [1, 0], [24, -24]);
  const numeralO = useTransform(p, [1, 0.8, 0.3, 0], [0, 1, 1, 0.25]);
  const titleO = useTransform(p, [0.8, 0.6], [0, 1]);
  const titleY = useTransform(p, [0.8, 0.6], [40, 0]);
  const textO = useTransform(p, [0.72, 0.5], [0, 1]);
  const textY = useTransform(p, [0.72, 0.5], [30, 0]);
  const clip = useTransform(p, [0.92, 0.5], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const imgX = useTransform(p, [1, 0], [-40, 40]);
  const roadW = useTransform(p, [0.75, 0.2], ["0%", "100%"]);

  // Capítulo só de texto: transição editorial. A "estrada" tracejada cresce em direção ao painel final, sugerindo continuidade.
  if (c.media.kind === "none")
    return (
      <article ref={ref} aria-labelledby={`h-${c.id}`} className={`relative flex ${still ? "h-auto pb-[7.5rem]" : "h-full pb-[5.25rem]"} w-[90vw] shrink-0 items-center bg-ink px-6 pt-[calc(var(--header-h)+0.75rem)] text-white md:w-[74vw] md:px-12 lg:w-[62vw] ${snap}`}>
        <div className="w-full">
          <motion.p style={{ opacity: titleO }} className="eyebrow text-mint">
            {c.kicker}
          </motion.p>
          <motion.h3 id={`h-${c.id}`} style={{ opacity: titleO, y: titleY }} className="display mt-4 text-[clamp(2.6rem,min(7.5vw,11svh),6.5rem)]">
            A história
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_#00ff9c]">continua</span>
          </motion.h3>
          <motion.p style={{ opacity: textO, y: textY }} className="mt-5 max-w-md text-[clamp(1rem,2.6svh,1.25rem)] leading-snug text-white/85">
            {c.text}
          </motion.p>
          <div aria-hidden className="relative mt-10 h-5 w-full overflow-hidden md:mt-14">
            <motion.div style={{ width: roadW }} className="absolute inset-y-0 left-0 flex items-center gap-3">
              <span className="h-[3px] flex-1 bg-[repeating-linear-gradient(to_right,#00ff9c_0_22px,transparent_22px_38px)]" />
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="3.2">
                <path d="M6 5l8 7-8 7M13 5l8 7-8 7" strokeLinecap="square" />
              </svg>
            </motion.div>
          </div>
        </div>
      </article>
    );

  return (
    <article
      ref={ref}
      aria-labelledby={`h-${c.id}`}
      className={`relative flex ${still ? "h-auto pb-[7.5rem]" : "h-full pb-[5.25rem]"} w-[90vw] shrink-0 items-center px-6 pt-[calc(var(--header-h)+0.75rem)] md:w-[74vw] md:px-12 lg:w-[62vw] ${snap} ${dark ? "bg-ink text-white" : "on-light bg-paper text-ink"}`}
    >
      <div className="flex w-full flex-col gap-3 md:gap-5">
        {/* decorativo: o ano é lido pelo texto pequeno acima do título */}
        <motion.div aria-hidden style={{ x: numeralX, opacity: numeralO }} className={`text-[clamp(2.75rem,min(10vw,14svh),8rem)] ${dark ? "text-mint" : "text-ink"}`}>
          {c.numeral ? (
            <div className="flex items-end gap-1">
              <RaceNumber value={c.numeral} label={c.word ? `${c.numeral} ${c.word}` : c.numeral} />
              {c.word && (
                <span aria-hidden className="display pb-[0.08em] text-[0.42em] leading-none">
                  {c.word}
                </span>
              )}
            </div>
          ) : (
            <span className="display text-[0.6em]">{c.word}</span>
          )}
        </motion.div>
      <div className="grid w-full gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-center md:gap-10">
        <div className="relative">

          <motion.div style={{ clipPath: clip }} className="relative">
            <div className="slant relative aspect-[16/9] max-h-[24svh] w-full overflow-hidden bg-ink-3 md:aspect-[4/5] md:max-h-[34svh] md:w-auto">
              {c.media.kind === "image" ? (
                <motion.div style={{ x: imgX }} className="absolute -inset-x-10 inset-y-0">
                  <Image src={c.media.src} alt={c.media.alt} fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" style={{ objectPosition: c.media.position }} />
                </motion.div>
              ) : c.media.kind === "video" ? (
                <LoopVideo src={c.media.src} poster={c.media.poster} label={c.media.label} />
              ) : c.media.kind === "slot" ? (
                <Placeholder className="h-full w-full">{c.media.note}</Placeholder>
              ) : null}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.p style={{ opacity: titleO }} className={`eyebrow ${dark ? "text-mint" : "text-mint-ink"}`}>
            {c.kicker} {c.numeral ?? ""} {c.word && c.numeral ? c.word : ""}
          </motion.p>
          <motion.h3 id={`h-${c.id}`} style={{ opacity: titleO, y: titleY }} className="display mt-2 text-2xl md:text-[clamp(1.6rem,min(4.2vw,6.5svh),3.6rem)]">
            {c.title}
          </motion.h3>
          <motion.p style={{ opacity: textO, y: textY }} className={`mt-3 max-w-md text-[clamp(0.85rem,2.3svh,1.125rem)] leading-snug ${dark ? "text-white/85" : "text-mute-light"}`}>
            {c.text}
          </motion.p>
          {c.facts && (
            <ul className="mt-4 grid max-w-md">
              {c.facts.map((f, i) => (
                <Fact key={f} p={p} i={i} dark={dark}>
                  {f}
                </Fact>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </article>
  );
}


/** Abertura da linha do tempo. `native`: versão da faixa deslizável (celular). */
function Opening({ native = false }: { native?: boolean }) {
  return (
    <div className={`flex ${native ? "h-auto snap-start pb-[7.5rem]" : "h-full"} w-[92vw] shrink-0 flex-col justify-center bg-ink px-6 pt-[var(--header-h)] md:w-[58vw] md:px-12`}>
      <p className="eyebrow flex items-center gap-3 text-mint">
        <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
        Minha história
      </p>
      <h2 className="display mt-4 text-[clamp(3rem,9vw,8rem)]">
        Volta a volta,
        <br />
        <span className="text-transparent [-webkit-text-stroke:2px_#fff]">até aqui</span>
      </h2>
      <p className="mt-6 flex max-w-sm items-center gap-3 text-lg text-white/80">
        <span aria-hidden className="inline-flex h-10 w-10 shrink-0 -skew-x-12 items-center justify-center bg-mint text-ink">→</span>
        {native ? "Deslize para o lado para seguir a trajetória, de 2016 até hoje." : "Role a página para seguir a trajetória, de 2016 até hoje."}
      </p>
    </div>
  );
}

/** Chamada final da linha do tempo. */
function Closing({ native = false }: { native?: boolean }) {
  return (
    <div className={`relative flex ${native ? "h-auto snap-end pb-[7.5rem]" : "h-full"} w-[92vw] shrink-0 flex-col justify-center overflow-hidden bg-mint px-6 pt-[var(--header-h)] text-ink md:w-[58vw] md:px-12`}>
      <div aria-hidden className="absolute inset-y-0 left-0 w-3 md:w-4 [background:conic-gradient(#0a0b0a_25%,transparent_0_50%,#0a0b0a_0_75%,transparent_0)_0_0/16px_16px]" />
      <p className="eyebrow ml-2 md:ml-4">E agora?</p>
      <h3 className="display ml-2 mt-3 text-[clamp(2.6rem,min(7.5vw,11svh),6.5rem)] md:ml-4">Faça parte da próxima volta</h3>
      <p className="ml-2 mt-5 max-w-lg text-[clamp(0.95rem,2.4svh,1.2rem)] font-medium leading-snug md:ml-4">
        Cada etapa é construída com dedicação, apoio e pessoas que acreditam no potencial do Enrico. Faça parte dessa jornada e acompanhe o que vem pela frente.
      </p>
      <div className="ml-2 mt-8 flex flex-col gap-3 sm:flex-row md:ml-4">
        <Button href="#desafios" variant="ink">Próximos desafios</Button>
        <Button href="#contato" variant="ghost-light">Seja parceiro</Button>
      </div>
    </div>
  );
}

/**
 * Celular: sem rolagem presa. A linha do tempo vira uma faixa que se desliza com o dedo (scroll-snap) e ocupa uma tela de altura,
 * então a página continua rolando normalmente na vertical. A última chamada ("E agora?") encaixa na borda final da faixa.
 */
function StoryNative({ id }: { id: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const lefts = useRef<Record<string, number>>({});
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const x = useMotionValue(0);
  const register = useCallback((cid: string, left: number) => {
    lefts.current[cid] = left;
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, el.scrollLeft / max) : 0);
    // no fim da faixa, o último capítulo é o ativo
    const atEnd = max > 0 && el.scrollLeft >= max - 4;
    let idx = 0;
    chapters.forEach((c, i) => {
      if ((lefts.current[c.id] ?? Infinity) <= el.scrollLeft + el.clientWidth * 0.5) idx = i;
    });
    if (atEnd) idx = chapters.length - 1;
    setActive((a) => (a === idx ? a : idx));
  };

  const jump = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: lefts.current[chapters[i].id] ?? 0, behavior: "smooth" });
  };

  return (
    <section id={id} aria-label="Minha história, linha do tempo" className="relative bg-ink">
      <div ref={scroller} onScroll={onScroll} className="relative flex min-h-[100svh] snap-x snap-mandatory items-stretch overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Opening native />
        {chapters.map((c) => (
          <ChapterPanel key={c.id} c={c} x={x} vw={375} register={register} still />
        ))}
        <Closing native />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-9 mix-blend-difference">
        <ul aria-label="Ir para o capítulo" className="pointer-events-auto flex gap-1 overflow-x-auto pb-2 text-white">
          {chapters.map((c, i) => (
            <li key={c.id} className="shrink-0">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={i === active ? "true" : undefined}
                className={`min-h-11 px-2.5 font-display text-base font-extrabold italic uppercase ${i === active ? "underline decoration-2 underline-offset-8" : "opacity-60"}`}
              >
                {c.numeral ?? c.word}
                {c.numeral && c.word ? ` ${c.word}` : ""}
              </button>
            </li>
          ))}
        </ul>
        <div aria-hidden className="h-[3px] w-full bg-white/30">
          <div style={{ width: `${progress * 100}%` }} className="h-full bg-white" />
        </div>
      </div>
    </section>
  );
}

export function StoryHorizontal({ id = "historia" }: { id?: string }) {
  const reduce = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ vw: 1280, vh: 800, dist: 4000 });
  const lefts = useRef<Record<string, number>>({});
  const [active, setActive] = useState(0);
  const [native, setNative] = useState(false);

  const register = useCallback((id: string, left: number) => {
    lefts.current[id] = left;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNative(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      const vw = window.innerWidth;
      setDim({ vw, vh: window.innerHeight, dist: Math.max(0, track.current.scrollWidth - vw) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  // Pausa no fim: a trilha horizontal termina antes do fim da rolagem, e o último painel fica parado por `hold` px
  // (cerca de 70% da altura da tela) para dar tempo de ler antes de a página voltar a rolar na vertical.
  const hold = dim.vh * 0.7;
  const travel = dim.dist + dim.vh * 0.2;
  const horiz = (p: number) => Math.min(1, (p * (travel + hold)) / travel);
  const x = useTransform(smooth, (p) => -horiz(p) * dim.dist);
  const ghostX = useTransform(smooth, (p) => -horiz(p) * dim.dist * 0.35);
  const bar = useTransform(smooth, (p) => `${horiz(p) * 100}%`);

  useMotionValueEvent(smooth, "change", (p) => {
    const cur = horiz(p) * dim.dist + dim.vw * 0.35;
    let idx = 0;
    chapters.forEach((c, i) => {
      if ((lefts.current[c.id] ?? Infinity) <= cur) idx = i;
    });
    setActive((a) => (a === idx ? a : idx));
  });

  const jump = (i: number) => {
    const el = container.current;
    if (!el) return;
    const left = lefts.current[chapters[i].id] ?? 0;
    const target = Math.min(1, Math.max(0, (left - dim.vw * 0.12) / (dim.dist || 1)));
    const scrollable = el.offsetHeight - dim.vh;
    window.scrollTo({ top: el.offsetTop + target * (travel / (travel + hold)) * scrollable, behavior: reduce ? "auto" : "smooth" });
  };

  // Movimento reduzido: sem rolagem lateral, usa a linha do tempo vertical.
  if (reduce) return <Story />;
  if (native) return <StoryNative id={id} />;

  return (
    <section id={id} aria-label="Minha história, linha do tempo horizontal">
      <div ref={container} className="relative bg-ink" style={{ height: dim.dist + dim.vh * 1.2 + hold }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* numeral de fundo em parallax */}
          <motion.div aria-hidden style={{ x: ghostX }} className="pointer-events-none absolute left-[30vw] top-[12svh] z-0 select-none text-[78svh] text-mint/[0.07]">
            <RaceNumber value={5} outline />
          </motion.div>

          <motion.div ref={track} style={{ x }} className="relative z-10 flex h-full w-max">
            <Opening />

            {chapters.map((c) => (
              <ChapterPanel key={c.id} c={c} x={x} vw={dim.vw} register={register} />
            ))}

            <Closing />
          </motion.div>

          {/* trilho de anos + progresso */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 mix-blend-difference md:px-10 md:pb-6">
            <ul aria-label="Ir para o capítulo" className="flex gap-1 overflow-x-auto pb-2 text-white md:gap-2">
              {chapters.map((c, i) => (
                <li key={c.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={i === active ? "true" : undefined}
                    className={`min-h-11 px-2.5 font-display text-base font-extrabold italic uppercase md:px-3 md:text-lg ${i === active ? "underline decoration-2 underline-offset-8" : "opacity-60 hover:opacity-100"}`}
                  >
                    {c.numeral ?? c.word}
                    {c.numeral && c.word ? ` ${c.word}` : ""}
                  </button>
                </li>
              ))}
            </ul>
            <div aria-hidden className="h-[3px] w-full bg-white/30">
              <motion.div style={{ width: bar }} className="h-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
