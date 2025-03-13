import { useInfiniteQuery } from "@tanstack/react-query";
import querystring from "querystring";

const perPage = 30;
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

function getUrl(path: string, query?: Record<string, unknown>) {
  const params = query
    ? querystring.stringify(query as Record<string, string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null>)
    : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

async function fetchProjectos({ pageParam = 1, locale }: { pageParam: number; locale: string }) {
  const url = getUrl("/projectos_cache", {
    acf_format: "standard",
    lang: locale,
    per_page: perPage,
    page: pageParam,
    _fields: "featured_media,id,title,slug,acf.page_title,acf.year,featured_image,modified",
  });

  console.log("Fetching:", url);
  const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const json = await res.json();
  return {
    data: json.data, 
    nextPage: pageParam < json.total_pages ? pageParam + 1 : null, 
  };
}

export function useProjectos(locale: string) {
  return useInfiniteQuery({
    queryKey: ["projectos", locale],
    queryFn: ({ pageParam }) => fetchProjectos({ pageParam, locale }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
