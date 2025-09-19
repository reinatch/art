"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useToggleSearch } from "@/lib/useToggleSearch";
import Search from "@/components/Search";

interface SearchSectionProps {
  isSearchOpen: boolean;
  renderSearchInput?: boolean;
}

export default function SearchSection({ isSearchOpen, renderSearchInput = false }: SearchSectionProps) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const t = useTranslations("NavbarLinks");
  const { openSearch, closeSearch } = useToggleSearch();

  // If we're rendering the search input area
  if (renderSearchInput) {
    return (
      <div
        ref={searchInputRef}
        className="cenas_essencials bottom-0 absolute flex caret_container flex-end justify-center items-end w-full h-[7vh]"
      >
        <Search />
      </div>
    );
  }

  // Otherwise render the search toggle button
  return (
    <div
      className="uppercase absolute left-4 md:left-10 w-[10vw] z-[55] text-start bottom-4 md:bottom-10 leading-3 cursor-pointer"
      onClick={() => {
        if (isSearchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }}
    >
      {t("search")}
    </div>
  );
}
