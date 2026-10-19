"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { Marquee, SpeedLines } from "./shared";
import { pilot } from "@/content/pilot";
import { positionLabel, results } from "@/content/results";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Versão 1 · Cinema: foto em tela cheia com zoom lento, linhas de velocidade e faixa de resultados rolando embaixo. */
export function Hero1() {
  const reduce = useReducedMotion();
  const wins = results
    .filter((r) => r.position <= 2)
    .sort((a, b) => b.year - a.year || a.position - b.position)
    .map((r) => `${positionLabel(r.position)} · ${r.event.replace("Campeonato ", "")} ${r.year}`);

  return (
    <section aria-labelledby="h1-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[var(--header-h)]">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.02 }}
        animate={reduce ? undefined : { scale: [1.02, 1.14] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <Image src="/news/portal-palhoca-paranaense.jpg" alt="Enrico, de capacete verde e laranja, na frente do pelotão de karts durante a prova" fill priority sizes="100vw" className="object-cover object-[50%_40%]" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
      <SpeedLines count={12} className="-z-10 opacity-60" />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <motion.p className="eyebrow mb-4 flex items-center gap-3 text-mint" initial={reduce ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
          <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
          Piloto de kart · Palhoça (SC)
        </motion.p>
        <h1 id="h1-title" className="display text-[clamp(4.2rem,15vw,13rem)] leading-[0.82]">
          <span className="block overflow-hidden pb-[0.05em]">
            <motion.span className="block" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>
              Enrico
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block text-mint" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.22 }}>
              Vernieri
            </motion.span>
          </span>
        </h1>
        <motion.div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.7 }}>
          <p className="max-w-xs text-lg text-white/85">{pilot.tagline}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </div>
        </motion.div>
      </div>

      <div className="border-y border-white/15 bg-ink/70 py-3 backdrop-blur-sm">
        <Marquee duration={38}>
          {wins.map((w) => (
            <span key={w} className="eyebrow flex items-center gap-6 whitespace-nowrap px-6 text-base text-white md:text-lg">
              {w}
              <span className="h-2 w-2 -skew-x-12 bg-mint" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
