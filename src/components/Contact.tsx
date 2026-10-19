import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { RaceNumber } from "./RaceNumber";
import { nav, site, whatsappLink } from "@/content/site";
import { pilot } from "@/content/pilot";
import { withBase } from "@/lib/base-path";

function Icon({ name }: { name: "whatsapp" | "instagram" | "mail" }) {
  const common = { "aria-hidden": true, viewBox: "0 0 24 24", className: "h-6 w-6 shrink-0", fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;
  if (name === "instagram")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.8" fill="currentColor" />
      </svg>
    );
  if (name === "mail")
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4.1A8 8 0 1 1 20 12Z" />
      <path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-.8-.4-1.6-1.2-2-2l.8-1-1-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Contact() {
  const c = site.contact;
  return (
    <>
      <section id="contato" aria-labelledby="contato-title" className="relative isolate overflow-hidden bg-ink py-24 md:py-36">
        <div aria-hidden className="pointer-events-none absolute -bottom-[18%] -right-[6%] -z-10 select-none text-[min(70vw,760px)] text-mint/[0.12]">
          <RaceNumber value={pilot ? 5 : 5} outline />
        </div>
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <p className="eyebrow flex items-center gap-3 text-mint">
            <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
            Parcerias
          </p>
          <h2 id="contato-title" className="display mt-4 text-[clamp(3rem,10vw,8.5rem)]">
            Faça parte
            <br />
            <span className="text-mint">dessa trajetória</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/85">
            Apoie o desenvolvimento de Enrico Vernieri no kartismo. Entre em contato com a equipe responsável para conhecer o projeto e as oportunidades de parceria.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappLink()} external>Seja um parceiro</Button>
            <Button href={site.mediaKit.url} variant="ghost-dark" icon="download" download>Baixar mídia kit</Button>
          </div>

          <ul className="mt-14 grid max-w-3xl gap-px bg-line-dark sm:grid-cols-2">
            <li className="bg-ink">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex min-h-20 items-center gap-4 px-5 py-4 transition-colors hover:text-mint">
                <Icon name="whatsapp" />
                <span>
                  <span className="eyebrow block text-mute-dark">WhatsApp dos responsáveis</span>
                  <span className="display text-2xl">{c.whatsappDisplay}</span>
                </span>
              </a>
            </li>
            <li className="bg-ink">
              <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-20 items-center gap-4 px-5 py-4 transition-colors hover:text-mint">
                <Icon name="instagram" />
                <span>
                  <span className="eyebrow block text-mute-dark">Instagram oficial</span>
                  <span className="display text-2xl">@{c.instagramHandle}</span>
                </span>
              </a>
            </li>
            {c.email && (
              <li className="bg-ink sm:col-span-2">
                <a href={`mailto:${c.email}`} className="flex min-h-20 items-center gap-4 px-5 py-4 transition-colors hover:text-mint">
                  <Icon name="mail" />
                  <span>
                    <span className="eyebrow block text-mute-dark">E-mail comercial</span>
                    <span className="display text-2xl">{c.email}</span>
                  </span>
                </a>
              </li>
            )}
          </ul>

          <figure className="mt-16 max-w-2xl border-l-4 border-mint pl-5">
            <blockquote className="display text-2xl md:text-3xl">“{pilot.sennaQuote}”</blockquote>
            <figcaption className="eyebrow mt-2 text-mute-dark">{pilot.idol}</figcaption>
          </figure>
        </div>
      </section>

      <footer className="border-t border-line-dark bg-ink-2 py-12">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/brand/logo-stacked-white.png" alt="Enrico Vernieri" width={1629} height={1247} className="h-24 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-mute-dark">
              Piloto de kart de Palhoça (SC). Por ser menor de idade, todo contato comercial é feito com os responsáveis.
            </p>
          </div>
          <nav aria-label="Rodapé" className="lg:col-span-5">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={withBase(`/#${n.id}`)} className="inline-flex min-h-11 items-center font-display text-lg font-bold italic uppercase tracking-wide text-white/85 hover:text-mint">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={withBase(site.mediaKit.url)} download className="inline-flex min-h-11 items-center font-display text-lg font-bold italic uppercase tracking-wide text-white/85 hover:text-mint">Mídia kit</a>
              </li>
              <li>
                <Link href="/noticias" className="inline-flex min-h-11 items-center font-display text-lg font-bold italic uppercase tracking-wide text-white/85 hover:text-mint">Todas as notícias</Link>
              </li>
            </ul>
          </nav>
          <div className="lg:col-span-3">
            <p className="eyebrow text-mute-dark">Perfis oficiais</p>
            <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 text-white/85 hover:text-mint">
              <Icon name="instagram" /> @{c.instagramHandle}
            </a>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-[1400px] px-5 text-xs text-mute-dark md:px-10">
          © {new Date().getFullYear()} Enrico Vernieri. Todos os direitos reservados. Fotografias e marcas pertencem aos respectivos titulares.
        </p>
      </footer>
    </>
  );
}
