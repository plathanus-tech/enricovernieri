import Image from "next/image";
import { Button } from "./Button";
import { Placeholder } from "./Placeholder";
import { RaceNumber } from "./RaceNumber";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { VideoCarousel } from "./VideoCarousel";
import { campaignVideos, sponsors, type Sponsor } from "@/content/sponsors";
import { whatsappLink } from "@/content/site";

const exposure = [
  { src: "/photos/kart-enrico.jpg", alt: "Enrico, de capacete verde e laranja, pilotando o kart verde número 5, com os logos dos patrocinadores na carenagem", label: "Kart", w: 1600, h: 1066, cover: true, position: "35% 50%" },
  { src: "/photos/macacao-enrico-2.jpg", alt: "Enrico sorrindo, de macacão de corrida roxo com os logos Next e Plathanus no peito, apontando para cima com as duas mãos", label: "Macacão", w: 853, h: 807, cover: true, position: "50% 25%" },
  { src: "/photos/vestimenta.jpg", alt: "Três pessoas posam na pista de kart com as vestimentas da equipe: uma camiseta e um boné pretos e roxos com a marca EV Enrico Vernieri e dois casacos pretos com detalhes roxos e verdes, um deles com o logo da Next", label: "Vestimentas", w: 1376, h: 768, cover: true, position: "50% 40%" },
];

const offers = [
  { t: "Exposição direta", d: "A marca no kart, no macacão e nas camisetas, em competições, eventos e materiais de comunicação visual." },
  { t: "Presença digital", d: "Postagens dedicadas nas redes sociais, menções em veículos especializados e campanhas digitais." },
  { t: "Rede de contatos", d: "Participação em eventos e conexão com pessoas e empresas do setor por meio do networking do piloto." },
];

const presence = [
  { v: "7.500", l: "seguidores no Instagram" },
  { v: "62", l: "horas de transmissão" },
  { v: "410.000", l: "espectadores" },
  { v: "30", l: "notícias em portais" },
];

/**
 * Tabuleiro claro/escuro: no computador (3 colunas) o tom alterna a cada célula; no celular (2 colunas) alterna por linha e coluna.
 * O logo é um arquivo único, preto: nos quadros escuros ele é invertido para branco por CSS (classes literais, para o Tailwind gerar).
 */
const tones = (i: number) => {
  const desktop = i % 2 === 0 ? "L" : "D";
  const mobile = (Math.floor(i / 2) + (i % 2)) % 2 === 0 ? "L" : "D";
  return `${mobile}${desktop}` as "LL" | "LD" | "DL" | "DD";
};
const cellBg = { LL: "bg-paper-2", LD: "bg-paper-2 md:bg-ink", DL: "bg-ink md:bg-paper-2", DD: "bg-ink" } as const;
const logoFilter = { LL: "", LD: "md:invert", DL: "invert md:invert-0", DD: "invert" } as const;
const roleColor = { LL: "text-mint-ink", LD: "text-mint-ink md:text-mint", DL: "text-mint md:text-mint-ink", DD: "text-mint" } as const;

