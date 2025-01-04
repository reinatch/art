// fetch.ts

import {
  Projecto,
  Artista,
  Material,
} from "./types";
import querystring from 'querystring';

// WordPress Config
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

function getUrl(path: string, query?: Record<string, unknown>) {
  const params = query ? querystring.stringify(query as Record<string, string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null>) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

// Fetching data utility function
export const fetchData = async (endpoint: string) => {
  const url = `${baseUrl}${endpoint}`;
  const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`); // Use the constructed URL in the error message for better debugging
  }

  const data = await res.json();
  return data; // Return the data directly
};

// Fetch all 'projectos'
export async function getAllProjectoss(locale: string): Promise<Projecto[]> {
  let allProjects: Projecto[] = [];
  let page = 1;
  let totalPages = 1; // Initialize total pages with a default value
  const perPage = 10;

  try {
    while (page <= totalPages) {
      const url = getUrl(`/projectos?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${page}&_fields=featured_media,id,title,slug,acf.page_title,acf.year,featured_image,artistas,materiais,modified`);
      const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 60  } });
console.log(url)
      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }

      const data = await res.json();
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

// Fetch all 'artists'
export async function getAllArtists(locale: string): Promise<Artista[]> {
  let allArtists: Artista[] = [];
  let page = 1;
  let totalPages = 1; // Initialize total pages with a default value
  const perPage = 10;

  try {
    while (page <= totalPages) {
      const url = getUrl(`/artistas?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${page}&_fields=id,title,slug,name`);
      const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 60  } });

      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }

      const data = await res.json();
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

// Fetch all 'materials'
export async function getAllMaterials(locale: string): Promise<Material[]> {
  let allMaterials: Material[] = [];
  let page = 1;
  let totalPages = 1; // Initialize total pages with a default value
  const perPage = 10;

  try {
    while (page <= totalPages) {
      const url = getUrl(`/materiais?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${page}&_fields=id,title,slug,name`);
      const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 60  } });

      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }

      const data = await res.json();
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

// Fetch all 'years'
export const getAllYears = async (locale: string): Promise<number[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/project_years?lang=${locale}&per_page=100`, { cache: 'force-cache', next: { revalidate: 60  } });

  if (!res.ok) {
    throw new Error('Failed to fetch years');
  }

  const data = await res.json();
  return data.map((year: string) => parseInt(year, 10)).filter((year: number) => !isNaN(year));
};

// Fetch 'ano'
export async function getAno(locale: string): Promise<number[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/project_years?lang=${locale}`, { cache: 'force-cache', next: { revalidate: 60  } });
  const projectos: string[] = await response.json();

  // Extract the years from the projectos
  const years = projectos.map((projecto: string) => {
    return parseInt(projecto, 10); // Assuming the year is stored in a meta field
  });

  // Filter out invalid years and get unique years
  const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a); // Sort in descending order

  return uniqueYears as number[];
}

// Fetch project by ID
export async function getProjectById(id: number, locale: string): Promise<Projecto> {
  const url = getUrl(`/projectos/${id}?acf_format=standard&lang=${locale}&_fields=featured_media,id,title,slug,acf.page_title,acf.year,featured_image,artistas,materiais`);
  const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 60  } });

  if (!res.ok) {
    throw new Error(`Failed to fetch project with ID ${id} from ${url}`);
  }

  const data = await res.json();
  return data;
}