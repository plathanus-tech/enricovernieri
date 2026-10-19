"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;
const SLIDES = [
  { src: "/news/portal-palhoca-paranaense.jpg", alt: "Enrico à frente do pelotão de karts durante a prova", label: "Em prova", pos: "50% 40%" },
  { src: "/news/kartmotor-vice-2025.jpg", alt: "Enrico pilotando o kart número 5 em uma curva", label: "Na curva", pos: "50% 58%" },
  { src: "/photos/kart-action-2.png", alt: "Enrico contornando uma curva com o kart número 5", label: "Em ação", pos: "55% 55%" },
] as const;
const SECONDS = 6;

/** Ln4 · Pista de noite: fotos em tela cheia que alternam sozinhas, título condensado à esquerda e links pequenos com seta (referência Fastrack). */
export function Ln4() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SLIDES.length), SECONDS * 1000);
    return () => clearTimeout(t);
  }, [i, reduce]);
  const s = SLIDES[i];

  return (
    <section aria-labelledby="ln4-title" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-[var(--header-h)]">
      <AnimatePresence mode="sync">
        <motion.div key={s.src} className="absolute inset-0 -z-10" initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1.02 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1.1 }, scale: { duration: SECONDS + 1.5, ease: "linear" } }}>
          <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="100vw" className="object-cover" style={{ objectPosition: s.pos }} />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/75 via-transparent to-ink/30" />

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <p className="eyebrow text-mint">Enrico Vernieri · Nº 5</p>
        <h1 id="ln4-title" className="display mt-3 max-w-3xl text-[clamp(3.8rem,11vw,9.6rem)] leading-[0.84]">
          <span className="block overflow-hidden pb-[0.05em]"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>Nossa casa</motion.span></span>
          <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.22 }}>é a pista</motion.span></span>
        </h1>
        <span aria-hidden className="mt-5 block h-[3px] w-12 bg-mint" />
        <p className="eyebrow mt-3 text-white/80">{pilot.tagline}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[1400px] flex-col items-start justify-between gap-4 px-5 pb-6 sm:flex-row sm:items-end md:px-10">
        <div className="flex gap-8 sm:gap-10">
          <a href="#patrocinadores" className="group block">
            <span className="eyebrow flex items-center gap-2 text-mint">Seja parceiro <span aria-hidden className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></span>
            <span className="text-xs text-white/70">Patrocínio e contato</span>
          </a>
          <a href="#historia" className="group block">
            <span className="eyebrow flex items-center gap-2 text-mint">Minha história <span aria-hidden className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></span>
            <span className="text-xs text-white/70">De 2016 até hoje</span>
          </a>
        </div>
        <div className="flex items-center gap-2" role="group" aria-label="Fotos">
          {SLIDES.map((sl, k) => (
            <button key={sl.src} type="button" onClick={() => setI(k)} aria-label={`Foto ${k + 1}: ${sl.label}`} aria-current={k === i} className="group flex h-11 w-12 items-center">
              <span className="relative block h-[3px] w-full overflow-hidden bg-white/30">
                {k === i && <motion.span key={`${i}-${reduce}`} className="absolute inset-y-0 left-0 bg-mint" initial={{ width: reduce ? "100%" : "0%" }} animate={{ width: "100%" }} transition={{ duration: reduce ? 0 : SECONDS, ease: "linear" }} />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
