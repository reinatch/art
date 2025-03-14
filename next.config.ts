import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass',
    silenceDeprecations: ['legacy-js-api'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.artworks.pt",
      },
    ],
  },
  experimental: {
    // staleTimes: {
    //   dynamic: 30,
    // },
    // backend.artworks.pt
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },

};

export default withNextIntl(nextConfig);
