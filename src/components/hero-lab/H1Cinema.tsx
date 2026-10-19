"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { Button } from "../Button";
import { SpeedLines } from "../heroes/shared";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;
const SRC = "/news/kartmotor-vice-2025.jpg";
const ALT = "Enrico pilotando o kart número 5 em uma curva, de capacete amarelo e verde";

/**
 * 1 · Cinematográfica. Uma só foto, tratada em três planos de profundidade:
 * fundo com zoom lento e parallax do mouse, faixa de asfalto em primeiro plano com desfoque de movimento
 * e a tipografia ancorada embaixo, fora da área do piloto. Nada compete com a imagem.
 */
export function H1Cinema() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const bx = useTransform(sx, [-1, 1], [-22, 22]);
  const by = useTransform(sy, [-1, 1], [-12, 12]);
  const fx = useTransform(sx, [-1, 1], [40, -40]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section aria-labelledby="h1c-title" onPointerMove={reduce ? undefined : onMove} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pt-[var(--header-h)]">
      <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
        <filter id="h1c-motion" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="34 0" /></filter>
      </svg>

      {/* plano 1: fundo */}
      <motion.div className="absolute inset-0 -z-10" style={{ x: reduce ? 0 : bx, y: reduce ? 0 : by }}>
        <motion.div className="absolute -inset-[6%]" initial={{ scale: 1.04 }} animate={reduce ? undefined : { scale: [1.04, 1.12] }} transition={{ duration: 22, ease: "linear", repeat: Infinity, repeatType: "reverse" }}>
          <Image src={SRC} alt={ALT} fill priority sizes="100vw" className="object-cover object-[50%_56%]" />
        </motion.div>
      </motion.div>

      {/* plano 2: asfalto em primeiro plano, com desfoque de movimento e deslocamento oposto */}
      <motion.div aria-hidden className="absolute -inset-[6%] -z-10 [mask-image:linear-gradient(to_top,#000_0%,#000_16%,transparent_34%)]" style={{ x: reduce ? 0 : fx, filter: "url(#h1c-motion)" }}>
        <Image src={SRC} alt="" fill sizes="100vw" className="object-cover object-[50%_56%]" />
      </motion.div>

      <SpeedLines count={8} className="-z-10 opacity-35" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/35 to-ink/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/15 to-transparent" />

      <div className="mx-auto w-full max-w-[1400px] px-5 pb-10 md:px-10 md:pb-14">
        <motion.p className="eyebrow mb-4 flex items-center gap-3 text-mint" initial={reduce ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
          <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
          Piloto de kart · Palhoça (SC)
        </motion.p>
        <h1 id="h1c-title" className="display text-[clamp(4.4rem,15.5vw,14rem)] leading-[0.8]">
          <span className="block overflow-hidden pb-[0.05em]"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.95, ease, delay: 0.1 }}>Enrico</motion.span></span>
          <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block text-mint" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.95, ease, delay: 0.22 }}>Vernieri</motion.span></span>
        </h1>
        <motion.div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.7 }}>
          <p className="max-w-[16rem] text-lg text-white/90">{pilot.tagline}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
