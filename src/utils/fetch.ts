import {
  Projecto,
  Artista,
  Material,
} from "./types";
import querystring from 'querystring';
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
if (!baseUrl) {
  // Fail fast in dev; in production this will surface a clear error rather than obscure .filter crash
  console.error('NEXT_PUBLIC_WORDPRESS_API_URL is not set. API requests will fail.');
}
function getUrl(path: string, query?: Record<string, unknown>) {
  const params = query ? querystring.stringify(query as Record<string, string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null>) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}
export const fetchData = async (endpoint: string) => {
  const url = `${baseUrl}${endpoint}`;
  const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`); 
  }
  const data = await res.json();
  // defensive: if backend didn't return expected JSON, log and return null
  if (data == null) return null as unknown as null;
  return data; 
};
export async function getAllProjectoss(locale: string): Promise<Projecto[]> {
  let allProjects: Projecto[] = [];
  let page = 1;
  let totalPages = 1; 
  const perPage = 20;
  try {
    while (page <= totalPages) {
      const url = getUrl(`/projectos?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${page}&_fields=featured_media,id,title,slug,acf.page_title,acf.year,featured_image,artistas,materiais,modified`);
      const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600  } });
// console.log(url)
      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected projects response for', url, data);
        console.trace('Trace: unexpected projects response');
        break;
      }
      allProjects = [...allProjects, ...data];
      totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
      page++;
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  return allProjects;
}
export async function getAllArtists(locale: string): Promise<Artista[]> {
  let allArtists: Artista[] = [];
  let page = 1;
  let totalPages = 1; 
  const perPage = 10;
  try {
    while (page <= totalPages) {
      const url = getUrl(`/artistas?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${page}&_fields=id,title,slug,name`);
      const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600  } });
      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected artists response for', url, data);
        console.trace('Trace: unexpected artists response');
        break;
      }
      allArtists = [...allArtists, ...data];
      totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
      page++;
    }
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
  return allArtists;
}
export async function getAllMaterials(locale: string): Promise<Material[]> {
  let allMaterials: Material[] = [];
  let page = 1;
  let totalPages = 1; 
  const perPage = 10;
  try {
    while (page <= totalPages) {
      const url = getUrl(`/materiais?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${page}&_fields=id,title,slug,name`);
      const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600  } });
      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected materials response for', url, data);
        console.trace('Trace: unexpected materials response');
        break;
      }
      allMaterials = [...allMaterials, ...data];
      totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
      page++;
    }
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
  return allMaterials;
}
export const getAllYears = async (locale: string): Promise<number[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/project_years?lang=${locale}&per_page=100`, { cache: 'force-cache', next: { revalidate: 3600  } });
  if (!res.ok) {
    throw new Error('Failed to fetch years');
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error('Unexpected project_years response', data);
    console.trace('Trace: unexpected project_years response in getAllYears');
    return [];
  }
  return data.map((year: string) => parseInt(year, 10)).filter((year: number) => !isNaN(year));
};
export async function getAno(locale: string): Promise<number[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/project_years?lang=${locale}`, { cache: 'force-cache', next: { revalidate: 3600  } });
  const projectos = await response.json();
  if (!Array.isArray(projectos)) {
    console.error('Unexpected project_years response for getAno', projectos);
    console.trace('Trace: unexpected project_years response in getAno');
    return [];
  }
  const years = projectos.map((projecto: string) => parseInt(projecto, 10)).filter((y) => !isNaN(y));
  const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
  return uniqueYears as number[];
}
export async function getProjectById(id: number, locale: string): Promise<Projecto> {
  const url = getUrl(`/projectos/${id}?acf_format=standard&lang=${locale}&_fields=featured_media,id,title,slug,acf.page_title,acf.year,featured_image,artistas,materiais`);
  const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600  } });
  if (!res.ok) {
    throw new Error(`Failed to fetch project with ID ${id} from ${url}`);
  }
  const data = await res.json();
  return data;
}