import type { MetadataRoute } from 'next';

const noIndexPaths = [
  '/ingest', // posthog's reverse proxy
  '/ingest/*', // posthog's reverse proxy
];

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 🚨 IMPORTANT: if this is not a production environment, disallow all requests
  if (
    process.env.NODE_ENV !== 'production'
  ) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '*',
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/api/', 
      },
      {
        userAgent: '*',
        disallow: '/_next/', // Next.js build output
      },
      {
        userAgent: '*',
        disallow: '/public/', // static files like css, images, fonts. This one's up to you!
      },
      ...noIndexPaths.map((path) => ({
        userAgent: '*',
        disallow: path,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
