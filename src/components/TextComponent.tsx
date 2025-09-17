// components/TextComponent.tsx
import React from 'react';
interface TextComponentProps {
  text: string;
}
const TextComponent: React.FC<TextComponentProps> = ({ text }) => {
  return (
    <div className="absolute w-full z-1 top-1/2 left-1/2 transform  -translate-x-1/2 -translate-y-1/2 text-center">
      <p className="text-6xl">{text}</p>
    </div>
  );
};
export default TextComponent;
