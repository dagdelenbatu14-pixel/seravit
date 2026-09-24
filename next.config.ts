import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true ile derlenince statik site (out/) üretilir.
 * NEXT_PUBLIC_BASE_PATH: depo adı alt dizini (ör. "/seravit").
 */
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = pages
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
