"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Barra de rolagem personalizada com trilho de pista (versão 2 da home, rota /v2).
 * Indicador em forma de kart (padrão) ou convencional (/v2?barra=simples). Só com mouse; no celular e em telas de toque
 * a barra nativa continua. `force`: liga sem depender de ambiente nem de parâmetro (usado pela rota /v2).
 * Sem `force`, só aparece em desenvolvimento e com ?barra=kart ou ?barra=simples.
 */
type Variant = "kart" | "simples";

const THUMB = { kart: { w: 16, h: 30 }, simples: { w: 6, h: 36 } } as const;

function Kart() {
  // Kart visto de cima, com a frente para baixo (sentido da rolagem).
  return (
    <svg viewBox="0 0 16 30" width="16" height="30" aria-hidden focusable="false" className="block">
      <g transform="rotate(180 8 15)" fill="currentColor">
        {/* eixo e rodas traseiras */}
        <rect x="0" y="17" width="3.6" height="9" rx="1" />
        <rect x="12.4" y="17" width="3.6" height="9" rx="1" />
        <rect x="3" y="20.6" width="10" height="1.6" />
        {/* rodas dianteiras e eixo */}
        <rect x="0.6" y="3.6" width="3" height="6.4" rx="1" />
        <rect x="12.4" y="3.6" width="3" height="6.4" rx="1" />
        <rect x="3.4" y="6.4" width="9.2" height="1.4" />
        {/* bico e carenagem */}
        <rect x="3.6" y="0.8" width="8.8" height="2" rx="0.8" />
        <path d="M4.4 9.2h7.2l1 11.6H3.4z" />
        {/* assento e piloto */}
        <rect x="4.2" y="21" width="7.6" height="3.4" rx="1" opacity="0.55" />
      </g>
      <circle cx="8" cy="14.4" r="2.6" fill="#0a0b0a" />
    </svg>
  );
}

export function ScrollTrack({ force = false }: { force?: boolean }) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  // Só em desenvolvimento, só com o parâmetro, só com mouse e tela larga.
  useEffect(() => {
    if (!force && process.env.NODE_ENV === "production") return;
    const q = new URLSearchParams(window.location.search).get("barra");
    const v: Variant | null = q === "kart" || q === "simples" ? q : force ? "kart" : null;
    // Experimento: sem largura mínima, para poder avaliar também em janelas estreitas (painel do app). Precisa de mouse.
    const wide = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setVariant(v && wide.matches ? v : null);
    apply();
    wide.addEventListener("change", apply);
    return () => wide.removeEventListener("change", apply);
  }, [force]);

  useEffect(() => {
    if (!variant) return;
    document.documentElement.classList.add("scroll-lab");
    const thumbH = THUMB[variant].h;
    let raf = 0;

    const update = () => {
      raf = 0;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.current = p;
      const y = p * (track.clientHeight - thumbH);
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
      if (doneRef.current) doneRef.current.style.height = `${y + thumbH / 2}px`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      document.documentElement.classList.remove("scroll-lab");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [variant]);

  if (!variant) return null;
  const { w, h } = THUMB[variant];

  const scrollToPointer = (clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const r = track.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientY - r.top - h / 2) / (r.height - h)));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: p * max, behavior: "instant" });
  };

  return (
    <>
      <style>{`html.scroll-lab{scrollbar-width:none}html.scroll-lab::-webkit-scrollbar{display:none}`}</style>
    <div
      aria-hidden
      className="fixed bottom-2 right-1 top-[calc(var(--header-h)+0.5rem)] z-40 w-5 select-none rounded-[3px] bg-[#1a1b1a]/95"
    >
      <div
        ref={trackRef}
        className="relative h-full w-full cursor-pointer touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          scrollToPointer(e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) scrollToPointer(e.clientY);
        }}
      >
        {/* bordas da pista */}
        <span className="absolute inset-y-0 left-[3px] w-px bg-white/20" />
        <span className="absolute inset-y-0 right-[3px] w-px bg-white/20" />
        {/* faixa central tracejada */}
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/.28)_0_6px,transparent_6px_13px)]" />
        {/* trecho já percorrido */}
        <div ref={doneRef} className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/.6)_0_6px,transparent_6px_13px)]" style={{ height: 0 }} />
        {/* linha de chegada */}
        <span aria-hidden className="absolute inset-x-[3px] bottom-0 h-2 [background:conic-gradient(rgb(255_255_255/.7)_25%,transparent_0_50%,rgb(255_255_255/.7)_0_75%,transparent_0)_0_0/4px_4px]" />

        <div ref={thumbRef} className="absolute left-1/2 top-0 will-change-transform" style={{ width: w, height: h, marginLeft: -w / 2 }}>
          {variant === "kart" ? (
            <span className="block text-[#a9a9a9]">
              <Kart />
            </span>
          ) : (
            <span className="block h-full w-full rounded-full bg-[#a9a9a9]" />
          )}
        </div>
      </div>
    </div>
    </>
  );
}
