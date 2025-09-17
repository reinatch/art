"use client";
import { Projecto } from "@/utils/types";
import React, { useRef, useState, useEffect } from "react";
import { Link as TransitionLink } from "next-transition-router";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useToggleSearch } from "@/lib/useToggleSearch";
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const SearchSimplified: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Projecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState<Projecto[]>([]);
  const locale = useLocale();
  const { closeSearch, isSearchOpen } = useToggleSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Search");
  // Auto-focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 3) {
      setResults([]);
      setFilteredResults([]);
      return;
    }
    setLoading(true);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.length < 3) return;
    setLoading(true);
    handleSearch({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
    setLoading(false);
  };
  const handleResultClick = () => {
    closeSearch();
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
  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-4">
         <form className="relative w-10/12" onSubmit={handleSubmit} action={""}>
            <input
              name="query"
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder={t("submit") }
              className="border-b border-black outline-none w-full px-10 py-2 focus:outline-none focus:ring-none focus:border-blue-700"
            />
          </form>
                    {/* Close button */}
           <button
          className="absolute top-4 right-4 z-50 md:hidden text-3xl font-bold text-black  w-8 h-8 flex items-center justify-center "
          aria-label="Close sitemap"
          onClick={closeSearch}
          type="button"
        >
                <svg
                className={`w-auto h-full rotate-[135deg] ${loading ? "animate-spin" : ""} transition-transform duration-500`} // Fixed: use rotate-[135deg] instead of transform-rotate-[135deg]
                fill="black"
                stroke="black"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeWidth="1" d="M0 15h30M15 0v30" />
              </svg>
        </button>
      </div>
      {/* Results */}
      <div className="space-y-6">
        {query.length >= 3 && (
          <div className="text-sm text-gray-600 mb-4">
            {loading 
              ? t("searching") 
              : `${filteredResults.length} ${filteredResults.length === 1 ? t("result") : t("resultes")}`
            }
          </div>
        )}
        {filteredResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {filteredResults.map((projecto: Projecto) => (
              <TransitionLink
                key={projecto.id}
                href={`/projects/${projecto.slug}`}
                className="flex flex-col gap-4"
                onClick={handleResultClick}
              >
                {projecto.featured_image && (
                  <Image
                    src={projecto.featured_image.url}
                    alt={projecto.title.rendered}
                    width={projecto.featured_image.width / 4}
                    height={projecto.featured_image.height / 4}
                    placeholder="blur"
                    blurDataURL={projecto.featured_image.blurDataURL}
                    className="w-full h-auto rounded-md"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-col">
                  <div className="uppercase text-rodape font-intl text-ellipsis whitespace-nowrap overflow-hidden w-full leading-[1.25em] block my-0">
                    {projecto.acf.page_title}
                  </div>
                  <div className="text-ellipsis lowercase whitespace-nowrap font-works overflow-hidden w-full text-xs my-0">
                    {projecto.title.rendered}, {projecto.acf.year}
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>
        )}
        {query.length >= 3 && !loading && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">{t("noResults")}</p>
            <p className="text-sm text-gray-400">{t("tryAgain")}</p>
          </div>
        )}
        {query.length < 3 && query.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("3char")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchSimplified;
