"use client";
import { Projecto } from "@/utils/types";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { useToggleSearch } from "@/lib/useToggleSearch";
import SearchForm from "./SearchForm";
import SearchModal from "./SearchModal";

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Projecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<Projecto[]>([]);
  const locale = useLocale();
  const { closeSearch, isSearchOpen, openSearch } = useToggleSearch();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    setIsModalOpen(true);
    try {
      const response = await fetch(
        `${baseUrl}/projectos_search?lang=${locale}&search=${value}`
      );
      const data = await response.json();
      setResults(data as Projecto[]);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setQuery("");
    setResults([]);
    setFilteredResults([]);
    if (isSearchOpen) {
      closeSearch();
    }
  }, [isSearchOpen, closeSearch]);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const modalElement = document.querySelector('[data-modal="search"]');
      if (modalElement && !modalElement.contains(e.target as Node)) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    handleSearch({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
    setLoading(false);
  };

  useEffect(() => {
    if (!query || query.length < 3) {
      setFilteredResults([]);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const filtered = (results || []).filter((projecto: Projecto) =>
      projecto.title.rendered?.toLowerCase().includes(lowerCaseQuery) ||
      projecto.slug?.toLowerCase().includes(lowerCaseQuery) ||
      projecto.acf.location?.toLowerCase().includes(lowerCaseQuery) ||
      projecto.acf.right_field?.toLowerCase().includes(lowerCaseQuery) ||
      projecto.acf.year?.toLowerCase().includes(lowerCaseQuery) ||
      projecto.acf.page_title?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredResults(filtered);
  }, [query, results]);

  useEffect(() => {
    const closeSearchAfterTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        if (isSearchOpen) {
          closeSearch();
        } else {
          closeSearchAfterTimeout();
        }
      }, 30000);
    };
    if (isModalOpen) {
      if (timeoutRef.current) {
        closeSearchAfterTimeout();
      }
      return;
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSearchOpen, isModalOpen, closeSearch, openSearch]);

  return (
    <div className="relative mx-auto w-[50vw] md:-bottom-0 bottom-96">
      <div className="flex flex-col gap-4">
        <SearchForm 
          query={query}
          onSearch={handleSearch}
          onSubmit={handleSubmit}
        />
      </div>
      <SearchModal
        isModalOpen={isModalOpen}
        loading={loading}
        filteredResults={filteredResults}
        onCloseModal={closeModal}
        onItemClick={closeModal}
      />
    </div>
  );
};

export default Search;

// Export additional components that might be used elsewhere
export { default as SearchOverlay } from "./SearchOverlay";
export { default as SearchSimplified } from "./SearchSimplified";
