"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Pill({ href, children, play }: { href: string; children: React.ReactNode; play?: boolean }) {
  return (
    <a href={href} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/60 px-8 font-display text-lg font-extrabold italic uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:border-mint hover:bg-mint hover:text-ink">
      {play && <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M7 5v14l11-7z" /></svg>}
      {children}
    </a>
  );
}

/** Ln2 · Foto total: imagem em tela cheia, texto centralizado em caixa alta e botões em pílula (referência da moto de enduro). */
export function Ln2() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="ln2-title" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink px-5 pt-[var(--header-h)] text-center">
      <motion.div className="absolute inset-0 -z-10" initial={{ scale: 1.04 }} animate={reduce ? undefined : { scale: [1.04, 1.16] }} transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}>
        <Image src="/news/kartmotor-vice-2025.jpg" alt="Enrico pilotando o kart número 5 em uma curva, de capacete amarelo e verde" fill priority sizes="100vw" className="object-cover object-[50%_58%]" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-transparent to-ink/50" />

      <motion.p className="eyebrow text-lg text-white" initial={reduce ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Vice-campeão brasileiro 2025 · Campeão paranaense 2026
      </motion.p>
      <h1 id="ln2-title" className="display mt-4 max-w-5xl text-[clamp(3.4rem,10.5vw,9rem)] leading-[0.86]">
        <span className="block overflow-hidden pb-[0.06em]">
          <motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>Feito para</motion.span>
        </span>
        <span className="block overflow-hidden pb-[0.06em]">
          <motion.span className="block text-mint" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.24 }}>acelerar</motion.span>
        </span>
      </h1>
      <p className="mt-5 text-lg text-white/90">{pilot.tagline}</p>
      <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.7 }}>
        <Pill href="#historia" play>Conhecer</Pill>
        <Pill href="#patrocinadores">Seja parceiro</Pill>
      </motion.div>
      <p className="eyebrow absolute bottom-6 text-white/80">Enrico Vernieri · Nº 5 · Palhoça (SC)</p>
    </section>
  );
}
