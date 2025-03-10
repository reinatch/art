import { Suspense } from "react";
import ProjectList from "./ProjectList";
import { getLocale, setRequestLocale } from "next-intl/server";
import Loading from "@/components/Loading";

export const revalidate = 3600;
export const dynamic = 'force-dynamic';
export async function generateStaticParams() {
  const locales = ['en', 'pt']; 
  return locales.map(locale => ({ locale }));
}

export default async function Page() {
  const locale = await getLocale();
  setRequestLocale(locale);
  return (
    <Suspense fallback={<Loading />}>
      <ProjectList />
    </Suspense>
  );
}

