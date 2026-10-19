import type { ReactNode } from "react";
import { About } from "./About";
import { Achievements } from "./Achievements";
import { Challenges } from "./Challenges";
import { Contact } from "./Contact";
import { NewsSection } from "./News";
import { Sponsors } from "./Sponsors";
import { StoryHorizontal } from "./StoryHorizontal";
import { challenges } from "@/content/events";
import { formatDate } from "@/lib/format";

/** Composição da home. Recebe o hero por parâmetro para que a versão 1 (/) e a 2 (/v2) compartilhem o resto da página. */
export function HomePage({ hero, aboutTone = "dark" }: { hero: ReactNode; aboutTone?: "dark" | "light" }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = challenges
    .filter((c) => (c.endDate ?? c.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const nextChallenge = upcoming
    ? `${upcoming.championship.replace(/^\d+º Campeonato /, "").replace(" de Kart", "")} · ${formatDate(upcoming.date, { day: "2-digit" })}${upcoming.endDate ? ` a ${formatDate(upcoming.endDate, { day: "2-digit" })}` : ""}/${formatDate(upcoming.date, { month: "2-digit" })}`
    : undefined;

  return (
    <>
      {hero}
      <About nextChallenge={nextChallenge} tone={aboutTone} />
      <StoryHorizontal />
      <Achievements />
      <Challenges />
      <Sponsors />
      <NewsSection />
      <Contact />
    </>
  );
}
