import { useInfiniteQuery } from "@tanstack/react-query";
import querystring from 'querystring';
const perPage = 30;
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
function getUrl(path: string, query?: Record<string, unknown>) {
  const params = query ? querystring.stringify(query as Record<string, string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null>) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

async function fetchProjectos({ pageParam = 1, locale }: { pageParam: number; locale: string }) {
  const url = getUrl(`/projectos_cache?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${pageParam}&_fields=featured_media,id,title,slug,acf.page_title,acf.year,featured_image,artistas,materiais,modified`);
  console.log("Fetching:", url);

  const res = await fetch(url, { cache: "force-cache", next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const data = await res.json();
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
console.log(data, totalPages)
  return { data, nextPage: pageParam < totalPages ? pageParam + 1 : null };
}

export function useProjectos(locale: string) {
  return useInfiniteQuery({
    queryKey: ["projectos", locale],
    queryFn: ({ pageParam }) => fetchProjectos({ pageParam, locale }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
