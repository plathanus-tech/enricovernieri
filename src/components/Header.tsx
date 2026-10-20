"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { withBase } from "@/lib/base-path";

export function Header() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const prefix = home ? "" : withBase("/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!home) return;
    const ids = [...nav.map((n) => n.id), "contato"];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [home]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const bg = scrolled || open || !home ? "bg-ink/90 backdrop-blur-md border-b border-line-dark" : "bg-transparent";

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${bg}`} style={{ height: "var(--header-h)" }}>
      <div className="mx-auto grid h-full max-w-[1400px] grid-cols-[1fr_auto] items-center gap-6 px-5 md:px-10 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="Enrico Vernieri, início" className="relative z-10 block shrink-0">
          <Image src="/brand/logo-horizontal-white.png" alt="Enrico Vernieri" width={2043} height={370} className="h-9 w-auto md:h-10" priority />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`${prefix}#${n.id}`}
                  aria-current={active === n.id ? "location" : undefined}
                  className={`font-display text-[1.05rem] font-bold italic uppercase tracking-wider transition-colors hover:text-mint ${active === n.id ? "text-mint" : "text-white/85"}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-3">
          <a
            href={`${prefix}#contato`}
            className="hidden min-h-11 items-center bg-mint px-5 font-display text-base font-extrabold italic uppercase tracking-wide text-ink transition-colors hover:bg-white sm:inline-flex"
          >
            Seja parceiro
          </a>
          <button
            ref={toggle}
            type="button"
            className="relative z-10 inline-flex h-11 w-11 items-center justify-center border border-white/35 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
              {open ? <path d="M5 5l14 14M19 5 5 19" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>

    </header>

    {open && (
      <div id="menu-mobile" className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto overscroll-contain bg-ink px-5 pb-10 pt-6 lg:hidden [@media(max-height:640px)]:pb-6 [@media(max-height:640px)]:pt-3">
        <nav aria-label="Menu mobile">
          <ul className="flex flex-col">
            {nav.map((n, i) => (
              <li key={n.id} className="border-b border-line-dark">
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`${prefix}#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="display flex min-h-16 items-center justify-between text-4xl [@media(max-height:640px)]:min-h-12 [@media(max-height:640px)]:text-3xl"
                >
                  {n.label}
                  <span aria-hidden className="text-mint">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={`${prefix}#contato`}
          onClick={() => setOpen(false)}
          className="mt-8 flex min-h-14 items-center justify-center bg-mint px-6 font-display text-xl font-extrabold italic uppercase text-ink [@media(max-height:640px)]:mt-5"
        >
          Seja parceiro
        </a>
      </div>
    )}
    </>
  );
}
