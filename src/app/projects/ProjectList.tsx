"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { Projecto, Material, Artista } from "@/utils/types"; 
import React from "react";
import Loading from "@/components/Loading";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useToggleContact } from "@/lib/useToggleContact";
import ViewOptions from "./ViewOptions";
import FilterOptions from "./FilterOptions";
import ListView from "./ListView";
import GalleryView from "./GalleryView";
import { shimmer, toBase64 } from "../../utils/imageUtils";
import { useProjectos } from "@/utils/useProjectos";  
import { useProjectosData } from "@/utils/useProjectosData";  



const ProjectList: React.FC = ({

}) => {
  const locale = useLocale();
  const t = useTranslations("ProjectList");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProjectos(locale); 
  const { mat, art, ano} = useProjectosData(locale);

  
  const projectos = data?.pages.flatMap(page => page.data) || []; // Flatten the pages

// console.log(mat, art, ano)


  const [viewMode, setViewMode] = useState("gallery"); 
  const [selectedFilter, setSelectedFilter] = useState<string | null>("ano"); 
  const [materials, setMaterials] = useState<Material[]>(mat); 
  const [years, setYears] = useState<number[]>(ano);
  const [artists, setArtists] = useState<Artista[]>(art);
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const containerRef = useRef<HTMLUListElement>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);





  gsap.registerPlugin(useGSAP);
  const { contextSafe } = useGSAP({ scope: containerRef });
  const { isContactOpen, closeContact } = useToggleContact();

  useEffect(() => {
    const sitempa = document.querySelector("#sitemap");
    const handleClickOutside = (event: MouseEvent) => {
      if (sitempa && !sitempa.contains(event.target as Node)) {
        closeContact(); 
      }
    };

    const handleScroll = () => {
      if (isContactOpen) {
        closeContact(); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeContact, isContactOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 2) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  // Intersection Observer for Infinite Scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProjectRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const getRandomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const memoizedPositions = useRef<{
    [key: number]: { x: number; y: number; z: number };
  }>({});

  const handleMouseEnter = (id: number) => {
    if (!memoizedPositions.current[id]) {
      const randomX = getRandomInRange(0, 20);
      const randomY = getRandomInRange(10, 50); 
      const randomZ = 10; 

      memoizedPositions.current[id] = { x: randomX, y: randomY, z: randomZ };
    }
    console.log(
      memoizedPositions.current[id].x,
      memoizedPositions.current[id].y
    );
    gsap.set(`#element-${id} img`, {
      x: `${memoizedPositions.current[id].x}vw`,
      y: `${memoizedPositions.current[id].y}dvh`,
      zIndex: memoizedPositions.current[id].z,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = contextSafe(() => {
    setHoveredProjectId(null);
  });

  useEffect(() => {
    if (selectedFilter === "materiais" && mat) {
      setMaterials(mat);
    } else if (selectedFilter === "ano" && ano) {
      setYears(ano);
    } else if (selectedFilter === "artistas" && art) {
      setArtists(art);
    }
  }, [selectedFilter, mat, ano, art]);

  const groupByYear = (projects: Projecto[]) => {
    const grouped = projects.reduce((acc, projecto) => {
      const year = projecto?.acf.year.trim(); 
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(projecto);
      return acc;
    }, {} as Record<string, Projecto[]>);

    const sortedGroupedArray = Object.entries(grouped)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .map(([year, projects]) => ({ year, projects })); 

    return sortedGroupedArray; 
  };

  const filteredProjects = selectedFilter
    ? projectos
        .filter((projecto) => {
          if (selectedFilter === "ano" && years) {
            return years.includes(parseInt(projecto?.acf.year, 10));
          }
          return true; 
        })
        .sort((a, b) => {
          if (selectedFilter === "artistas" && viewMode === "gallery") {
            return a.acf.page_title.localeCompare(b.acf.page_title);
          }
          return 0;
        })
    : projectos;

  const groupedYearsProjects = groupByYear(filteredProjects);

  const handleArtistClick = (artistId: number) => {
    setSelectedArtist(artistId === selectedArtist ? null : artistId);
  };
  const handleMaterialClick = (materialId: number) => {
    setSelectedMaterial(materialId === selectedMaterial ? null : materialId);
  };
  const handleYearClick = (year: number) => {
    setSelectedYear(year === selectedYear ? null : year);
  };

  const filteredArtistProjects = selectedArtist
    ? filteredProjects.filter((projecto) =>
        projecto.artistas?.includes(selectedArtist)
      )
    : filteredProjects;

  const filteredMaterialProjects = selectedMaterial
    ? filteredProjects.filter((projecto) => {
        return projecto.materiais?.includes(Number(selectedMaterial));
      })
    : filteredProjects;

  const filteredYearProjects = selectedYear
    ? groupedYearsProjects.filter(({ year }) => {
        return parseInt(year, 10) === selectedYear;
      })
    : groupedYearsProjects;

  return (
    <div className="flex flex-col items-center w-screen text-sm md:text-xl justify-items-center h-screen min-h-screen pb-32 px-4 md:px-10 gap-4">
      <div className="project-inner flex w-full flex-col h-[80dvh] mt-[12dvh] gap-4 md:gap-8 ">
       <div className="filtering flex justify-between w-full uppercase">
        {/* Filter Options */}
        <FilterOptions
          selectedFilter={selectedFilter || ""}
          setSelectedFilter={setSelectedFilter}
          t={t}
        />

        {/* View Options */}
        <ViewOptions
          viewMode={viewMode}
          setViewMode={setViewMode}
          t={t}
        />
  </div>
        <Suspense fallback={<Loading />}>
          {viewMode === "gallery" ? (
            <GalleryView
      
              selectedFilter={selectedFilter || ""}
              filteredProjects={filteredProjects}
              filteredMaterialProjects={filteredMaterialProjects}
              groupedYearsProjects={groupedYearsProjects}
              loading={isFetchingNextPage}
              materials={materials}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              shimmer={shimmer} // Replace with actual shimmer function
              toBase64={toBase64} // Replace with actual toBase64 function
              lastProjectRef={lastProjectRef}
            />
          ) : (
            <ListView
              selectedFilter={selectedFilter  || ""}
              artists={artists}
              years={years}
              materials={materials}
              loading={isFetchingNextPage}
              handleArtistClick={handleArtistClick}
              handleMaterialClick={handleMaterialClick}
              handleYearClick={handleYearClick}
              selectedArtist={selectedArtist}
              selectedMaterial={selectedMaterial}
              selectedYear={selectedYear}
              filteredArtistProjects={filteredArtistProjects}
              filteredMaterialProjects={filteredMaterialProjects}
              filteredYearProjects={filteredYearProjects}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              hoveredProjectId={hoveredProjectId}
              containerRef={containerRef as React.RefObject<HTMLUListElement>}
              lastProjectRef={lastProjectRef}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectList;
