"use client";

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <button
      className="absolute top-4 right-4 z-50 md:hidden text-3xl font-bold text-black w-8 h-8 flex items-center justify-center"
      aria-label="Close sitemap"
      onClick={onClose}
      type="button"
    >
      <svg
        className="w-auto h-full rotate-[135deg] transition-transform duration-500" 
        fill="black"
        stroke="black"
        viewBox="0 0 30 30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeWidth="1" d="M0 15h30M15 0v30" />
      </svg>
    </button>
  );
};

export default CloseButton;
