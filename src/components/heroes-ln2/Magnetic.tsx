"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { NextCard } from "../heroes-ln/shared";

const LINES = ["ENRICO", "VERNIERI"] as const;
const RADIUS = 220;

/** Hero "Letras magnéticas": as letras do nome fogem do cursor e voltam, com a foto de ação em cores ao fundo. */
export function MagneticHero() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (reduce) return;
    const els = letters.current.filter(Boolean) as HTMLSpanElement[];
    const st = els.map(() => ({ ox: 0, oy: 0, bx: 0, by: 0 }));
    const measure = () =>
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        st[i].bx = r.left + r.width / 2 - st[i].ox;
        st[i].by = r.top + r.height / 2 - st[i].oy;
      });
    measure();
    window.addEventListener("resize", measure);
    let raf = 0;
    const loop = () => {
      els.forEach((el, i) => {
        const s = st[i];
        const dx = s.bx - mouse.current.x;
        const dy = s.by - mouse.current.y;
        const d = Math.hypot(dx, dy);
        const f = d < RADIUS ? 1 - d / RADIUS : 0;
        const tx = d > 0 ? (dx / d) * f * 90 : 0;
        const ty = d > 0 ? (dy / d) * f * 90 : 0;
        s.ox += (tx - s.ox) * 0.14;
        s.oy += (ty - s.oy) * 0.14;
        el.style.transform = `translate(${s.ox.toFixed(1)}px, ${s.oy.toFixed(1)}px) rotate(${(s.ox * 0.12).toFixed(1)}deg)`;
        el.style.color = f > 0.15 ? "#00ff9c" : "";
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  let n = 0;
  return (
    <section
      ref={section}
      aria-labelledby="mg-title"
      onPointerMove={(e) => { mouse.current = { x: e.clientX, y: e.clientY }; }}
      onPointerLeave={() => { mouse.current = { x: -9999, y: -9999 }; }}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-[var(--header-h)]"
    >
      <Image src="/news/portal-palhoca-paranaense.jpg" alt="Enrico, de capacete verde e laranja, à frente do pelotão de karts" fill priority sizes="100vw" className="-z-10 object-cover object-[50%_40%]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/65" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <p className="eyebrow mb-3 text-mint">Passe o mouse sobre o nome</p>
        <h1 id="mg-title" aria-label="Enrico Vernieri" className="display text-[clamp(4rem,15.5vw,14rem)] leading-[0.82]">
          {LINES.map((line, li) => (
            <span key={line} aria-hidden className={`block whitespace-nowrap ${li ? "text-transparent [-webkit-text-stroke:2px_#fff] sm:[-webkit-text-stroke:3px_#fff]" : ""}`}>
              {line.split("").map((ch) => {
                const i = n++;
                return <span key={i} ref={(el) => { letters.current[i] = el; }} className="inline-block will-change-transform">{ch}</span>;
              })}
            </span>
          ))}
        </h1>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="#historia">Conheça minha história</Button>
          <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
        </div>
      </div>
      <div className="absolute bottom-5 right-5 z-20 hidden md:right-10 md:block"><NextCard /></div>
    </section>
  );
}
