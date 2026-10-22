"use client";

import { useEffect, useId, useRef, useState } from "react";
import { pixDefaultId, pixOptions, pixReady } from "@/content/pix";
import { withBase } from "@/lib/base-path";

const brl = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

/**
 * Botão secundário "Apoiar com Pix" + janela (dialog nativo) para escolher o valor e pagar por QR Code ou pelo link da cobrança.
 * Contribuição espontânea: o texto deixa claro que não é patrocínio nem parceria comercial.
 * Os dados (QR Code e link por valor) vêm de src/content/pix.ts.
 */
export function PixSupport() {
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(pixDefaultId);
  const [copied, setCopied] = useState(false);
  const group = useId();

  // Sempre derivado do valor selecionado: QR Code e link nunca vêm de opções diferentes.
  const selected = pixOptions.find((o) => o.id === selectedId) ?? pixOptions[0];
  const ready = pixReady(selected);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Trava a rolagem da página enquanto o modal está aberto (compensando a barra de rolagem para o layout não pular).
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
    };
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const choose = (id: string) => {
    setSelectedId(id);
    setCopied(false);
  };

  const copy = async () => {
    if (!selected.code) return;
    try {
      await navigator.clipboard.writeText(selected.code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = selected.code;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 3500);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/35 px-6 py-3 font-display text-lg font-extrabold italic uppercase tracking-wide text-white transition-colors duration-200 hover:border-mint hover:text-mint"
      >
        Apoiar com Pix
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="pix-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto max-h-[92svh] w-[min(94vw,36rem)] overflow-y-auto overscroll-contain border border-line-dark bg-ink-2 p-0 text-white backdrop:bg-black/80"
      >
        <div className="relative p-6 md:p-8">
          <button
            type="button"
            autoFocus
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center border border-white/35 text-white transition-colors hover:border-mint hover:text-mint"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>

          <h2 id="pix-title" className="display pr-12 text-[clamp(2rem,6vw,2.8rem)]">
            Apoie a trajetória do Enrico
          </h2>
          <p className="mt-3 text-white/85">
            Cada contribuição é uma forma de incentivar o Enrico a continuar perseguindo seu sonho no automobilismo. Se você acredita nessa trajetória, pode contribuir espontaneamente com o valor que desejar entre as opções disponíveis.
          </p>

          <fieldset className="mt-6">
            <legend className="eyebrow text-mute-dark">Escolha um valor</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {pixOptions.map((o) => (
                <label key={o.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name={group}
                    value={o.id}
                    checked={o.id === selected.id}
                    onChange={() => choose(o.id)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-14 items-center justify-center border border-white/35 px-2 py-3 text-center font-display text-xl font-extrabold italic uppercase tracking-wide text-white transition-colors hover:border-mint peer-checked:border-mint peer-checked:bg-mint peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-mint">
                    {brl(o.amount)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            {ready && selected.qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={selected.id}
                src={withBase(selected.qr)}
                alt={`QR Code Pix no valor de ${brl(selected.amount)}`}
                width={176}
                height={176}
                className="mx-auto h-44 w-44 bg-white p-2 sm:mx-0"
              />
            ) : (
              <div
                key={selected.id}
                className="mx-auto flex h-44 w-44 flex-col items-center justify-center gap-1 border-2 border-dashed border-white/35 p-3 text-center text-sm text-mute-dark sm:mx-0"
              >
                <span className="font-display text-xs font-bold uppercase italic tracking-[0.18em]">Provisório</span>
                <span>QR Code de {brl(selected.amount)} ainda não configurado</span>
              </div>
            )}

            <div className="min-w-0">
              <p className="eyebrow text-mute-dark">Pix copia e cola · {brl(selected.amount)}</p>
              {ready && selected.code ? (
                <p key={selected.id} className="mt-2 max-h-24 overflow-y-auto break-all border border-line-dark bg-ink p-3 font-mono text-xs leading-relaxed text-white/85">
                  {selected.code}
                </p>
              ) : (
                <p key={selected.id} className="mt-2 border-2 border-dashed border-white/35 p-3 text-sm text-mute-dark">
                  Provisório: o Pix copia e cola deste valor ainda não foi configurado.
                </p>
              )}
              <button
                type="button"
                onClick={copy}
                disabled={!ready}
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center bg-mint px-6 py-3 font-display text-lg font-extrabold italic uppercase tracking-wide text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50 sm:w-auto"
              >
                Copiar código Pix
              </button>
              {ready && selected.url && (
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-white/85 underline underline-offset-4 hover:text-mint">
                  Abrir a cobrança no navegador<span className="sr-only"> (abre em nova aba)</span>
                </a>
              )}
              <p role="status" aria-live="polite" className="mt-2 min-h-6 text-sm">
                {!ready ? <span className="text-mute-dark">O pagamento via Pix estará disponível em breve.</span> : copied ? <span className="text-mint">Código Pix copiado!</span> : null}
              </p>
            </div>
          </div>

          <p className="mt-5 border-t border-line-dark pt-4 text-xs leading-relaxed text-mute-dark">
            Esta é uma contribuição espontânea para apoiar a trajetória esportiva do Enrico. Não se trata de patrocínio ou parceria comercial, e a contribuição não oferece contrapartidas comerciais.
          </p>
        </div>
      </dialog>
    </>
  );
}
