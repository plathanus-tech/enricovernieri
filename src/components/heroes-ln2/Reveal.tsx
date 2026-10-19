"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Contours, NextCard } from "../heroes-ln/shared";

const W = 100;
const H = 120;
const FOLLOWERS = [
  { k: 0.24, r: 17 },
  { k: 0.14, r: 22 },
  { k: 0.085, r: 15 },
  { k: 0.05, r: 9 },
] as const;

/** Domo de linhas sobre a cabeça: meridianos que giram devagar, como o capacete em arame do site de referência. */
function Dome({ color }: { color: string }) {
  const [t, setT] = useState<number | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setT(0.6);
      return;
    }
    let raf = 0;
    const loop = (now: number) => {
      setT(now / 5200);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  if (t === null) return null;
  const r = (n: number) => Math.round(n * 10) / 10;
  const meridians = Array.from({ length: 9 }, (_, i) => {
    const rx = r(90 * Math.abs(Math.cos((i / 9) * Math.PI + t)));
    return `M${r(100 - rx)} 70 A${rx} 62 0 0 1 ${r(100 + rx)} 70`;
  });
  const parallels = [0.18, 0.38, 0.58, 0.78].map((f) => {
    const k = Math.sqrt(1 - f * f);
    return { cy: r(70 - 62 * f), rx: r(90 * k), ry: r(14 * k) };
  });
  return (
    <svg aria-hidden viewBox="0 0 200 90" className="pointer-events-none absolute -top-[9%] left-1/2 w-[78%] -translate-x-1/2" fill="none" stroke={color} strokeWidth="0.7">
      <ellipse cx="100" cy="70" rx="90" ry="14" />
      {parallels.map((p) => <ellipse key={p.cy} cx="100" cy={p.cy} rx={p.rx} ry={p.ry} />)}
      {meridians.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

type Props = {
  variant: "light" | "dark";
  base: { src: string; alt: string };
  reveal: { src: string; align?: string };
};

/**
 * Hero "Revelação": uma bolha líquida segue o cursor (ou o dedo) e mostra por dentro a foto de ação em cores.
 * Sem mouse, ela passeia sozinha. "Toque para travar" fixa a bolha onde estiver.
 * A bolha é uma máscara SVG com efeito "gooey" (desfoque + contraste), animada por requestAnimationFrame
 * direto nos atributos, sem re-renderizar o React a cada frame.
 */
export function RevealHero({ variant, base, reveal }: Props) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const stage = useRef<HTMLDivElement>(null);
  const circles = useRef<(SVGCircleElement | null)[]>([]);
  const s = useRef({ tx: 50, ty: 58, inside: false, locked: false });
  const [locked, setLocked] = useState(false);
  const light = variant === "light";

  useEffect(() => {
    if (reduce) return;
    const pos = FOLLOWERS.map(() => ({ x: 50, y: 58 }));
    let raf = 0;
    const loop = (now: number) => {
      const st = s.current;
      if (!st.inside && !st.locked) {
        st.tx = 50 + Math.sin(now / 1500) * 24;
        st.ty = 58 + Math.cos(now / 2100) * 22;
      }
      FOLLOWERS.forEach((f, i) => {
        const p = pos[i];
        const dx = st.tx - p.x;
        const dy = st.ty - p.y;
        p.x += dx * f.k;
        p.y += dy * f.k;
        const speed = Math.hypot(dx, dy);
        const c = circles.current[i];
        if (c) {
          c.setAttribute("cx", p.x.toFixed(2));
          c.setAttribute("cy", p.y.toFixed(2));
          c.setAttribute("r", (f.r * (1 + Math.min(speed * 0.05, 0.7))).toFixed(2));
        }
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const onMove = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || s.current.locked) return;
    const r = el.getBoundingClientRect();
    s.current.tx = ((e.clientX - r.left) / r.width) * W;
    s.current.ty = ((e.clientY - r.top) / r.height) * H;
    s.current.inside = true;
  };
  const toggle = () => {
    s.current.locked = !s.current.locked;
    setLocked(s.current.locked);
  };

  const text = light ? "text-ink" : "text-white";
  return (
    <section
      aria-labelledby={`rv-${uid}`}
      onPointerMove={onMove}
      onPointerLeave={() => (s.current.inside = false)}
      className={`relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden ${light ? "on-light bg-paper" : "bg-[#0c0d0e]"} ${text}`}
    >
      {light && <div aria-hidden className="absolute inset-x-0 top-0 h-[var(--header-h)] bg-ink" />}
      <Contours className="-z-10" color={light ? "rgb(10 11 10 / 0.12)" : "rgb(0 255 156 / 0.18)"} />

      <div className="relative z-20 mt-[calc(var(--header-h)+1.25rem)] text-center">
        <motion.h1 id={`rv-${uid}`} className="display text-[clamp(2.2rem,5.4vw,4.2rem)]" initial={reduce ? false : { opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Enrico <span className={light ? "text-mint-ink" : "text-mint"}>Vernieri</span>
        </motion.h1>
        <p className={`eyebrow mt-1 ${light ? "text-mute-light" : "text-mute-dark"}`}>Piloto de kart · Palhoça (SC)</p>
      </div>

      <div className="relative z-10 mt-2 flex w-full flex-1 items-end justify-center">
        <motion.div
          ref={stage}
          initial={reduce ? false : { opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative aspect-[100/120] h-[min(66svh,700px)] max-w-[92vw]"
          style={{ touchAction: "pan-y" }}
        >
          <div aria-hidden className="slant-r absolute -right-3 top-3 -z-10 h-full w-full bg-mint" />
          <Dome color={light ? "rgb(10 11 10 / 0.55)" : "rgb(255 255 255 / 0.55)"} />
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={base.alt} className="slant-r absolute inset-0 h-full w-full bg-ink-3">
            <defs>
              <filter id={`goo-${uid}`} filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.4" result="b" />
                <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
              </filter>
              <mask id={`m-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                <rect width={W} height={H} fill="#000" />
                <g filter={`url(#goo-${uid})`} fill="#fff">
                  {FOLLOWERS.map((f, i) => (
                    <circle key={i} ref={(el) => { circles.current[i] = el; }} cx="50" cy="58" r={reduce ? 0 : f.r} />
                  ))}
                </g>
              </mask>
            </defs>
            <image href={base.src} width={W} height={H} preserveAspectRatio="xMidYMin slice" />
            <image href={reveal.src} width={W} height={H} preserveAspectRatio={reveal.align ?? "xMidYMid slice"} mask={`url(#m-${uid})`} />
          </svg>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-5 z-20 hidden md:left-10 md:block"><NextCard dark={!light} /></div>
      <div className="absolute inset-x-5 bottom-5 z-20 flex items-center justify-between gap-3 md:inset-x-auto md:right-10 md:gap-4">
        <a href="#historia" className={`eyebrow underline-offset-4 hover:underline ${light ? "text-ink" : "text-white"}`}>Minha história ↓</a>
        {!reduce && (
          <button type="button" onClick={toggle} aria-pressed={locked} className="flex items-center gap-3">
            <span className="eyebrow text-[0.75rem]">{locked ? "Voltar a mover" : "Toque para travar"}</span>
            <span className="flex h-11 w-11 items-center justify-center bg-mint text-ink">
              <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                {locked ? <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z" /> : <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v5a5 5 0 0 1-5 5h-1.5a5 5 0 0 1-4-2L5 15l1-1a1.5 1.5 0 0 1 2 .2L9 15" />}
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
