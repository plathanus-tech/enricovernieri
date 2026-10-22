import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookCover } from "@/components/BookCover";
import { BuyBookButton } from "@/components/BookPurchase";
import { Contact } from "@/components/Contact";
import { RaceNumber } from "@/components/RaceNumber";
import { Reveal } from "@/components/Reveal";
import { book, bookNews } from "@/content/book";
import { brl } from "@/lib/book-order";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Curva Zero · o livro",
  description: `${book.title}: ${book.subtitle}. Livro de ${book.author}, pai do piloto Enrico Vernieri, sobre disciplina, persistência e família.`,
};

export default function BookPage() {
  const news = [...bookNews].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      {/* A. apresentação */}
      <section aria-labelledby="livro-title" className="relative isolate overflow-hidden bg-ink pb-20 pt-[calc(var(--header-h)+3rem)] md:pb-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <nav aria-label="Trilha" className="text-sm text-white/80">
            <Link href="/" className="underline underline-offset-4 hover:text-mint">
              Início
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span aria-current="page">O livro</span>
          </nav>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:order-2 lg:col-span-6">
              <div className="relative aspect-[4/3] w-full">
                <div aria-hidden className="slant absolute -right-3 -top-3 bottom-3 left-3 bg-mint" />
                <div className="slant absolute inset-0 overflow-hidden bg-ink-3">
                  <Image src={book.photos.signing.src} alt={book.photos.signing.alt} fill priority sizes="(min-width:1024px) 46vw, 100vw" className="object-cover object-[20%_50%]" />
                </div>
                <div aria-hidden className="pointer-events-none absolute bottom-[2%] right-[7%] z-10 select-none text-[clamp(4.5rem,9vw,8.5rem)] text-mint/[0.26]">
                  <RaceNumber value={0} outline />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <p className="eyebrow inline-flex items-center gap-3 text-mint">
                <span aria-hidden className="inline-block h-[3px] w-6 bg-current" />O livro por trás da trajetória
              </p>
              <h1 id="livro-title" className="display mt-5 text-[clamp(3.6rem,11vw,9rem)]">
                {book.title}
              </h1>
              <p className="display mt-1 max-w-2xl text-xl text-mint md:text-3xl">{book.subtitle}</p>
              <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
                Escrito por {book.author}, pai do Enrico, a partir da experiência de acompanhar o filho no automobilismo enquanto construía a própria trajetória como empreendedor.
              </p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                {[
                  ["Autor", book.author],
                  ["Editora", book.publisher],
                  ["Edição", book.edition],
                  ["Páginas", String(book.pages)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow text-mute-dark">{k}</dt>
                    <dd className="mt-0.5 font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <BuyBookButton>Comprar livro</BuyBookButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. a história por trás do livro */}
      <section aria-labelledby="historia-livro-title" className="on-light bg-paper py-20 text-ink md:py-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div>
            <p className="eyebrow flex items-center gap-3 text-mint-ink">
              <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />A história
            </p>
            <h2 id="historia-livro-title" className="display mt-4 text-[clamp(2.4rem,6vw,4.6rem)]">
              Dois mundos, uma mesma curva
            </h2>
          </div>
          <Reveal className="mt-8 md:mt-10">
            <div className="grid max-w-3xl gap-5 text-base text-ink/90 md:text-lg">
              {book.synopsis.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* C. notícias sobre o livro: só aparece quando há notícias reais em src/content/book.ts */}
      {news.length > 0 && (
        <section aria-labelledby="noticias-livro-title" className="on-light bg-paper-2 py-20 text-ink md:py-28">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <p className="eyebrow flex items-center gap-3 text-mint-ink">
              <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />Novidades
            </p>
            <h2 id="noticias-livro-title" className="display mt-4 text-[clamp(2.4rem,6vw,4.6rem)]">
              Notícias sobre o livro
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <article key={n.slug} className="flex flex-col">
                  {n.image && (
                    <div className="slant relative aspect-[16/9] w-full overflow-hidden bg-ink-3">
                      <Image src={n.image.src} alt={n.image.alt} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
                    </div>
                  )}
                  <time dateTime={n.date} className="mt-4 text-sm text-mute-light">
                    {formatDate(n.date)}
                  </time>
                  <h3 className="display mt-1 text-2xl">{n.title}</h3>
                  <p className="mt-2 text-mute-light">{n.excerpt}</p>
                  {n.externalUrl && (
                    <a href={n.externalUrl} target="_blank" rel="noopener noreferrer" className="eyebrow mt-3 text-mint-ink underline-offset-4 hover:underline">
                      Ler a notícia completa{n.source ? ` · ${n.source}` : ""} <span aria-hidden>↗</span>
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* D. chamada final */}
      <section aria-labelledby="comprar-livro-title" className="relative isolate overflow-hidden border-y border-line-dark bg-ink-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 md:px-10 lg:grid-cols-12">
          <div className="flex justify-center lg:col-span-5">
            <BookCover className="shadow-[0_30px_80px_-20px_rgba(0,255,156,0.25)]" />
          </div>
          <div className="lg:col-span-7">
            <h2 id="comprar-livro-title" className="display text-[clamp(2.4rem,6vw,4.6rem)]">
              Leve o <span className="text-mint">Curva Zero</span> para casa
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
              Uma conversa sobre disciplina, família e como continuar avançando quando o caminho fica mais difícil.
            </p>
            <div className="mt-8">
              <BuyBookButton>Comprar livro</BuyBookButton>
            </div>
            <p className="mt-3 text-sm text-mute-dark">{brl(book.priceCents)} · pagamento por Pix</p>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
