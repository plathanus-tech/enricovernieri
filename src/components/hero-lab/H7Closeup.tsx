"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { Button } from "../Button";
import { challenges } from "@/content/events";
import { pilot } from "@/content/pilot";
import { formatDate } from "@/lib/format";
import { GLYPHS, GLYPH_TRANSFORM } from "@/lib/digits";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Troque aqui quando houver um close do rosto, de capacete, em ação (ideal: fundo escuro, piloto no terço direito). */
const PHOTO = { src: "/news/portal-palhoca-paranaense.jpg", alt: "Enrico, de capacete verde e laranja, à frente do pelotão de karts durante a prova" };

const DAY = 86_400_000;

/** Próximo desafio em texto corrido, alinhado à direita, como no canto superior da referência. */
function NextText() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  if (now === null) return null;
  const next = [...challenges]
    .filter((c) => new Date(`${c.endDate ?? c.date}T23:59:59-03:00`).getTime() >= now)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!next) return null;
  const start = new Date(`${next.date}T00:00:00-03:00`).getTime();
  const days = Math.ceil((start - now) / DAY);
  const when = next.endDate ? `${formatDate(next.date, { day: "numeric" })} a ${formatDate(next.endDate, { day: "numeric", month: "short" })}` : formatDate(next.date, { day: "numeric", month: "short" });
  return (
    <a href="#desafios" className="group block text-right" aria-label={`Próximo desafio: ${next.championship}, ${when}. Ver calendário`}>
      <span className="eyebrow flex items-center justify-end gap-2 text-[0.8rem] text-mint md:text-base">
        <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M6 4v16l14-8z" /></svg>Próximo desafio
      </span>
      <span className="display mt-1 block text-lg leading-none md:text-2xl">{next.championship.replace(/^\d+º /, "").replace(" de Kart", "")}</span>
      <span className="eyebrow mt-1 block text-[0.75rem] text-white/75 md:text-sm">
        {when} · <span className="text-mint">{now >= start ? "em andamento" : days <= 1 ? "amanhã" : `em ${days} dias`}</span>
      </span>
    </a>
  );
}

/**
 * 7 · Close-up. Hero de tela cheia: foto escura à direita, nome monumental à esquerda, o 5 em contorno (desenhado traço a traço)
 * como marca d’água no canto oposto ao nome, dados de apoio embaixo e o próximo desafio no canto. Layout inspirado na referência enviada;
 * o texto de apoio usa só fatos do projeto (estratégia, dedicação e confiança vêm da apresentação do piloto).
 */
