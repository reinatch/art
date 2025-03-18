// import { Suspense } from "react";
import ProjectList from "./ProjectList";
import { getLocale, setRequestLocale } from "next-intl/server";
// import Loading from "@/components/Loading";
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { getQueryClient } from '@/app/get-query-client'
import {projectosOptions} from '@/utils/useProjectos'
export const revalidate = 3600;
export const dynamic = 'force-dynamic';
export async function generateStaticParams() {
  const locales = ['en', 'pt']; 
  return locales.map(locale => ({ locale }));
}

export default async function Page() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery({
    queryKey: projectosOptions.queryKey,
    queryFn: projectosOptions.queryFn
  })

  return (
    // <Suspense fallback={<Loading />}>
    <HydrationBoundary state={dehydrate(queryClient)}>

      <ProjectList />
      </HydrationBoundary>
  );
}

