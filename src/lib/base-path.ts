/**
 * Prefixo de publicação (ex.: "/enricovernieri" no GitHub Pages). Vazio no desenvolvimento local e em hospedagem na raiz.
 * Links do `next/link` e o `next/image` já recebem o prefixo sozinhos; use `withBase` só em `<a href>` e arquivos de /public.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBase = (path: string) => (path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path);
