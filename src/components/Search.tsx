"use client";
import { Projecto } from "@/utils/types";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link as TransitionLink } from "next-transition-router";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useToggleSearch } from "@/lib/useToggleSearch";
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
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Search");
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
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    },
    [closeModal, modalRef]
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
    <div className="relative mx-auto w-[50vw]  md:-bottom-2 bottom-96">
      <div className="flex flex-col gap-4">
        <div className="flex flex-end">
          <form className="w-11/12" onSubmit={handleSubmit} action={""}>
            <input
              name="query"
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder=""
              className="border-b border-black outline-none w-full px-10 py-2 focus:outline-none focus:ring-none focus:border-blue-700"
            />
          </form>
          <button className="w-1/12" type="submit">
            {t("submit")}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <div
            ref={modalRef}
            className="bottom-[8vh] bg-white bg-opacity-90 absolute w-[94vw] h-[80vh] px-12 rounded-lg overflow-y-auto py-12 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => closeModal()}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">{t("results")}</h2>
            <div className={`relative bottom-0 ${loading ? "opacity-100" : "opacity-0"}`}>
              {t("searching")}
            </div>
            {filteredResults.length > 0 ? (
              <ul className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {filteredResults.map((projecto: Projecto) => (
                  <li key={projecto.id} className="relative w-full">
                    <TransitionLink 
                      href={`/projects/${projecto.slug}`} 
                      className="flex flex-col gap-4"
                      onClick={closeModal}
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
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 animate-bounce">{t("searching")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Search;