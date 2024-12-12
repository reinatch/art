// CustomRadioMaterial.jsx
import React from 'react';

interface CustomRadioMaterialProps {
  id: string;
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomRadioMaterial: React.FC<CustomRadioMaterialProps> = ({ id, label, value, checked,name, onChange }) => {
  // console.log("Rendering CustomRadioMaterial - Checked:", checked, id, value); // Check if the checked status updates correctly

  return (
    <div className="flex items-center mr-2 ">
      <input
        id={id}
        className="hidden"
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="flex items-baseline font-mono text-[0.55rem] md:text-rodape leading-3 " htmlFor={id}>
        <span
          className={`w-2 h-2 md:w-[0.65rem] md:h-[0.65rem] border-[1.5px] border-black rounded-full flex items-center justify-center mr-2 ${
            checked ? 'bg-black' : 'bg-white'
          }`}
        >
          {checked && <span className="w-1 h-1 md:w-[0.65rem] md:h-[0.65rem] bg-black rounded-full"></span>}
        </span>
        {label}
      </label>
    </div>
  );
};


export default CustomRadioMaterial;
