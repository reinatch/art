import { useQuery } from "@tanstack/react-query";
import querystring from 'querystring';
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
function getUrl(path: string, query?: Record<string, unknown>) {
  const params = query ? querystring.stringify(query as Record<string, string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null>) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}



async function fetchMateriais(locale: string) {
  const url = getUrl(`/materiais?acf_format=standard&lang=${locale}&per_page=100&_fields=id,title,slug,name`);
  const res = await fetch(url, { cache: "force-cache", next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return res.json();
}

async function fetchArtistas(locale: string) {
  const url = getUrl(`/artistas?acf_format=standard&lang=${locale}&per_page=100&_fields=id,title,slug,name`);
  const res = await fetch(url, { cache: "force-cache", next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return res.json();
}

async function fetchAno(locale: string) {
  const url = getUrl(`/project_years?lang=${locale}&per_page=100`);
  const res = await fetch(url, { cache: "force-cache", next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const data = await res.json();
  return data.map((year: string) => parseInt(year, 10)).filter((year: number) => !isNaN(year));
}



export function useProjectosData(locale: string) {
  const materiaisQuery = useQuery({
    queryKey: ["materiais", locale],
    queryFn: () => fetchMateriais(locale),
  });
  const artistasQuery = useQuery({
    queryKey: ["artistas", locale],
    queryFn: () => fetchArtistas(locale),
  });
  const anoQuery = useQuery({
    queryKey: ["ano", locale],
    queryFn: () => fetchAno(locale),
  });

  return {
    mat: materiaisQuery.data,
    art: artistasQuery.data,
    ano: anoQuery.data,
    isLoading: materiaisQuery.isLoading || artistasQuery.isLoading || anoQuery.isLoading,
    error: materiaisQuery.error || artistasQuery.error || anoQuery.error,
  };
}
