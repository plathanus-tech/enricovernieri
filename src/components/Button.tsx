import Link from "next/link";
import type { ReactNode } from "react";
import { withBase } from "@/lib/base-path";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "mint" | "ink" | "ghost-dark" | "ghost-light";
  external?: boolean;
  download?: boolean;
  className?: string;
  icon?: "arrow" | "download" | "none";
};

const styles = {
  mint: "bg-mint text-ink hover:bg-white",
  ink: "bg-ink text-white hover:bg-mint hover:text-ink",
  "ghost-dark": "border border-white/35 text-white hover:border-mint hover:text-mint",
  "ghost-light": "border border-ink/40 text-ink hover:bg-ink hover:text-white",
} as const;

export function Button({ href, children, variant = "mint", external, download, className = "", icon = "arrow" }: Props) {
  const cls = `group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 font-display text-lg font-extrabold italic uppercase tracking-wide transition-colors duration-200 ${styles[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {icon === "arrow" && (
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="square" />
        </svg>
      )}
      {icon === "download" && (
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" strokeLinecap="square" />
        </svg>
      )}
    </>
  );
  if (external || download || href.startsWith("http") || href.startsWith("/docs"))
    return (
      <a href={withBase(href)} className={cls} {...(download ? { download: true } : {})} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
