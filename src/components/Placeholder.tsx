import type { ReactNode } from "react";
import { site } from "@/content/site";

/** Espaço reservado, visível apenas enquanto `site.showPlaceholders` estiver ligado. */
export function Placeholder({ children, className = "", tone = "dark" }: { children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  if (!site.showPlaceholders) return null;
  const palette = tone === "dark" ? "border-white/35 text-mute-dark" : "border-ink/40 text-mute-light";
  return (
    <div className={`flex min-w-0 items-center justify-center border-2 border-dashed p-6 text-center text-sm [overflow-wrap:anywhere] ${palette} ${className}`}>
      <p>
        <span className="mb-1 block font-display text-xs font-bold uppercase italic tracking-[0.18em]">Conteúdo a definir</span>
        {children}
      </p>
    </div>
  );
}
