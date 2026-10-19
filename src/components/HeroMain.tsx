"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import type { MotionValue } from "motion/react";
import { Button } from "./Button";
import { challenges } from "@/content/events";
import { pilot } from "@/content/pilot";
import { totals } from "@/content/results";
import { formatDate } from "@/lib/format";
import { GLYPHS, GLYPH_TRANSFORM } from "@/lib/digits";

const ease = [0.2, 0.8, 0.2, 1] as const;
const DAY = 86_400_000;

/** Foto do hero. Ideal para substituir: close do rosto de capacete, em ação, com fundo escuro e o piloto no terço direito. */
const PHOTO = {
  src: "/news/portal-palhoca-paranaense.jpg",
  alt: "Enrico, de capacete verde e laranja, à frente do pelotão de karts durante a prova",
};

/** Próxima etapa, calculada a partir de events.ts. Some sozinha quando não houver etapa futura. */
function NextChallenge() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  if (now === null) return null;
  const next = [...challenges]
    .filter((c) => new Date(`${c.endDate ?? c.date}T23:59:59-03:00`).getTime() >= now)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!next) return null;

  const start = new Date(`${next.date}T00:00:00-03:00`).getTime();
  const days = Math.ceil((start - now) / DAY);
  const when = next.endDate
    ? `${formatDate(next.date, { day: "numeric" })} a ${formatDate(next.endDate, { day: "numeric", month: "short" })}`
    : formatDate(next.date, { day: "numeric", month: "short" });
  const countdown = now >= start ? "em andamento" : days <= 1 ? "amanhã" : `em ${days} dias`;
  const where = [next.city, next.category].filter(Boolean).join(" · ");

  return (
    <a href="#desafios" aria-label={`Próximo desafio: ${next.championship}, ${when}, ${where}, ${countdown}. Ver calendário`} className="group block border-y border-white/15 bg-ink/40 px-4 py-3 text-right backdrop-blur-sm transition-colors hover:border-mint/50">
      <span className="eyebrow block text-[0.65rem] text-mint md:text-xs">Próximo desafio</span>
      <span className="display mt-1.5 block text-[20px] leading-none md:text-[24px]">{next.championship.replace(/^\d+º /, "").replace(" de Kart", "")}</span>
      <span className="eyebrow mt-1.5 block text-[0.7rem] text-white/75 md:text-[0.78rem]">
        {where && <>{where} · </>}
        {when}
      </span>
      <span className="eyebrow mt-1 block text-[0.62rem] text-white/45 md:text-[0.68rem]">{countdown}</span>
    </a>
  );
}

/**
 * Hero da home. Nome como protagonista, foto escura que se dissolve no preto, o 5 como marca d'água no canto oposto ao nome,
 * próximo desafio discreto no canto e indicadores limpos embaixo. A faixa de conquistas vem logo depois (AchievementsStrip).
 */
