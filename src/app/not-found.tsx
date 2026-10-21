import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

/**
 * Página 404. O kart do Enrico é o protagonista: no computador ocupa a lateral direita, com a borda esquerda se dissolvendo
 * no preto (como no hero); no celular fica no topo. O 404 é um elemento gráfico à parte, com o "0" em contorno verde.
 */
export default function NotFound() {
  return (
    <section
      aria-labelledby="erro-titulo"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#050605] pt-[var(--header-h)] xl:flex-row xl:items-center"
    >
      {/* foto: no celular, faixa no topo; no computador, lateral direita. As camadas escurecem sem alterar a imagem original. */}
      <div className="relative h-[34svh] w-full shrink-0 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] xl:absolute xl:inset-y-0 xl:right-0 xl:z-0 xl:h-auto xl:w-[74%] xl:[mask-image:none]">
        {/* no computador a foto começa um pouco à direita, deixando a transição para o preto acontecer antes do kart */}
        <div className="absolute inset-0 xl:left-[8%]">
          <Image
            src="/photos/404-kart.jpg"
            alt="Enrico, de capacete verde e laranja, pilotando o kart número 5 em uma curva da pista, com o fundo desfocado pela velocidade"
            fill
            priority
            sizes="(min-width:1280px) 68vw, 100vw"
            className="object-cover object-[38%_55%] [filter:grayscale(1)_contrast(1.07)_brightness(1.08)] xl:object-[0%_55%]"
          />
        </div>
        {/* escurecimento leve e do fundo da pista (alto, baixo e bordas), mantendo o piloto e o kart mais claros e definidos */}
        <div aria-hidden className="absolute inset-0 bg-black/[0.1]" />
        <div aria-hidden className="absolute inset-0 [background:radial-gradient(ellipse_70%_75%_at_44%_58%,transparent_0%,transparent_50%,rgb(5_6_5/.35)_100%)] xl:[background:radial-gradient(ellipse_48%_52%_at_62%_58%,transparent_0%,transparent_45%,rgb(5_6_5/.38)_100%)]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(5_6_5/.45)_0%,transparent_32%,transparent_66%,rgb(5_6_5/.5)_100%)]" />
        {/* transição longa e suave do preto para a foto */}
        <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(to_right,#050605_0%,#050605_8%,rgb(5_6_5/.82)_16%,rgb(5_6_5/.55)_26%,rgb(5_6_5/.28)_36%,rgb(5_6_5/.08)_48%,transparent_60%)] xl:block" />
        {/* luz de contorno verde, muito sutil, onde o kart se aproxima da área escura */}
        <div aria-hidden className="absolute inset-0 hidden mix-blend-screen xl:block [background:radial-gradient(ellipse_26%_36%_at_30%_58%,rgb(0_255_156/.08),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-12 pt-6 md:px-10 xl:pb-0 xl:pt-0">
        <div className="xl:max-w-[34rem]">
          <p className="eyebrow text-[0.8rem] text-mint md:text-sm">Erro 404</p>

          <div aria-hidden className="display mt-2 text-[clamp(5.5rem,24vw,17rem)] leading-[0.82] xl:text-[clamp(9rem,15vw,17rem)]">
            4<span className="text-transparent [-webkit-text-stroke:2px_#00ff9c] md:[-webkit-text-stroke:3px_#00ff9c]">0</span>4
          </div>

          <h1 id="erro-titulo" className="display mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[0.95] xl:mt-6">
            Parece que saímos do traçado.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/85 md:text-lg">Essa página não foi encontrada. Vamos voltar ao caminho certo?</p>

          <div className="mt-6 xl:mt-8">
            <Button href="/" className="w-full sm:w-auto sm:min-w-[15rem]">
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
