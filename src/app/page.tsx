import { AchievementsStrip } from "@/components/AchievementsStrip";
import { HeroMain } from "@/components/HeroMain";
import { HomePage } from "@/components/HomePage";

// A página usa a data de hoje para separar etapas futuras; revalida a cada hora.
export const revalidate = 3600;

export default function Home() {
  return (
    <HomePage
      hero={
        <>
          <HeroMain />
          <AchievementsStrip />
        </>
      }
    />
  );
}