export function Sponsors() {
  const cells: (Sponsor | "cta")[] = [...sponsors];
  cells.push("cta");
  const [featured, ...others] = campaignVideos;
  return (
    <section id="patrocinadores" aria-labelledby="patrocinadores-title" className="on-light relative bg-paper py-24 text-ink md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading eyebrow="Patrocinadores e parceiros" tone="light" className="max-w-4xl">
          <span id="patrocinadores-title">Quem corre junto</span>
        </SectionHeading>

        {/* A. marcas parceiras */}
        <div className="mt-14">
          <h3 className="eyebrow border-b-2 border-ink pb-3">Marcas parceiras</h3>
          {sponsors.length > 0 ? (
            <ul className="mt-6 grid grid-cols-2 gap-px bg-line-light md:grid-cols-3">
              {cells.map((cell, i) => {
                // Alterna fundo escuro e claro como um tabuleiro, em 2 colunas (celular) e em 3 (computador).
                const t = tones(i);
                if (cell === "cta")
                  return (
                    <li key="cta" className="col-span-2 flex min-h-40 items-center justify-center bg-mint p-6 text-ink md:col-span-1 md:min-h-48">
                      <a href="#contato" className="group text-center">
                        <span className="eyebrow block">Seu logo aqui</span>
                        <span className="display mt-1 block text-3xl">Seja a próxima marca</span>
                        <span aria-hidden className="mt-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    </li>
                  );
                const s = cell;
                const img = <Image src={s.logo} alt={s.name} width={s.width} height={s.height} style={{ height: s.h, width: "auto" }} className={`max-w-full object-contain ${logoFilter[t]}`} />;
                return (
                  <li key={s.name} className={`relative flex min-h-40 items-center justify-center p-6 md:min-h-48 ${cellBg[t]}`}>
                    {s.href ? (
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                    {s.role && <span className={`eyebrow absolute left-3 top-3 text-[0.7rem] ${roleColor[t]}`}>{s.role}</span>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              <div className="bg-paper-2 p-7 md:p-10 lg:col-span-5">
                <p className="display text-3xl md:text-4xl">O seu logo pode estar aqui</p>
                <p className="mt-3 text-mute-light">
                  Estamos reunindo as marcas que apoiam a trajetória do Enrico para apresentá-las com o destaque que merecem.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:col-span-7 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <Placeholder key={i} tone="light" className="aspect-[3/2] !p-3 text-xs">
                    Logo original (SVG ou PNG)
                  </Placeholder>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* onde a marca aparece */}
        <div className="mt-14 bg-ink p-6 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-4">
              <p className="eyebrow text-mint">Onde a marca aparece</p>
              <p className="display mt-2 text-4xl md:text-5xl">Kart, macacão e camisetas</p>
              <p className="mt-3 text-mute-dark">Os espaços previstos na proposta de patrocínio, em todas as competições e eventos.</p>
            </div>
            <ul className="grid grid-cols-3 gap-3 lg:col-span-8">
              {exposure.map((e, i) => (
                <Reveal as="li" key={e.src} delay={i * 0.1}>
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden bg-white">
                      <Image src={e.src} alt={e.alt} fill sizes="(min-width:1024px) 22vw, 30vw" className={"cover" in e && e.cover ? "object-cover" : "object-contain p-1"} style={"position" in e ? { objectPosition: e.position } : undefined} />
                    </div>
                    <figcaption className="eyebrow mt-2 text-mint">{e.label}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* B. conteúdos e campanhas */}
        <div className="mt-20">
          <h3 className="eyebrow border-b-2 border-ink pb-3">Conteúdos e campanhas</h3>
          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
            <p className="display text-4xl md:text-5xl lg:col-span-6">Também diante das câmeras</p>
            <p className="text-lg text-mute-light lg:col-span-6">
              O Enrico já participou de campanhas e produziu vídeos para marcas. Aqui estão alguns desses trabalhos, publicados pelas próprias marcas, como portfólio de quem sabe falar com a câmera.
            </p>
          </div>

          {campaignVideos.length > 0 ? (
            <>
              <VideoCarousel videos={campaignVideos} />
            </>
          ) : (
            <div className="mt-8 grid gap-4">
              <div className="bg-paper-2 p-7 md:p-10">
                <p className="display text-3xl">Vídeos em breve</p>
                <p className="mt-2 text-mute-light">Os trabalhos com marcas serão publicados aqui, cada um com a campanha e o link para o conteúdo original.</p>
              </div>
              <Placeholder tone="light" className="aspect-[21/9]">
                Destaque principal: capa, marca, título e vídeo (Instagram, YouTube, Vimeo ou arquivo). Preencher em <code>src/content/sponsors.ts</code>.
              </Placeholder>
            </div>
          )}
        </div>

        {/* C. seja um patrocinador */}
        <div className="relative mt-24 overflow-hidden bg-ink text-white">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 select-none text-[22rem] leading-none text-mint/[0.08]">
            <RaceNumber value={5} outline />
          </div>
          <div className="relative grid gap-10 p-7 md:p-12 lg:grid-cols-12 lg:gap-14 lg:p-16">
            <div className="lg:col-span-6">
              <p className="eyebrow text-mint">Seja um patrocinador</p>
              <h3 className="display mt-3 text-[clamp(2.6rem,6vw,5rem)]">Faça parte dessa trajetória</h3>
              <p className="mt-5 max-w-xl text-lg text-white/85">
                Patrocinar o Enrico é apoiar o desenvolvimento esportivo de um jovem piloto e associar a sua marca a valores como dedicação, estratégia e superação, ao lado de uma história real que está sendo construída pista a pista.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={whatsappLink()} external>Conversar sobre patrocínio</Button>
              </div>
              <p className="mt-4 text-sm text-mute-dark">O contato é feito diretamente com os responsáveis pelo piloto.</p>
            </div>
            <div className="lg:col-span-6">
              <p className="eyebrow text-mute-dark">O que a proposta prevê</p>
              <ul className="mt-4 grid gap-px bg-line-dark sm:grid-cols-2">
                {offers.map((o) => (
                  <li key={o.t} className="bg-ink p-5 sm:[&:last-child:nth-child(odd)]:col-span-2">
                    <p className="display text-2xl text-mint">{o.t}</p>
                    <p className="mt-1 text-sm text-white/75">{o.d}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line-dark pt-6 sm:grid-cols-4">
                {presence.map((p) => (
                  <div key={p.l}>
                    <dt className="sr-only">{p.l}</dt>
                    <dd>
                      <p className="display text-3xl text-white">+{p.v}</p>
                      <p className="eyebrow mt-1 text-[0.75rem] text-mute-dark">{p.l}</p>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-mute-dark">Dados informados na apresentação de patrocínio do piloto; sujeitos a atualização.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
