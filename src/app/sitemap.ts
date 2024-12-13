import type { MetadataRoute } from 'next';
import { getAllProjectoss} from "@/utils/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const locale = 'en'; // or fetch the locale dynamically if needed
  const projects = await getAllProjectoss(locale);
  const projectsSitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.modified),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes: string[] = [
    '', // home page
    '/about',
    '/residencias',
    '/production',
    '/projects',
  ];

  const staticRoutesSitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [
    ...staticRoutesSitemap,
    ...projectsSitemap,
  ];
}
