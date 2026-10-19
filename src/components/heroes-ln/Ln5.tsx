"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Mostrador de marcas ao redor da foto, como no relógio da referência do paraquedista. */
function Dial() {
  const ticks = Array.from({ length: 60 }, (_, k) => k);
  return (
    <svg aria-hidden viewBox="-110 -110 220 220" className="absolute inset-0 h-full w-full">
      {ticks.map((k) => {
        const major = k % 5 === 0;
        const a = (k / 60) * Math.PI * 2;
        const r1 = major ? 98 : 102;
        const f = (n: number) => Math.round(n * 100) / 100;
        return <line key={k} x1={f(Math.sin(a) * r1)} y1={f(-Math.cos(a) * r1)} x2={f(Math.sin(a) * 108)} y2={f(-Math.cos(a) * 108)} stroke={major ? "#00ff9c" : "rgb(255 255 255 / 0.5)"} strokeWidth={major ? 1.6 : 0.8} />;
      })}
    </svg>
  );
}

const callouts = [
  { text: "Nascido em 2016", className: "left-[2%] top-[18%] md:left-[4%]", line: "right" },
  { text: "Nas pistas desde 2022", className: "right-[2%] top-[10%] md:right-[2%]", line: "left" },
  { text: "Campeão paranaense 2026", className: "right-[0%] bottom-[22%] md:right-[1%]", line: "left" },
] as const;

/** Ln5 · Mostrador: o retrato dentro de um círculo com marcas de relógio girando, linhas de chamada com fatos reais e o contorno de uma pista nos cantos. */
export function Ln5() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="ln5-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#161718] pt-[var(--header-h)]">
      {/* contorno de pista nos cantos */}
      <svg aria-hidden viewBox="0 0 400 300" className="absolute left-0 top-[var(--header-h)] -z-10 h-56 w-72 fill-none stroke-mint/60">
        {[0, 7, 14].map((o) => <path key={o} d={`M0 ${120 + o} H150 Q${200 + o} ${120 + o} ${200 + o} ${60 + o} V0`} strokeWidth="1.5" opacity={1 - o / 30} />)}
      </svg>
      <svg aria-hidden viewBox="0 0 400 300" className="absolute bottom-0 right-0 -z-10 h-56 w-72 rotate-180 fill-none stroke-mint/60">
        {[0, 7, 14].map((o) => <path key={o} d={`M0 ${120 + o} H150 Q${200 + o} ${120 + o} ${200 + o} ${60 + o} V0`} strokeWidth="1.5" opacity={1 - o / 30} />)}
      </svg>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-5 py-8 md:px-10">
        <p className="eyebrow text-mint">Piloto de kart · Palhoça (SC)</p>
        <h1 id="ln5-title" className="display mt-2 text-center text-[clamp(2.6rem,6.5vw,5.4rem)]">Enrico Vernieri</h1>

        <div className="relative mt-6 aspect-square w-[min(84vw,58svh)]">
          <motion.div className="absolute inset-0" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 120, ease: "linear", repeat: Infinity }}><Dial /></motion.div>
          <motion.div className="absolute inset-[9%] overflow-hidden rounded-full bg-ink-3" initial={reduce ? false : { scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease }}>
            <Image src="/news/kartmotor-vice-2025.jpg" alt="Enrico pilotando o kart número 5 em uma curva" fill priority sizes="(min-width:768px) 58svh, 84vw" className="object-cover object-[50%_55%]" />
          </motion.div>
          {callouts.map((c) => (
            <motion.p key={c.text} className={`absolute z-10 max-w-[9.5rem] bg-ink/70 px-2 py-1 text-xs font-bold uppercase leading-tight tracking-wide text-white backdrop-blur-sm md:max-w-none md:text-sm ${c.className}`} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
              <span aria-hidden className="mr-2 inline-block h-2 w-2 rounded-full border border-mint" />{c.text}
            </motion.p>
          ))}
        </div>
        {/* plataforma elíptica */}
        <div aria-hidden className="-mt-4 h-10 w-[min(84vw,58svh)] rounded-[50%] border border-white/40" />

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <Button href="#historia">Conheça minha história</Button>
          <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
        </div>
        <p className="eyebrow mt-4 text-white/70">{pilot.tagline}</p>
      </div>

      <div className="flex min-h-12 items-center justify-center gap-3 bg-mint px-5 py-2 text-ink">
        <span aria-hidden className="inline-flex h-6 w-4 items-start justify-center rounded-full border-2 border-ink pt-1"><span className="h-1.5 w-0.5 bg-ink" /></span>
        <span className="font-display text-lg font-extrabold italic uppercase tracking-wide">Role para conhecer a trajetória</span>
      </div>
    </section>
  );
}
