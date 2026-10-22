import Image from "next/image";
import { BuyBookButton } from "./BookPurchase";
import { Button } from "./Button";
import { RaceNumber } from "./RaceNumber";
import { Reveal } from "./Reveal";
import { book } from "@/content/book";

/** Apresentação do livro na home. A compra abre o mesmo modal da página /livro (BookPurchaseProvider). */
export function BookSection() {
  return (
    <section id="livro" aria-labelledby="livro-title" className="relative isolate overflow-hidden border-t border-line-dark bg-ink-2 py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-[4%] top-1/2 -z-10 -translate-y-1/2 select-none text-[min(80vw,640px)] text-mint/[0.09]">
        <RaceNumber value={0} outline />
      </div>
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <Reveal variant="wipe" className="lg:col-span-6">
          <div className="slant relative aspect-[4/3] w-full overflow-hidden bg-ink-3">
            <Image src={book.photos.family.src} alt={book.photos.family.alt} fill sizes="(min-width:1024px) 46vw, 100vw" className="object-cover object-[50%_45%]" />
          </div>
        </Reveal>

        <div className="lg:col-span-6">
          <p className="eyebrow inline-flex items-center gap-3 text-mint">
            <span aria-hidden className="inline-block h-[3px] w-6 bg-current" />O livro por trás da trajetória
          </p>
          <h2 id="livro-title" className="display mt-5 text-[clamp(3.4rem,10vw,8rem)]">
            {book.title}
          </h2>
          <p className="display mt-1 max-w-2xl text-xl text-mint md:text-2xl">{book.subtitle}</p>
          <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
            Escrito por {book.author}, pai do Enrico, o livro nasce da vivência de acompanhar o filho no kart enquanto conduzia a própria jornada como empreendedor. Nas pistas e nos negócios, os desafios eram quase os mesmos: decisões sob pressão, limites, frustrações e a responsabilidade de sustentar um sonho sem perder de vista quem caminha junto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BuyBookButton>Comprar livro</BuyBookButton>
            <Button href="/livro" variant="ghost-dark">
              Conheça a história do livro
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
