"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "./Button";
import { SpeedingNumber } from "./SpeedingNumber";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const line = (i: number) =>
    reduce
      ? {}
      : { initial: { y: "105%" }, animate: { y: 0 }, transition: { duration: 0.8, ease, delay: 0.15 + i * 0.12 } };

  return (
    <section id="topo" aria-labelledby="hero-title" className="grain relative isolate overflow-hidden bg-ink pt-[var(--header-h)]">
            <div className="mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-[1400px] grid-cols-1 gap-y-10 px-5 pb-12 pt-6 md:px-10 lg:grid-cols-12 lg:items-end lg:pb-16">
        {/* foto */}
        <div className="relative order-1 lg:absolute lg:right-0 lg:top-[calc(var(--header-h)+1.5rem)] lg:z-0 lg:order-none lg:h-[min(72svh,720px)] lg:w-[64%]">
          <div aria-hidden className="slant absolute -bottom-3 -left-3 right-3 top-3 bg-mint lg:-bottom-4 lg:-left-4 lg:right-4 lg:top-4" />
          <motion.div
            className="slant relative aspect-[4/3] w-full overflow-hidden bg-ink-3 lg:aspect-auto lg:h-full"
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.1, ease }}
          >
            <Image
              src="/photos/kart-action-2.png"
              alt="Enrico Vernieri pilotando seu kart número 5 em uma curva do kartódromo"
              fill
              priority
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover object-[50%_55%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
          </motion.div>

          {/* número oficial: sai da moldura da foto, com a animação Speeding Text */}
          <div className="absolute -bottom-10 right-3 z-10 text-[clamp(6.5rem,19vw,14rem)] text-mint drop-shadow-[0_8px_0_rgba(0,0,0,0.45)] lg:-bottom-16 lg:right-8">
            <SpeedingNumber value={pilot ? 5 : 5} from={0} duration={1.1} maxBlur={12} label="Número 5, número oficial do piloto" />
          </div>
        </div>

        {/* texto */}
        <div className="relative z-10 order-2 pt-10 lg:order-none lg:col-span-6 lg:pt-0">
          <motion.p
            className="eyebrow mb-5 flex items-center gap-3 text-mint"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
            Piloto de kart · Palhoça (SC)
          </motion.p>

          <h1 id="hero-title" className="display text-[clamp(3.6rem,10.5vw,8.8rem)]">
            <span className="block overflow-hidden pb-[0.06em] pr-[0.08em]">
              <motion.span className="block" {...line(0)}>
                Enrico
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] pr-[0.08em]">
              <motion.span className="block text-transparent [-webkit-text-stroke:2px_#fff] sm:[-webkit-text-stroke:3px_#fff]" {...line(1)}>
                Vernieri
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-6 max-w-md text-lg text-white/85 md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
          >
            {pilot.tagline}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease }}
          >
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">
              Seja parceiro
            </Button>
          </motion.div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 border-t border-line-dark pt-5 text-sm">
            <div>
              <dt className="eyebrow text-mute-dark">Nascido em</dt>
              <dd className="display mt-1 text-2xl">{pilot.born}</dd>
            </div>
            <div>
              <dt className="eyebrow text-mute-dark">Nas pistas desde</dt>
              <dd className="display mt-1 text-2xl">{pilot.debut.year}</dd>
            </div>
            <div>
              <dt className="eyebrow text-mute-dark">Em 2026</dt>
              <dd className="display mt-1 text-2xl text-mint">Campeão paranaense</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