export function HeroMain() {
  const reduce = useReducedMotion();
  const [drawn, setDrawn] = useState(false);
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const photoX = useTransform(sx, [-1, 1], [-14, 14]);
  const fiveX = useTransform(sx, [-1, 1], [18, -18]);
  const g = GLYPHS["5"];
  const [x, y, w, h] = g.vb;

  /** O 5 em contorno. No desktop é marca d'água no canto; no celular (segunda instância) fica ao lado de "Enrico", na altura da linha. */
  const five = (className: string, style?: { x: number | MotionValue<number> }) => (
    <motion.svg aria-hidden viewBox={`${x - 2} ${y - 2} ${w + 4} ${h + 4}`} style={style} className={className}>
      {/* O traço tracejado da animação deixa uma emenda no ponto inicial do contorno (a quina superior esquerda). Ao terminar, trocamos por um caminho estático e fechado. */}
      {reduce || drawn ? (
        <path transform={GLYPH_TRANSFORM} d={g.d} fillRule="evenodd" fill="rgb(0 255 156 / 0.07)" stroke="rgb(0 255 156 / 0.6)" strokeWidth="1.5" strokeLinejoin="round" />
      ) : (
        <motion.path
          transform={GLYPH_TRANSFORM}
          d={g.d}
          fillRule="evenodd"
          fill="rgb(0 255 156 / 0.07)"
          stroke="rgb(0 255 156 / 0.6)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease, delay: 0.5 }}
          onAnimationComplete={() => setDrawn(true)}
        />
      )}
    </motion.svg>
  );

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  return (
    <section
      id="topo"
      aria-labelledby="hero-title"
      onPointerMove={reduce ? undefined : onMove}
      className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-[#050605] pt-[var(--header-h)] md:min-h-[calc(100svh-4rem)]"
    >
      {/* foto: dessaturada e dissolvida no preto à esquerda, embaixo e em cima */}
      <motion.div
        className="absolute inset-y-0 right-0 -z-10 w-full [mask-image:linear-gradient(to_top,transparent_0%,#000_28%)] md:w-[78%] md:[mask-image:linear-gradient(to_right,transparent_0%,rgb(0_0_0/.35)_16%,#000_48%)]"
        style={{ x: reduce ? 0 : photoX }}
      >
        <motion.div className="absolute -inset-[5%]" initial={{ scale: 1.04 }} animate={reduce ? undefined : { scale: [1.04, 1.12] }} transition={{ duration: 26, ease: "linear", repeat: Infinity, repeatType: "reverse" }}>
          <Image src={PHOTO.src} alt={PHOTO.alt} fill priority sizes="(min-width:768px) 78vw, 100vw" className="object-cover object-[55%_42%] [filter:saturate(0.82)_contrast(1.06)_brightness(0.95)]" />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#050605_0%,rgb(5_6_5/.92)_22%,rgb(5_6_5/.64)_40%,rgb(5_6_5/.3)_60%,rgb(5_6_5/.08)_80%,transparent_100%)] max-md:bg-[linear-gradient(to_right,rgb(5_6_5/.88),rgb(5_6_5/.5)_70%,rgb(5_6_5/.25))]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#050605_0%,rgb(5_6_5/.82)_14%,rgb(5_6_5/.36)_34%,transparent_58%,rgb(5_6_5/.3)_88%,rgb(5_6_5/.62)_100%)]" />

      {/* 5 como marca d'água no canto oposto ao nome */}
      {five("pointer-events-none absolute bottom-[14%] right-[4%] -z-10 h-[34%] w-auto overflow-visible max-md:hidden", { x: reduce ? 0 : fiveX })}

      {/* próximo desafio */}
      <div className="absolute inset-x-0 top-[calc(var(--header-h)+0.9rem)] z-20 md:top-[calc(var(--header-h)+1.4rem)]">
        <div className="mx-auto flex max-w-[1400px] justify-end px-5 md:px-10">
          <NextChallenge />
        </div>
      </div>

      {/* nome, subtítulo e CTAs */}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-9 pt-20 md:justify-center md:pb-4 md:px-10 md:pt-6">
        <motion.p className="eyebrow text-[0.8rem] text-mint md:text-sm" initial={reduce ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
          Piloto de kart
        </motion.p>

        <h1 id="hero-title" className="display relative mt-3 w-fit text-[min(23vw,19svh)] leading-[0.86] md:text-[min(14.8vw,22.5svh)]">
          <span className="block overflow-hidden pb-[0.04em] pr-[0.1em]">
            <motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>
              Enrico
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.07em] pr-[0.1em]">
            {/* contorno firme e preenchimento leve: legível sobre o escuro, sem brilho exagerado */}
            <motion.span
              className="block text-mint/[0.07] [-webkit-text-stroke:1.5px_#00ff9c] [text-shadow:0_0_26px_rgba(0,255,156,0.12)] [filter:drop-shadow(0_0_5px_rgba(0,255,156,0.3))] md:[-webkit-text-stroke:2.5px_#00ff9c]"
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.22 }}
            >
              Vernieri
            </motion.span>
          </span>
          {five("pointer-events-none absolute left-full top-[1.15em] ml-[0.07em] h-[0.64em] w-auto overflow-visible md:hidden")}
        </h1>

        <motion.p className="mt-5 max-w-xl text-[20px] text-white/85" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7, ease }}>
          {pilot.tagline}
        </motion.p>

        <motion.div className="mt-6 flex flex-col gap-3 sm:flex-row" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.7, ease }}>
          <Button href="#patrocinadores" className="sm:min-w-[14rem]">Seja parceiro</Button>
          <Button href="#historia" variant="ghost-dark" icon="none" className="sm:min-w-[14rem]">Conheça a trajetória</Button>
        </motion.div>
      </div>

      {/* indicadores */}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-7 md:px-10 md:pb-8">
        <dl className="grid max-w-2xl grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-2 md:pt-4">
          {[
            ["Títulos", `${totals.titles} ${totals.titles === 1 ? "título" : "títulos"}`],
            ["Nas pistas desde", String(pilot.debut.year)],
            ["Categoria", "Cadete"],
          ].map(([k, v], i) => (
            <div key={k} className={i ? "pl-4 pr-2 md:pl-8" : "pr-4 md:pr-8"}>
              <dt className="eyebrow text-[0.65rem] text-white/55 md:text-xs">{k}</dt>
              <dd className={`display mt-1 text-xl leading-none md:text-[1.75rem]`}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
