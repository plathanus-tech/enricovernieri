"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { challenges } from "@/content/events";
import { formatDate } from "@/lib/format";

/** Linhas de nível (inspiradas no fundo do site do Lando Norris): ondas finas que respiram devagar. */
export function Contours({ color = "rgb(10 11 10 / 0.12)", lines = 9, className = "" }: { color?: string; lines?: number; className?: string }) {
  const reduce = useReducedMotion();
  const wave = (i: number, ph: number) => {
    const y0 = 40 + i * (520 / lines);
    const a = 26 + (i % 4) * 9;
    let d = `M-20 ${y0}`;
    for (let x = 0; x <= 1040; x += 130) {
      const y = Math.round((y0 + Math.sin((x / 170) + i * 0.7 + ph) * a) * 10) / 10;
      d += ` S ${x + 65} ${Math.round((y + (i % 2 ? -a : a) * 0.6) * 10) / 10}, ${x + 130} ${y}`;
    }
    return d;
  };
  return (
    <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <motion.path
          key={i}
          d={wave(i, 0)}
          animate={reduce ? undefined : { d: [wave(i, 0), wave(i, 1.4), wave(i, 0)] }}
          transition={{ duration: 16 + i * 1.3, ease: "easeInOut", repeat: Infinity }}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Cartão compacto "Próximo desafio", como o "Next race" do site de referência. */
export function NextCard({ dark = true, className = "" }: { dark?: boolean; className?: string }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const next = today ? challenges.filter((c) => (c.endDate ?? c.date) >= today).sort((a, b) => a.date.localeCompare(b.date))[0] : undefined;
  if (!next) return null;
  const when = next.endDate ? `${formatDate(next.date, { day: "2-digit" })} a ${formatDate(next.endDate, { day: "2-digit", month: "short" })}` : formatDate(next.date, { day: "2-digit", month: "short" });
  return (
    <a href="#desafios" className={`block w-44 border p-3 transition-colors ${dark ? "border-white/25 bg-ink/60 text-white hover:border-mint" : "border-ink/30 bg-paper text-ink hover:border-ink"} ${className}`}>
      <span className={`eyebrow block text-[0.7rem] ${dark ? "text-mint" : "text-mint-ink"}`}>Próximo desafio</span>
      <span className="display mt-1 block text-xl leading-none">{next.championship.replace(/^\d+º Campeonato /, "").replace(" de Kart", "")}</span>
      <span className="eyebrow mt-1 block text-[0.7rem] opacity-70">{[next.city, when].filter(Boolean).join(" · ")}</span>
    </a>
  );
}
