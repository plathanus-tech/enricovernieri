import type { CSSProperties, ReactNode } from "react";

/** Linhas de velocidade que cruzam a tela da direita para a esquerda. Posições fixas (sem aleatório) para não variar entre servidor e navegador. */
export function SpeedLines({ count = 14, color, className = "" }: { count?: number; color?: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const top = (i * 37 + 11) % 97;
        const w = 80 + ((i * 53) % 240);
        const d = 1.6 + ((i * 29) % 18) / 10;
        const dl = -((i * 41) % 30) / 10;
        const o = 0.25 + ((i * 17) % 50) / 100;
        const style = { top: `${top}%`, width: w, opacity: o, "--d": `${d}s`, "--dl": `${dl}s`, ...(color ? { "--c": color } : {}) } as CSSProperties;
        return <span key={i} className="speed-line" style={style} />;
      })}
    </div>
  );
}

/** Faixa de texto em loop. O conteúdo é duplicado para fechar o ciclo sem emenda. */
export function Marquee({ children, duration = 30, reverse = false, className = "" }: { children: ReactNode; duration?: number; reverse?: boolean; className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden ${className}`}>
      <div className={`marquee-track ${reverse ? "rev" : ""}`} style={{ "--d": `${duration}s` } as CSSProperties}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
