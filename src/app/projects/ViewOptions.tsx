import React from "react";
import CustomRadio from "@/components/CustomRadio";
interface ViewOptionsProps {
  viewMode: string;
  setViewMode: (value: string) => void;
  t: (key: string) => string;
}
const ViewOptions: React.FC<ViewOptionsProps> = ({
  viewMode,
  setViewMode,
  t,
}) => {
  const options = [
    { id: "lista", label: t("list"), value: "list" },
    { id: "galeria", label: t("gallery"), value: "gallery" },
  ];
  return (
    <form
      id="view-options"
      className="pl-2 hidden view-options col form-check md:flex w-1/2"
    >
      {options.map((option, index) => (
        <React.Fragment key={option.id}>
          <CustomRadio
            id={option.id}
            label={option.label}
            name="term"
            value={option.value}
            checked={viewMode === option.value}
            onChange={() => setViewMode(option.value)}
          />
          {index < options.length - 1 && (
            <span className="separador1 pr-4"> \ </span>
          )}
        </React.Fragment>
      ))}
    </form>
  );
};
export default React.memo(ViewOptions);
