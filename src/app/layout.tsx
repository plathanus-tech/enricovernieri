import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import { NextChallengeChip } from "@/components/NextChallengeChip";
import { ScrollTrack } from "@/components/ScrollTrack";
import { challenges } from "@/content/events";
import { site } from "@/content/site";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["italic"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Enrico Vernieri · Piloto de kart", template: "%s · Enrico Vernieri" },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Enrico Vernieri",
    title: "Enrico Vernieri · Piloto de kart",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Enrico Vernieri em ação no kart" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0a0b0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        <NextChallengeChip challenges={challenges} />
        {/* barra de rolagem com trilho de pista e kart (só com mouse; no celular, a barra nativa) */}
        <ScrollTrack force />
        <main id="conteudo">{children}</main>
      </body>
    </html>
  );
}
