"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../Button";
import { NextCard } from "../heroes-ln/shared";

/** Hero "Campo de linhas": linhas de nível desenhadas em canvas que se curvam ao redor do cursor e ondulam sozinhas. */
export function FieldHero() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1, y: -1, sx: -1, sy: -1 });

  useEffect(() => {
    const cv = canvas.current;
    const host = wrap.current;
    if (!cv || !host) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth;
      h = host.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      const m = mouse.current;
      if (m.x < 0) { m.sx = w * 0.5 + Math.sin(t / 1800) * w * 0.25; m.sy = h * 0.55 + Math.cos(t / 2300) * h * 0.2; }
      else { m.sx += (m.x - m.sx) * 0.12; m.sy += (m.y - m.sy) * 0.12; }
      ctx.clearRect(0, 0, w, h);
      const rows = Math.max(18, Math.round(h / 30));
      for (let r = 0; r < rows; r++) {
        const y0 = (r + 0.5) * (h / rows);
        ctx.beginPath();
        for (let x = 0; x <= w + 14; x += 14) {
          const base = Math.sin(x / 140 + r * 0.45 + t / 2200) * 9 + Math.sin(x / 70 - t / 1500 + r) * 3;
          const dx = x - m.sx;
          const dy = y0 - m.sy;
          const d2 = dx * dx + dy * dy;
          const push = Math.exp(-d2 / (2 * 130 * 130)) * 60;
          const y = y0 + base + (dy === 0 ? 0 : (dy / Math.abs(dy)) * push);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const dist = Math.abs(y0 - m.sy) / h;
        ctx.strokeStyle = `rgba(0,255,156,${(0.5 - dist * 0.55).toFixed(2)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(m.sx, m.sy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#00ff9c";
      ctx.fill();
    };

    let raf = 0;
    if (reduce) draw(0);
    else {
      const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [reduce]);

  return (
    <section
      ref={wrap}
      aria-labelledby="fd-title"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mouse.current.x = e.clientX - r.left; mouse.current.y = e.clientY - r.top; }}
      onPointerLeave={() => { mouse.current.x = -1; mouse.current.y = -1; }}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#07090a] pt-[var(--header-h)]"
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-0 h-full w-full" />
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-end px-5 md:px-10">
        <motion.div initial={reduce ? false : { opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }} className="relative h-[min(60svh,620px)] w-[min(88vw,460px)]">
          <Image src="/photos/portrait-1.png" alt="Retrato de Enrico de capacete e macacão" fill priority sizes="(min-width:768px) 460px, 88vw" className="object-cover object-[50%_20%] [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]" />
        </motion.div>
        <div className="absolute inset-x-5 top-6 text-center md:inset-x-10">
          <h1 id="fd-title" className="display text-[clamp(2.6rem,7vw,6rem)]">Enrico <span className="text-mint">Vernieri</span></h1>
          <p className="eyebrow mt-1 text-white/80">Piloto de kart · Palhoça (SC)</p>
        </div>
      </div>
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-5 pb-6 md:px-10">
        <div className="hidden md:block"><NextCard /></div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#historia">Conheça minha história</Button>
          <Button href="#patrocinadores" variant="ghost-dark">Seja parceiro</Button>
        </div>
      </div>
    </section>
  );
}
