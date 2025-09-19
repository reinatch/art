import React from "react";
import { Link as TransitionLink } from "next-transition-router";
import Image from "next/image";
import { homeProjecto } from "@/utils/types";

// iOS detection utility
const isIOS = () => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

interface ProjectSectionsProps {
  projectData: {
    project0?: {
      title: string;
      subtitle: string;
    };
    project1?: {
      items: homeProjecto[];
      items0: homeProjecto[];
      link: {
        title: string;
      };
    };
  };
}

const ProjectSections: React.FC<ProjectSectionsProps> = ({ projectData }) => {
  const { project0, project1 } = projectData;

  return (
    <>
      {/* Project Section 0 */}
      {project0 && (
        <div className="project-value h-[40vh] md:mt-[10vh] w-full text-center items-center py-8 gap-32">
          <div
            id="pro-title"
            className="flex flex-col items-center w-full gap-16 text-center"
          >
            <span className="w-9/12 text-destaque-xl">
              {project0.title}
            </span>
            <span className="text-corpo-a md:text-3xl font-works">
              {project0.subtitle}
            </span>
          </div>
        </div>
      )}

      {/* Project Section 1 */}
      {project1 && (
        <div className="project-section h-[80vh] md:mt-[10vh] w-full text-center items-center py-8 gap-32">
          <div className="h-[80vh] flex flex-col md:grid pb-[10vh] justify-between md:justify-center gap-10 md:gap-12 w-10/12 md:w-full mx-auto md:mx-0">
            <div
              id="pro-row1"
              className="grid justify-around w-full grid-cols-1 gap-10 flex-nowrap sm:grid-cols-3 md:w-full"
            >
              {project1.items &&
                project1.items.map((item: homeProjecto, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center h-full md:h-[20vh] w-auto gap-4"
                    >
                      <TransitionLink
                        href={`/projects/${item.slug}`}
                        className="flex flex-col items-center h-auto md:h-[20vh] w-auto gap-4"
                      >
                        <Image
                          width={1000}
                          height={1000}
                          src={item.thumbnail}
                          alt={item.title}
                          priority
                          className="object-contain w-full h-auto rounded-md md:w-auto md:h-full"
                          onError={(e) => {
                            const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                            console.error('Failed to load homepage project image:', {
                              projectId: item.id,
                              slug: item.slug,
                              thumbnailUrl: item.thumbnail,
                              title: item.title,
                              userAgent: navigator.userAgent,
                              isIOS: isiOS,
                              windowLocation: window.location.href
                            });
                            // Replace with fallback
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm object-contain md:w-auto md:h-full';
                            fallbackDiv.textContent = isiOS ? 'iOS Image Error' : 'Image Failed to Load';
                            e.currentTarget.parentElement?.replaceChild(fallbackDiv, e.currentTarget);
                          }}
                          unoptimized={isIOS()}
                        />
                        <div className="w-8/12 text-sm">
                          <span className="uppercase md:text-xl kerning">
                            {item.acf.page_title},{" "}
                          </span>
                          <span className="capital capitalize md:text-lg font-works kerning">
                            {item.title}, {item.acf.year}
                          </span>
                        </div>
                      </TransitionLink>
                    </div>
                  );
                })}
            </div>
            <div
              id="pro-row2"
              className="grid justify-around w-full grid-cols-1 gap-10 mx-auto flex-nowrap md:mx-0 sm:grid-cols-3 md:w-full"
            >
              {project1.items0 &&
                project1.items0.map(
                  (item: homeProjecto, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center h-full md:h-[20vh] md:w-auto gap-4"
                      >
                        <TransitionLink
                          href={`/projects/${item.slug}`}
                          className="flex flex-col items-center h-auto md:h-[20vh] w-auto gap-4"
                        >
                          <Image
                            width={1000}
                            height={1000}
                            src={item.thumbnail}
                            alt={item.title}
                            priority
                            className="object-contain w-full h-auto rounded-md md:w-auto md:h-full"
                            onError={(e) => {
                              const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                              console.error('Failed to load homepage project image:', {
                                projectId: item.id,
                                slug: item.slug,
                                thumbnailUrl: item.thumbnail,
                                title: item.title,
                                userAgent: navigator.userAgent,
                                isIOS: isiOS,
                                windowLocation: window.location.href
                              });
                              // Replace with fallback
                              const fallbackDiv = document.createElement('div');
                              fallbackDiv.className = 'w-full h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm object-contain md:w-auto md:h-full';
                              fallbackDiv.textContent = isiOS ? 'iOS Image Error' : 'Image Failed to Load';
                              e.currentTarget.parentElement?.replaceChild(fallbackDiv, e.currentTarget);
                            }}
                            unoptimized={isIOS()}
                          />
                          <div className="w-8/12 text-sm">
                            <span className="uppercase md:text-xl">
                              {item.acf.page_title},{" "}
                            </span>
                            <span className="capital capitalize md:text-lg font-works">
                              {item.title}, {item.acf.year}
                            </span>
                          </div>
                        </TransitionLink>
                      </div>
                    );
                  }
                )}
            </div>
            <div id="pro-link" className="py-10 md:py-0">
              <TransitionLink
                href={`/projects/`}
                className="text-[1.5em] md:text-corpo-a-md"
              >
                {project1.link.title}
              </TransitionLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectSections;