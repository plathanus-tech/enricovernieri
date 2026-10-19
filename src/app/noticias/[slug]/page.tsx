import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { ShareButtons } from "@/components/ShareButtons";
import { news } from "@/content/news";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  // Next exige ao menos um valor em export estático; sem notícias, a rota simplesmente não existe.
  return news.filter((n) => !n.externalUrl).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug && !n.externalUrl);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/noticias/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      publishedTime: item.date,
      images: item.image ? [{ url: item.image.src, alt: item.image.alt }] : [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function NewsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug && !n.externalUrl);
  if (!item) notFound();
  const url = `${site.url}/noticias/${item.slug}`;

  return (
    <>
      <article className="on-light bg-paper pb-24 pt-[calc(var(--header-h)+3rem)] text-ink md:pb-32">
        <div className="mx-auto max-w-3xl px-5 md:px-0">
          <nav aria-label="Trilha" className="text-sm">
            <Link href="/" className="underline underline-offset-4 hover:text-mint-ink">Início</Link>
            <span aria-hidden className="mx-2">/</span>
            <Link href="/noticias" className="underline underline-offset-4 hover:text-mint-ink">Notícias</Link>
          </nav>
          <p className="mt-8 flex items-center gap-3">
            <span className="bg-ink px-2 py-0.5 font-display text-sm font-bold italic uppercase tracking-wide text-mint">{item.category}</span>
            <time dateTime={item.date} className="text-mute-light">{formatDate(item.date)}</time>
          </p>
          <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.6rem)]">{item.title}</h1>
          <p className="mt-4 text-xl text-mute-light">{item.excerpt}</p>
        </div>

        {item.image && (
          <div className="mx-auto mt-10 max-w-5xl px-5 md:px-10">
            <div className="slant relative aspect-[16/9] overflow-hidden bg-ink-3">
              <Image src={item.image.src} alt={item.image.alt} fill priority sizes="(min-width:1024px) 960px, 100vw" className="object-cover" />
            </div>
          </div>
        )}

        <div className="mx-auto mt-10 max-w-3xl space-y-5 px-5 text-lg leading-relaxed md:px-0">
          {(item.body ?? []).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="border-t border-line-light pt-6">
            <ShareButtons url={url} title={item.title} />
          </div>
        </div>
      </article>
      <Contact />
    </>
  );
}
