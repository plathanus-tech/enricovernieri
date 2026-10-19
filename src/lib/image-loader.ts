/**
 * Carregador de imagens usado só na publicação estática (GitHub Pages): não há servidor de otimização,
 * então as imagens são servidas como estão, com o prefixo da publicação.
 */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
}
