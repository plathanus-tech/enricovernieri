"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * 5 · Premium e minimalista. Uma foto, um nome, duas ações. Tipografia leve (Manrope 300) em vez do condensado pesado da marca,
 * margens generosas, linhas finas e um único movimento lento. A contenção é o efeito.
 */
export function H5Premium() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="h5p-title" className="on-light relative isolate flex min-h-[100svh] flex-col bg-paper pt-[var(--header-h)] text-ink">
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-12 items-end gap-y-10 px-5 pb-10 pt-10 md:px-10 md:pb-14 lg:pt-14">
        <div className="col-span-12 lg:col-span-4 lg:pb-4">
          <motion.p className="text-xs font-semibold uppercase tracking-[0.32em] text-mute-light" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
            Piloto de kart · Palhoça
          </motion.p>
          <h1 id="h5p-title" className="mt-5 text-[clamp(2.8rem,5.6vw,5.4rem)] font-light leading-[1.02] tracking-[-0.03em]">
            <span className="block overflow-hidden pb-1"><motion.span className="block" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.15 }}>Enrico</motion.span></span>
            <span className="block overflow-hidden pb-1"><motion.span className="block font-extrabold" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.27 }}>Vernieri</motion.span></span>
          </h1>
          <motion.span aria-hidden className="mt-8 block h-px w-24 origin-left bg-ink" initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease, delay: 0.7 }} />
          <motion.div className="mt-8 flex flex-col items-start gap-1 text-[0.95rem] font-semibold" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
            <a href="#historia" className="group inline-flex min-h-11 items-center gap-3 hover:text-mint-ink">Conheça a trajetória <span aria-hidden className="inline-block h-px w-8 bg-current transition-all group-hover:w-12" /></a>
            <a href="#patrocinadores" className="group inline-flex min-h-11 items-center gap-3 text-mute-light hover:text-mint-ink">Seja parceiro <span aria-hidden className="inline-block h-px w-8 bg-current transition-all group-hover:w-12" /></a>
          </motion.div>
        </div>

        <motion.div className="relative col-span-12 lg:col-span-8" initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 1.3, ease }}>
          <motion.div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-3 lg:aspect-[16/10]" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease }}>
            <Image src="/news/kartmotor-vice-2025.jpg" alt="Enrico pilotando o kart número 5 em uma curva, de capacete amarelo e verde" fill priority sizes="(min-width:1024px) 66vw, 100vw" className="object-cover object-[50%_58%]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
