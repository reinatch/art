import React from "react";
interface CustomRadioProps {
  id: string;
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  label,
  value,
  checked,
  name,
  onChange,
}) => {
  return (
    <div className="flex items-end mr-2">
      <input
        id={id}
        className="hidden"
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="flex items-baseline " htmlFor={id}>
        <div
          className={`w-3 h-3 md:w-4 md:h-4  border-2 border-black rounded-full flex items-center justify-center mr-2 ${
            checked ? "bg-black" : "bg-white"
          }`}
        >
          {checked && (
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full"></div>
          )}
        </div>
        <div>{label}</div>
      </label>
    </div>
  );
};
export default CustomRadio;
