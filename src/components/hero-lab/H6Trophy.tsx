"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { Button } from "../Button";
import { Contours, NextCard } from "../heroes-ln/shared";
import { Marquee } from "../heroes/shared";
import { SpeedingNumber } from "../SpeedingNumber";
import { pilot } from "@/content/pilot";
import { positionLabel, results } from "@/content/results";

const ease = [0.2, 0.8, 0.2, 1] as const;

// Principais feitos: só títulos e vices, tirados de results.ts (nada digitado à mão).
const feats = results
  .filter((r) => r.position <= 2)
  .sort((a, b) => b.year - a.year || a.position - b.position)
  .map((r) => `${positionLabel(r.position)} · ${r.event.replace("Campeonato ", "")}${r.note ? ` (${r.note})` : ""} ${r.year}`);

/**
 * 6 · Troféu. Composição em camadas, inspirada em pôsteres de tênis e F1 em que o numeral e o nome ficam atrás do atleta:
 * 5 gigante e ENRICO atrás, o Enrico recortado no meio, VERNIERI em contorno por cima do corpo.
 * Botões à esquerda, próximo desafio no canto superior direito e uma faixa de feitos rolando embaixo.
 * A foto original (420×476 px) é pequena: acima de ~480 px de largura ela perde nitidez, então vale pedir o arquivo original.
 */
export function H6Trophy() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const xName = useTransform(sx, [-1, 1], [-14, 14]);
  const xFive = useTransform(sx, [-1, 1], [34, -34]);
  const xPilot = useTransform(sx, [-1, 1], [-8, 8]);
  const xFront = useTransform(sx, [-1, 1], [-26, 26]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };
  const par = (v: typeof xName) => (reduce ? 0 : v);

  return (
    <section aria-labelledby="h6t-title" onPointerMove={reduce ? undefined : onMove} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#070908] pt-[var(--header-h)]">
      <Contours className="-z-0" color="rgb(0 255 156 / 0.16)" />
      <div aria-hidden className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_50%_60%_at_58%_55%,rgb(0_255_156/0.2),transparent_72%)]" />

      <h1 id="h6t-title" className="sr-only">Enrico Vernieri, piloto de kart</h1>

      {/* próximo desafio: canto superior direito (celular: linha acima da cena) */}
      <div className="relative z-[6] flex justify-end px-5 pt-3 lg:absolute lg:right-16 lg:top-[calc(var(--header-h)+1rem)] lg:p-0">
        <NextCard />
      </div>

      {/* cena em camadas */}
      <div className="relative mx-auto w-full max-w-[1600px] flex-1 min-h-[33rem] lg:min-h-0">
        {/* 1 · numeral gigante, atrás de tudo */}
        <motion.div aria-hidden style={{ x: par(xFive) }} className="pointer-events-none absolute right-[-6%] top-[2%] z-[1] select-none text-[min(58svh,86vw)] text-mint/[0.3] md:right-auto md:left-[50%] md:text-[min(72svh,52vw)]">
          <SpeedingNumber value={5} duration={1.2} maxBlur={14} label="Número 5" />
        </motion.div>

        {/* 2 · ENRICO, atrás do piloto */}
        <motion.div aria-hidden style={{ x: par(xName) }} className="pointer-events-none absolute left-[3vw] top-[3%] z-[2] select-none">
          <motion.span className="display block whitespace-nowrap text-[27vw] leading-[0.8] text-white md:text-[min(19.5vw,27svh)]" initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.1, ease }}>
            Enrico
          </motion.span>
        </motion.div>

        {/* 3 · piloto recortado */}
        <motion.div style={{ x: par(xPilot) }} className="absolute bottom-0 left-1/2 z-[3] h-[84%] -translate-x-1/2 md:left-[54%] md:h-[92%]">
          <motion.div className="relative h-full aspect-[420/476] [mask-image:linear-gradient(to_bottom,#000_80%,transparent_99%)]" initial={reduce ? false : { opacity: 0, y: 60, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease, delay: 0.25 }}>
            <Image src="/photos/enrico-trofeu.png" alt="Enrico Vernieri de macacão e boné, sorrindo e segurando um troféu" fill priority sizes="(min-width:768px) 580px, 80vw" className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />
          </motion.div>
        </motion.div>

        {/* 4 · VERNIERI em contorno, por cima do corpo */}
        <motion.div aria-hidden style={{ x: par(xFront) }} className="pointer-events-none absolute bottom-[3%] left-[3vw] z-[4] select-none">
          <motion.span className="display block whitespace-nowrap text-[21vw] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_#fff] [filter:drop-shadow(0_0_14px_rgba(0,0,0,0.55))] md:text-[min(17vw,24svh)] md:[-webkit-text-stroke:2.5px_#fff]" initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.1, ease, delay: 0.5 }}>
            Vernieri
          </motion.span>
        </motion.div>
      </div>

      {/* botões: canto esquerdo (celular: logo abaixo da cena) */}
      <motion.div className="relative z-[6] px-5 pb-6 pt-4 lg:absolute lg:left-[3vw] lg:top-[40%] lg:max-w-[19rem] lg:p-0" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.9 }}>
        <p className="eyebrow flex items-center gap-3 text-mint lg:[@media(max-height:760px)]:hidden"><span aria-hidden className="inline-block h-[3px] w-8 bg-current" />Piloto de kart · Palhoça (SC)</p>
        <p className="mt-2 text-white/85 lg:[@media(max-height:760px)]:hidden">{pilot.tagline}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button href="#historia">Conheça minha história</Button>
          <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
        </div>
      </motion.div>

      {/* faixa de feitos */}
      <div className="relative z-[6] border-y border-white/15 bg-ink/85 py-3 backdrop-blur-sm">
        <span className="sr-only">Principais feitos: {feats.join("; ")}.</span>
        <Marquee duration={46}>
          {feats.map((f) => (
            <span key={f} className="eyebrow flex items-center gap-6 whitespace-nowrap px-6 text-base text-white md:text-lg">
              {f}
              <span aria-hidden className="h-2 w-2 -skew-x-12 bg-mint" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
