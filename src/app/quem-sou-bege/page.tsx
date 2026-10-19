import type { Metadata } from "next";
import { AchievementsStrip } from "@/components/AchievementsStrip";
import { HeroMain } from "@/components/HeroMain";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Teste: Quem sou em bege",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

/** Teste: a home idêntica à de "/", com a seção "Quem sou" em bege. Para adotar, passe aboutTone="light" em app/page.tsx. */
export default function QuemSouBege() {
  return (
    <HomePage
      aboutTone="light"
      hero={
        <>
          <HeroMain />
          <AchievementsStrip />
        </>
      }
    />
  );
}
