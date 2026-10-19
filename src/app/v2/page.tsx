import type { Metadata } from "next";
import { HeroV2 } from "@/components/HeroV2";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Versão 2 (teste)",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

/** Versão 2 da home: só o hero muda (foto colorida, pan blur, linha de circuito 3D). O restante é idêntico à versão 1 em "/". */
export default function HomeV2() {
  return <HomePage hero={<HeroV2 />} />;
}
