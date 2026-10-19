"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { NextCard } from "./shared";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Corners({ className = "" }: { className?: string }) {
  const c = "absolute h-4 w-4 border-white/60";
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

/** Ln3 · Palco: fundo escuro, retrato recortado com foco de luz à direita e título em verde com marcas de enquadramento (referência do atleta de vermelho). */
export function Ln3() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="ln3-title" className="relative isolate flex min-h-[100svh] overflow-hidden bg-[#07090a] pt-[var(--header-h)]">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_74%_62%,rgb(0_255_156/0.22),transparent_70%)]" />
      <motion.div aria-hidden className="absolute right-[6%] top-[24%] -z-10 h-[56svh] w-[56svh] rounded-full border border-white/10" animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div aria-hidden className="absolute right-[2%] top-[18%] -z-10 h-[68svh] w-[68svh] rounded-full border border-white/5" animate={reduce ? undefined : { scale: [1.04, 1, 1.04] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-5 pb-10 pt-8 md:px-10 lg:grid-cols-12">
        <div className="relative flex flex-col justify-between lg:col-span-7">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <Image src="/sponsors/plathanus.png" alt="Plathanus" width={208} height={34} className="h-5 w-auto opacity-90" />
              <span aria-hidden className="h-6 w-px bg-white/30" />
              <Image src="/sponsors/mas-taekwondo.png" alt="MAS Pedra Branca Taekwondo" width={412} height={385} className="h-9 w-auto opacity-90" />
            </div>
            <span className="eyebrow text-[0.7rem] text-white/60">Parceiros do Enrico</span>
          </div>

          <div className="relative mt-16 lg:mt-0">
            <Corners className="-inset-4 md:-inset-6" />
            <h1 id="ln3-title" className="display text-[clamp(3.4rem,9.5vw,8.4rem)] text-mint">
              <span className="block overflow-hidden pb-[0.05em]"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }}>Corrida</motion.span></span>
              <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.22 }}>para o topo</motion.span></span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/85">Enrico Vernieri, piloto de kart de Palhoça (SC). {pilot.tagline}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="#historia">Conheça minha história</Button>
              <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[46svh] lg:col-span-5 lg:min-h-0">
          <motion.div className="absolute inset-x-0 bottom-0 top-4 mx-auto w-full max-w-[420px]" initial={reduce ? false : { opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }}>
            <Image src="/photos/portrait-2.png" alt="Enrico de capacete em pé entre os karts no paddock" fill priority sizes="(min-width:1024px) 420px, 80vw" className="object-cover object-[50%_28%] [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]" />
          </motion.div>
          <div className="absolute bottom-0 right-0 z-10"><NextCard /></div>
        </div>
      </div>
    </section>
  );
}
