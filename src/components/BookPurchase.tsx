"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { book, bookPix, orderApiUrl } from "@/content/book";
import { withBase } from "@/lib/base-path";
import {
  UFS,
  brl,
  digits,
  hasErrors,
  maskCep,
  maskCpf,
  validateAddress,
  validateBuyer,
  type Address,
  type Buyer,
  type FieldErrors,
  type OrderRequest,
  type OrderResponse,
} from "@/lib/book-order";

/**
 * Compra do livro: UM modal para a página inicial e para a página do livro. O provedor (no layout) guarda o estado e
 * renderiza a janela; qualquer <BuyBookButton> só pede para abrir. Os dados ficam apenas na memória da página
 * (nada de localStorage com dados pessoais) e o pedido só existe depois de enviado à API (backend/worker.ts).
 */

const STEPS = ["Seus dados", "Entrega", "Pagamento"] as const;
type Step = 1 | 2 | 3 | "done";

const emptyBuyer: Buyer = { name: "", email: "", cpf: "" };
const emptyAddress: Address = { cep: "", street: "", number: "", complement: "", district: "", city: "", state: "" };

const PurchaseContext = createContext<{ open: () => void } | null>(null);

export function useBookPurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error("BuyBookButton precisa estar dentro de BookPurchaseProvider");
  return ctx;
}

export function BuyBookButton({ children = "Comprar livro", variant = "mint", className = "" }: { children?: ReactNode; variant?: "mint" | "ghost-dark" | "ink"; className?: string }) {
  const { open } = useBookPurchase();
  const styles = { mint: "bg-mint text-ink hover:bg-white", ink: "bg-ink text-white hover:bg-white hover:text-ink", "ghost-dark": "border border-white/35 text-white hover:border-mint hover:text-mint" }[variant];
  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className={`group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 font-display text-lg font-extrabold italic uppercase tracking-wide transition-colors duration-200 ${styles} ${className}`}
    >
      <span>{children}</span>
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="square" />
      </svg>
    </button>
  );
}

/* ——— campos ——— */

