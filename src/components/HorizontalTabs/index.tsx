"use client";

import React from 'react';
import Image from 'next/image';
import { AboutTabData, ImageMedia } from "@/utils/types";

// Import all section components
import SplashSection from './sections/SplashSection';
import AboutSection from './sections/AboutSection';
import MissionSection from './sections/MissionSection';
import TeamsSection from './sections/TeamsSection';
import TeamDetailSection from './sections/TeamDetailSection';
import SupportArtistsSection from './sections/SupportArtistsSection';
import JornaisSection from './sections/JornaisSection';
import ArtProductionSection from './sections/ArtProductionSection';
import ServicesSection from './sections/ServicesSection';
import NoEntulhoSection from './sections/NoEntulhoSection';

// Import custom hooks and utils
import { useTabsLogic } from './useTabsLogic';
import { useTabsAnimations } from './gsapAnimations';

// Define interfaces
interface JornaisType {
  capa: ImageMedia;
  contra: ImageMedia;
  link: {
    target: string;
    title: string;
    url: string;
  };
}

interface Card {
  title: string;
  lista: string;
  capa: ImageMedia;
  thumbnail: ImageMedia;
}

interface TabContent {
  mov?: { url: string };
  sub_content?: string;
  heading?: string;
  subHeading?: string;
  title?: string;
  video?: { url: string };
  image?: ImageMedia;
  description?: string;
  content?: string;
  jornais?: JornaisType[] | undefined;
  services?: Card[] | undefined;
  grafico?: ImageMedia;
  chefia?: {
    titulo: string;
    cargos: { name: string; cargo: string; image?: ImageMedia }[];
  };
  producao?: {
    equipas: {
      id_name: string;
      titulo: string;
      trabalhador: { nome: string; cargo: string; image: ImageMedia }[];
    }[];
    id_name: string;
    titulo: string;
  }[];
  projecto?: {
    equipas: {
      id_name: string;
      titulo: string;
      trabalhador: { nome: string; cargo: string; image: ImageMedia }[];
    }[];
    id_name: string;
    titulo: string;
  }[];
}

interface HorizontalTabsProps {
  tabData: AboutTabData[];
}

const HorizontalTabs: React.FC<HorizontalTabsProps> = ({ tabData }) => {
  // Use custom hooks for logic and animations
  const {
    scrollContainerRef,
    sectionRefs,
    videoRef,
    hoveredImage,
    isMobileClient,
    hoverVisible,
    hoverRef,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    scrollSmootherInstanceRef,
    setSelectedTab,
  } = useTabsLogic(tabData);

  // Initialize animations
  useTabsAnimations(scrollContainerRef, scrollSmootherInstanceRef, sectionRefs, setSelectedTab);

  // Render section based on tab key
  const renderSection = (key: string, tabContent: TabContent) => {
    switch (key) {
      case "splash":
        return (
          <SplashSection
            tabContent={tabContent}
            videoRef={videoRef}
          />
        );
      case "about_aw":
        return <AboutSection tabContent={tabContent} />;
      case "mission":
        return <MissionSection tabContent={tabContent} />;
      case "teams":
        return <TeamsSection tabContent={tabContent} />;
      case "team":
        return (
          <TeamDetailSection
            tabContent={tabContent}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseMove={handleMouseMove}
          />
        );
      case "support_artists":
        return <SupportArtistsSection tabContent={tabContent} />;
      case "jornais":
        return <JornaisSection tabContent={tabContent} />;
      case "art_production":
        return <ArtProductionSection tabContent={tabContent} />;
      case "servicos":
        return <ServicesSection tabContent={tabContent} sectionKey={key} />;
      case "no_entulho":
        return <NoEntulhoSection tabContent={tabContent} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div id="smooth-wrapper" className="">
        <div
          id="smooth-content"
          className="relative w-screen min-h-full pb-[20vh] md:pb-[5vh]"
          ref={scrollContainerRef}
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
        {/* Render all sections */}
        {Object.entries(tabData[0].acf).map(
          ([key, tabContent]: [string, TabContent], index) => {
            return (
              <div
                key={`${key}-${index}`}
                id={key}
                ref={(el: HTMLDivElement | null) => {
                  sectionRefs.current[index] = el;
                }}
                className={`relative md:pt-[7.5rem]
                  ${key === "no_entulho" ? "md:overflow-x-hidden h-[125vh] md:h-screen py-[10vh] md:px-32" : ""} 
                  ${key === "mission" ? "h-full md:h-screen md:px-32" : ""}
                  ${key === "teams" ? "h-full md:h-screen md:pt-[0vh] md:px-32" : ""}
                  ${key === "about_aw" ? "h-full md:px-32" : ""}
                  ${key === "support_artists" ? "md:px-32" : ""}
                  ${
                    key === "jornais"
                      ? " w-full overflow-x-scroll px-20 md:w-screen h-screen"
                      : ""
                  }
                  ${
                    key === "servicos"
                      ? "w-full overflow-x-scroll px-20 md:w-screen h-screen md:px-32"
                      : "w-screen"
                  }
                  ${
                    key === "splash"
                      ? "px-4 h-[30vh] md:px-40 md:h-screen mt-[12rem] md:mt-0 mb-8 md:pb-0"
                      : "px-4"
                  }
                  ${
                    key === "team"
                      ? "px-4 md:px-12"
                      : ""
                  }
                  ${
                    key === "art_production"
                      ? "px-4 md:px-12"
                      : ""
                  }
                  snap-start scroll-mt-[7.5rem]`}
              >
                {renderSection(key, tabContent)}
              </div>
            );
          }
        )}
      </div>
    </div>

    {/* Floating hover image - clean production version */}
    {!isMobileClient && (
      <div
        ref={hoverRef}
        className={`fixed pointer-events-none z-50 transform origin-top-left ${hoverVisible ? '' : ''}`}
        style={{
          left: 0,
          top: 0,
          visibility: hoveredImage ? 'visible' : 'hidden',
        }}
      >
        {hoveredImage && (
          <Image
            src={hoveredImage.url}
            alt={hoveredImage.alt ?? hoveredImage.url}
            width={170}
            height={170}
            className="object-cover rounded-md"
            unoptimized
          />
        )}
      </div>
    )}
  </>
  );
};

export default HorizontalTabs;