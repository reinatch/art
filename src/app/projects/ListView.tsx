import React from 'react';
import Loading from '@/components/Loading';

import { Artista, Material, Projecto } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";

import TransitionLink from "@/components/TransitionLink";
interface FilterListProps {
    items: { id: number; name: string }[];
    onClick: (id: number) => void;
    selectedId: number | null;
  }
interface ProjectListItemProps {
    projecto: Projecto;
    onMouseEnter: (id: number) => void;
    onMouseLeave: () => void;
    hoveredProjectId: number | null;
}
  
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
  containerRef: React.RefObject<HTMLUListElement>;
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
  hoveredProjectId,
  containerRef,
}) => {

    const FilterList: React.FC<FilterListProps> = ({
        items,
        onClick,
        selectedId,
      }) => (
        <ul>
          {items && items.map((item) => (
            <li className="js-filter-item" key={uuidv4()}>
              <a
                data-name={item.name}
                data-id={item.id}
                href="#"
                onClick={() => onClick(item.id)}
                className={`js-filter-item uppercase ${
                  selectedId === item.id ? "ml-10 font-works" : ""
                }`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      );
      const ProjectListItem: React.FC<ProjectListItemProps> = React.memo(
        ({ projecto, onMouseEnter, onMouseLeave }) => (
          <li
            key={uuidv4()}
            id={`element-${projecto.id}`}
            className="hover__item flex gap-4 w-9/12 pl-10 -indent-10"
            onMouseEnter={() => onMouseEnter(projecto.id)}
            onMouseLeave={onMouseLeave}
          >
            <div className="hover__item-image_wrapper top-1/2 left-1/2 opacity-100 flex">
              <TransitionLink
                href={`/projects/${projecto.slug}`}
                className="hover__item-text relative font-works flex "
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
                <Image
                  className="hover__item-image absolute z-50 rounded-md"
                  src={projecto.featured_image.url}
                  alt={projecto.title.rendered}
                  width={projecto.featured_image.width/4}
                  height={projecto.featured_image.height/4}
                  loading="lazy" // Use lazy loading
                  priority={false} // Remove priority to defer loading
                />
              </div>
            </div>
          </li>
        )
      );
      ProjectListItem.displayName = "ProjectListItem";
    
return (  <div className="flex w-full h-[70dvh]">
    <div className="w-1/2 pr-4 overflow-y-scroll pb-[12vh]">
      {loading && (artists.length === 0 || years.length === 0 || materials.length === 0) ? (
        <div className="w-full h-full">
          <Loading />
        </div>
      ) : (
        <>
          {selectedFilter === "artistas" && (
            <FilterList
              items={artists}
              onClick={handleArtistClick}
              selectedId={selectedArtist}
            />
          )}
          {selectedFilter === "materiais" && (
            <FilterList
              items={materials}
              onClick={handleMaterialClick}
              selectedId={selectedMaterial}
            />
          )}
          {selectedFilter === "ano" && (
            <FilterList
              items={years.map((year) => ({
                id: year,
                name: year.toString(),
              }))}
              onClick={handleYearClick}
              selectedId={selectedYear}
            />
          )}
        </>
      )}
    </div>

    <div className="w-1/2 pl-4 overflow-y-scroll pb-[12vh]">
      <ul ref={containerRef} className="w-full h-full">
        {selectedFilter === "artistas" && artists && (
          <>
            <li className="uppercase w-full">
              {artists.find((artist) => artist.id === selectedArtist)?.name}
            </li>
            <div className={`${selectedArtist ? "pt-4" : ""}`}>
              {filteredArtistProjects.map((projecto) => (
                <ProjectListItem
                  key={uuidv4()}
                  projecto={projecto}
                  onMouseEnter={() => handleMouseEnter(projecto.id)}
                  onMouseLeave={handleMouseLeave}
                  hoveredProjectId={hoveredProjectId}
                />
              ))}
            </div>
          </>
        )}

        {selectedFilter === "materiais" && materials && (
          <>
            <h5 className="uppercase">
              {materials.find((material) => material.id === selectedMaterial)?.name}
            </h5>
            <div className={`${selectedMaterial ? "pt-4" : ""}`}>
              {filteredMaterialProjects.map((projecto) => (
                <ProjectListItem
                  key={uuidv4()}
                  projecto={projecto}
                  onMouseEnter={() => handleMouseEnter(projecto.id)}
                  onMouseLeave={handleMouseLeave}
                  hoveredProjectId={hoveredProjectId}
                />
              ))}
            </div>
          </>
        )}

        {selectedFilter === "ano" && (
          <>
            <h5 className="">
              {years.find((year) => year === selectedYear)}
            </h5>
            {filteredYearProjects.map((group) => (
              <div key={uuidv4()} className={`${selectedYear ? "py-4" : ""}`}>
                <ul>
                  {group.projects.map((projecto) => (
                    <ProjectListItem
                      key={uuidv4()}
                      projecto={projecto}
                      onMouseEnter={() => handleMouseEnter(projecto.id)}
                      onMouseLeave={handleMouseLeave}
                      hoveredProjectId={hoveredProjectId}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </ul>
    </div>
  </div>)
};

export default ListView;