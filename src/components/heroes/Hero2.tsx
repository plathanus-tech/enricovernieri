"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { Button } from "../Button";
import { Marquee } from "./shared";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Row({ outline, reverse, duration }: { outline?: boolean; reverse?: boolean; duration: number }) {
  return (
    <Marquee reverse={reverse} duration={duration}>
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={`display flex items-center gap-8 whitespace-nowrap pr-8 text-[clamp(6rem,20vw,17rem)] leading-[0.85] ${outline ? "text-transparent [-webkit-text-stroke:2px_rgb(255_255_255/0.35)]" : "text-white/[0.09]"}`}>
          Enrico Vernieri
          <span className="h-[0.12em] w-[0.5em] -skew-x-12 bg-mint/70" />
        </span>
      ))}
    </Marquee>
  );
}

/** Versão 2 · Letreiro: o nome em escala gigante corre atrás da foto e se inclina com a velocidade da rolagem. */
export function Hero2() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(vel, [-2500, 0, 2500], [10, 0, -10]);

  return (
    <section aria-labelledby="h2-title" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-[var(--header-h)]">
      <motion.div aria-hidden style={{ skewX: reduce ? 0 : skew }} className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2">
        <Row duration={42} />
        <Row outline reverse duration={34} />
        <Row duration={50} />
      </motion.div>

      <h1 id="h2-title" className="sr-only">Enrico Vernieri, piloto de kart</h1>

      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-8 px-5 py-10 md:px-10 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <div aria-hidden className="slant absolute -bottom-3 -left-3 right-3 top-3 bg-mint" />
          <motion.div
            className="slant relative aspect-[16/11] overflow-hidden bg-ink-3"
            initial={reduce ? false : { x: 160, opacity: 0, filter: "blur(14px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease }}
          >
            <Image src="/photos/kart-action-2.png" alt="Enrico pilotando o kart número 5 em uma curva" fill priority sizes="(min-width:1024px) 58vw, 100vw" className="object-cover object-[50%_55%]" />
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <motion.p className="eyebrow flex items-center gap-3 text-mint" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
            Piloto de kart · Palhoça (SC)
          </motion.p>
          <motion.p className="display mt-4 text-[clamp(2.6rem,5vw,4.4rem)]" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.6 }}>
            Juntos na pista,
            <br />
            <span className="text-mint">rumo ao topo!</span>
          </motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.8 }}>
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </motion.div>
          <p className="eyebrow mt-8 text-mute-dark">Nº {pilot ? 5 : 5} · Nas pistas desde {pilot.debut.year}</p>
        </div>
      </div>
    </section>
  );
}
