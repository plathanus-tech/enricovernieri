"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/base-path";

/**
 * Vídeo em loop, sem som, que começa sozinho quando aparece na tela. Um clique (ou toque) pausa; outro clique retoma.
 * Fora da tela ele pausa sozinho, para não gastar processamento. Se a pessoa pausou, ele só volta quando ela clicar de novo.
 */
export function LoopVideo({ src, poster, label, position = "50% 50%" }: { src: string; poster: string; label: string; position?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const visible = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Autoplay sem som: algumas plataformas só aceitam se o vídeo estiver explicitamente mudo (atributo e propriedade).
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tryPlay = () => {
      if (reduce || userPaused.current || !visible.current) return;
      void v.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          v.preload = "auto";
          tryPlay();
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    // se o primeiro play() for recusado ou vier antes de haver dados, tenta de novo quando o vídeo estiver pronto
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      io.disconnect();
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      void v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${playing ? "Pausar" : "Reproduzir"} vídeo: ${label}`}
      aria-pressed={!playing}
      className="group absolute inset-0 block h-full w-full cursor-pointer"
    >
      <video
        ref={ref}
        src={withBase(src)}
        poster={withBase(poster)}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
      {!playing && (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-ink/25">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-ink/55 text-white backdrop-blur-sm transition-colors group-hover:border-mint group-hover:text-mint">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </span>
      )}
    </button>
  );
}
