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

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, locale }) => {
  const { data: allProjects, isLoading: isLoadingProjects } = useProjectos(locale);
  const { data: project, isLoading: isLoadingProject } = useProjectDetails(slug, locale);
  const { setPrevProject, setNextProject } = useThumbnailsContext();

  useEffect(() => {
    if (!allProjects || !project) return;
    
    const currentIndex = allProjects.pages.flat().findIndex((p) => p.slug === slug);
    const prevProject: Projecto | null = currentIndex > 0 ? allProjects.pages.flat()[currentIndex - 1] as unknown as Projecto : null;
    const nextProject: Projecto | null = currentIndex < allProjects.pages.flat().length - 1 ? allProjects.pages.flat()[currentIndex + 1] as unknown as Projecto : null;
    
    setPrevProject(prevProject);
    setNextProject(nextProject);
  }, [allProjects, project, slug, setPrevProject, setNextProject]);

  if (isLoadingProjects || isLoadingProject) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div id="projectDetail" className="h-screen overflow-hidden !pt-10">
      <div className="gap-6 h-full">
        <div className="flex flex-col gap-10 md:gap-10 items-center w-screen pb-4 md:pb-10">
          <div className="flex flex-col h-[4vh] items-end md:flex-row leading-tight text-center text-corpo-a md:text-2xl">
            <p className="w-full text-center md:w-auto ">
              {project.acf.page_title},&nbsp;
            </p>
            <div className="flex flex-col px-10 md:px-0">
              <p className="font-works uppercase w-full text-center md:w-auto ">
                {project.title.rendered},&nbsp;{project.acf.year}.
              </p>
            </div>
          </div>
          <div className="text-rodape text-center font-mono leading-tight flex flex-col w-9/12 md:w-auto">
            <span className="">{project.acf.location}</span>
            <span className="">{project.acf.right_field}</span>
          </div>
        </div>

        <HorizontalSnapSlider galeria={project.acf.galeria} video={project.acf.video} />
      </div>
    </div>
  );
};

export default ProjectDetailPage;




// // components/ProjectDetailPage.tsx
// "use client";
// import React, { useEffect } from "react";
// import { Projecto } from "@/utils/types";
// import HorizontalSnapSlider from "./HorizontalSnapSlider";
// import { useThumbnailsContext } from "@/lib/useThumbnailsContext";

// interface ProjectDetailPageProps {
//   project: Projecto;
//   prevProject: Projecto | null;
//   nextProject: Projecto | null;
// }

// const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
//   project,
//   prevProject,
//   nextProject,
// }) => {
//   const { setPrevProject, setNextProject } = useThumbnailsContext();

//   useEffect(() => {
//     setPrevProject(prevProject);
//     setNextProject(nextProject);
//   }, [prevProject, nextProject, setPrevProject, setNextProject]);
//   return (
//     <div id="projectDetail" className=" h-screen overflow-hidden !pt-10">
//       <div className=" gap-6 h-full ">
//         <div className="flex flex-col gap-10 md:gap-10 items-center w-screen pb-4 md:pb-10">
//           <div className="flex flex-col h-[4vh] items-end md:flex-row leading-tight text-center text-corpo-a md:text-2xl">
//             <p className="w-full text-center md:w-auto ">
//               {project.acf.page_title},&nbsp;
//             </p>
//             <div className="flex flex-col px-10 md:px-0">
//               <p className="font-works uppercase w-full text-center md:w-auto ">
//                 {project.title.rendered},&nbsp;{project.acf.year}.
//               </p>
//             </div>
//           </div>
//           <div className="text-rodape text-center font-mono leading-tight flex flex-col w-9/12 md:w-auto ">
//             <span className="">{project.acf.location}</span>
//             <span className="">{project.acf.right_field}</span>
//           </div>
//         </div>

//         <HorizontalSnapSlider
//           galeria={project.acf.galeria}
//           video={project.acf.video}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProjectDetailPage;
