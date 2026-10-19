import type { NextConfig } from "next";

// Publicação estática no GitHub Pages (ver .github/workflows/pages.yml). Em desenvolvimento e em outros hosts nada muda.
const pages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = pages
  ? {
      output: "export",
      trailingSlash: true,
      basePath,
      images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
    }
  : {
      images: { formats: ["image/avif", "image/webp"] },
    };

export default nextConfig;