const inputCls =
  "mt-1.5 block min-h-12 w-full border border-white/35 bg-ink px-3 py-2.5 text-base text-white placeholder:text-white/40 focus:border-mint focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint aria-[invalid=true]:border-[#ff8a8a]";

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = true,
  className = "",
  children,
  ...input
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children?: ReactNode;
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, "autoComplete" | "inputMode" | "maxLength" | "placeholder" | "type">) {
  const id = useId();
  const describedBy = [error ? `${id}-e` : "", hint ? `${id}-h` : ""].filter(Boolean).join(" ") || undefined;
  const common = { id, name, value, onChange, onBlur, required, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, className: inputCls };
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-white/90">
        {label}
        {!required && <span className="font-normal text-mute-dark"> (opcional)</span>}
      </label>
      {children ? <select {...common}>{children}</select> : <input {...common} {...input} />}
      {hint && !error && (
        <p id={`${id}-h`} className="mt-1 text-xs text-mute-dark">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-e`} className="mt-1 text-sm text-[#ff9b9b]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ——— janela ——— */

function PurchaseDialog({ openState, onClose }: { openState: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);
  const idempotencyKey = useRef("");
  const edited = useRef<Set<string>>(new Set());
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [buyer, setBuyer] = useState<Buyer>(emptyBuyer);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // isca contra robôs
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverErrors, setServerErrors] = useState<FieldErrors<Buyer> & FieldErrors<Address>>({});
  const [cepStatus, setCepStatus] = useState<"" | "loading" | "notfound" | "failed">("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);

  const buyerErrors = useMemo(() => validateBuyer(buyer), [buyer]);
  const addressErrors = useMemo(() => validateAddress(address), [address]);
  const pixReady = Boolean(bookPix.code);
  const apiReady = Boolean(orderApiUrl);
  // sem API de pedidos ou sem Pix configurado, a compra não abre: ninguém deve pagar sem o pedido ser registrado
  const available = apiReady && pixReady;
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));
  const show = (errors: object, k: string) => (touched[k] ? (errors as Record<string, string | undefined>)[k] : undefined) ?? (serverErrors as Record<string, string | undefined>)[k];

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (openState && !d.open) {
      d.showModal();
      if (!startedAt.current) startedAt.current = Date.now();
      if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
    }
    if (!openState && d.open) d.close();
  }, [openState]);

  // trava a rolagem da página enquanto a janela está aberta, compensando a barra para o layout não pular
  useEffect(() => {
    if (!openState) return;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
    };
  }, [openState]);

  // a cada etapa, o foco vai para o título (leitores de tela anunciam onde a pessoa está)
  useEffect(() => {
    if (openState) heading.current?.focus();
  }, [step, openState]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const close = () => {
    onClose();
    if (step === "done") {
      // pedido concluído: limpa tudo para a próxima compra
      setStep(1);
      setBuyer(emptyBuyer);
      setAddress(emptyAddress);
      setConsent(false);
      setTouched({});
      setOrderId("");
      setApiError("");
      setServerErrors({});
      edited.current.clear();
      startedAt.current = 0;
      idempotencyKey.current = "";
    }
  };

  const setB = (k: keyof Buyer) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = k === "cpf" ? maskCpf(e.target.value) : e.target.value;
    setBuyer((b) => ({ ...b, [k]: v }));
    setServerErrors((s) => ({ ...s, [k]: undefined }));
  };

  const lookupCep = useCallback(async (cep: string) => {
    setCepStatus("loading");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string };
      if (data.erro) return setCepStatus("notfound");
      setAddress((a) => ({
        ...a,
        street: edited.current.has("street") ? a.street : (data.logradouro ?? a.street),
        district: edited.current.has("district") ? a.district : (data.bairro ?? a.district),
        city: edited.current.has("city") ? a.city : (data.localidade ?? a.city),
        state: edited.current.has("state") ? a.state : (data.uf ?? a.state),
      }));
      setCepStatus("");
    } catch {
      setCepStatus("failed"); // sem internet ou serviço fora do ar: a pessoa preenche à mão
    }
  }, []);

  const setA = (k: keyof Address) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = k === "cep" ? maskCep(e.target.value) : e.target.value;
    if (k !== "cep") edited.current.add(k);
    setAddress((a) => ({ ...a, [k]: v }));
    setServerErrors((s) => ({ ...s, [k]: undefined }));
    if (k === "cep") {
      setCepStatus("");
      if (digits(v).length === 8) void lookupCep(digits(v));
    }
  };

  const goto = (s: Step) => {
    setApiError("");
    setStep(s);
  };

  const step1Ok = !hasErrors(buyerErrors) && consent;
  const step2Ok = !hasErrors(addressErrors);

  const copy = async () => {
    const code = bookPix.code;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 3500);
  };

  const submit = async () => {
    if (submitting || !step1Ok || !step2Ok || !pixReady || !apiReady) return;
    setSubmitting(true);
    setApiError("");
    const payload: OrderRequest = {
      idempotencyKey: idempotencyKey.current,
      buyer: { ...buyer, name: buyer.name.trim(), email: buyer.email.trim() },
      address: { ...address, street: address.street.trim(), number: address.number.trim(), complement: address.complement.trim(), district: address.district.trim(), city: address.city.trim() },
      quantity: 1,
      consent: true,
      website,
      elapsedMs: Date.now() - startedAt.current,
    };
    try {
      const res = await fetch(orderApiUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => ({}))) as Partial<OrderResponse> & { error?: string; fields?: FieldErrors<Buyer> & FieldErrors<Address> };
      if (res.ok && data.orderId) {
        setOrderId(data.orderId);
        setStep("done");
      } else if (res.status === 422 && data.fields) {
        setServerErrors(data.fields);
        setApiError("Alguns dados precisam de ajuste. Volte às etapas anteriores e confira os campos marcados.");
      } else {
        setApiError(data.error ?? "Não foi possível registrar o pedido agora. Seus dados continuam aqui: tente novamente em instantes.");
      }
    } catch {
      setApiError("Não foi possível falar com o servidor. Confira sua conexão e tente novamente: seus dados continuam aqui.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = step === "done" ? 3 : step;
  const btnPrimary =
    "inline-flex min-h-12 items-center justify-center bg-mint px-6 py-3 font-display text-lg font-extrabold italic uppercase tracking-wide text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50";
  const btnSecondary =
    "inline-flex min-h-12 items-center justify-center border border-white/35 px-6 py-3 font-display text-lg font-extrabold italic uppercase tracking-wide text-white transition-colors hover:border-mint hover:text-mint";

  return (
    <dialog
      ref={dialog}
      aria-labelledby="compra-title"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="m-auto max-h-[94svh] w-[min(94vw,40rem)] overflow-y-auto overscroll-contain border border-line-dark bg-ink-2 p-0 text-white backdrop:bg-black/80"
    >
      <div className="relative p-5 md:p-8">
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center border border-white/35 text-white transition-colors hover:border-mint hover:text-mint"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 5l14 14M19 5 5 19" />
          </svg>
        </button>

        <p className="eyebrow text-mint">Livro · {book.title}</p>
        <h2 id="compra-title" ref={heading} tabIndex={-1} className="display mt-2 pr-12 text-[clamp(1.9rem,6vw,2.6rem)] outline-none">
          {!available ? "Compra em breve" : step === "done" ? "Pedido recebido" : step === 1 ? "Seus dados" : step === 2 ? "Endereço de entrega" : "Pagamento por Pix"}
        </h2>

        {!available && (
          <div className="mt-6 grid gap-4">
            <p className="border-l-4 border-mint bg-ink p-4 text-white/90">A compra do livro pelo site estará disponível em breve. Obrigado pelo interesse!</p>
            <div className="flex justify-end">
              <button type="button" onClick={close} className={btnPrimary}>
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* progresso */}
        {available && (
        <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="Etapas da compra">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const state = step === "done" || n < progress ? "done" : n === progress ? "current" : "todo";
            return (
              <li key={label} aria-current={state === "current" ? "step" : undefined}>
                <span className={`block h-1.5 ${state === "todo" ? "bg-white/20" : "bg-mint"}`} />
                <span className={`mt-1.5 block text-xs font-semibold ${state === "todo" ? "text-mute-dark" : "text-white"}`}>
                  {n}. {label}
                  {state === "done" && <span className="sr-only"> (concluída)</span>}
                  {state === "current" && <span className="sr-only"> (etapa atual)</span>}
                </span>
              </li>
            );
          })}
        </ol>
        )}

        {available && step === 1 && (
          <form
            noValidate
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (step1Ok) goto(2);
            }}
          >
            <p className="text-sm text-white/80">
              Usamos esses dados só para identificar o seu pedido, conferir o pagamento e enviar o livro. Eles não são usados para outra finalidade.
            </p>
            <Field label="Nome completo" name="name" value={buyer.name} onChange={setB("name")} onBlur={() => touch("name")} error={show(buyerErrors, "name")} autoComplete="name" maxLength={120} />
            <Field label="E-mail" name="email" type="email" inputMode="email" value={buyer.email} onChange={setB("email")} onBlur={() => touch("email")} error={show(buyerErrors, "email")} autoComplete="email" maxLength={254} hint="Enviaremos a confirmação do pedido para este endereço." />
            <Field label="CPF" name="cpf" inputMode="numeric" placeholder="000.000.000-00" value={buyer.cpf} onChange={setB("cpf")} onBlur={() => touch("cpf")} error={show(buyerErrors, "cpf")} autoComplete="off" maxLength={14} hint="Usado para identificar o pagamento do pedido." />

            {/* isca contra robôs: escondida de pessoas e de leitores de tela */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Não preencha este campo
                <input tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm text-white/85">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#00ff9c]" />
              <span>
                Li e concordo com o{" "}
                <a href={withBase("/privacidade/")} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-mint">
                  Aviso de Privacidade<span className="sr-only"> (abre em nova aba)</span>
                </a>
                .
              </span>
            </label>

            <section aria-label="Resumo do pedido" className="border border-line-dark bg-ink p-4 text-sm">
              <p className="eyebrow text-mute-dark">Resumo do pedido</p>
              <dl className="mt-2 grid gap-1.5">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/80">
                    {book.title} · 1 un.
                  </dt>
                  <dd className="font-bold">{brl(book.priceCents)}</dd>
                </div>
              </dl>
            </section>

            {!step1Ok && <p className="text-xs text-mute-dark">Preencha os campos e aceite o aviso de privacidade para continuar.</p>}
            <div className="flex justify-end">
              <button type="submit" disabled={!step1Ok} className={`${btnPrimary} w-full sm:w-auto`}>
                Continuar
              </button>
            </div>
          </form>
        )}

        {available && step === 2 && (
          <form
            noValidate
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (step2Ok) goto(3);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
              <Field
                label="CEP"
                name="cep"
                inputMode="numeric"
                placeholder="00000-000"
                value={address.cep}
                onChange={setA("cep")}
                onBlur={() => touch("cep")}
                error={show(addressErrors, "cep")}
                autoComplete="postal-code"
                maxLength={9}
                hint={cepStatus === "loading" ? "Buscando endereço…" : cepStatus === "notfound" ? "CEP não encontrado: preencha o endereço manualmente." : cepStatus === "failed" ? "Não foi possível buscar o CEP: preencha o endereço manualmente." : "Preenchemos o endereço pelo CEP quando possível."}
              />
              <Field label="Endereço" name="street" value={address.street} onChange={setA("street")} onBlur={() => touch("street")} error={show(addressErrors, "street")} autoComplete="address-line1" maxLength={120} />
            </div>
            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <Field label="Número" name="number" value={address.number} onChange={setA("number")} onBlur={() => touch("number")} error={show(addressErrors, "number")} autoComplete="off" maxLength={12} />
              <Field label="Complemento" name="complement" required={false} value={address.complement} onChange={setA("complement")} onBlur={() => touch("complement")} error={show(addressErrors, "complement")} autoComplete="address-line2" maxLength={60} />
            </div>
            <Field label="Bairro" name="district" value={address.district} onChange={setA("district")} onBlur={() => touch("district")} error={show(addressErrors, "district")} autoComplete="off" maxLength={80} />
            <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
              <Field label="Cidade" name="city" value={address.city} onChange={setA("city")} onBlur={() => touch("city")} error={show(addressErrors, "city")} autoComplete="address-level2" maxLength={80} />
              <Field label="Estado" name="state" value={address.state} onChange={setA("state")} onBlur={() => touch("state")} error={show(addressErrors, "state")} autoComplete="address-level1">
                <option value="">UF</option>
                {UFS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Field>
            </div>

            <section aria-label="Resumo do pedido" className="border border-line-dark bg-ink p-4 text-sm">
              <p className="eyebrow text-mute-dark">Resumo do pedido</p>
              <dl className="mt-2 grid gap-1.5">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/80">
                    {book.title} · 1 un.
                  </dt>
                  <dd className="font-bold">{brl(book.priceCents)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line-dark pt-1.5">
                  <dt className="text-white/80">Entrega</dt>
                  <dd className="text-right">{addressSummary(address)}</dd>
                </div>
              </dl>
            </section>

            {!step2Ok && <p className="text-xs text-mute-dark">Preencha os campos obrigatórios para continuar.</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => goto(1)} className={btnSecondary}>
                Voltar
              </button>
              <button type="submit" disabled={!step2Ok} className={btnPrimary}>
                Ir para o pagamento
              </button>
            </div>
          </form>
        )}

        {available && step === 3 && (
          <div className="mt-6 grid gap-5">
            <div className="flex items-baseline justify-between gap-4 border border-line-dark bg-ink p-4">
              <p>
                <span className="eyebrow block text-mute-dark">Livro</span>
                <span className="font-semibold">{book.title}</span>
              </p>
              <p className="text-right">
                <span className="eyebrow block text-mute-dark">Valor total</span>
                <span className="display text-3xl text-mint">{brl(book.priceCents)}</span>
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
              {bookPix.qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={withBase(bookPix.qr)} alt={`QR Code Pix no valor de ${brl(book.priceCents)}`} width={176} height={176} className="mx-auto h-44 w-44 bg-white p-2 sm:mx-0" />
              ) : (
                <div className="mx-auto flex h-44 w-44 flex-col items-center justify-center gap-1 border-2 border-dashed border-white/35 p-3 text-center text-sm text-mute-dark sm:mx-0">
                  <span className="font-display text-xs font-bold uppercase italic tracking-[0.18em]">Provisório</span>
                  <span>QR Code do livro ainda não configurado</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="eyebrow text-mute-dark">Pix copia e cola</p>
                {pixReady ? (
                  <p className="mt-2 max-h-24 overflow-y-auto break-all border border-line-dark bg-ink p-3 font-mono text-xs leading-relaxed text-white/85">{bookPix.code}</p>
                ) : (
                  <p className="mt-2 border-2 border-dashed border-white/35 p-3 text-sm text-mute-dark">Código provisório: o Pix copia e cola do livro ainda não foi configurado.</p>
                )}
                <button type="button" onClick={copy} disabled={!pixReady} className={`${btnPrimary} mt-3 w-full sm:w-auto`}>
                  Copiar código Pix
                </button>
                <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-mint">
                  {copied ? "Código Pix copiado!" : ""}
                </p>
              </div>
            </div>

            <ol className="grid list-decimal gap-1.5 pl-5 text-sm text-white/85">
              <li>Abra o app do seu banco e escolha pagar com Pix.</li>
              <li>Leia o QR Code ou cole o código copiado e confira o valor de {brl(book.priceCents)}.</li>
              <li>Depois de pagar, volte aqui e clique em “Concluir pedido” para registrar a entrega.</li>
            </ol>

            <p className="border-l-4 border-mint bg-ink p-3 text-sm text-white/90">
              O pagamento precisa ser confirmado pela nossa equipe antes do envio do livro. Registrar o pedido não significa que o pagamento foi aprovado.
            </p>

            {!pixReady && <p className="text-sm text-[#ffd27a]">O pagamento do livro ainda não está disponível. Volte em breve.</p>}
            {pixReady && !apiReady && <p className="text-sm text-[#ffd27a]">O registro de pedidos ainda não está ativo neste site. Volte em breve.</p>}
            {apiError && (
              <p role="alert" className="border border-[#ff9b9b]/60 p-3 text-sm text-[#ff9b9b]">
                {apiError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => goto(2)} disabled={submitting} className={btnSecondary}>
                Voltar
              </button>
              <button type="button" onClick={submit} disabled={!pixReady || !apiReady || submitting} className={btnPrimary}>
                {submitting ? "Registrando…" : "Concluir pedido"}
              </button>
            </div>
          </div>
        )}

        {available && step === "done" && (
          <div className="mt-6 grid gap-5">
            <div className="border border-mint/60 bg-ink p-5">
              <p className="eyebrow text-mute-dark">Número do pedido</p>
              <p className="display mt-1 break-all text-4xl text-mint">{orderId}</p>
              <p className="mt-2 inline-block bg-white px-2 py-0.5 font-display text-sm font-bold italic uppercase text-ink">Aguardando confirmação do pagamento</p>
            </div>
            <div className="text-sm text-white/90">
              <p>Registramos o seu pedido e avisamos a nossa equipe. Ele ainda não está aprovado: o livro só é enviado depois que o seu pagamento via Pix for conferido.</p>
              <p className="mt-3 font-semibold">O que fazer agora</p>
              <ul className="mt-1 grid list-disc gap-1 pl-5">
                <li>Se ainda não pagou, volte à etapa de pagamento e faça o Pix de {brl(book.priceCents)}.</li>
                <li>Guarde o número do pedido: ele identifica a sua compra.</li>
                <li>Enviamos um e-mail de confirmação para {buyer.email}. Se não encontrar, confira a caixa de spam.</li>
              </ul>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => goto(3)} className={btnSecondary}>
                Ver o Pix novamente
              </button>
              <button type="button" onClick={close} className={btnPrimary}>
                Fechar
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 border-t border-line-dark pt-4 text-xs leading-relaxed text-mute-dark">
          Dados de pagamento não passam por este site: o Pix é feito no aplicativo do seu banco.
        </p>
      </div>
    </dialog>
  );
}

function addressSummary(a: Address) {
  const line1 = [a.street, a.number].filter(Boolean).join(", ");
  const line2 = [a.district, [a.city, a.state].filter(Boolean).join("/")].filter(Boolean).join(" · ");
  return [line1 + (a.complement ? ` (${a.complement})` : ""), line2, a.cep && `CEP ${a.cep}`].filter(Boolean).join(" · ") || "—";
}

export function BookPurchaseProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setOpen(true) }), []);
  return (
    <PurchaseContext.Provider value={value}>
      {children}
      <PurchaseDialog openState={open} onClose={() => setOpen(false)} />
    </PurchaseContext.Provider>
  );
}
