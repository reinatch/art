import ProjectDetailPage from "./ProjectDetailPage";
import { getLocale } from "next-intl/server";
export const revalidate = 3600;
export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  const locales = ["en", "pt"];
  return locales.map((locale) => ({ locale }));
}
export default async function Project({
  params,
}: {
  params: { slug: string };
}) {
  // console.log("Params:", params);
  const { slug } = params;
  const locale = await getLocale();
  return <ProjectDetailPage slug={slug} locale={locale} />;
}
