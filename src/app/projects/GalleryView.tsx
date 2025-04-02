import React, { useCallback } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import Image from "next/image";
import { Link as TransitionLink } from "next-transition-router";
import Loading from "@/components/Loading";
import CustomRadioMaterial from "@/components/CustomRadioMaterial";
import { Projecto, Material } from "@/utils/types";
import AutoSizer from "react-virtualized-auto-sizer";
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
  const renderGrid = useCallback(
    (items: Projecto[]) => (
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = width < 768 ? 2 : 6;
          const gap = 16;
          const columnWidth = (width - gap * (columnCount - 1)) / columnCount;
          const rowHeight = columnWidth;
          return (
            <Grid
              columnCount={columnCount}
              columnWidth={() => columnWidth}
              rowCount={Math.ceil(items.length / columnCount)}
              rowHeight={() => rowHeight}
              height={height}
              width={width}
              itemData={{ items, gap }}
              overscanRowCount={2}
            >
              {({ columnIndex, rowIndex, style, data }) => {
                const index = rowIndex * columnCount + columnIndex;
                const projecto = data.items[index];
                if (!projecto) return null;
                const itemStyle = {
                  ...style,
                  left:
                    parseFloat(style.left as string) + columnIndex * data.gap,
                  top: parseFloat(style.top as string) + rowIndex * data.gap,
                  width: style.width,
                  height: style.height,
                };
                return (
                  <div style={itemStyle} className="">
                    <TransitionLink
                      href={`/projects/${projecto.slug}`}
                      className="flex flex-col gap-4"
                    >
                      {projecto.featured_image && (
                        <Image
                          src={projecto.featured_image.url}
                          alt={projecto.title.rendered}
                          width={projecto.featured_image.width / 4}
                          height={projecto.featured_image.height / 4}
                          placeholder="blur"
                          blurDataURL={projecto.featured_image.blurDataURL}
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
                  </div>
                );
              }}
            </Grid>
          );
        }}
      </AutoSizer>
    ),
    []
  );
  interface ProjectItem {
    type: "project";
    project: Projecto;
  }
  interface HeaderItem {
    type: "header";
    year: string;
  }
  type FlattenedListItem = ProjectItem | HeaderItem;
  interface RenderGridForYearProps {
    groups: { year: string; projects: Projecto[] }[];
  }
  const renderGridForYear = useCallback(
    ({ groups }: RenderGridForYearProps) => {
      if (!groups || groups.length === 0) {
        return null;
      }
      const flattenedList: FlattenedListItem[] = groups.flatMap(
        ({ year, projects }) => [
          { type: "header", year },
          ...projects.map((project) => ({ type: "project" as const, project })),
        ]
      );
      return (
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = width < 768 ? 2 : 6;
            const gap = 16;
            const columnWidth = (width - gap * (columnCount - 1)) / columnCount;
            const rowHeight = columnWidth;
            const headerHeight = 30;
            let currentRow = 0;
            let currentCol = 0;
            const cellMap = new Map();
            const rowHeights: number[] = [];
            for (let i = 0; i < flattenedList.length; i++) {
              const item = flattenedList[i];
              if (item.type === "header") {
                if (currentCol > 0) {
                  currentRow++;
                  currentCol = 0;
                }
                cellMap.set(`${currentRow},0`, i);
                rowHeights[currentRow] = headerHeight;
                currentRow++;
                currentCol = 0;
              } else {
                cellMap.set(`${currentRow},${currentCol}`, i);
                if (!rowHeights[currentRow]) rowHeights[currentRow] = rowHeight;
                currentCol++;
                if (currentCol >= columnCount) {
                  currentRow++;
                  currentCol = 0;
                }
              }
            }
            if (currentCol > 0) currentRow++;
            const totalRows = currentRow;
            return (
              <Grid
                columnCount={columnCount}
                columnWidth={() => columnWidth}
                rowCount={totalRows}
                rowHeight={(index) => rowHeights[index] || rowHeight}
                height={height}
                width={width}
                overscanRowCount={5}
              >
                {({ rowIndex, columnIndex, style }) => {
                  const itemIndex = cellMap.get(`${rowIndex},${columnIndex}`);
                  if (itemIndex === undefined) return null;
                  const item = flattenedList[itemIndex];
                  if (!item) return null;
                  if (item.type === "header") {
                    if (columnIndex === 0) {
                      const adjustedTop =
                        parseFloat(style.top as string) + rowIndex * gap;
                      return (
                        <div
                          style={{
                            ...style,
                            width,
                            left: 0,
                            top: adjustedTop,
                            height: headerHeight,
                            zIndex: 10,
                          }}
                          className=""
                        >
                          <h2 className="text-xl font-bold">{item.year}</h2>
                        </div>
                      );
                    }
                    return null;
                  }
                  const itemStyle = {
                    ...style,
                    left: parseFloat(style.left as string) + columnIndex * gap,
                    top: parseFloat(style.top as string) + rowIndex * gap,
                    width: style.width,
                    height: style.height,
                  };
                  if (item.type === "project") {
                    const projecto = item.project;
                    return (
                      <div style={itemStyle} className="">
                        <TransitionLink
                          href={`/projects/${projecto.slug}`}
                          className="flex flex-col gap-4"
                        >
                          {projecto.featured_image && (
                            <Image
                              src={projecto.featured_image.url}
                              alt={projecto.title.rendered}
                              width={projecto.featured_image.width / 4}
                              height={projecto.featured_image.height / 4}
                              placeholder="blur"
                              blurDataURL={projecto.featured_image.blurDataURL}
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
                      </div>
                    );
                  }
                  return null;
                }}
              </Grid>
            );
          }}
        </AutoSizer>
      );
    },
    []
  );
  return (
    <React.Fragment>
      {selectedFilter === "materiais" && (
        <div id="field7" className="w-full h-min">
          {loading ? (
            <div className="h-[15dvh]">
              <Loading />
            </div>
          ) : (
            <div className="flex flex-wrap uppercase justify-center md:justify-normal pb-4">
              {materials?.map((option, index) => (
                <React.Fragment key={option.id}>
                  <CustomRadioMaterial
                    id={option.id.toString()}
                    label={option.name}
                    value={option.id.toString()}
                    name="materialcheckbox"
                    checked={selectedMaterial === option.id}
                    onChange={(e) =>
                      setSelectedMaterial(Number(e.target.value))
                    }
                  />
                  {index < materials.length - 1 && (
                    <span className="separador1 pr-2 items-baseline font-mono text-[0.55rem] md:text-rodape leading-3">
                      {" "}
                      \{" "}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      <div
        className={`w-full overflow-y-hidden ${
          selectedFilter === "materiais" ? "h-[60vh]" : "h-[70vh]"
        }`}
      >
        {selectedFilter === "artistas" && renderGrid(filteredProjects)}
        {selectedFilter === "materiais" && renderGrid(filteredMaterialProjects)}
        {selectedFilter === "ano" &&
          renderGridForYear({ groups: groupedYearsProjects })}
      </div>
    </React.Fragment>
  );
};
export default React.memo(GalleryView);
