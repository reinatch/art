"use client";
import React from "react";
import { useHomeLogic } from "./useHomeLogic";
import { useHomeAnimations } from "./gsapAnimations";
import HomeSplashSection from "./sections/HomeSplashSection";
import AboutSections from "./sections/AboutSections";
import ProductionSections from "./sections/ProductionSections";
import ProjectSections from "./sections/ProjectSections";
import ResidencySection from "./sections/ResidencySection";
import MapSection from "./sections/MapSection";

const HomePageContent: React.FC = () => {
  const {
    sections,
    containerRef,
    sectionRefs,
    windowSize,
    videoRef,
  } = useHomeLogic();

  // Initialize GSAP animations
  useHomeAnimations(sections, containerRef, sectionRefs, windowSize);

  return (
    <div id="smooth-wrapper">
      <div
        ref={containerRef}
        id="smooth-content"
        className="relative grid w-screen min-h-full"
      >
        {sections &&
          sections[0]?.acf &&
          Object.entries(sections[0].acf).map(([key, value], index) => {
            return (
              <div
                key={key}
                ref={(el: HTMLDivElement | null) => {
                  sectionRefs.current[index + 1] = el;
                }}
                id={key}
                className={`
                ${key === "home_splash" ? "md:px-10 px-0" : ""} 
                ${
                  key === "about0" || key === "about1" || key === "production0"
                    ? "h-full md:h-screen "
                    : ""
                } 
                ${key === "production1" ? "h-auto md:h-screen" : ""}   
                ${key === "production0" ? "my-20 md:my-0" : ""}   
                ${key === "project0" ? "h-[40vh]" : ""}   
                ${
                  key === "project1"
                    ? "h-[270vh] pb-[10vh] md:h-screen md:pb-0"
                    : ""
                }   
                ${
                  key != "project0" &&
                  key != "about0" &&
                  key != "project1" &&
                  key != "about1" &&
                  key != "production0"
                    ? "h-screen"
                    : ""
                }   
                panel relative flex flex-col items-center w-screen gap-8 sm:items-start rounded-3xl snap-start`}
              >
                {/* Home Splash Section */}
                {key === "home_splash" && (
                  <HomeSplashSection value={value} videoRef={videoRef} />
                )}

                {/* About Sections */}
                {(key === "about0" || key === "about1") && (
                  <AboutSections 
                    aboutData={{ 
                      [key]: value 
                    }} 
                  />
                )}

                {/* Production Sections */}
                {(key === "production0" || key === "production1") && (
                  <ProductionSections 
                    productionData={{ 
                      [key]: value 
                    }} 
                  />
                )}

                {/* Project Sections */}
                {(key === "project0" || key === "project1") && (
                  <ProjectSections 
                    projectData={{ 
                      [key]: value 
                    }} 
                  />
                )}

                {/* Residency Section */}
                {key === "residency0" && (
                  <ResidencySection residencyData={value} />
                )}
              </div>
            );
          })}

        {/* Map Section */}
        <MapSection />
      </div>
    </div>
  );
};

export default HomePageContent;