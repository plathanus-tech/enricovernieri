import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/Contact";
import { Story } from "@/components/Story";
import { StoryBeginnings } from "@/components/StoryBeginnings";
import { StoryHorizontal } from "@/components/StoryHorizontal";

export const metadata: Metadata = {
  title: "Variante da história (teste)",
  robots: { index: false, follow: false },
};

/**
 * Página de comparação. A é a linha do tempo atual (Story), B é a inspirada em "Beginnings" (carrossel) e C é a de rolagem horizontal.
 * A home usa a C (StoryHorizontal). A e B ficam aqui como alternativas.
 */
export default function HistoriaVariants() {
  return (
    <>
      <div className="bg-ink pt-[calc(var(--header-h)+1.5rem)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 pb-6 md:px-10">
          <p className="eyebrow text-mint">Teste de variantes · seção “Minha história”</p>
          <nav aria-label="Variantes" className="flex gap-2">
            <a href="#variante-b" className="inline-flex min-h-11 items-center border border-white/35 px-4 font-display text-lg font-extrabold italic uppercase hover:border-mint hover:text-mint">Variante B</a>
            <a href="#variante-c" className="inline-flex min-h-11 items-center bg-mint px-4 font-display text-lg font-extrabold italic uppercase text-ink">Variante C (horizontal)</a>
            <Link href="/" className="inline-flex min-h-11 items-center border border-white/35 px-4 font-display text-lg font-extrabold italic uppercase hover:border-mint hover:text-mint">Voltar à home</Link>
          </nav>
        </div>
      </div>

      <div className="border-y-4 border-mint bg-ink-2 py-3 text-center">
        <p className="eyebrow">Variante A · atual (linha do tempo vertical)</p>
      </div>
      <Story />

      <div id="variante-b" className="border-y-4 border-mint bg-ink-2 py-3 text-center">
        <p className="eyebrow">Variante B · inspirada em “Beginnings” (começo + resultados por ano)</p>
      </div>
      <StoryBeginnings />

      <div id="variante-c" className="border-y-4 border-mint bg-ink-2 py-3 text-center">
        <p className="eyebrow">Variante C · rolagem horizontal com movimento (inspirada no Leclerc)</p>
      </div>
      <StoryHorizontal id="historia-c" />

      <Contact />
    </>
  );
}
