"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * 2 · Editorial e tipográfica. Página de revista: ENRICO em escala monumental por trás do retrato,
 * VERNIERI na vertical como lombada e um bloco de texto pequeno e assimétrico. A tipografia é a imagem.
 */
export function H2Editorial() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const wordX = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);

  return (
    <section ref={ref} aria-labelledby="h2e-title" className="on-light relative isolate min-h-[100svh] overflow-hidden bg-paper pt-[var(--header-h)] text-ink">
      <h1 id="h2e-title" className="sr-only">Enrico Vernieri, piloto de kart</h1>

      {/* palavra monumental */}
      <motion.div aria-hidden style={{ x: reduce ? 0 : wordX }} className="pointer-events-none absolute left-[-1.5vw] top-[calc(var(--header-h)+0.5rem)] -z-0 select-none">
        <motion.span className="display block whitespace-nowrap text-[clamp(7.5rem,27vw,25rem)] leading-[0.78]" initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.2, ease }}>
          Enrico
        </motion.span>
      </motion.div>

      <div className="relative mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-[1400px] grid-cols-12 px-5 md:px-10">
        {/* lombada */}
        <p aria-hidden className="display absolute bottom-6 left-3 hidden text-[clamp(2.6rem,5.4vw,5rem)] text-transparent [-webkit-text-stroke:1.5px_#0a0b0a] [writing-mode:vertical-rl] [transform:rotate(180deg)] md:left-6 lg:block">
          Vernieri
        </p>

        {/* retrato */}
        <motion.div style={{ y: reduce ? 0 : photoY }} className="relative z-10 col-span-12 mt-[24vw] self-end lg:col-span-4 lg:col-start-6 lg:mt-[15.5vw]">
          <motion.div initial={reduce ? false : { opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.25 }} className="relative mx-auto aspect-[4/5] w-[min(72vw,380px)] lg:w-full lg:max-w-[350px]">
            <div aria-hidden className="absolute -left-4 top-5 h-full w-full bg-mint" />
            <Image src="/photos/portrait-1.png" alt="Retrato de Enrico Vernieri de capacete e macacão" fill priority sizes="(min-width:1024px) 460px, 78vw" className="object-cover object-[50%_22%]" />
          </motion.div>
        </motion.div>

        {/* texto */}
        <motion.div className="relative z-10 col-span-12 mt-8 pb-10 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end lg:pb-12" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }}>
          <p className="eyebrow text-mint-ink">Nº 05 · Piloto de kart</p>
          <p className="mt-3 text-[clamp(1.35rem,2.2vw,1.85rem)] font-light leading-snug">{pilot.tagline}</p>
          <p className="mt-2 text-sm text-mute-light">Palhoça (SC)</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-display text-xl font-extrabold italic uppercase tracking-wide">
            <a href="#historia" className="group inline-flex min-h-11 items-center gap-2 border-b-2 border-ink pb-0.5 hover:text-mint-ink">Conheça minha história <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></a>
            <a href="#patrocinadores" className="group inline-flex min-h-11 items-center gap-2 hover:text-mint-ink">Seja parceiro <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
