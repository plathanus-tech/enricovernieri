import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroLab } from "@/components/hero-lab/HeroLab";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Laboratório de hero (teste)",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Laboratório do hero: as cinco direções com seletor, seguidas da one page real, para avaliar em contexto.
 * Só existe em desenvolvimento (ou com NEXT_PUBLIC_HERO_LAB=1). O hero atual da home (components/Hero.tsx) não foi alterado.
 */
export default function HeroLabPage() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_HERO_LAB !== "1") notFound();
  return <HomePage hero={<HeroLab />} />;
}
