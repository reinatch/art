import ProjectDetailPage from "./ProjectDetailPage";
import { getLocale } from "next-intl/server";
export const revalidate = 3600;
export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  const locales = ["en", "pt"];
  return locales.map((locale) => ({ locale }));
}
export default async function Project({ params }: { params?: Promise<{ slug: string | string[] }> }) {
  // Next's PageProps expects params as a Promise — await it safely (await works with non-promises at runtime too)
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || "";
  const locale = await getLocale();
  return <ProjectDetailPage slug={slug} locale={locale} />;
}
