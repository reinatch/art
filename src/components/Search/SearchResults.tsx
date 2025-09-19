"use client";
import { Projecto } from "@/utils/types";
import { useTranslations } from "next-intl";
import SearchResultItem from "./SearchResultItem";

interface SearchResultsProps {
  filteredResults: Projecto[];
  onItemClick: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ filteredResults, onItemClick }) => {
  const t = useTranslations("Search");

  if (filteredResults.length > 0) {
    return (
      <ul className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {filteredResults.map((projecto: Projecto) => (
          <SearchResultItem 
            key={projecto.id}
            projecto={projecto} 
            onItemClick={onItemClick}
          />
        ))}
      </ul>
    );
  }

  return (
    <p className="text-gray-500 animate-bounce">{t("searching")}</p>
  );
};

export default SearchResults;
