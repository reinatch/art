import HorizontalTabs from "@/components/HorizontalTabs";
import { AboutTabData } from "@/utils/types";
import { getLocale } from "next-intl/server";
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
export const revalidate = 3600;
export async function generateStaticParams() {
  const locales = ["en", "pt"];
  return locales.map((locale) => ({ locale }));
}
export default async function AboutPage() {
  const locale = await getLocale();
  const fetchData = async (): Promise<AboutTabData[]> => {
    const url = `${baseUrl}/pages?acf_format=standard&per_page=100&slug=production-${locale}&_fields=id,title,slug,acf&lang=${locale}`;
    const response = await fetch(url);
    console.log(url, response);
    if (!response.ok) {
      throw new Error("Failed to fetch tab data");
    }
    return response.json();
  };
  const tabData = await fetchData();
  return (
    <div>{tabData.length > 0 && <HorizontalTabs tabData={tabData} />}</div>
  );
}
