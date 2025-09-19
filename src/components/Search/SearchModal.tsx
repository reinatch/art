"use client";
import { Projecto } from "@/utils/types";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import ModalCloseButton from "./ModalCloseButton";
import LoadingIndicator from "./LoadingIndicator";
import SearchResults from "./SearchResults";

interface SearchModalProps {
  isModalOpen: boolean;
  loading: boolean;
  filteredResults: Projecto[];
  onCloseModal: () => void;
  onItemClick: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ 
  isModalOpen, 
  loading, 
  filteredResults, 
  onCloseModal,
  onItemClick
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Search");

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white bg-opacity-50">
      <div
        ref={modalRef}
        data-modal="search"
        className="bottom-[8vh] bg-white bg-opacity-90 absolute w-[94vw] h-[80vh] px-12 rounded-lg overflow-y-auto py-12 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onCloseModal} />
        <h2 className="text-xl font-semibold mb-4">{t("results")}</h2>
        <LoadingIndicator loading={loading} />
        <SearchResults 
          filteredResults={filteredResults} 
          onItemClick={onItemClick}
        />
      </div>
    </div>
  );
};

export default SearchModal;
