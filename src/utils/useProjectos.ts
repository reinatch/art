import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import querystring from 'querystring';
import { Projecto } from "./types";
import { fetchData } from '@/utils/fetch';

const perPage = 30;
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
  // &_fields=featured_media,id,title,slug,acf.page_title,acf.year,featured_image,artistas,materiais,modified
  console.log("Fetching:", url);

  const res = await fetch(url, { cache: "force-cache", next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const data:props = await res.json();
  // const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
console.log(data, data.totalPages)
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
      // console.log(lastPage, allPages, lastPageParam, "GGGGGGGGGGGGGGG")
      return lastPageParam + 1
    },
  });
}
import { queryOptions } from '@tanstack/react-query'

export const projectosOptions = queryOptions({
  queryKey: ['projectos'],
  queryFn: async () => {
    const response = await fetch('https://backend.reinatch.website/wp-json/wp/v2/projectos_cache?acf_format=standard&lang=en&per_page=20&page=1&locale=en')

    return response.json()
  },
})


const fetchProjectDetails = async (slug: string, locale: string) => {
  return await fetchData(
    `/projectos?acf_format=standard&_fields=id,title,slug,acf&slug=${slug}&lang=${locale}`
  );
};



export const useProjectDetails = (slug: string, locale: string) => {
  return useQuery<Projecto>({
    queryKey: ['project', slug, locale],
    queryFn: () => fetchProjectDetails(slug, locale),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};