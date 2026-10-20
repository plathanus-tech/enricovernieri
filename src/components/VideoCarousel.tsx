"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VideoCard } from "./VideoCard";
import type { CampaignVideo } from "@/content/sponsors";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={dir === "prev" ? "M20 12H5m6-6-6 6 6 6" : "M4 12h15m-6-6 6 6-6 6"} strokeLinecap="square" />
    </svg>
  );
}

/**
 * Vídeos em faixa horizontal: 1 por vez no celular, 2 no tablet e 3 no computador. As setas avançam e voltam;
 * o arrastar com o dedo e a rolagem lateral nativa continuam funcionando (scroll-snap).
 */
export function VideoCarousel({ videos }: { videos: CampaignVideo[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [index, setIndex] = useState(0);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    setIndex(Math.min(videos.length - 1, Math.round(el.scrollLeft / (step || 1))));
  }, [videos.length]);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: smooth ? "smooth" : "auto" });
  };

  const btn = "inline-flex h-11 w-11 items-center justify-center border border-ink/40 text-ink transition-colors hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <div role="region" aria-roledescription="carrossel" aria-label="Vídeos de campanhas e conteúdos com marcas" className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-mute-light" aria-live="polite">
          {index + 1} de {videos.length}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label="Vídeos anteriores" className={btn}>
            <Arrow dir="prev" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label="Próximos vídeos" className={btn}>
            <Arrow dir="next" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        onScroll={measure}
        className="relative mt-4 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v) => (
          <li key={v.id} className="w-[86%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]">
            <VideoCard video={v} />
          </li>
        ))}
      </ul>
    </div>
  );
}
