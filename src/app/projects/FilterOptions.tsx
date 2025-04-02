import React from "react";
import CustomRadio from "@/components/CustomRadio";
interface FilterOptionsProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string) => void;
  t: (key: string) => string;
}
const FilterOptions: React.FC<FilterOptionsProps> = ({
  selectedFilter,
  setSelectedFilter,
  t,
}) => {
  const options = [
    { id: "artistas", label: t("artists"), value: "artistas" },
    { id: "ano", label: t("years"), value: "ano" },
    { id: "materiais", label: t("materiais"), value: "materiais" },
  ];
  return (
    <form
      id="term-options"
      className="view-filter col gap-y-0 form-check flex flex-row flex-wrap md:flex-row w-full md:w-1/2 "
    >
      {options.map((option, index) => (
        <React.Fragment key={option.id}>
          <CustomRadio
            id={option.id}
            label={option.label}
            name="term"
            value={option.value}
            checked={selectedFilter === option.value}
            onChange={(e) => setSelectedFilter(e.target.value)}
          />
          {index < options.length - 1 && (
            <span className="separador1 pr-4  md:block"> \ </span>
          )}
        </React.Fragment>
      ))}
    </form>
  );
};
export default React.memo(FilterOptions);
