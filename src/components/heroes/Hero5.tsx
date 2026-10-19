"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { SpeedLines } from "./shared";
import { GLYPHS, GLYPH_TRANSFORM } from "@/lib/digits";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Versão 5 · Número: o 5 oficial, em escala gigante, funciona como janela para a foto, que desliza lentamente por dentro dele. */
export function Hero5() {
  const reduce = useReducedMotion();
  const g = GLYPHS["5"];
  const [x, y, w, h] = g.vb;
  const imgW = w * 2.1;

  return (
    <section aria-labelledby="h5-title" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-[var(--header-h)]">
      <SpeedLines count={16} className="-z-10 opacity-40" />
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-6 px-5 py-8 md:px-10 lg:grid-cols-12">
        <div className="relative z-10 order-2 lg:order-1 lg:col-span-6">
          <motion.p className="eyebrow mb-4 flex items-center gap-3 text-mint" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
            Piloto de kart · Palhoça (SC)
          </motion.p>
          <h1 id="h5-title" className="display text-[clamp(3.8rem,9.5vw,8.2rem)]">
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span className="block" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.15 }}>Enrico</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-mint" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.27 }}>Vernieri</motion.span>
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-lg text-white/85">{pilot.tagline}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6">
          <motion.svg
            viewBox={`${x} ${y} ${w} ${h}`}
            role="img"
            aria-label="Número 5, número oficial do piloto, com uma foto de Enrico no kart dentro"
            className="mx-auto h-[min(54svh,520px)] w-auto max-w-full overflow-visible lg:h-[min(70svh,680px)]"
            initial={reduce ? false : { x: 120, opacity: 0, skewX: -12 }}
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            transition={{ duration: 1, ease }}
          >
            <defs>
              <clipPath id="h5-clip"><path transform={GLYPH_TRANSFORM} d={g.d} fillRule="evenodd" /></clipPath>
            </defs>
            <g clipPath="url(#h5-clip)">
              <rect x={x} y={y} width={w} height={h} fill="#121513" />
              <motion.g
                animate={reduce ? undefined : { x: [0, -(imgW - w)] }}
                transition={{ duration: 14, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              >
                <image href="/photos/kart-action-2.png" x={x} y={y} width={imgW} height={h} preserveAspectRatio="xMidYMid slice" />
              </motion.g>
              <rect x={x} y={y} width={w} height={h} fill="url(#h5-shade)" />
            </g>
            <defs>
              <linearGradient id="h5-shade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0a0b0a" stopOpacity="0" />
                <stop offset="1" stopColor="#0a0b0a" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <path transform={GLYPH_TRANSFORM} d={g.d} fillRule="evenodd" fill="none" stroke="#00ff9c" strokeWidth="0.9" />
          </motion.svg>
        </div>
      </div>
    </section>
  );
}
