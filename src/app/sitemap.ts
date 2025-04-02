import type { MetadataRoute } from 'next';
import { getAllProjectoss } from "@/utils/fetch";

// import { Projecto } from '@/utils/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const locale = 'en'; 

  const projects = await getAllProjectoss(locale);
  const projectsSitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.modified ? new Date(project.modified).toISOString() : new Date().toISOString(),
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
