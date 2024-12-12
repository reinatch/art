import ProjectList from "./ProjectList";
import { getAllProjectoss, getAllMaterials, getAno, getAllArtists } from "@/utils/fetch";
import { Projecto, Material, Artista } from "@/utils/types";
import { getLocale, setRequestLocale } from "next-intl/server";

export const revalidate = 60;
export const dynamic = "force-static";
export const dynamicParams = true;
// export async function generateStaticParams() {
//   const locales = ['en', 'pt']; 
//   return locales.map(locale => ({ locale }));
// }

export default async function Page() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const projectos: Projecto[] = await getAllProjectoss(locale);
  const materials: Material[] = await getAllMaterials(locale);
  const years: number[] = await getAno(locale);
  const artists:Artista[] = await getAllArtists(locale);
// console.log(projectos)
  return (
    <>
      <ProjectList projectos={projectos} materials={materials} years={years} artists={artists}/>
    </>
  );
}

