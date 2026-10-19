"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "./Button";
import { RaceNumber } from "./RaceNumber";
import { pilot } from "@/content/pilot";

const ease = [0.2, 0.8, 0.2, 1] as const;
const PHOTO = "/news/kartmotor-vice-2025.jpg";
const PHOTO_ALT = "Enrico Vernieri pilotando seu kart número 5 em uma curva, de capacete amarelo e verde";

/**
 * Hero da versão 2.
 * - Foto real e colorida. O efeito de "pan shot" é feito em duas camadas: o fundo recebe um desfoque horizontal
 *   (filtro SVG) e a foto nítida aparece só numa elipse em volta do kart.
 * - Rastro neon, linha de circuito e número 5 são camadas de SVG/CSS sobre a foto, sem alterar o piloto nem o kart.
 */
export function HeroV2() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const fiveY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, -34]);

  const line = (i: number) =>
    reduce ? {} : { initial: { y: "105%" }, animate: { y: 0 }, transition: { duration: 0.8, ease, delay: 0.15 + i * 0.12 } };
  const draw = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { pathLength: 1, opacity: 1 } }
      : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.6, ease, delay } };

  return (
    <section ref={ref} id="topo" aria-labelledby="hero-title" className="grain relative isolate overflow-hidden bg-ink pt-[var(--header-h)]">
      {/* filtros SVG compartilhados */}
      <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
        <defs>
          <filter id="pan-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="22 0" />
          </filter>
          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="trail-blur" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="9 1.5" />
          </filter>
          <linearGradient id="circuit-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00ff9c" stopOpacity="0" />
            <stop offset="0.4" stopColor="#00ff9c" stopOpacity="0.22" />
            <stop offset="0.72" stopColor="#00ff9c" stopOpacity="0.95" />
            <stop offset="1" stopColor="#00ff9c" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* trama de fibra de carbono no fundo */}
      <div aria-hidden className="carbon-bg absolute inset-0 -z-10 opacity-60" />

      {/* LINHA DE CIRCUITO (computador): nasce no asfalto, à frente do kart, e serpenteia para fora do quadro, à esquerda */}
      <svg aria-hidden viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[3] hidden h-full w-full lg:block">
        {(() => {
          const d = "M840 650 L700 722 L610 676 L470 748 L380 712 L250 766 L150 736 L-40 790";
          return (
            <>
              {/* cauda de desfoque de movimento */}
              <motion.path d={d} fill="none" stroke="url(#circuit-fade)" strokeWidth="22" strokeLinejoin="miter" strokeLinecap="square" opacity="0.35" filter="url(#trail-blur)" vectorEffect="non-scaling-stroke" {...draw(0.5)} />
              {/* sombra: dá volume, como se a linha estivesse acima do asfalto */}
              <motion.path d={d} transform="translate(0 10)" fill="none" stroke="#001b0f" strokeOpacity="0.75" strokeWidth="12" strokeLinejoin="miter" strokeLinecap="square" vectorEffect="non-scaling-stroke" {...draw(0.5)} />
              {/* brilho neon */}
              <motion.path d={d} fill="none" stroke="url(#circuit-fade)" strokeWidth="14" strokeOpacity="0.6" filter="url(#neon-glow)" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" {...draw(0.5)} />
              {/* núcleo e fio de luz */}
              <motion.path d={d} fill="none" stroke="url(#circuit-fade)" strokeWidth="8" strokeLinejoin="miter" strokeLinecap="square" vectorEffect="non-scaling-stroke" {...draw(0.5)} />
              <motion.path d={d} fill="none" stroke="#eafff5" strokeOpacity="0.5" strokeWidth="1.6" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" {...draw(0.62)} />
            </>
          );
        })()}
      </svg>

      <div className="mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-[1400px] grid-cols-1 gap-y-10 px-5 pb-12 pt-6 md:px-10 lg:grid-cols-12 lg:items-end lg:pb-16">
        {/* FOTO */}
        <div className="relative order-1 lg:absolute lg:right-0 lg:top-[calc(var(--header-h)+1.5rem)] lg:z-0 lg:order-none lg:h-[min(72svh,720px)] lg:w-[64%]">
          <div aria-hidden className="slant absolute -bottom-3 -left-3 right-3 top-3 bg-mint/90 shadow-[0_0_60px_rgba(0,255,156,0.35)] lg:-bottom-4 lg:-left-4 lg:right-4 lg:top-4" />
          <motion.div
            className="slant relative aspect-[4/3] w-full overflow-hidden bg-ink-3 lg:aspect-auto lg:h-full"
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.1, ease }}
          >
            <motion.div style={{ y: reduce ? 0 : photoY }} className="absolute -inset-y-[5%] inset-x-0">
              {/* camada 1: fundo em movimento (desfoque horizontal) */}
              <div className="absolute inset-0 scale-[1.08]" style={{ filter: "url(#pan-blur) saturate(1.15) contrast(1.05)" }}>
                <Image src={PHOTO} alt="" fill priority sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover object-[50%_55%]" />
              </div>
              {/* camada 2: piloto e kart nítidos, recortados em elipse */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: "radial-gradient(ellipse 44% 46% at 53% 60%, #000 58%, transparent 100%)",
                  maskImage: "radial-gradient(ellipse 44% 46% at 53% 60%, #000 58%, transparent 100%)",
                }}
              >
                <Image src={PHOTO} alt={PHOTO_ALT} fill priority sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover object-[50%_55%] [filter:saturate(1.12)_contrast(1.06)]" />
              </div>
            </motion.div>

            {/* classificação de cor e vinheta */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/30" />

            {/* RASTRO NEON saindo das rodas e do motor, para trás do kart */}
            <svg aria-hidden viewBox="0 0 100 62" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen">
              <g fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke">
                <motion.path d="M72 44 C 82 44, 90 46, 112 43" stroke="#00ff9c" strokeWidth="5" opacity="0.85" filter="url(#trail-blur)" {...draw(1.1)} />
                <motion.path d="M70 38 C 82 36, 92 37, 112 33" stroke="#00ff9c" strokeWidth="3.4" opacity="0.7" filter="url(#trail-blur)" {...draw(1.25)} />
                <motion.path d="M71 48 C 84 50, 94 49, 112 52" stroke="#7dffc8" strokeWidth="1.6" opacity="0.6" filter="url(#trail-blur)" {...draw(1.4)} />
                <motion.path d="M72 44 C 82 44, 90 46, 112 43" stroke="#eafff5" strokeWidth="0.5" opacity="0.45" {...draw(1.2)} />
              </g>
            </svg>
          </motion.div>

          {/* 5 GIGANTE: translúcido, com volume e um rastro de luz difuso até o kart */}
          <motion.div style={{ y: reduce ? 0 : fiveY }} className="pointer-events-none absolute -bottom-10 right-3 z-10 lg:-bottom-16 lg:right-8">
            <div
              aria-hidden
              className="absolute -left-[55%] top-[42%] h-[18%] w-[120%] -rotate-[8deg] rounded-full bg-gradient-to-r from-transparent via-mint/45 to-mint/10 blur-2xl"
            />
            <motion.div
              animate={reduce ? undefined : { y: [0, -9, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative text-[clamp(6.5rem,19vw,14rem)] text-mint/75 [filter:drop-shadow(0_0_26px_rgba(0,255,156,0.55))_drop-shadow(0_14px_20px_rgba(0,0,0,0.5))]"
            >
              <RaceNumber value={5} label="Número 5, número oficial do piloto" />
            </motion.div>
          </motion.div>
        </div>

        {/* TEXTO */}
        <div className="relative z-10 order-2 pt-10 lg:order-none lg:col-span-6 lg:pt-0">
          <motion.p className="eyebrow mb-5 flex items-center gap-3 text-mint" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <span aria-hidden className="inline-block h-[3px] w-10 bg-current shadow-[0_0_12px_#00ff9c]" />
            Piloto de kart · Palhoça (SC)
          </motion.p>

          <h1 id="hero-title" className="display text-[clamp(3.6rem,10.5vw,8.8rem)]">
            <span className="block overflow-hidden pb-[0.06em] pr-[0.08em]">
              <motion.span className="carbon-text block" {...line(0)}>
                Enrico
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] pr-[0.08em]">
              <motion.span className="neon-outline block" {...line(1)}>
                Vernieri
              </motion.span>
            </span>
          </h1>

          <motion.p className="mt-6 max-w-md text-lg text-white/85 md:text-xl" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease }}>
            {pilot.tagline}
          </motion.p>

          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85, ease }}>
            <Button href="#historia" className="shadow-[0_0_28px_rgba(0,255,156,0.35)]">Conheça minha história</Button>
            <Button href="#patrocinadores" variant="ghost-dark">
              Seja parceiro
            </Button>
          </motion.div>

          <motion.dl style={{ y: reduce ? 0 : statsY }} className="mt-10 grid max-w-xl grid-cols-3 border-t border-line-dark pt-5 text-sm">
            <div>
              <dt className="eyebrow text-mute-dark">Nascido em</dt>
              <dd className="display mt-1 text-2xl">{pilot.born}</dd>
            </div>
            <div>
              <dt className="eyebrow text-mute-dark">Nas pistas desde</dt>
              <dd className="display mt-1 text-2xl">{pilot.debut.year}</dd>
            </div>
            <div>
              <dt className="eyebrow text-mute-dark">Em 2026</dt>
              <dd className="display mt-1 text-2xl text-mint">Campeão paranaense</dd>
            </div>
          </motion.dl>
        </div>
      </div>

      {/* LINHA DE CIRCUITO (celular): curta, cruzando o limite entre a foto e o texto */}
      <svg aria-hidden viewBox="0 0 390 80" className="pointer-events-none absolute left-0 top-[calc(var(--header-h)+min(75vw,420px)-10px)] z-[3] h-16 w-full lg:hidden">
        <motion.path d="M300 8 L230 52 L170 14 L90 62 L40 38 L-10 70" fill="none" stroke="#00ff9c" strokeWidth="10" opacity="0.5" filter="url(#neon-glow)" {...draw(0.5)} />
        <motion.path d="M300 8 L230 52 L170 14 L90 62 L40 38 L-10 70" fill="none" stroke="url(#circuit-fade)" strokeWidth="5" strokeLinejoin="miter" {...draw(0.5)} />
      </svg>
    </section>
  );
}
