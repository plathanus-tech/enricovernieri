"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import { Button } from "../Button";
import { RaceNumber } from "../RaceNumber";
import { Contours, NextCard } from "./shared";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Ln1 · Retrato: fundo claro com linhas de nível, nome centralizado e retrato grande, como no site do Lando Norris. */
export function Ln1() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 16 });
  const px = useTransform(sx, [-1, 1], [-14, 14]);
  const nx = useTransform(sx, [-1, 1], [30, -30]);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  return (
    <section aria-labelledby="ln1-title" onMouseMove={reduce ? undefined : onMove} className="on-light relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden bg-paper text-ink">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-0 h-[var(--header-h)] bg-ink" />
      <Contours className="-z-10" />

      <div className="relative z-10 mt-[calc(var(--header-h)+1.5rem)] text-center">
        <motion.h1 id="ln1-title" className="display text-[clamp(2.4rem,6vw,4.6rem)]" initial={reduce ? false : { opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          Enrico <span className="text-mint-ink">Vernieri</span>
        </motion.h1>
        <p className="eyebrow mt-1 text-mute-light">Piloto de kart · Palhoça (SC)</p>
      </div>

      <div className="relative z-10 mt-4 flex w-full flex-1 items-end justify-center pb-20 md:pb-0">
        <motion.div style={{ x: nx }} className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 text-[min(52vw,56svh)] text-ink/[0.07]">
          <RaceNumber value={5} />
        </motion.div>
        <motion.div style={{ x: reduce ? 0 : px }} initial={reduce ? false : { opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.1 }} className="relative h-[min(62svh,640px)] w-[min(86vw,440px)]">
          <div className="slant-r absolute inset-0 overflow-hidden bg-ink-3">
            <Image src="/photos/portrait-1.png" alt="Retrato de Enrico Vernieri de capacete e macacão" fill priority sizes="(min-width:768px) 440px, 86vw" className="object-cover object-[50%_22%]" />
          </div>
          <div aria-hidden className="slant-r absolute -right-3 top-3 -z-10 h-full w-full bg-mint" />
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-5 z-20 hidden md:left-10 md:block"><NextCard dark={false} /></div>
      <div className="absolute inset-x-5 bottom-5 z-20 flex gap-2 md:inset-x-auto md:right-10 md:flex-col">
        <Button href="#historia" variant="ink" className="flex-1 whitespace-nowrap !px-3 md:flex-none">Minha história</Button>
        <Button href="#patrocinadores" variant="ghost-light" className="flex-1 whitespace-nowrap !px-3 md:flex-none">Seja parceiro</Button>
      </div>
    </section>
  );
}
