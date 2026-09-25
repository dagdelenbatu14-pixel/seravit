import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true ile derlenince statik site (out/) üretilir.
 * NEXT_PUBLIC_BASE_PATH: depo adı alt dizini (ör. "/seravit").
 *
 * Görseller: public/ altındaki dokular zaten boyutlandırılmış webp; yayın (Pages)
 * görsel optimize edici çalıştıramadığı için her ortamda doğrudan sunulur.
 */
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  ...(pages && {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
    trailingSlash: true,
  }),
};

export default nextConfig;
