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
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"], // WebP & AVIF for better performance
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.artworks.pt",
      },
    ],
  },
  experimental: {
    esmExternals: true, // Ensures modern JavaScript modules are used
  },

  // webpack: (config, { dev, isServer }) => {
  //   // Only apply optimizations for production builds on client side
  //   if (!dev && !isServer) {
  //     // Optimize chunk splitting
  //     config.optimization = {
  //       ...config.optimization,
  //       runtimeChunk: 'single',
  //       splitChunks: {
  //         chunks: 'all',
  //         maxInitialRequests: Infinity,
  //         minSize: 20000,
  //         cacheGroups: {
  //           vendor: {
  //             test: /[\\/]node_modules[\\/]/,
  //             name(module: { context: { match: (arg0: RegExp) => RegExpMatchArray | null; }; }) {
  //               // Get the package name from the path
  //               const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
  //               const packageName = match ? match[1] : 'unknown';
  //               // Return a readable name for better debugging
  //               return `npm.${packageName.replace('@', '')}`;
  //             },
  //             priority: 10,
  //           },
  //           commons: {
  //             name: 'commons',
  //             minChunks: 2,
  //             priority: 0,
  //           },
  //         },
  //       },
  //       minimize: true,
  //       minimizer: config.optimization.minimizer,
  //     };
  //   }

  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     'webpack-internal': false,
  //   };
    
  //   return config;
  // },
});

export default withNextIntl(nextConfig);
