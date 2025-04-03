import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import querystring from 'querystring';
import { Projecto } from "./types";
import { fetchData } from '@/utils/fetch';
const perPage = 1000;
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
function getUrl(path: string, query?: Record<string, unknown>) {
  const params = query ? querystring.stringify(query as Record<string, string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null>) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}
interface props {
  slug: string;
  projects : Projecto[];
  totalPages: number;
  maxProject:number;
  }
async function fetchProjectos({ pageParam = 1, locale }: { pageParam: number; locale: string }) {
  const url = getUrl(`/projectos_cache?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${pageParam}`);
  // console.log("Fetching:", url);
  const res = await fetch(url, { cache: "force-cache", next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  const data:props = await res.json();
// console.log(data, data.totalPages)
  return data;
}
export function useProjectos(locale: string) {
  return useInfiniteQuery({
    queryKey: ["projectos", locale],
    queryFn: ({ pageParam }) => fetchProjectos({ pageParam, locale }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage.projects) {
        return undefined
      }
      return lastPageParam + 1
    },
  });
}
const fetchProjectDetails = async (slug: string, locale: string) => {
  const url = `${baseUrl}/projectos_cache/${slug}?lang=${locale}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch project with slug "${slug}"`);
  }

  const data = await response.json();
  return data;
};
export const useProjectDetails = (slug: string, locale: string) => {
  return useQuery<Projecto>({
    queryKey: ['project', slug, locale],
    queryFn: () => fetchProjectDetails(slug, locale),
    staleTime: 1000 * 60 * 60, 
  });
};