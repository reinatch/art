import React from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import Loading from "@/components/Loading";
import CustomRadioMaterial from "@/components/CustomRadioMaterial";
import { Projecto, Material } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";
import SectionList from "react-virtualized-sectionlist";

interface GalleryViewProps {
  selectedFilter: string | null;
  filteredProjects: Projecto[];
  filteredMaterialProjects: Projecto[];
  groupedYearsProjects: { year: string; projects: Projecto[] }[];
  loading: boolean;
  materials: Material[];
  selectedMaterial: number | null;
  setSelectedMaterial: (value: number | null) => void;
  shimmer: (w: number, h: number) => string;
  toBase64: (str: string) => string;
}

const GalleryView: React.FC<GalleryViewProps> = ({
  selectedFilter,
  filteredProjects,
  filteredMaterialProjects,
  groupedYearsProjects,
  loading,
  materials,
  selectedMaterial,
  setSelectedMaterial,
  shimmer,
  toBase64,
}) => {
  const renderHeader = ({ title }: { title: string }) => (
    <div className="list--header py-4 px-2 bg-gray-100">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );

  const renderRow = ({ item }: { item: Projecto }) => (
    <div className="p-2">
      <TransitionLink
        href={`/projects/${item.slug}`}
        className="flex flex-col gap-4"
      >
        {item.featured_image && (
          <Image
            src={item.featured_image.url}
            alt={item.title.rendered}
            width={item.featured_image.width}
            height={item.featured_image.height}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            className="w-full h-auto rounded-md"
            loading="lazy"
          />
        )}
        <div className="flex flex-col">
          <div className="uppercase text-rodape font-intl truncate">
            {item.acf.page_title}
          </div>
          <div className="lowercase font-works text-xs truncate">
            {item.title.rendered}, {item.acf.year}
          </div>
        </div>
      </TransitionLink>
    </div>
  );

  const sections = groupedYearsProjects.map((group) => ({
    title: group.year,
    data: group.projects,
  }));

  return (
    <React.Fragment>
      {/* Materiais Filter */}
      {selectedFilter === "materiais" && (
        <>
          <div id="field7" className="w-full h-min">
            {loading ? (
              <div className="h-[15dvh]">
                <Loading />
              </div>
            ) : (
              <div className="flex flex-wrap uppercase justify-center md:justify-normal">
                {materials.map((option, index) => (
                  <React.Fragment key={option.id}>
                    <CustomRadioMaterial
                      id={option.id.toString()}
                      label={option.name}
                      value={option.id.toString()}
                      name="materialcheckbox"
                      checked={selectedMaterial === option.id}
                      onChange={(e) => setSelectedMaterial(Number(e.target.value))}
                    />
                    {index < materials.length - 1 && (
                      <span className="separador1 pr-2 items-baseline font-mono text-[0.55rem] md:text-rodape leading-3">
                        {" "}\\{" "}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Material Projects */}
          <ul className="grid grid-cols-2 md:grid-cols-6 gap-4 overflow-y-scroll pb-[12vh]">
            {filteredMaterialProjects.map((projecto) => (
              <li key={uuidv4()} className="relative w-full">
                <TransitionLink
                  href={`/projects/${projecto.slug}`}
                  className="flex flex-col gap-4"
                >
                  {projecto.featured_image && (
                    <Image
                      src={projecto.featured_image.url}
                      alt={projecto.title.rendered}
                      width={projecto.featured_image.width}
                      height={projecto.featured_image.height}
                      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      className="w-full h-auto rounded-md"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-col">
                    <div className="uppercase text-rodape font-intl truncate">
                      {projecto.acf.page_title}
                    </div>
                    <div className="lowercase font-works text-xs truncate">
                      {projecto.title.rendered}, {projecto.acf.year}
                    </div>
                  </div>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Artistas Filter */}
      {selectedFilter === "artistas" && (
        <ul className="grid grid-cols-2 md:grid-cols-6 gap-4 overflow-y-scroll pb-[12vh]">
          {filteredProjects.map((projecto) => (
            <li key={uuidv4()} className="relative w-full ">
              <TransitionLink
                href={`/projects/${projecto.slug}`}
                className="flex flex-col gap-4"
              >
                {projecto.featured_image && (
                  <Image
                    src={projecto.featured_image.url}
                    alt={projecto.title.rendered}
                    width={projecto.featured_image.width}
                    height={projecto.featured_image.height}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    className="w-full h-auto rounded-md"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-col">
                  <div className="uppercase text-rodape font-intl truncate">
                    {projecto.acf.page_title}
                  </div>
                  <div className="lowercase font-works text-xs truncate">
                    {projecto.title.rendered}, {projecto.acf.year}
                  </div>
                </div>
              </TransitionLink>
            </li>
          ))}
        </ul>
      )}

      {/* Ano Filter with SectionList */}
      {selectedFilter === "ano" && (
        <SectionList
          width={"100%"}
          height={"70vh"}
          sections={sections}
          sectionHeaderRenderer={renderHeader}
          sectionHeaderHeight={50} // Adjust header height as needed
          rowRenderer={renderRow}
          rowHeight={475} // Adjust row height as needed
        />
      )}
    </React.Fragment>
  );
};

export default GalleryView;
