import ProjectDetailPage from "./ProjectDetailPage";
import { fetchData } from "@/utils/fetch";
import { Projecto } from "@/utils/types";
import { getLocale } from "next-intl/server";

export const revalidate = 60;

export async function generateStaticParams() {
  const locales = ["en", "pt"];
  const allProjects = await Promise.all(
    locales.map((locale) =>
      fetchData(
        `/projectos?acf_format=standard&_fields=id,title,slug&per_page=100&lang=${locale}`
      )
    )
  );
  return allProjects.flat().map((project) => ({
    locale: project.lang,
    slug: project.slug,
  }));
}

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Project({ params }: PageProps) {
  const { slug } = params;
  const locale = getLocale();
  const fetchProjectData = async () => {
    const allProjects = await fetchData(
      `/projectos?acf_format=standard&_fields=id,title,slug&per_page=100&lang=${locale}`
    );

    const project = await fetchData(
      `/projectos?acf_format=standard&_fields=id,title,slug,acf&slug=${slug}&lang=${locale}`
    );

    return { allProjects, project };
  };

  const { allProjects, project } = await fetchProjectData();

  const currentIndex = allProjects.findIndex((p: Projecto) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <ProjectDetailPage
      project={project[0]}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
