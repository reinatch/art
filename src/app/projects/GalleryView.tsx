import React from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import Loading from "@/components/Loading";
import CustomRadioMaterial from "@/components/CustomRadioMaterial";
import { Projecto, Material } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";

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
  lastProjectRef: (node?: Element | null) => void;
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
  lastProjectRef
}) => {
  return (
    <>
      {selectedFilter === "artistas" && (
        <ul className="grid grid-cols-2 md:grid-cols-6 gap-4 overflow-y-scroll pb-[12vh]" >
          {filteredProjects.map((projecto, index) => {
            const isLast = index === filteredProjects.length - 1;
            return(
            <li key={uuidv4()} ref={isLast ? lastProjectRef : null} className="relative w-full ">
              <TransitionLink
                href={`/projects/${projecto?.slug}`}
                className="flex flex-col gap-4"
              >
                {projecto?.featured_image && (
                  <Image
                    src={projecto?.featured_image.url}
                    alt={projecto?.title.rendered}
                    width={projecto?.featured_image.width}
                    height={projecto?.featured_image.height}
                    // loading="lazy" // Use lazy loading
                    // priority={false} // Remove priority to defer loading
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                    className="w-full h-auto rounded-md"
                  />
                )}
                <div className="flex flex-col">
                  <div className="uppercase text-rodape font-intl text-ellipsis whitespace-nowrap overflow-hidden w-full leading-[1.25em] block my-0">
                    {projecto?.acf.page_title}
                  </div>
                  <div className="text-ellipsis lowercase whitespace-nowrap font-works overflow-hidden w-full text-xs my-0">
                    {projecto?.title.rendered}, {projecto?.acf.year}
                  </div>
                </div>
              </TransitionLink>
            </li>
          )})}
        </ul>
      )}

      {selectedFilter === "materiais" && (
        <>
          <div id="field7" className="w-full  h-min">
            {loading ? (
              <div className="h-[15dvh]">
                <Loading />
              </div>
            ) : (
              <div className="flex flex-wrap uppercase justify-center md:justify-normal">
                {materials && materials.map((option, index) => (
                  <React.Fragment key={option.id}>
                    <CustomRadioMaterial
                      id={option.id.toString()}
                      label={option.name}
                      value={option.id.toString()}
                      name="materialcheckbox"
                      checked={selectedMaterial === option.id}
                      onChange={(e) => {
                        setSelectedMaterial(Number(e.target.value));
                      }}
                    />
                    {index < materials.length - 1 && (
                      <span className="separador1 pr-2 items-baseline font-mono text-[0.55rem] md:text-rodape leading-3 ">
                        {" "}
                        \{" "}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-6 gap-4 overflow-y-scroll pb-[12vh]">
            {filteredMaterialProjects.map((projecto) => (
              <li key={uuidv4()} className="relative w-full">
                <TransitionLink
                  href={`/projects/${projecto?.slug}`}
                  className="flex flex-col gap-4"
                >
                  {projecto?.featured_image && (
                    <Image
                      src={projecto?.featured_image.url}
                      alt={projecto?.title.rendered}
                      width={projecto?.featured_image.width}
                      height={projecto?.featured_image.height}
                    //   loading="lazy" // Use lazy loading
                    //   priority={false} // Remove priority to defer loading
                      placeholder={`data:image/svg+xml;base64,${toBase64(
                        shimmer(700, 475)
                      )}`}
                      className="w-full h-auto rounded-md"
                    />
                  )}
                  <div className="flex flex-col">
                    <div className="uppercase text-rodape font-intl text-ellipsis whitespace-nowrap overflow-hidden w-full leading-[1.25em] block my-0">
                      {projecto?.acf.page_title}
                    </div>
                    <div className="text-ellipsis lowercase whitespace-nowrap font-works overflow-hidden w-full text-xs my-0">
                      {projecto?.title.rendered}, {projecto?.acf.year}
                    </div>
                  </div>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedFilter === "ano" && (
                      <div className="overflow-y-scroll pb-[12vh]">
                        {groupedYearsProjects.map((group , index) => {
                          const isLast = index === groupedYearsProjects.length - 1;
                          return(
                          <div key={uuidv4()} ref={isLast ? lastProjectRef : null}>
                            <h2 className="text-xl py-4">{group.year}</h2>
                            <ul className="grid grid-cols-2 md:grid-cols-6 gap-4">
                              {group.projects.map((projecto: Projecto) => (
                                <li key={uuidv4()} className="relative w-full">
                                  <TransitionLink
                                    href={`/projects/${projecto?.slug}`}
                                    className="flex flex-col gap-4"
                                  >
                                    {projecto?.featured_image && (
                                      <Image
                                        src={projecto?.featured_image.url}
                                        alt={projecto?.title.rendered}
                                        width={projecto?.featured_image.width}
                                        height={projecto?.featured_image.height}
                                        // loading="lazy" // Use lazy loading
                                        // priority={false} // Remove priority to defer loading
                                        placeholder={`data:image/svg+xml;base64,${toBase64(
                                          shimmer(700, 475)
                                        )}`}
                                        className="w-full h-auto rounded-md"
                                      />
                                    )}
                                    <div className="flex flex-col">
                                      <div className="uppercase text-rodape font-intl text-ellipsis whitespace-nowrap overflow-hidden w-full leading-[1.25em] block my-0">
                                        {projecto?.acf.page_title}
                                      </div>
                                      <div className="text-ellipsis lowercase whitespace-nowrap font-works overflow-hidden w-full text-xs my-0">
                                        {projecto?.title.rendered}, {projecto?.acf.year}
                                      </div>
                                    </div>
                                  </TransitionLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )})}
                      </div>
       )}
    </>
  );
};

export default GalleryView;
