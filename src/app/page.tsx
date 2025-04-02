import HomePageContent from "@/components/HomePage";
import { getLocale, setRequestLocale } from "next-intl/server";
export const revalidate = 3600;
export const dynamic = "force-static";
export default async function Page() {
  const locale = await getLocale();
  setRequestLocale(locale);
  return (
    <>
      <HomePageContent />{" "}
    </>
  );
}
