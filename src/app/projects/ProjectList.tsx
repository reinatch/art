"use client";
import {
  useState,
  useEffect,
  useRef,
  Suspense,
  useMemo,
  useCallback,
} from "react";
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
import { FixedSizeList } from "react-window";
type FilterState = {
  selectedFilter: string | null;
  selectedArtist: number | null;
  selectedMaterial: number | null;
  selectedYear: number | null;
};
const ProjectList: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("ProjectList");
  const { data, isFetchingNextPage } = useProjectos(locale);
  const { mat, art, ano } = useProjectosData(locale);
  const projectos = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.projects || []);
  }, [data]);
  const ref = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState("gallery");
  const [filterState, setFilterState] = useState<FilterState>({
    selectedFilter: "ano",
    selectedArtist: null,
    selectedMaterial: null,
    selectedYear: null,
  });
  const [materials, setMaterials] = useState<Material[]>(mat || []);
  const [years, setYears] = useState<number[]>(ano);
  const [artists, setArtists] = useState<Artista[]>(art || []);
  const containerRef = useRef<FixedSizeList<Projecto[]> | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  gsap.registerPlugin(useGSAP);
  const { contextSafe } = useGSAP({ scope: containerRef });
  const { isContactOpen, closeContact } = useToggleContact();
  const updateFilter = useCallback(
    (key: keyof FilterState, value: string | number | null) => {
      setFilterState((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));
    },
    []
  );
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
  const getRandomInRange = useCallback(
    (min: number, max: number) => Math.random() * (max - min) + min,
    []
  );
  const memoizedPositions = useRef<{
    [key: number]: { x: number; y: number; z: number };
  }>({});
  const handleMouseEnter = useCallback(
    (id: number) => {
      if (!memoizedPositions.current[id]) {
        const randomX = getRandomInRange(0, 20);
        const randomY = getRandomInRange(10, 50);
        const randomZ = 10;
        memoizedPositions.current[id] = { x: randomX, y: randomY, z: randomZ };
      }
      gsap.set(`#element-${id} img`, {
        x: `${memoizedPositions.current[id].x}vw`,
        y: `${memoizedPositions.current[id].y}dvh`,
        zIndex: memoizedPositions.current[id].z,
        ease: "power1.inOut",
      });
    },
    [getRandomInRange]
  );
  const handleMouseLeave = contextSafe(() => {
    setHoveredProjectId(null);
  });
  useEffect(() => {
    if (filterState.selectedFilter === "materiais" && mat) {
      setMaterials(mat);
    } else if (filterState.selectedFilter === "ano" && ano) {
      setYears(ano);
    } else if (filterState.selectedFilter === "artistas" && art) {
      setArtists(art);
    }
  }, [filterState.selectedFilter, mat, ano, art]);
  const groupByYear = useCallback((projects: Projecto[]) => {
    const grouped = projects.reduce((acc, projecto) => {
      const year = (projecto.acf?.year || "").toString().trim();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(projecto);
      return acc;
    }, {} as Record<string, Projecto[]>);
    return Object.entries(grouped)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .map(([year, projects]) => ({ year, projects }));
  }, []);
  const filteredProjects = useMemo(() => {
    if (!filterState.selectedFilter) return projectos || [];
    return (projectos || [])
      .filter((projecto) => {
        if (filterState.selectedFilter === "ano" && years) {
          return years.includes(parseInt(projecto.acf.year, 10));
        }
        return true;
      })
      .sort((a, b) => {
        if (
          filterState.selectedFilter === "artistas" &&
          viewMode === "gallery"
        ) {
          return a.acf.page_title.localeCompare(b.acf.page_title);
        }
        return 0;
      });
  }, [filterState.selectedFilter, projectos, years, viewMode]);
  const groupedYearsProjects = useMemo(() => groupByYear(filteredProjects), [
    filteredProjects,
    groupByYear,
  ]);
  const handleArtistClick = useCallback(
    (artistId: number) => {
      updateFilter("selectedArtist", artistId);
    },
    [updateFilter]
  );
  const handleMaterialClick = useCallback(
    (materialId: number) => {
      updateFilter("selectedMaterial", materialId);
    },
    [updateFilter]
  );
  const handleYearClick = useCallback(
    (year: number) => {
      updateFilter("selectedYear", year);
    },
    [updateFilter]
  );
  const filteredArtistProjects = useMemo(
    () =>
      filterState.selectedArtist
        ? (filteredProjects || []).filter(
            (projecto) =>
              filterState.selectedArtist !== null &&
              (projecto.artistas || []).includes(filterState.selectedArtist)
          )
        : filteredProjects,
    [filterState.selectedArtist, filteredProjects]
  );
  const filteredMaterialProjects = useMemo(
    () =>
      filterState.selectedMaterial
        ? (filteredProjects || []).filter((projecto) =>
            (projecto.materiais || []).includes(Number(filterState.selectedMaterial))
          )
        : filteredProjects,
    [filterState.selectedMaterial, filteredProjects]
  );
  const filteredYearProjects = useMemo(
    () =>
      filterState.selectedYear
        ? groupedYearsProjects.filter(({ year }) => {
            return parseInt(year, 10) === filterState.selectedYear;
          })
        : groupedYearsProjects,
    [filterState.selectedYear, groupedYearsProjects]
  );
  useEffect(() => {
    return () => {
      gsap.globalTimeline.clear();
      gsap.killTweensOf("*");
    };
  }, []);
  return (
    <div className="flex flex-col items-center w-screen text-sm md:text-xl justify-items-center h-screen min-h-screen pb-32 px-4 md:px-10 gap-4">
      <div className="project-inner flex w-full flex-col h-[80dvh] mt-[12dvh] gap-4 md:gap-8 ">
        <div className="filtering flex justify-between w-full uppercase">
          {/* Filter Options - updated to use filterState */}
          <FilterOptions
            selectedFilter={filterState.selectedFilter || ""}
            setSelectedFilter={(filter) =>
              updateFilter("selectedFilter", filter)
            }
            t={t}
          />
          {/* View Options */}
          <ViewOptions viewMode={viewMode} setViewMode={setViewMode} t={t} />
        </div>
        <div ref={ref} className="ref_container w-full h-full">
          <Suspense fallback={<Loading />}>
            {viewMode === "gallery" ? (
              <GalleryView
                selectedFilter={filterState.selectedFilter || ""}
                filteredProjects={filteredProjects}
                filteredMaterialProjects={filteredMaterialProjects}
                groupedYearsProjects={groupedYearsProjects}
                loading={isFetchingNextPage}
                materials={materials}
                selectedMaterial={filterState.selectedMaterial}
                setSelectedMaterial={(material) =>
                  updateFilter("selectedMaterial", material)
                }
                shimmer={shimmer}
                toBase64={toBase64}
              />
            ) : (
              <ListView
                selectedFilter={filterState.selectedFilter || ""}
                artists={artists}
                years={years}
                materials={materials}
                loading={isFetchingNextPage}
                handleArtistClick={handleArtistClick}
                handleMaterialClick={handleMaterialClick}
                handleYearClick={handleYearClick}
                selectedArtist={filterState.selectedArtist}
                selectedMaterial={filterState.selectedMaterial}
                selectedYear={filterState.selectedYear}
                filteredArtistProjects={filteredArtistProjects}
                filteredMaterialProjects={filteredMaterialProjects}
                filteredYearProjects={filteredYearProjects}
                handleMouseEnter={handleMouseEnter}
                hoveredProjectId={hoveredProjectId}
                handleMouseLeave={handleMouseLeave}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default ProjectList;
