"use client";

import { useEffect, useState } from "react";
import { H1Cinema } from "./H1Cinema";
import { H2Editorial } from "./H2Editorial";
import { H3Personal } from "./H3Personal";
import { H4Poster } from "./H4Poster";
import { H5Premium } from "./H5Premium";
import { H6Trophy } from "./H6Trophy";
import { H7Closeup } from "./H7Closeup";

const VERSIONS = [
  { n: 1, short: "Cinema", name: "Cinematográfica e imersiva", C: H1Cinema },
  { n: 2, short: "Editorial", name: "Editorial e tipográfica", C: H2Editorial },
  { n: 3, short: "Pessoal", name: "Personalidade do piloto", C: H3Personal },
  { n: 4, short: "Gráfica", name: "Motorsport gráfico", C: H4Poster },
  { n: 5, short: "Premium", name: "Premium e minimalista", C: H5Premium },
  { n: 6, short: "Troféu", name: "Troféu: nome atrás e na frente do piloto", C: H6Trophy },
  { n: 7, short: "Close-up", name: "Close-up: nome, 5 em contorno e foto escura", C: H7Closeup },
] as const;

/**
 * Seletor temporário de variações do hero. Mostra uma por vez e guarda a escolha em ?v=1..5 para poder compartilhar o link.
 * A rota /hero-lab só existe fora de produção (ou com NEXT_PUBLIC_HERO_LAB=1).
 */
export function HeroLab() {
  const [v, setV] = useState(1);

  useEffect(() => {
    const q = Number(new URLSearchParams(window.location.search).get("v"));
    if (q >= 1 && q <= VERSIONS.length) setV(q);
  }, []);

  const pick = (n: number) => {
    setV(n);
    const u = new URL(window.location.href);
    u.searchParams.set("v", String(n));
    window.history.replaceState(null, "", u);
    window.scrollTo({ top: 0 });
  };

  const cur = VERSIONS[v - 1];
  const Hero = cur.C;

  const btn = (o: (typeof VERSIONS)[number], extra: string) => (
    <button
      key={o.n}
      type="button"
      onClick={() => pick(o.n)}
      aria-pressed={o.n === v}
      aria-label={`Versão ${o.n}: ${o.name}`}
      title={`${o.n} · ${o.name}`}
      className={`min-h-11 min-w-11 rounded-full font-display text-lg font-extrabold italic uppercase tracking-wide transition-colors ${extra} ${o.n === v ? "bg-mint text-ink" : "text-white hover:bg-white/15"}`}
    >
      {o.n}
    </button>
  );

  return (
    <div className="max-md:pb-[4.75rem] max-md:bg-ink">
      <Hero key={v} />
      {/* computador: coluna na lateral direita, fora do conteúdo */}
      <div role="group" aria-label="Versões do hero (modo de exploração)" className="fixed right-2 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-white/25 bg-ink/90 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md md:flex">
        <span className="eyebrow pb-1 pt-1 text-[0.6rem] text-mint [writing-mode:vertical-rl]">Hero</span>
        {VERSIONS.map((o) => btn(o, ""))}
      </div>
      {/* celular: barra inferior; o hero ganha folga embaixo para não ficar coberto */}
      <div role="group" aria-label="Versões do hero (modo de exploração)" className="fixed inset-x-3 bottom-3 z-[60] flex items-center justify-between gap-1 rounded-full border border-white/25 bg-ink/90 p-1.5 backdrop-blur-md md:hidden">
        <span className="eyebrow pl-3 text-[0.65rem] text-mint">{cur.short}</span>
        <div className="flex gap-1">{VERSIONS.map((o) => btn(o, ""))}</div>
      </div>
    </div>
  );
}
