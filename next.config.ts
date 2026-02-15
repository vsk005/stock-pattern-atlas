import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/stock-pattern-atlas',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
