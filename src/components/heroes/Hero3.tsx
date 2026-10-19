"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import { Button } from "../Button";
import { SpeedLines } from "./shared";
import { SpeedingNumber } from "../SpeedingNumber";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Versão 3 · Chegada: o kart entra pela direita com desfoque de movimento, a foto responde ao mouse e uma faixa quadriculada corre embaixo. */
export function Hero3() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const photoX = useTransform(sx, [-1, 1], [-16, 16]);
  const photoY = useTransform(sy, [-1, 1], [-10, 10]);
  const fiveX = useTransform(sx, [-1, 1], [26, -26]);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section aria-labelledby="h3-title" onMouseMove={reduce ? undefined : onMove} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[var(--header-h)]">
      <SpeedLines count={10} color="rgb(0 255 156 / 0.8)" className="-z-10 opacity-50" />
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 px-5 py-10 md:px-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-5">
          <motion.p className="eyebrow mb-4 flex items-center gap-3 text-mint" initial={reduce ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
            Piloto de kart · Palhoça (SC)
          </motion.p>
          <h1 id="h3-title" className="display text-[clamp(3.8rem,10vw,8.6rem)]">
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span className="block" initial={reduce ? false : { x: "-110%" }} animate={{ x: 0 }} transition={{ duration: 0.8, ease, delay: 0.15 }}>Enrico</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-transparent [-webkit-text-stroke:2px_#00ff9c] sm:[-webkit-text-stroke:3px_#00ff9c]" initial={reduce ? false : { x: "-110%" }} animate={{ x: 0 }} transition={{ duration: 0.8, ease, delay: 0.28 }}>Vernieri</motion.span>
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-lg text-white/85">{pilot.tagline}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <motion.div style={{ x: reduce ? 0 : photoX, y: reduce ? 0 : photoY }}>
            <motion.div
              initial={reduce ? false : { x: "70%", opacity: 0, filter: "blur(18px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease }}
              className="slant relative aspect-[16/10] overflow-hidden bg-ink-3"
            >
              <Image src="/news/kartmotor-vice-2025.jpg" alt="Enrico pilotando o kart número 5 em uma curva, de capacete amarelo e verde" fill priority sizes="(min-width:1024px) 58vw, 100vw" className="object-cover object-[50%_55%]" />
            </motion.div>
          </motion.div>
          <motion.div style={{ x: reduce ? 0 : fiveX }} className="pointer-events-none absolute -bottom-8 -left-2 z-10 text-[clamp(6rem,15vw,12rem)] text-mint drop-shadow-[0_8px_0_rgba(0,0,0,0.5)] lg:-left-14">
            <SpeedingNumber value={5} duration={1.1} maxBlur={12} label="Número 5, número oficial do piloto" />
          </motion.div>
        </div>
      </div>
      <div aria-hidden className="checker h-6 w-full" />
    </section>
  );
}
