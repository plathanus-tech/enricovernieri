import type { Metadata } from "next";
import Link from "next/link";
import { FieldHero } from "@/components/heroes-ln2/Field";
import { IrisHero } from "@/components/heroes-ln2/Iris";
import { MagneticHero } from "@/components/heroes-ln2/Magnetic";
import { RevealHero } from "@/components/heroes-ln2/Reveal";

export const metadata: Metadata = {
  title: "Heros interativos (teste)",
  robots: { index: false, follow: false },
};

const items = [
  { id: "a", name: "Revelação clara", note: "bolha líquida segue o cursor e revela a foto de ação; domo de linhas; “toque para travar” (como o Lando)" },
  { id: "b", name: "Revelação escura", note: "a mesma mecânica no tema escuro da marca" },
  { id: "c", name: "Íris", note: "ao rolar, um círculo cresce e troca o retrato pela foto de ação" },
  { id: "d", name: "Letras magnéticas", note: "as letras do nome fogem do cursor" },
  { id: "e", name: "Campo de linhas", note: "linhas de nível em canvas se curvam ao redor do cursor" },
] as const;

/** Página de teste com heros interativos. A home e o hero atual não foram alterados. */
export default function HeroesLn2() {
  return (
    <>
      <div className="bg-ink pt-[calc(var(--header-h)+1.5rem)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 pb-5 md:px-10">
          <p className="eyebrow text-mint">Teste · heros interativos</p>
          <nav aria-label="Versões" className="flex flex-wrap gap-2">
            {items.map((h) => (
              <a key={h.id} href={`#ln2-${h.id}`} className="inline-flex min-h-11 items-center border border-white/35 px-4 font-display text-lg font-extrabold italic uppercase hover:border-mint hover:text-mint">{h.id.toUpperCase()} · {h.name}</a>
            ))}
            <Link href="/" className="inline-flex min-h-11 items-center bg-mint px-4 font-display text-lg font-extrabold italic uppercase text-ink">Home atual</Link>
          </nav>
        </div>
      </div>

      {items.map((h) => (
        <div key={h.id} id={`ln2-${h.id}`}>
          <div className="border-y-4 border-mint bg-ink-2 py-3 text-center"><p className="eyebrow">{h.id.toUpperCase()} · {h.name}: {h.note}</p></div>
          {h.id === "a" && <RevealHero variant="light" base={{ src: "/photos/portrait-1.png", alt: "Retrato de Enrico de capacete e macacão; a foto de ação aparece dentro da bolha que segue o cursor" }} reveal={{ src: "/news/portal-palhoca-paranaense.jpg" }} />}
          {h.id === "b" && <RevealHero variant="dark" base={{ src: "/photos/portrait-2.png", alt: "Retrato de Enrico de capacete entre os karts; a foto de ação aparece dentro da bolha que segue o cursor" }} reveal={{ src: "/news/kartmotor-vice-2025.jpg", align: "xMidYMid slice" }} />}
          {h.id === "c" && <IrisHero />}
          {h.id === "d" && <MagneticHero />}
          {h.id === "e" && <FieldHero />}
        </div>
      ))}
    </>
  );
}
