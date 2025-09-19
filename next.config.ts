import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})({
  // devIndicators: false,
  sassOptions: {
    implementation: "sass",
    silenceDeprecations: ["legacy-js-api"],
  },

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    formats: ["image/webp"], // Removed AVIF for better iOS compatibility
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.artworks.pt",
      },
      {
        protocol: "https",
        hostname: "*.artworks.pt", // Allow subdomains
      },
    ],
  },
  experimental: {
    // esmExternals: true, // Ensures modern JavaScript modules are used
    // allowedDevOrigins: ['https://artworks.reinatch.website'],
  },

  
});

export default withNextIntl(nextConfig);
