"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Contours } from "../heroes-ln/shared";
import { RaceNumber } from "../RaceNumber";

/** Hero "Íris": ao rolar, um círculo cresce do centro e troca o retrato em preto e branco pela foto de ação em cores. */
export function IrisHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.3 });

  const iris = useTransform(p, [0.04, 0.85], ["circle(0% at 50% 64%)", "circle(95% at 50% 64%)"]);
  const baseScale = useTransform(p, [0, 1], [1, 1.25]);
  const actionScale = useTransform(p, [0, 1], [1.35, 1]);
  const nameY = useTransform(p, [0, 0.3], ["0%", "-40%"]);
  const nameO = useTransform(p, [0.08, 0.26], [1, 0]);
  const lineA = useTransform(p, [0.4, 0.65], [0, 1]);
  const lineAY = useTransform(p, [0.4, 0.65], [40, 0]);
  const five = useTransform(p, [0.5, 1], [0, 1]);
  const fiveX = useTransform(p, [0.5, 1], [120, 0]);
  const cue = useTransform(p, [0, 0.08], [1, 0]);
  const ringScale = useTransform(p, [0.04, 0.85], [0.1, 2.2]);

  if (reduce)
    return (
      <section aria-label="Enrico Vernieri, piloto de kart" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink pt-[var(--header-h)]">
        <Image src="/news/kartmotor-vice-2025.jpg" alt="Enrico pilotando o kart número 5 em uma curva" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink to-transparent" />
        <h1 className="display mx-auto w-full max-w-[1400px] px-5 pb-12 text-[clamp(3rem,10vw,8rem)] md:px-10">Enrico <span className="text-mint">Vernieri</span></h1>
      </section>
    );

  return (
    <section ref={ref} aria-labelledby="iris-title" className="relative h-[260svh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Contours className="z-0" color="rgb(0 255 156 / 0.16)" />

        <motion.div style={{ scale: baseScale }} className="absolute inset-x-0 bottom-0 top-[var(--header-h)] z-10 mx-auto w-[min(92vw,560px)]">
          <Image src="/photos/portrait-2.png" alt="Retrato de Enrico de capacete, em pé entre os karts" fill priority sizes="(min-width:768px) 560px, 92vw" className="object-cover object-[50%_26%] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]" />
        </motion.div>

        <motion.div style={{ clipPath: iris }} className="absolute inset-0 z-20">
          <motion.div style={{ scale: actionScale }} className="absolute inset-0">
            <Image src="/news/kartmotor-vice-2025.jpg" alt="Enrico pilotando o kart número 5 em uma curva" fill sizes="100vw" className="object-cover object-[50%_58%]" />
          </motion.div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
        </motion.div>
        <motion.div aria-hidden style={{ scale: ringScale }} className="pointer-events-none absolute left-1/2 top-[64%] z-30 h-[min(120vw,120svh)] w-[min(120vw,120svh)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-mint/70" />

        <motion.div style={{ y: nameY, opacity: nameO }} className="absolute inset-x-0 top-[calc(var(--header-h)+1.5rem)] z-40 text-center">
          <h1 id="iris-title" className="display text-[clamp(3rem,9vw,8rem)]">Enrico <span className="text-mint">Vernieri</span></h1>
          <p className="eyebrow mt-2 text-white/80">Piloto de kart · Palhoça (SC)</p>
        </motion.div>

        <motion.div style={{ opacity: lineA, y: lineAY }} className="absolute inset-x-0 bottom-[12%] z-40 px-5 text-center">
          <p className="display text-[clamp(2.4rem,7vw,6rem)]">Juntos na pista,<br /><span className="text-mint">rumo ao topo!</span></p>
        </motion.div>
        <motion.div style={{ opacity: five, x: fiveX }} className="absolute right-[4%] top-[calc(var(--header-h)+1rem)] z-40 text-[clamp(5rem,14vw,11rem)] text-mint">
          <RaceNumber value={5} label="Número 5" />
        </motion.div>

        <motion.div style={{ opacity: cue }} className="absolute inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2 text-white">
          <span className="eyebrow text-sm">Role para acelerar</span>
          <span aria-hidden className="block h-9 w-5 rounded-full border-2 border-white/80"><motion.span className="mx-auto mt-1.5 block h-2 w-0.5 bg-white" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.4, repeat: Infinity }} /></span>
        </motion.div>
      </div>
    </section>
  );
}
