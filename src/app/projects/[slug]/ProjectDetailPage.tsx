"use client";
import React, { useEffect } from "react";
import { useProjectos, useProjectDetails } from "@/utils/useProjectos";
import HorizontalSnapSlider from "./HorizontalSnapSlider";
import { useThumbnailsContext } from "@/lib/useThumbnailsContext";
import { Projecto } from "@/utils/types";
interface ProjectDetailPageProps {
  slug: string;
  locale: string;
}
const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  slug,
  locale,
}) => {
  const { data: allProjects, isLoading: isLoadingProjects } = useProjectos(
    locale
  );
  const { data: project, isLoading: isLoadingProject } = useProjectDetails(
    slug,
    locale
  );
  const { setPrevProject, setNextProject } = useThumbnailsContext();
  useEffect(() => {
    if (!allProjects || !project) return;
    const allProjectsFlattened = allProjects.pages.reduce((acc, page) => {
      return page && page.projects ? [...acc, ...page.projects] : acc;
    }, [] as Projecto[]);
    const currentIndex = allProjectsFlattened.findIndex((p) => p.slug === slug);
    if (currentIndex !== -1) {
      const prevProject =
        currentIndex > 0 ? allProjectsFlattened[currentIndex - 1] : null;
      const nextProject =
        currentIndex < allProjectsFlattened.length - 1
          ? allProjectsFlattened[currentIndex + 1]
          : null;
      setPrevProject(prevProject);
      setNextProject(nextProject);
      // console.log("Navigation projects set:", {
      //   prev: prevProject?.slug,
      //   next: nextProject?.slug,
      // });
    } else {
      console.warn("Current project not found in projects list");
      setPrevProject(null);
      setNextProject(null);
    }
  }, [allProjects, project, slug, setPrevProject, setNextProject]);
  useEffect(() => {
    // console.log(project);
  }, [project]);
  if (isLoadingProjects || isLoadingProject) {
    return <div>Loading...</div>;
  }
  if (!project) {
    return <div>Project not found</div>;
  }
  // console.log(project);
  return (
    project && (
      <div id="projectDetail" className="h-screen overflow-hidden !pt-10">
        <div className="gap-6 h-full">
          <div className="flex flex-col gap-10 md:gap-10 items-center w-screen pb-4 md:pb-10">
            <div className="flex flex-col h-[4vh] items-end md:flex-row leading-tight text-center text-corpo-a md:text-2xl">
              <p className="w-full text-center md:w-auto ">
                {project.acf?.page_title},&nbsp;
              </p>
              <div className="flex flex-col px-10 md:px-0">
                <p className="font-works uppercase w-full text-center md:w-auto ">
                  {project.title?.rendered},&nbsp;{project.acf.year}.
                </p>
              </div>
            </div>
            <div className="text-rodape text-center font-mono leading-tight flex flex-col w-9/12 md:w-auto">
              <span className="">{project.acf.location}</span>
              <span className="">{project.acf.right_field}</span>
            </div>
          </div>
          <HorizontalSnapSlider
            project={project}
          />
        </div>
      </div>
    )
  );
};
export default ProjectDetailPage;
