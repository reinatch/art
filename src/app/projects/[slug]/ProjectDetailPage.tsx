// components/ProjectDetailPage.tsx
"use client"
import React, { useEffect } from 'react';
// import Image from 'next/image';
import { Projecto } from '@/utils/types'; // Adjust the import path as needed
import HorizontalSnapSlider from "./HorizontalSnapSlider";
// import { ThumbnailsProvider } from "@/lib/useThumbnailsContext"; // New import
import { useThumbnailsContext } from '@/lib/useThumbnailsContext'; // Import the context



interface ProjectDetailPageProps {
  project: Projecto;
  prevProject: Projecto | null;
  nextProject: Projecto | null;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, prevProject, nextProject }) => {
    // console.log(project)
      const { setPrevProject, setNextProject } = useThumbnailsContext(); // Destructure context setters

  
      useEffect(() => {
        setPrevProject(prevProject);
        setNextProject(nextProject);
      }, [prevProject, nextProject, setPrevProject, setNextProject]);
  return (
        
      <div id='projectDetail' className=" h-screen overflow-hidden !pt-10">
       
       <div className=' gap-6 h-full '>

                  <div className='flex flex-col gap-10 md:gap-10 items-center w-screen pb-4 md:pb-10'>

                      <div className='flex flex-col h-[4vh] items-end md:flex-row leading-tight text-center text-corpo-a md:text-2xl'>
                          <p className="w-full text-center md:w-auto ">{project.acf.page_title},&nbsp;</p>
                          <div className='flex flex-col px-10 md:px-0'>

                          <p className="font-works uppercase w-full text-center md:w-auto ">{project.title.rendered},&nbsp;{project.acf.year}.</p>
                          {/* <p className="w-full text-center md:w-auto ">{project.acf.year}.</p> */}
                          </div>
                      </div>
                      <div className="text-rodape text-center font-mono leading-tight flex flex-col w-9/12 md:w-auto ">

                      <span className="">{project.acf.location}</span>
                      <span className="">{project.acf.right_field}</span>
                      </div>

                  </div>
        
              <HorizontalSnapSlider galeria={project.acf.galeria} video={project.acf.video}/>

       </div>
      </div>
      
    );
  };
  

export default ProjectDetailPage;