export function H7Closeup() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const photoX = useTransform(sx, [-1, 1], [-18, 18]);
  const fiveX = useTransform(sx, [-1, 1], [22, -22]);
  const g = GLYPHS["5"];
  const [x, y, w, h] = g.vb;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  return (
    <section aria-labelledby="h7c-title" onPointerMove={reduce ? undefined : onMove} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#050605] pt-[var(--header-h)]">
      {/* foto */}
      <motion.div className="absolute inset-y-0 right-0 -z-10 w-full [mask-image:linear-gradient(to_top,transparent_0%,#000_26%)] md:w-[78%] md:[mask-image:linear-gradient(to_right,transparent_0%,rgb(0_0_0/.35)_16%,#000_48%)]" style={{ x: reduce ? 0 : photoX }}>
        <motion.div className="absolute -inset-[5%]" initial={{ scale: 1.04 }} animate={reduce ? undefined : { scale: [1.04, 1.13] }} transition={{ duration: 24, ease: "linear", repeat: Infinity, repeatType: "reverse" }}>
          <Image src={PHOTO.src} alt={PHOTO.alt} fill priority sizes="(min-width:768px) 74vw, 100vw" className="object-cover object-[55%_42%]" />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#050605_0%,rgb(5_6_5/.9)_20%,rgb(5_6_5/.62)_38%,rgb(5_6_5/.3)_58%,rgb(5_6_5/.08)_78%,transparent_100%)] max-md:bg-[linear-gradient(to_right,rgb(5_6_5/.85),rgb(5_6_5/.45)_70%,rgb(5_6_5/.2))]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#050605_0%,rgb(5_6_5/.8)_14%,rgb(5_6_5/.35)_34%,transparent_58%,rgb(5_6_5/.3)_88%,rgb(5_6_5/.6)_100%)]" />

      {/* 5 como marca d’água, no canto oposto ao nome */}
      <motion.svg aria-hidden viewBox={`${x - 2} ${y - 2} ${w + 4} ${h + 4}`} style={{ x: reduce ? 0 : fiveX }} className="pointer-events-none absolute bottom-[9%] right-[3%] -z-10 h-[40%] w-auto overflow-visible max-md:-right-[2%] max-md:bottom-[3%] max-md:h-[26%]">
        <motion.path transform={GLYPH_TRANSFORM} d={g.d} fillRule="evenodd" fill="rgb(0 255 156 / 0.05)" stroke="rgb(0 255 156 / 0.26)" strokeWidth="1" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2.2, ease, delay: 0.5 }} />
      </motion.svg>

      {/* faixas em diagonal, canto direito */}
      <motion.div aria-hidden className="pointer-events-none absolute right-[-3%] top-[24%] -z-10 hidden h-[34%] w-[11%] md:block" initial={reduce ? false : { x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease, delay: 0.6 }}>
        <span className="absolute inset-y-0 right-0 w-[38%] -skew-x-[28deg] bg-mint" />
        <span className="absolute inset-y-[12%] right-[44%] w-[20%] -skew-x-[28deg] bg-mint/60" />
        <span className="absolute inset-y-[24%] right-[70%] w-[9%] -skew-x-[28deg] bg-mint/30" />
      </motion.div>

      {/* próximo desafio */}
      <div className="absolute right-5 top-[calc(var(--header-h)+0.9rem)] z-20 md:right-16 md:top-[calc(var(--header-h)+1.4rem)]"><NextText /></div>

      {/* bloco principal */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 pb-6 pt-16 md:px-[5vw] md:pt-6">
        <motion.p className="eyebrow flex items-center gap-4 text-mint" initial={reduce ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
          <span aria-hidden className="inline-block h-[2px] w-12 bg-current" />Piloto de kart
        </motion.p>

        <div className="relative mt-3 w-fit">
          <h1 id="h7c-title" className="display relative text-[min(23vw,19svh)] leading-[0.86] md:text-[min(14.8vw,22.5svh)]">
            <span className="block overflow-hidden pb-[0.04em] pr-[0.1em]"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>Enrico</motion.span></span>
            <span className="block overflow-hidden pb-[0.07em] pr-[0.1em]"><motion.span className="block text-transparent [-webkit-text-stroke:1.5px_#00ff9c] [filter:drop-shadow(0_0_6px_rgba(0,255,156,0.5))] md:[-webkit-text-stroke:2.5px_#00ff9c]" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.22 }}>Vernieri</motion.span></span>
          </h1>
        </div>

        <motion.p className="mt-5 max-w-xl text-lg text-white/85" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7, ease }}>
          {pilot.tagline}
        </motion.p>
        <motion.p className="eyebrow mt-3 text-[0.8rem] tracking-[0.3em] text-mint md:text-base [@media(max-height:760px)]:hidden" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.7 }}>
          Estratégia <span className="mx-2 text-white/50">/</span> Dedicação <span className="mx-2 text-white/50">/</span> Confiança
        </motion.p>
        <motion.div className="mt-6 flex flex-col gap-3 sm:flex-row" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7, ease }}>
          <Button href="#historia">Conheça minha história</Button>
          <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
        </motion.div>
      </div>

      {/* dados + chamada para rolar */}
      <div className="relative mx-auto flex w-full max-w-[1600px] items-end justify-between gap-6 px-5 pb-6 md:px-[5vw] md:pb-8">
        <dl className="flex gap-6 md:gap-10">
          {[
            ["Nascido em", String(pilot.born)],
            ["Nas pistas desde", String(pilot.debut.year)],
            ["Categoria", "Cadete"],
          ].map(([k, v]) => (
            <div key={k} className="border-l-2 border-mint pl-3">
              <dt className="eyebrow text-[0.65rem] text-white/60 md:text-xs">{k}</dt>
              <dd className="display mt-0.5 text-xl md:text-3xl">{v}</dd>
            </div>
          ))}
        </dl>
        <a href="#quem-sou" className="eyebrow hidden items-center gap-3 text-sm text-white/80 hover:text-mint md:flex">
          <span aria-hidden className="flex h-9 w-5 justify-center rounded-full border-2 border-mint pt-1.5"><motion.span className="block h-1.5 w-0.5 bg-mint" animate={reduce ? undefined : { y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} /></span>
          Role para descobrir
        </a>
      </div>
    </section>
  );
}
