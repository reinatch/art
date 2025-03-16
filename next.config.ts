import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})({
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
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"], // WebP & AVIF for better performance
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.reinatch.website",
      },
    ],
  },
  experimental: {
    esmExternals: true, // Ensures modern JavaScript modules are used
  },

  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },
});

export default withNextIntl(nextConfig);
