/**
 * Carregador de imagens usado só na publicação estática (GitHub Pages): não há servidor de otimização do Next,
 * então scripts/optimize-images.mjs gera antes do build versões WebP em vários tamanhos (public/_opt) e este carregador
 * escolhe a menor que ainda cobre a largura pedida. SVG e imagens de outros endereços passam direto.
 */
const WIDTHS = [256, 384, 640, 828, 1080, 1280, 1600]; // igual à lista do script
const RASTER = /\.(png|jpe?g)$/i;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:") || !RASTER.test(src)) return `${BASE}${src}`;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${BASE}/_opt${src.replace(RASTER, "")}-${w}.webp`;
}
