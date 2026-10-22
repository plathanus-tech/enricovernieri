import Image from "next/image";
import { book } from "@/content/book";

/** Capa do livro. Enquanto a foto não for informada em src/content/book.ts, mostra um espaço reservado identificado. */
export function BookCover({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  const c = book.cover;
  return (
    <div className={`relative aspect-[13/20] w-full max-w-[18rem] ${className}`}>
      {c ? (
        <Image src={c.src} alt={c.alt} width={c.width} height={c.height} priority={priority} sizes="18rem" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-white/35 bg-ink-3 p-6 text-center">
          <span className="font-display text-xs font-bold uppercase italic tracking-[0.18em] text-mute-dark">Capa a definir</span>
          <span className="display text-5xl text-white/80">{book.title}</span>
          <span className="text-sm text-mute-dark">A foto da capa será adicionada em <code className="text-mint">src/content/book.ts</code>.</span>
        </div>
      )}
    </div>
  );
}
