"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;
// Traçado estilizado de pista (não representa nenhum kartódromo real).
const TRACK = "M120 330 C 120 220, 260 210, 330 250 C 400 290, 470 330, 560 290 C 650 250, 640 130, 740 120 C 860 108, 900 220, 860 300 C 820 380, 700 400, 640 440 C 560 495, 380 500, 260 470 C 160 445, 120 400, 120 330 Z";

/** Versão 4 · Volta lançada: o traçado de uma pista é desenhado na tela e um ponto verde percorre o circuito em loop. */
export function Hero4() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="h4-title" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-[var(--header-h)]">
      <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" className="absolute inset-y-0 -right-[12%] -z-10 h-full w-full scale-110 lg:w-[74%]">
        <defs>
          <filter id="h4-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <path d={TRACK} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="46" strokeLinejoin="round" />
        <motion.path
          id="h4-track"
          d={TRACK}
          fill="none"
          stroke="#00ff9c"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeDasharray="1 14"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease }}
        />
        {!reduce && (
          <g>
            <circle r="10" fill="#00ff9c" filter="url(#h4-glow)">
              <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"><mpath href="#h4-track" /></animateMotion>
            </circle>
            <circle r="5" fill="#eafff5">
              <animateMotion dur="7s" repeatCount="indefinite"><mpath href="#h4-track" /></animateMotion>
            </circle>
          </g>
        )}
      </svg>

      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 py-10 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p className="eyebrow mb-4 flex items-center gap-3 text-mint" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
            Piloto de kart · Palhoça (SC)
          </motion.p>
          <h1 id="h4-title" className="display text-[clamp(4rem,12vw,10.5rem)]">
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span className="block" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.3 }}>Enrico</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-transparent [-webkit-text-stroke:2px_#fff] sm:[-webkit-text-stroke:3px_#fff]" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.42 }}>Vernieri</motion.span>
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-lg text-white/85">{pilot.tagline}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-line-dark pt-4">
            <div><dt className="eyebrow text-mute-dark">Número</dt><dd className="display text-3xl text-mint">5</dd></div>
            <div><dt className="eyebrow text-mute-dark">Categoria</dt><dd className="display text-3xl">Cadete</dd></div>
            <div><dt className="eyebrow text-mute-dark">Em 2026</dt><dd className="display text-3xl text-mint">Campeão PR</dd></div>
          </dl>
        </div>
        <motion.div className="lg:col-span-5" initial={reduce ? false : { opacity: 0, y: 40, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ duration: 0.9, ease, delay: 0.5 }}>
          <div className="relative mx-auto max-w-md">
            <div aria-hidden className="absolute -bottom-3 -right-3 left-3 top-3 bg-mint" />
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
              <Image src="/photos/kart-action-1.png" alt="Enrico acelerando no kart número 5" fill priority sizes="(min-width:1024px) 34vw, 90vw" className="object-cover object-[62%_50%]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
