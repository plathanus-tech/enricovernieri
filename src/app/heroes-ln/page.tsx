import type { Metadata } from "next";
import Link from "next/link";
import { Ln1 } from "@/components/heroes-ln/Ln1";
import { Ln2 } from "@/components/heroes-ln/Ln2";
import { Ln3 } from "@/components/heroes-ln/Ln3";
import { Ln4 } from "@/components/heroes-ln/Ln4";
import { Ln5 } from "@/components/heroes-ln/Ln5";

export const metadata: Metadata = {
  title: "Heros inspirados (teste)",
  robots: { index: false, follow: false },
};

const heroes = [
  { n: 1, name: "Retrato", note: "fundo claro com linhas de nível e retrato grande (Lando Norris)", C: Ln1 },
  { n: 2, name: "Foto total", note: "tela cheia, texto centralizado e botões em pílula (moto de enduro)", C: Ln2 },
  { n: 3, name: "Palco", note: "fundo escuro, foco de luz, título verde com marcas de enquadramento (atleta de vermelho)", C: Ln3 },
  { n: 4, name: "Pista de noite", note: "fotos em tela cheia que alternam, título condensado e links com seta (Fastrack)", C: Ln4 },
  { n: 5, name: "Mostrador", note: "retrato em círculo com marcas de relógio e linhas de chamada (paraquedista e kart elétrico)", C: Ln5 },
] as const;

/** Página de teste, separada da home. O hero atual (components/Hero.tsx) não foi alterado. */
export default function HeroesLn() {
  return (
    <>
      <div className="bg-ink pt-[calc(var(--header-h)+1.5rem)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 pb-5 md:px-10">
          <p className="eyebrow text-mint">Teste · heros inspirados nas suas referências</p>
          <nav aria-label="Versões" className="flex flex-wrap gap-2">
            {heroes.map((h) => (
              <a key={h.n} href={`#ln-${h.n}`} className="inline-flex min-h-11 items-center border border-white/35 px-4 font-display text-lg font-extrabold italic uppercase hover:border-mint hover:text-mint">{h.n} · {h.name}</a>
            ))}
            <Link href="/" className="inline-flex min-h-11 items-center bg-mint px-4 font-display text-lg font-extrabold italic uppercase text-ink">Home atual</Link>
          </nav>
        </div>
      </div>
      {heroes.map(({ n, name, note, C }) => (
        <div key={n} id={`ln-${n}`}>
          <div className="border-y-4 border-mint bg-ink-2 py-3 text-center"><p className="eyebrow">Versão {n} · {name}: {note}</p></div>
          <C />
        </div>
      ))}
    </>
  );
}
