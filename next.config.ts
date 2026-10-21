import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true ile derlenince statik site (out/) üretilir.
 * NEXT_PUBLIC_BASE_PATH: depo adı alt dizini (ör. "/seravit").
 *
 * Görseller: yayın (Pages) optimize edici çalıştıramadığı için özel yükleyici kullanılır;
 * kartlarda ürün görsellerinin 640 px kopyaları (scripts/thumbs.mjs), büyüklerde orijinaller.
 */
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [96, 240, 480],
  },
  ...(pages && {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
    trailingSlash: true,
  }),
};

export default nextConfig;
