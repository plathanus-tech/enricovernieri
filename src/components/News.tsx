import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { Placeholder } from "./Placeholder";
import { RaceNumber } from "./RaceNumber";
import { SectionHeading } from "./SectionHeading";
import { news, type NewsItem } from "@/content/news";
import { formatDate } from "@/lib/format";

function CardLink({ item, side, children }: { item: NewsItem; side: boolean; children: React.ReactNode }) {
  const cls = `flex h-full flex-col focus-visible:outline-offset-4 ${side ? "lg:flex-row lg:gap-5" : ""}`;
  if (item.externalUrl)
    return (
      <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  return (
    <Link href={`/noticias/${item.slug}`} className={cls}>
      {children}
    </Link>
  );
}

/** `side`: no desktop, foto à esquerda e texto à direita (cards secundários da home, que ficam empilhados ao lado do destaque). */
export function NewsCard({ item, large = false, side = false }: { item: NewsItem; large?: boolean; side?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col">
      <CardLink item={item} side={side}>
        <div className={`slant relative w-full overflow-hidden bg-ink-3 ${large ? "aspect-[16/10]" : "aspect-[16/9]"} ${side ? "lg:aspect-[4/3] lg:w-[40%] lg:shrink-0 lg:self-start" : ""}`}>
          {item.image ? (
            <Image src={item.image.src} alt={item.image.alt} fill sizes={large ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 100vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          ) : (
            <div aria-hidden className="absolute inset-0 flex items-center justify-center overflow-hidden bg-ink-3 text-[min(14rem,60%)] text-mint/30">
              <RaceNumber value={5} outline className="!text-[9rem] md:!text-[11rem]" />
              {item.source && <span className="eyebrow absolute bottom-4 left-[12%] text-sm text-white/70">{item.source}</span>}
            </div>
          )}
        </div>
        <div className={`min-w-0 ${side ? "lg:flex-1" : ""}`}>
          <div className={`flex items-center gap-3 text-sm ${side ? "mt-4 lg:mt-0" : "mt-4"}`}>
            <span className="bg-ink px-2 py-0.5 font-display text-sm font-bold italic uppercase tracking-wide text-mint">{item.category}</span>
            <time dateTime={item.date} className="text-mute-light">{formatDate(item.date)}</time>
          </div>
          <h3 className={`display mt-2 transition-colors group-hover:text-mint-ink ${large ? "text-[clamp(2rem,4vw,3.2rem)]" : side ? "text-2xl lg:text-[1.35rem]" : "text-2xl"}`}>{item.title}</h3>
          <p className={`mt-2 text-mute-light ${side ? "lg:line-clamp-3 lg:text-[0.95rem]" : ""}`}>{item.excerpt}</p>
          {item.externalUrl && (
            <p className="eyebrow mt-3 text-mint-ink">
              Ler em {item.source} <span aria-hidden>↗</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </p>
          )}
        </div>
      </CardLink>
    </article>
  );
}

export function sortedNews() {
  return [...news].sort((a, b) => b.date.localeCompare(a.date));
}

export function NewsSection() {
  const items = sortedNews().slice(0, 4);
  const [first, ...rest] = items;
  return (
    <section id="noticias" aria-labelledby="noticias-title" className="on-light relative bg-paper-2 py-24 text-ink md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Notícias" tone="light">
            <span id="noticias-title">Direto das pistas</span>
          </SectionHeading>
          {items.length > 0 && <Button href="/noticias" variant="ghost-light">Ver todas as notícias</Button>}
        </div>

        {first ? (
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className={rest.length ? "lg:col-span-7" : "lg:col-span-12"}>
              <NewsCard item={first} large />
            </div>
            {rest.length > 0 && (
              <div className="grid gap-8 lg:col-span-5 lg:content-between">
                {rest.map((n) => (
                  <NewsCard key={n.slug} item={n} side />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="bg-paper p-7 md:p-10 lg:col-span-5">
              <p className="display text-3xl md:text-4xl">As primeiras notícias estão a caminho</p>
              <p className="mt-3 text-mute-light">Resultados de etapas, conquistas e novidades de parceiros vão aparecer aqui, cada uma com sua própria página para compartilhar.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {[0, 1, 2].map((i) => (
                <Placeholder key={i} tone="light" className="aspect-[4/5] !p-3 text-xs">
                  Notícia: foto, data, categoria, título e resumo. Preencher em <code>src/content/news.ts</code>.
                </Placeholder>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
