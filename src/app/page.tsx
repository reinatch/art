// src/app/page.tsx
import HomePageContent from "@/components/HomePage";
import { HomePageData } from "@/utils/types";
import { getLocale, setRequestLocale } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export const revalidate = 60;

// export async function generateStaticParams() {
//   const locales = ["en", "pt"];
//   return locales.map((locale) => ({ locale }));
// }

export default async function Page() {
  const locale = await getLocale();
  setRequestLocale(locale);

  const fetchData = async (): Promise<HomePageData[]> => {
    const url = `${baseUrl}/pages?acf_format=standard&per_page=100&slug=home-${locale}&_fields=id,title,slug,acf&lang=${locale}`;
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch tab data");
    }
    return response.json();
  };

  const tabData = await fetchData();
  return <>{tabData.length > 0 && <HomePageContent sections={tabData} />}</>;
}
