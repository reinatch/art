import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})({
  devIndicators: false,
  sassOptions: {
    implementation: "sass",
    silenceDeprecations: ["legacy-js-api"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"], // WebP & AVIF for better performance
    remotePatterns: [
      {
        // protocol: "http",
        // hostname: "localhost",
        protocol: "https",
        hostname: "backend.artworks.pt",
      },
    ],
  },
  experimental: {
    // esmExternals: true, // Ensures modern JavaScript modules are used
    // allowedDevOrigins: ['https://artworks.reinatch.website'],
  },

  
});

export default withNextIntl(nextConfig);
