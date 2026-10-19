"use client";

import Image from "next/image";
import { useState } from "react";
import type { CampaignVideo } from "@/content/sponsors";

function embedUrl(v: CampaignVideo) {
  if (v.kind === "instagram") return `https://www.instagram.com/${v.src}/embed/`;
  if (v.kind === "youtube") return `https://www.youtube-nocookie.com/embed/${v.src}?autoplay=1&rel=0`;
  if (v.kind === "vimeo") return `https://player.vimeo.com/video/${v.src}?autoplay=1&dnt=1`;
  return v.src;
}

const permalink = (v: CampaignVideo) => v.href ?? (v.kind === "instagram" ? `https://www.instagram.com/${v.src}/` : undefined);

/**
 * Player sob demanda: mostra uma capa e só carrega o vídeo (e o provedor externo) quando o visitante clica.
 * Melhora o carregamento e evita cookies e rastreadores de terceiros antes da interação.
 * Para Instagram usa o embed oficial: o vídeo continua hospedado e creditado na conta da marca.
 */
export function VideoCard({ video }: { video: CampaignVideo }) {
  const [playing, setPlaying] = useState(false);
  const instagram = video.kind === "instagram";
  const link = permalink(video);

  return (
    <figure className="group flex h-full flex-col">
      <div className={`relative w-full overflow-hidden bg-ink ${playing && instagram ? "h-[640px] max-h-[85svh]" : instagram ? "aspect-[4/5]" : "aspect-video"}`}>
        {playing ? (
          video.kind === "file" ? (
            <video src={video.src} controls autoPlay playsInline className="absolute inset-0 h-full w-full" aria-label={video.title} />
          ) : (
            <iframe
              src={embedUrl(video)}
              title={`${video.brand}: ${video.title}`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full bg-white"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 block h-full w-full text-left"
            aria-label={`Assistir: ${video.brand}, ${video.title}${instagram ? " (carrega o vídeo do Instagram)" : ""}`}
          >
            {video.poster ? (
              <Image src={video.poster} alt="" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            ) : (
              <span aria-hidden className="grain absolute inset-0 flex flex-col justify-between bg-ink p-6 text-white">
                <span className="eyebrow text-mint">{instagram ? "Instagram" : "Vídeo"}{video.handle ? ` · @${video.handle}` : ""}</span>
                <span className="display pr-20 text-[clamp(2.4rem,4.4vw,3.4rem)] leading-[0.9]">{video.brand}</span>
              </span>
            )}
            {video.poster && <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />}
            <span aria-hidden className="absolute bottom-5 right-5 flex h-14 w-14 -skew-x-12 items-center justify-center bg-mint text-ink transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-6 w-6 skew-x-12" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex-1">
        <p className="eyebrow text-mint-ink">{video.brand}</p>
        <p className="display text-2xl">{video.title}</p>
        {video.description && <p className="mt-1 text-mute-light">{video.description}</p>}
        {link && (
          <p className="mt-2 text-sm">
            <a href={link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-mint-ink">
              Ver no Instagram{video.handle ? ` (@${video.handle})` : ""}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </p>
        )}
      </figcaption>
    </figure>
  );
}
