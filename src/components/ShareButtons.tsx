"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const base = "inline-flex min-h-11 items-center border border-ink/40 px-4 font-display text-base font-bold italic uppercase tracking-wide transition-colors hover:bg-ink hover:text-white";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copie o link:", url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="eyebrow text-mute-light">Compartilhar</span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={base}>WhatsApp</a>
      <button type="button" onClick={copy} className={base}>
        {copied ? "Link copiado" : "Copiar link"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">{copied ? "Link copiado" : ""}</span>
    </div>
  );
}
