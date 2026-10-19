"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { RaceNumber } from "../RaceNumber";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Words({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.1em]">
          <motion.span className="inline-block" initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease, delay: delay + i * 0.05 }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * 3 · Personalidade. O Enrico fala em primeira pessoa e o rosto dele é o centro da composição:
 * retrato grande sobre um bloco verde e a placa do número 5 pregada na foto, como no kart. Sem currículo, sem estatística.
 */
export function H3Personal() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="h3p-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pt-[var(--header-h)]">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 py-10 md:px-10 lg:grid-cols-12 lg:gap-6">
        <div className="relative z-10 order-2 lg:order-1 lg:col-span-6">
          <p className="eyebrow mb-3 text-mint"><Words text="Oi, eu sou o" /></p>
          <h1 id="h3p-title" className="display text-[clamp(4.8rem,16vw,13.5rem)] leading-[0.8]">
            <span className="block overflow-hidden pb-[0.05em]"><motion.span className="block text-mint" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>Enrico</motion.span></span>
            <span className="sr-only">Vernieri</span>
          </h1>
          <p className="mt-5 max-w-md text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold leading-tight">
            <Words text="Tenho 10 anos, moro em Palhoça (SC) e corro de kart desde os 6." delay={0.5} />
          </p>
          <motion.blockquote className="mt-6 max-w-md border-l-4 border-mint pl-4 text-lg text-white/80" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
            “{pilot.creed}”
          </motion.blockquote>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 1.0 }}>
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </motion.div>
          <p className="eyebrow mt-6 text-mute-dark">Enrico Vernieri · piloto de kart</p>
        </div>

        <div className="relative order-1 lg:order-2 lg:col-span-6">
          <motion.div className="relative mx-auto w-[min(82vw,500px)]" initial={reduce ? false : { opacity: 0, y: 60, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1, ease, delay: 0.1 }}>
            <div aria-hidden className="absolute -bottom-4 -right-4 h-[92%] w-[92%] bg-mint" />
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
              <Image src="/photos/portrait-1.png" alt="Enrico de capacete e macacão, olhando para a câmera" fill priority sizes="(min-width:1024px) 500px, 82vw" className="object-cover object-[50%_22%]" />
            </div>
            {/* placa do kart */}
            <motion.div className="absolute -bottom-7 -left-4 flex h-[8.2rem] w-[8.2rem] items-center justify-center rounded-[1.4rem] border-[5px] border-ink bg-white text-ink shadow-[0_10px_0_rgba(0,0,0,0.35)] md:-left-12 md:h-40 md:w-40" initial={reduce ? false : { scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: -7 }} transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.9 }}>
              <RaceNumber value={5} className="text-[5.6rem] md:text-[7rem]" label="Número 5" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
