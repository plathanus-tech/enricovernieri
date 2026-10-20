"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Button } from "./Button";
import { Placeholder } from "./Placeholder";
import { RaceNumber } from "./RaceNumber";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { chapters, type Chapter, type Media } from "@/content/story";
import { site } from "@/content/site";
import { withBase } from "@/lib/base-path";

function MediaBlock({ media, tone }: { media: Media; tone: Chapter["tone"] }) {
  if (media.kind === "image")
    return (
      <Reveal variant="wipe">
        <div className="slant relative aspect-[4/5] w-full overflow-hidden bg-ink-3 md:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/4]">
          <Image src={media.src} alt={media.alt} fill sizes="(min-width:1024px) 42vw, 90vw" className="object-cover" style={{ objectPosition: media.position }} />
        </div>
      </Reveal>
    );
  if (media.kind === "video")
    return (
      <div className="slant relative aspect-video w-full overflow-hidden bg-ink-3">
        <video src={withBase(media.src)} poster={withBase(media.poster)} controls playsInline preload="none" aria-label={media.label} className="h-full w-full object-cover" />
      </div>
    );
  if (media.kind === "none") return null;
  return <Placeholder tone={tone === "dark" ? "dark" : "light"} className="aspect-video w-full">{media.note}</Placeholder>;
}

function ChapterBand({ c, index }: { c: Chapter; index: number }) {
  const dark = c.tone === "dark";
  const flip = index % 2 === 1;
  const hasMedia = c.media.kind !== "none" && (c.media.kind !== "slot" || site.showPlaceholders);
  const last = index === chapters.length - 1;
  return (
    <article
      aria-labelledby={`cap-${c.id}`}
      className={`relative overflow-hidden ${dark ? "bg-ink text-white" : "on-light bg-paper text-ink"} ${index === 0 ? "pt-10" : ""}`}
    >
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-16 pl-14 md:px-10 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-28 lg:py-28">
        {/* texto */}
        <div className={`relative ${flip && hasMedia ? "lg:order-2" : ""}`}>
          <p className={`eyebrow ${dark ? "text-mint" : "text-mint-ink"}`}>{c.kicker}</p>
          <div className={`mt-1 flex items-end gap-3 ${dark ? "text-mint" : "text-ink"}`}>
            {c.numeral && <RaceNumber value={c.numeral} className="text-[clamp(5.5rem,16vw,12rem)]" label={c.word ? `${c.numeral} ${c.word}` : c.numeral} />}
            {c.word && (
              <span className={`display pb-[0.4em] ${c.numeral ? "text-4xl md:text-5xl" : "text-[clamp(4rem,12vw,9rem)] pb-0"}`}>{c.word}</span>
            )}
          </div>
          <Reveal>
            <h3 id={`cap-${c.id}`} className="display mt-5 text-[clamp(2rem,4.6vw,3.6rem)]">
              {c.title}
            </h3>
            <p className={`mt-4 max-w-xl text-base md:text-lg ${dark ? "text-white/85" : "text-mute-light"}`}>{c.text}</p>
            {c.facts && (
              <ul className="mt-6 grid max-w-xl gap-2">
                {c.facts.map((f) => (
                  <li key={f} className={`flex items-center gap-3 border-b py-2 font-display text-xl font-bold italic uppercase tracking-wide ${dark ? "border-line-dark" : "border-line-light"}`}>
                    <span aria-hidden className={`h-2.5 w-2.5 shrink-0 -skew-x-12 ${dark ? "bg-mint" : "bg-ink"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {last && (
              <div className="mt-8">
                <Button href="#desafios" variant="ink">Ver próximos desafios</Button>
              </div>
            )}
          </Reveal>
        </div>

        {/* mídia */}
        {hasMedia && <div className={flip ? "lg:order-1" : ""}><MediaBlock media={c.media} tone={c.tone} /></div>}
      </div>
    </article>
  );
}

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 65%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <section id="historia" aria-labelledby="historia-title" className="relative bg-ink">
      <div className="mx-auto max-w-[1400px] px-5 pb-6 pt-24 md:px-10 md:pt-32">
        <SectionHeading eyebrow="Minha história">
          <span id="historia-title">Volta a volta,<br className="hidden sm:block" /> até aqui</span>
        </SectionHeading>
        <p className="mt-5 max-w-xl text-base text-mute-dark md:text-lg">Uma trajetória contada em ordem, do primeiro contato com o kart às conquistas mais recentes.</p>
      </div>

      <div ref={ref} className="relative">
        {/* espinha da linha do tempo: o traço mint acompanha a rolagem */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-5 top-0 z-10 w-[4px] -translate-x-1/2 bg-ink-3/70 lg:left-1/2 mix-blend-difference md:w-[5px]">
          <motion.div className="h-full w-full origin-top bg-white" style={{ scaleY: reduce ? 1 : progress }} />
        </div>
        {chapters.map((c, i) => (
          <div key={c.id} className="relative">
            <span aria-hidden className="absolute left-5 top-16 z-20 h-5 w-5 -translate-x-1/2 -skew-x-12 border-[3px] border-ink bg-mint lg:left-1/2 md:top-24" />
            <ChapterBand c={c} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
