import HomePageContent from "@/components/HomePage";
import { getLocale, setRequestLocale } from "next-intl/server";
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const locales = ["en", "pt"];
  return locales.map((locale) => ({ locale }));
}
export default async function Page() {
  const locale = await getLocale();
  setRequestLocale(locale);
  return (
    <>
      <HomePageContent />{" "}
    </>
  );
}
