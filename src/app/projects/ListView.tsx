import React, { useCallback, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Link as TransitionLink } from "next-transition-router";
import Loading from "@/components/Loading";
import { Artista, Material, Projecto } from "@/utils/types";
interface ListViewProps {
  selectedFilter: string;
  artists: Artista[];
  years: number[];
  materials: Material[];
  loading: boolean;
  handleArtistClick: (id: number) => void;
  handleMaterialClick: (id: number) => void;
  handleYearClick: (id: number) => void;
  selectedArtist: number | null;
  selectedMaterial: number | null;
  selectedYear: number | null;
  filteredArtistProjects: Projecto[];
  filteredMaterialProjects: Projecto[];
  filteredYearProjects: { year: string; projects: Projecto[] }[];
  handleMouseEnter: (id: number) => void;
  handleMouseLeave: () => void;
  hoveredProjectId: number | null;
}
const ListView: React.FC<ListViewProps> = ({
  selectedFilter,
  artists,
  years,
  materials,
  loading,
  handleArtistClick,
  handleMaterialClick,
  handleYearClick,
  selectedArtist,
  selectedMaterial,
  selectedYear,
  filteredArtistProjects,
  filteredMaterialProjects,
  filteredYearProjects,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const listData = useMemo(() => {
    switch (selectedFilter) {
      case "artistas":
        return filteredArtistProjects;
      case "materiais":
        return filteredMaterialProjects;
      case "ano":
        return filteredYearProjects.flatMap((group) => group.projects);
      default:
        return [];
    }
  }, [
    selectedFilter,
    filteredArtistProjects,
    filteredMaterialProjects,
    filteredYearProjects,
  ]);
  const ProjectListItem = useCallback(
    ({ projecto }: { projecto: Projecto }) => (
      <div
        id={`element-${projecto.id}`}
        className="hover__item flex gap-4 w-9/12 pl-10 -indent-10"
        onMouseEnter={() => handleMouseEnter(projecto.id)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="hover__item-image_wrapper top-1/2 left-1/2 opacity-100 flex">
          <TransitionLink
            href={`/projects/${projecto.slug}`}
            className="hover__item-text relative font-works flex"
          >
            <div className="hover__item-innertext flex gap-2 uppercase">
              <div className="w-full">
                <span>{projecto.title.rendered}, </span>
                {selectedFilter === "ano" ? (
                  <span className="font-intl">{projecto.acf.page_title}</span>
                ) : (
                  <span className="font-intl">{projecto.acf.year}</span>
                )}
              </div>
            </div>
          </TransitionLink>
          <div
            data-id={projecto.id}
            className={`hover__item-image_inner fixed top-0 h-auto w-[20vw] object-cover hidden z-10`}
          >
            {projecto.featured_image && projecto.featured_image.url ? (
              <Image
                className="hover__item-image absolute z-50 rounded-md"
                src={projecto.featured_image.url}
                alt={projecto.title.rendered || 'Project image'}
                width={projecto.featured_image.width ? projecto.featured_image.width / 4 : 300}
                height={projecto.featured_image.height ? projecto.featured_image.height / 4 : 200}
                placeholder={projecto.featured_image.blurDataURL ? "blur" : "empty"}
                blurDataURL={projecto.featured_image.blurDataURL || undefined}
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load hover image:', {
                    projectId: projecto.id,
                    slug: projecto.slug,
                    imageUrl: projecto.featured_image.url,
                    title: projecto.title.rendered,
                    hasBlurData: !!projecto.featured_image.blurDataURL,
                    width: projecto.featured_image.width,
                    height: projecto.featured_image.height
                  });
                  // Hide the hover element when image fails to load
                  const hoverElement = e.currentTarget.closest('.hover-element') as HTMLElement;
                  if (hoverElement) {
                    hoverElement.style.display = 'none';
                  }
                }}
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                No Hover Image
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    [handleMouseEnter, handleMouseLeave, selectedFilter]
  );
  const memoizedHandleArtistClick = useCallback(
    (id: number) => handleArtistClick(id),
    [handleArtistClick]
  );
  const memoizedHandleMaterialClick = useCallback(
    (id: number) => handleMaterialClick(id),
    [handleMaterialClick]
  );
  const memoizedHandleYearClick = useCallback(
    (id: number) => handleYearClick(id),
    [handleYearClick]
  );
  return (
    <div className="flex w-full h-[70dvh]">
      {/* Left Filter Panel */}
      <div className="w-1/2 pr-4 overflow-y-scroll pb-[12vh]">
        {loading &&
        ((artists?.length ?? 0) === 0 ||
          (years?.length ?? 0) === 0 ||
          (materials?.length ?? 0) === 0) ? (
          <div className="w-full h-full">
            <Loading />
          </div>
        ) : (
          <>
            {selectedFilter === "artistas" && (
              <ul>
                {artists?.map((artist) => (
                  <li
                    key={uuidv4()}
                    className={`js-filter-item uppercase ${
                      selectedArtist === artist.id ? "ml-10 font-works" : ""
                    }`}
                    onClick={() => memoizedHandleArtistClick(artist.id)}
                  >
                    {artist.name}
                  </li>
                ))}
              </ul>
            )}
            {selectedFilter === "materiais" && (
              <ul>
                {materials?.map((material) => (
                  <li
                    key={uuidv4()}
                    className={`js-filter-item uppercase ${
                      selectedMaterial === material.id ? "ml-10 font-works" : ""
                    }`}
                    onClick={() => memoizedHandleMaterialClick(material.id)}
                  >
                    {material.name}
                  </li>
                ))}
              </ul>
            )}
            {selectedFilter === "ano" && (
              <ul>
                {years?.map((year) => (
                  <li
                    key={uuidv4()}
                    className={`js-filter-item uppercase ${
                      selectedYear === year ? "ml-10 font-works" : ""
                    }`}
                    onClick={() => memoizedHandleYearClick(year)}
                  >
                    {year}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      {/* Right Virtualized List Panel */}
      <div className="w-1/2 pl-4 h-full">
        <Virtuoso
          data={listData}
          itemContent={(index, projecto) => (
            <ProjectListItem key={uuidv4() + index} projecto={projecto} />
          )}
        />
        {loading && (
          <div className="text-center p-4">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};
export default React.memo(ListView);
