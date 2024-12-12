import { Projecto } from "@/utils/types";
// import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import TransitionLink from "./TransitionLink";
// import Image from "next/image";




import gsap from "gsap";
import { useLocale, useTranslations } from 'next-intl';
// import { useToggleContact } from "@/lib/useToggleContact";
import { useToggleSearch } from "@/lib/useToggleSearch";
import ReactDOM from "react-dom";
// import Form from 'next/form'
interface ProjectListItemProps {
  projecto: Projecto;
  onMouseEnter: (id: number) => void;
  onMouseLeave: () => void;
}
const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Projecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setHoveredProjectId] = useState<number | null>(null);
  const locale = useLocale(); // Get the current locale
  const { closeSearch, isSearchOpen, openSearch } = useToggleSearch();
  // const { closeContact, isContactOpen, openContact } = useToggleContact();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const memoizedPositions = useRef<{ [key: number]: { x: number; y: number; z: number } }>({});
  const modalRef = useRef<HTMLDivElement>(null);  // Reference to modal
  const t = useTranslations("Search");
  const getRandomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const handleMouseEnter = (id: number) => {
    if (!memoizedPositions.current[id]) {
      memoizedPositions.current[id] = {
        x: getRandomInRange(10, 30),
        y: getRandomInRange(10, 30),
        z: 0,
      };
    }

    gsap.set(`#element-${id} img`, {
      x: `${memoizedPositions.current[id].x}vw`,
      y: `${memoizedPositions.current[id].y}vh`,
      zIndex: memoizedPositions.current[id].z,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    setHoveredProjectId(null);
  };

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
        `${baseUrl}/projectos?search=${value}&per_page=15&_fields=id,title,slug,acf,featured_image&wpessid&lang=${locale}`
      );
      const data = await response.json();
      setResults(data as Projecto[]);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuery("");
    setResults([]);

  
      if (isSearchOpen) {
      closeSearch();
      }else {
      
      }
      
    
  };

  // Close modal if click is outside the modal
  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    // Add event listener for outside click
    document.addEventListener("click", handleOutsideClick);

    return () => {
      // Cleanup event listener
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Perform the search or navigate to the search results page
    handleSearch({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
    setLoading(false);
  };
  // Handle search input timeout logic
 
  useEffect(() => {
    const closeSearchAfterTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        if (isSearchOpen) {
          closeSearch();
        } else {
          closeSearchAfterTimeout();
        }
      }, 100000); // 1 minute
    };
  
    if (isModalOpen) {
      if (timeoutRef.current) {
        closeSearchAfterTimeout();
      }
      return;
    }
  
    // if (isSearchOpen) {
    //   closeSearchAfterTimeout();
    // } else {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }
    // }
  
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSearchOpen, isModalOpen, closeSearch, openSearch]);


  const ProjectListItem: React.FC<ProjectListItemProps> = ({ projecto, onMouseEnter, onMouseLeave }) => (
    <li
      id={`element-${projecto.id}`}
      className="hover__item flex gap-4 w-9/12 pl-10 -indent-10"
      onMouseEnter={() => onMouseEnter(projecto.id)}
      onMouseLeave={onMouseLeave}
    >
      <div className="hover__item-image_wrapper top-1/2 left-1/2 opacity-100 flex" onClick={() => closeModal()}>
        <TransitionLink href={`/projects/${projecto.slug}`} className="hover__item-text relative font-works flex" onClick={() => closeModal()}>
          <div className="hover__item-innertext flex gap-2 uppercase">
            <div className="w-full">
              <span className="font-intl">{projecto.title.rendered}, </span>
              <span>{projecto.acf.year}</span>
            </div>
          </div>
        </TransitionLink>
        <div className="hover__item-image_inner fixed top-0 h-auto w-[20vw] object-cover hidden">
          {/* <Image
            className="hover__item-image absolute"
            src={projecto.featured_image?.url || ""}
            alt={projecto.title.rendered || "Project Image"}
            width={500}
            height={500}
            loading="eager"
            priority={true}
          /> */}
        </div>
      </div>
    </li>
  );

  return (
    <div className="relative mx-auto w-[50vw]">
     <div className="flex flex-col gap-4">
            <div className="flex   ">

              <form className="w-11/12" onSubmit={handleSubmit} action={""}>
              <input name="query" 
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder=""
                className="border-b border-black outline-none  w-full px-10 py-2 focus:outline-none focus:ring-none focus:border-blue-700"/>
            </form>
              <button className="w-1/12" type="submit">{t("submit")}</button>
            </div>
     </div>
      {/* <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        className="border-b border-black outline-none  w-full px-10 py-2 focus:outline-none focus:ring-none focus:border-blue-700"
      /> */}
{/* blinking-cursor */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => closeModal()}>
          <div
            ref={modalRef}
            className="bg-white bg-opacity-90 absolute w-[100vw] h-[80vh] px-12 rounded-lg overflow-auto -top-[80vh] py-12 flex flex-col items-center"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">{t("results")}</h2>
            <div className={`relative bottom-0 ${loading ? "opacity-100" : "opacity-0"}`}>{t("searching")}</div>

            {results.length > 0 ? (
              <ul className="space-y-2 text-start w-full">
                {results.map((projecto) => (
                  <ProjectListItem
                    key={projecto.id}
                    projecto={projecto}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 animate-bounce">{t("searching")}</p>
            )}
          </div>
        </div>
      )} */}
            {isModalOpen &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => closeModal()}
          >
            <div
              ref={modalRef}
              className="bg-white bg-opacity-90 absolute w-[100vw] h-[80vh] px-12 rounded-lg overflow-auto py-12 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => closeModal()}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">{t("results")}</h2>
              <div className={`relative bottom-0 ${loading ? "opacity-100" : "opacity-0"}`}>{t("searching")}</div>
              {results.length > 0 ? (
                <ul className="space-y-2 text-start w-full" onClick={() => closeModal()}>
                  {results.map((projecto) => (
                    <ProjectListItem
                      key={projecto.id}
                      projecto={projecto}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 animate-bounce">{t("searching")}</p>
              )}
            </div>
          </div>,
          document.body
        )
      }

    </div>
  );
};

export default Search;
