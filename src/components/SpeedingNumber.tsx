"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { RaceNumber } from "./RaceNumber";

type Props = {
  value: number;
  from?: number;
  /** Duração em segundos. */
  duration?: number;
  /** Desfoque horizontal máximo (px) no pico de velocidade. */
  maxBlur?: number;
  className?: string;
  label?: string;
};

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -9 * t));

/**
 * Adaptação do "Speeding Text" (React Bits Pro) ao projeto: o valor sobe de `from` até `value`
 * e o desfoque cresce com a velocidade da contagem, voltando a zero quando o número assenta.
 * Diferenças em relação ao original: usa os glifos oficiais do piloto (RaceNumber), o desfoque é só
 * horizontal (sensação de velocidade em linha reta) e não depende de GSAP: usa requestAnimationFrame.
 * O valor final é sempre exato e a largura é reservada para não gerar salto de layout.
 * Com prefers-reduced-motion o número é exibido já no valor final.
 */
export function SpeedingNumber({ value, from = 0, duration = 1.4, maxBlur = 10, className = "", label }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const blurNode = useRef<SVGFEGaussianBlurElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(wrap, { once: true, margin: "0px 0px -12% 0px" });
  const [current, setCurrent] = useState(value);
  const [armed, setArmed] = useState(false);
  const filterId = "speed-" + useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    if (reduce) return;
    setCurrent(from);
    setArmed(true);
  }, [reduce, from]);

  useEffect(() => {
    if (reduce || !armed || !inView) return;
    let raf = 0;
    let last = from;
    let lastT = performance.now();
    const start = lastT;
    const total = duration * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      const v = from + (value - from) * easeOutExpo(t);
      const dt = Math.max(1, now - lastT);
      // velocidade normalizada: 1 = ritmo médio de toda a contagem
      const speed = Math.abs(v - last) / dt / (Math.abs(value - from) / total || 1);
      const blur = t >= 1 ? 0 : Math.min(maxBlur, speed * maxBlur * 0.55);
      blurNode.current?.setAttribute("stdDeviation", `${blur.toFixed(2)} 0`);
      setCurrent(t >= 1 ? value : Math.round(v));
      last = v;
      lastT = now;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, inView, reduce, from, value, duration, maxBlur]);

  const animating = armed && !reduce;
  return (
    <span ref={wrap} className={`relative inline-grid ${className}`} aria-label={label ?? String(value)} role="img">
      {/* reserva a largura do valor final */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        <RaceNumber value={value} />
      </span>
      <span
        aria-hidden
        className="col-start-1 row-start-1"
        style={{ filter: animating ? `url(#${filterId})` : undefined, opacity: animating && !inView ? 0 : 1 }}
      >
        <RaceNumber value={current} />
      </span>
      <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
        <filter id={filterId} x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur ref={blurNode} stdDeviation="0 0" />
        </filter>
      </svg>
    </span>
  );
}
