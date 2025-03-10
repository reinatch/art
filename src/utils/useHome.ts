import { useQuery } from "@tanstack/react-query";
import querystring from 'querystring';
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
function getUrl(path: string, query?: Record<string, unknown>) {
  const params = query ? querystring.stringify(query as Record<string, string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null>) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

async function fetchHome({ locale }: {locale: string }) {
  const url = getUrl(`/home_cache?acf_format=standard&per_page=1&slug=home-${locale}&_fields=id,title,slug,acf&lang=${locale}&locale=${locale}`);
  console.log("Fetching:", url);

  const res = await fetch(url, { cache: "force-cache", next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const data = await res.json();
console.log(data)
return data;
}

export function useHome(locale: string) {
return useQuery({
  queryKey: ["home", locale],
  queryFn: () => fetchHome({ locale}),
});
}
