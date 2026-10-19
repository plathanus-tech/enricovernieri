import { GLYPHS, GLYPH_TRANSFORM } from "@/lib/digits";

type Props = {
  value: string | number;
  className?: string;
  /** Texto lido por leitores de tela. Padrão: o próprio valor. */
  label?: string;
  /** Contorno em vez de preenchimento (usado em numerais gigantes de fundo). */
  outline?: boolean;
};

/**
 * Renderiza números com os glifos oficiais do piloto (vetor extraído do PDF "números").
 * O tamanho segue o `font-size` do elemento: 1em = altura do dígito.
 */
export function RaceNumber({ value, className = "", label, outline = false }: Props) {
  const chars = String(value).split("");
  return (
    <span
      role="img"
      aria-label={label ?? String(value)}
      className={`inline-flex items-end align-baseline leading-none ${className}`}
      style={{ height: "1em" }}
    >
      {chars.map((c, i) => {
        const g = GLYPHS[c];
        if (!g) return <span key={i} aria-hidden style={{ width: "0.28em" }} />;
        const [x, y, w, h] = g.vb;
        return (
          <svg
            key={i}
            aria-hidden
            focusable="false"
            viewBox={`${x} ${y} ${w} ${h}`}
            style={{ height: "1em", width: `${(w / h).toFixed(3)}em`, marginLeft: i ? "0.012em" : 0, overflow: "visible" }}
            fill={outline ? "none" : "currentColor"}
            stroke={outline ? "currentColor" : "none"}
            strokeWidth={outline ? 0.9 : 0}
          >
            <path transform={GLYPH_TRANSFORM} d={g.d} fillRule="evenodd" />
          </svg>
        );
      })}
    </span>
  );
}
