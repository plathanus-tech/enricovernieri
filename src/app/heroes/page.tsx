import type { Metadata } from "next";
import Link from "next/link";
import { Hero1 } from "@/components/heroes/Hero1";
import { Hero2 } from "@/components/heroes/Hero2";
import { Hero3 } from "@/components/heroes/Hero3";
import { Hero4 } from "@/components/heroes/Hero4";
import { Hero5 } from "@/components/heroes/Hero5";

export const metadata: Metadata = {
  title: "Versões do hero (teste)",
  robots: { index: false, follow: false },
};

const heroes = [
  { n: 1, name: "Cinema", note: "foto em tela cheia com zoom lento, linhas de velocidade e faixa de resultados rolando", C: Hero1 },
  { n: 2, name: "Letreiro", note: "o nome gigante corre atrás da foto e se inclina com a rolagem", C: Hero2 },
  { n: 3, name: "Chegada", note: "o kart entra com desfoque de movimento, a foto segue o mouse e a faixa quadriculada corre", C: Hero3 },
  { n: 4, name: "Volta lançada", note: "o traçado de uma pista é desenhado e um ponto percorre o circuito em loop", C: Hero4 },
  { n: 5, name: "Número", note: "o 5 oficial gigante vira janela para a foto em movimento", C: Hero5 },
] as const;

/** Página de comparação dos heros. O hero atual da home (components/Hero.tsx) não foi alterado. */
export default function HeroesPage() {
  return (
    <>
      <div className="bg-ink pt-[calc(var(--header-h)+1.5rem)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 pb-5 md:px-10">
          <p className="eyebrow text-mint">Teste · 5 versões do hero</p>
          <nav aria-label="Versões" className="flex flex-wrap gap-2">
            {heroes.map((h) => (
              <a key={h.n} href={`#hero-${h.n}`} className="inline-flex min-h-11 items-center border border-white/35 px-4 font-display text-lg font-extrabold italic uppercase hover:border-mint hover:text-mint">
                {h.n} · {h.name}
              </a>
            ))}
            <Link href="/" className="inline-flex min-h-11 items-center bg-mint px-4 font-display text-lg font-extrabold italic uppercase text-ink">Home atual</Link>
          </nav>
        </div>
      </div>
      {heroes.map(({ n, name, note, C }) => (
        <div key={n} id={`hero-${n}`}>
          <div className="border-y-4 border-mint bg-ink-2 py-3 text-center">
            <p className="eyebrow">Versão {n} · {name}: {note}</p>
          </div>
          <C />
        </div>
      ))}
    </>
  );
}
