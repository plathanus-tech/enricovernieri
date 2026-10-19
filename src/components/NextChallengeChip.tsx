"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Challenge } from "@/content/events";

const DAY = 86_400_000;
// Horário da largada não informado: contamos por dia, no fuso de Brasília (UTC-3).
const startOf = (iso: string) => new Date(`${iso}T00:00:00-03:00`).getTime();
const endOf = (iso: string) => new Date(`${iso}T23:59:59-03:00`).getTime();

const short = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`)).replace(".", "");

/**
 * Lembrete discreto do próximo desafio, no canto superior direito do topo da home (inspirado no site do Gabriel Bortoleto).
 * Some quando a página rola, para não competir com o cabeçalho. A contagem é só em dias, porque o horário não foi informado.
 */
export function NextChallengeChip({ challenges }: { challenges: Challenge[] }) {
  const pathname = usePathname();
  const [now, setNow] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const soft = pathname === "/v2";
  if (now === null || !soft) return null;
  const next = [...challenges]
    .filter((c) => endOf(c.endDate ?? c.date) >= now)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!next) return null;

  const start = startOf(next.date);
  const days = Math.ceil((start - now) / DAY);
  const when = next.endDate ? `${short(next.date).split(" ")[0]} a ${short(next.endDate)}` : short(next.date);
  const countdown = now >= start ? "em andamento" : days <= 1 ? "amanhã" : `em ${days} dias`;
  const place = [next.city, next.category].filter(Boolean).join(" · ");

  return (
    <a
      href="#desafios"
      aria-label={`Próximo desafio: ${next.championship}, ${when}, ${countdown}. Ver calendário`}
      tabIndex={scrolled ? -1 : 0}
      className={`fixed right-5 top-[calc(var(--header-h)+0.6rem)] z-40 max-w-[15rem] ${soft ? "bg-ink/30 hover:bg-ink/60" : "bg-ink/75 hover:bg-ink"} px-3 py-2 text-right backdrop-blur-sm transition-[opacity,background-color] duration-300 md:right-10 md:max-w-xs md:px-4 md:py-3 ${scrolled ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <span className="eyebrow block text-[0.7rem] text-mint md:text-sm">
        <span aria-hidden className={soft ? "mr-1.5 inline-block animate-pulse opacity-70 motion-reduce:animate-none" : "mr-1.5"}>▶</span>Próximo desafio
      </span>
      {place && <span className="eyebrow mt-0.5 hidden text-xs text-white/60 md:block">{place}</span>}
      <span className="display mt-1 block text-lg leading-none md:text-[1.7rem]">{next.championship.replace(/^\d+º /, "").replace(" de Kart", "")}</span>
      <span className="eyebrow mt-1 block text-[0.7rem] text-white/70 md:text-sm">
        {when}
        <span aria-hidden> · </span>
        <span className="text-mint">{countdown}</span>
      </span>
    </a>
  );
}
