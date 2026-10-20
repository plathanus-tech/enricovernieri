/**
 * Gera versões leves (WebP, em vários tamanhos) das imagens de /public para a publicação estática no GitHub Pages,
 * onde não há servidor de otimização do Next. Saída: public/_opt/<caminho>-<largura>.webp (pasta ignorada pelo git).
 * O carregador (src/lib/image-loader.ts) escolhe o tamanho mais próximo do que a tela pede.
 * Uso: node scripts/optimize-images.mjs   (o workflow do GitHub Pages roda antes do build)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const OUT = path.join(PUBLIC, "_opt");
// precisa ser igual à lista do carregador
const WIDTHS = [256, 384, 640, 828, 1080, 1280, 1600];
const RASTER = /\.(png|jpe?g)$/i;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return p === OUT || e.name === "docs" ? [] : walk(p);
    return RASTER.test(e.name) ? [p] : [];
  });

fs.rmSync(OUT, { recursive: true, force: true });
const files = walk(PUBLIC);
let before = 0;
let after = 0;
let count = 0;

for (const file of files) {
  const rel = path.relative(PUBLIC, file).split(path.sep).join("/");
  const base = rel.replace(RASTER, "");
  before += fs.statSync(file).size;
  const src = sharp(file, { failOn: "none" });
  const meta = await src.metadata();
  for (const w of WIDTHS) {
    const target = path.join(OUT, `${base}-${w}.webp`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    // nunca aumenta a imagem: tamanhos maiores que o original saem com a largura original
    const buf = await sharp(file, { failOn: "none" })
      .rotate()
      .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true })
      .webp({ quality: 76, effort: 4 })
      .toBuffer();
    fs.writeFileSync(target, buf);
    if (w === WIDTHS[WIDTHS.length - 1]) after += buf.length;
    count++;
  }
}
console.log(`Imagens: ${files.length} originais (${(before / 1048576).toFixed(1)} MB) → ${count} versões WebP; maior tamanho de cada imagem somado: ${(after / 1048576).toFixed(1)} MB`);
