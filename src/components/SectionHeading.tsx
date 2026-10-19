import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, children, tone = "dark", className = "" }: { eyebrow: string; children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <div className={className}>
      <p className={`eyebrow flex items-center gap-3 ${tone === "dark" ? "text-mint" : "text-mint-ink"}`}>
        <span aria-hidden className="inline-block h-[3px] w-10 bg-current" />
        <span>{eyebrow}</span>
      </p>
      <h2 className="display mt-4 text-[clamp(2.6rem,7vw,5.6rem)]">{children}</h2>
    </div>
  );
}
