import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";
import { NewsCard, sortedNews } from "@/components/News";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Resultados, campeonatos e novidades da carreira do piloto Enrico Vernieri.",
};

export default function NewsIndex() {
  const items = sortedNews();
  return (
    <>
      <div className="on-light bg-paper-2 pb-24 pt-[calc(var(--header-h)+3rem)] text-ink md:pb-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <nav aria-label="Trilha" className="text-sm">
            <Link href="/" className="underline underline-offset-4 hover:text-mint-ink">Início</Link>
            <span aria-hidden className="mx-2">/</span>
            <span aria-current="page">Notícias</span>
          </nav>
          <h1 className="display mt-6 text-[clamp(3rem,9vw,7rem)]">Notícias</h1>
          <p className="mt-4 max-w-xl text-lg text-mute-light">Notícias, histórias e novidades sobre a trajetória do Enrico no automobilismo</p>

          {items.length > 0 ? (
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((n) => (
                <NewsCard key={n.slug} item={n} />
              ))}
            </div>
          ) : (
            <div className="mt-12 max-w-2xl">
              <p className="display text-3xl">Ainda não há notícias publicadas</p>
              <p className="mt-2 text-mute-light">Volte em breve: os resultados e as novidades do Enrico serão publicados aqui.</p>
              <Placeholder tone="light" className="mt-6">
                Cada notícia em <code>src/content/news.ts</code> gera uma página própria em /noticias/[slug].
              </Placeholder>
            </div>
          )}
        </div>
      </div>
      <Contact />
    </>
  );
}
