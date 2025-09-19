"use client";

interface ModalCloseButtonProps {
  onClose: () => void;
}

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ onClose }) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
    >
      ✕
    </button>
  );
};

export default ModalCloseButton;
