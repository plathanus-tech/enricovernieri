"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { RaceNumber } from "../RaceNumber";

const ease = [0.2, 0.8, 0.2, 1] as const;

function Bracket({ className = "" }: { className?: string }) {
  const c = "absolute h-6 w-6 border-white";
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

/**
 * 4 · Motorsport gráfico. Pôster de corrida: bloco verde em diagonal, foto em duotone verde (preto e branco multiplicado sobre o verde),
 * numeral 5 em contorno atrás, marcas de enquadramento e uma faixa de dados no rodapé. Cada camada tem função de composição.
 */
export function H4Poster() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="h4g-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[var(--header-h)]">
      {/* bloco diagonal */}
      <motion.div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-full bg-mint lg:w-[68%] [clip-path:polygon(0_100%,34%_0,100%_0,100%_100%)] max-lg:[clip-path:polygon(0_62%,100%_47%,100%_100%,0_100%)]" initial={reduce ? false : { x: "30%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease }} />

      {/* numeral em contorno */}
      <motion.div aria-hidden className="pointer-events-none absolute -left-[3vw] top-[calc(var(--header-h)+1rem)] -z-10 select-none text-[min(78vw,78svh)] text-white/[0.1]" initial={reduce ? false : { x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.1, ease, delay: 0.15 }}>
        <RaceNumber value={5} outline />
      </motion.div>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 px-5 py-8 md:px-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-6">
          <p className="eyebrow mb-3 text-mint">Kart · Nº 5 · Palhoça (SC)</p>
          <h1 id="h4g-title" className="display text-[clamp(4rem,11.5vw,10rem)] leading-[0.86] tracking-[0.01em]">
            <span className="block overflow-hidden pb-[0.05em]"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.3 }}>Enrico</motion.span></span>
            <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block text-transparent [-webkit-text-stroke:2px_#00ff9c] sm:[-webkit-text-stroke:3px_#00ff9c]" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.42 }}>Vernieri</motion.span></span>
          </h1>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="#historia">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
          </div>
        </div>

        <motion.div className="relative z-10 lg:col-span-6" initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.4 }}>
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px] lg:ml-auto">
            <div className="absolute inset-0 overflow-hidden bg-mint [clip-path:polygon(7%_0,100%_0,93%_100%,0_100%)]">
              <Image src="/photos/kart-action-1.png" alt="Enrico acelerando no kart número 5, em preto e branco" fill priority sizes="(min-width:1024px) 40vw, 92vw" className="object-cover object-[62%_50%] mix-blend-multiply" />
            </div>
            <Bracket className="-inset-3" />
          </div>
        </motion.div>
      </div>

      {/* faixa de dados */}
      <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/20 bg-ink/80 px-5 py-3 backdrop-blur-sm md:px-10">
        <span className="eyebrow text-white">Enrico Vernieri</span>
        <span aria-hidden className="checker h-3 flex-1 max-w-xs" />
        <span className="eyebrow text-mint">Juntos na pista, rumo ao topo</span>
      </div>
    </section>
  );
}
