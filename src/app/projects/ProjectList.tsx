"use client";

import { useState, useEffect, useRef} from "react";
import Image from 'next/image';
import { Projecto, Material, Artista } from "@/utils/types"; // Ensure Material type is imported
import { getAllMaterials, getAno, getAllArtists } from "@/utils/fetch"; 
import CustomRadio from '@/components/CustomRadio';
import React from "react";
// import Link from "next/link";
import Loading from '@/components/Loading';
import TransitionLink from "@/components/TransitionLink";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { useLocale } from "next-intl";
import CustomRadioMaterial from "@/components/CustomRadioMaterial";
import { v4 as uuidv4 } from 'uuid';
import {useTranslations} from 'next-intl';
import { useToggleContact } from "@/lib/useToggleContact";

interface ProjectListProps {
  projectos: Projecto[];
  materials: Material[];
  years: number[];
  artists: Artista[];
  
}
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#fff" offset="20%" />
      <stop stop-color="#ebecf0" offset="50%" />
      <stop stop-color="#fff" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#fff" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);


    interface FilterListProps {
      items: { id: number; name: string }[];
      onClick: (id: number) => void;
      selectedId: number | null;
    }
interface ProjectListItemProps { 
  projecto: Projecto;
  onMouseEnter: (id: number) => void;
  onMouseLeave: () => void;
  hoveredProjectId: number | null;
}

const ProjectList: React.FC<ProjectListProps> = ({ projectos, materials: initialMaterials, years: initialYears, artists: initialArtists }) => {
  const [viewMode, setViewMode] = useState("gallery"); // Default to "gallery"
  const [selectedFilter, setSelectedFilter] = useState<string | null>("ano"); // State to manage selected filter
  const [materials, setMaterials] = useState<Material[]>(initialMaterials); // State to manage fetched materials
  const [years, setYears] = useState<number[]>(initialYears);
  const [artists, setArtists] = useState<Artista[]>(initialArtists); // To store artist data
  const [loading, setLoading] = useState(false); // Add loading state
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const containerRef = useRef<HTMLUListElement>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  // const [preloadedImages, setPreloadedImages] = useState({});
  const locale = useLocale();
  const t = useTranslations("ProjectList");

  gsap.registerPlugin(useGSAP);
  const { contextSafe } = useGSAP({ scope: containerRef });
  const { isContactOpen, closeContact } = useToggleContact();

 
  useEffect(() => {
    const sitempa = document.querySelector("#sitemap");
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the sitemap
      if (sitempa && !sitempa.contains(event.target as Node)) {
        closeContact(); // Toggle contact if clicked outside
      }
    };

    const handleScroll = () => {
      if (isContactOpen) {
        closeContact(); // Toggle contact on scroll if it's open
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeContact, isContactOpen]);
 
  useEffect(() => {
    // console.log(materials, years, artists)
    // Preload images
    // const imageMap: { [key: number]: HTMLImageElement } = {};
    // projectos.forEach((projecto) => {
    //   const img = new window.Image();
    //   img.src = projecto.featured_image.url;
    //   imageMap[projecto.id] = img;
    // });
    // setPreloadedImages(imageMap);
    // // console.log("preloadedImages",preloadedImages)
  }, [artists, materials, projectos, years]);
  // const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number; z: number } }>({});
  const getRandomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  // Memoize the random positions
  const memoizedPositions = useRef<{ [key: number]: { x: number; y: number; z: number } }>({});
  
  
  
  const handleMouseEnter = (id: number) => {
    if (!memoizedPositions.current[id]) {
      // Generate random positions
      const randomX = getRandomInRange(0, 20); // Horizontal position (10vw to 30vw)
      const randomY = getRandomInRange(10, 50);; // Vertical position (10dvh to 20dvh)
      const randomZ = 10; // Adjust z-index range as needed
  
      // Store the positions in the memoized object
      memoizedPositions.current[id] = { x: randomX, y: randomY, z: randomZ };
    }
    console.log(memoizedPositions.current[id].x, memoizedPositions.current[id].y)
    // Animate the element using GSAP
    gsap.set(`#element-${id} img`, {
      x: `${memoizedPositions.current[id].x}vw`,
      y: `${memoizedPositions.current[id].y}dvh`,
      zIndex: memoizedPositions.current[id].z,
      // duration: 0.5,
      ease: "power1.inOut",
    });
  };
  // const handleMouseEnter = (id: numbervent: React.MouseEvent<HTMLLIElement>) => {
  //   const mouseX = event.clientX;
  //   const mouseY = event.clientY;
  
  //   if (!memoizedPositions.current[id]) {
  //     // Generate random positions near the mouse position
  //     const randomX = getRandomInRange(mouseX - 50, mouseX + 50); // Horizontal position near mouse
  //     const randomY = getRandomInRange(mouseY - 50, mouseY + 50); // Vertical position near mouse
  //     const randomZ = 0; // Adjust z-index range as needed
  
  //     // Store the positions in the memoized object
  //     memoizedPositions.current[id] = { x: randomX, y: randomY, z: randomZ };
  //   }
  
  //   // Animate the element using GSAP
  //   gsap.set(`#element-${id} img`, {
  //     x: `${memoizedPositions.current[id].x}px`,
  //     y: `${memoizedPositions.current[id].y}px`,
  //     zIndex: memoizedPositions.current[id].z,
  //     ease: "power1.inOut",
  //   });
  //   setHoveredProjectId(id);
  // };

   const handleMouseLeave = contextSafe(() => {
    setHoveredProjectId(null);
    // console.log("leavinging",id)
  });
  const FilterOptions = [
    { id: 'artistas', label: t("artists"), value: 'artistas' },
    { id: 'ano', label: t("years"), value: 'ano' },
    { id: 'materiais', label: t("materiais"), value: 'materiais' },
  ];
  const viewOptions = [
    { id: 'lista', label: t("list"), value: 'list' },
    { id: 'galeria', label: t("gallery"), value: 'gallery' },
  ];
// console.log(projectos);
  // Fetch materials when selectedFilter is "materiais" and viewMode is "galeria"
//   useEffect(() => {
//     const fetchMaterials = async () => {
//       const data = await getAllMaterials(); 
//       console.log(data); // Log the fetched materials
//       setMaterials(data); // Store materials in state if needed
//     };

//     if (selectedFilter === "materiais" && viewMode === "gallery") {
//       fetchMaterials();
//     }
//   }, [selectedFilter, viewMode]); // Dependency array
useEffect(() => {
  const fetchData = async () => {
    setLoading(true); // Set loading to true before starting the fetch
    try {
      if (selectedFilter === 'materiais' && materials.length === 0) {
        const data = await getAllMaterials(locale);
        // console.log("data",data)
        setMaterials(data);
      } else if (selectedFilter === 'ano' && years.length === 0) {
        const yearData = await getAno(locale);
        setYears(yearData);
      } else if (selectedFilter === 'artistas' && artists.length === 0) {
        const artistData = await getAllArtists(locale);
        setArtists(artistData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching is done
    }
  };

  fetchData();
}, [selectedFilter, artists.length, materials.length, years.length, locale]);

// Helper function to group projects by year
const groupByYear = (projects: Projecto[]) => {
  // Group projects by year
  const grouped = projects.reduce((acc, projecto) => {
    const year = projecto.acf.year.trim(); // Trim year to remove any extra spaces
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(projecto);
    return acc;
  }, {} as Record<string, Projecto[]>);

  // Convert grouped object to array and sort by year in descending order
  const sortedGroupedArray = Object.entries(grouped)
    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Sort by year in descending order
    .map(([year, projects]) => ({ year, projects })); // Transform to array of objects

  return sortedGroupedArray; // Return an array of objects
};

// Example usage
const filteredProjects = selectedFilter
  ? projectos
      .filter((projecto) => {
        if (selectedFilter === "ano" && years.includes(parseInt(projecto.acf.year, 10))) {
          return true;
        }
        return true; // Adjust this logic as needed
      })
      .sort((a, b) => {
        if (selectedFilter === "artistas" && viewMode === "gallery") {
          return a.acf.page_title.localeCompare(b.acf.page_title);
        }
        return 0;
      })
  : projectos;

const groupedYearsProjects = groupByYear(filteredProjects);




const handleArtistClick = (artistId: number) => {
  setSelectedArtist(artistId === selectedArtist ? null : artistId); 
};
const handleMaterialClick = (materialId: number) => {
  setSelectedMaterial(materialId === selectedMaterial ? null : materialId); 
};
const handleYearClick = (year: number) => {
  setSelectedYear(year === selectedYear ? null : year); 
};


const filteredArtistProjects = selectedArtist
? filteredProjects.filter((projecto) =>
  projecto.artistas?.includes(selectedArtist)
)
: filteredProjects;

const filteredMaterialProjects = selectedMaterial
  ? filteredProjects.filter((projecto) => {
      // console.log(`Checking project ${projecto.id} with materiais:`, projecto.materiais);
      return projecto.materiais?.includes(Number(selectedMaterial));
    })
  : filteredProjects;
  
  const filteredYearProjects = selectedYear
    ? groupedYearsProjects.filter(({ year }) => {
        // console.log(`Checking year ${year}`);
        return year === selectedYear.toString();
      })
    : groupedYearsProjects;

// console.log("groupedYearsProjects", filteredYearProjects);

// useEffect(() => {
//   return () => {
//     // selectedMaterial
//     console.log(selectedMaterial)
//     // console.log(selectedArtist)
//   };
// }, [selectedMaterial])




const FilterList: React.FC<FilterListProps> = ({ items, onClick, selectedId }) => (
  <ul>
    {items.map((item) => (
      <li className="js-filter-item" key={uuidv4()}>
        <a 
          data-name={item.name} 
          data-id={item.id} 
          href="#" 
          onClick={() => onClick(item.id)}
          className={`js-filter-item uppercase ${selectedId === item.id ? "ml-10 font-works" : ""}`}>
          {item.name}
        </a>
      </li>
    ))}
  </ul>
);
const ProjectListItem: React.FC<ProjectListItemProps> = React.memo(({ projecto, onMouseEnter, onMouseLeave }) => (
  <li 
     key={uuidv4()}
    id={`element-${projecto.id}`}
    className="hover__item flex gap-4 w-9/12 pl-10 -indent-10"
    onMouseEnter={() => onMouseEnter(projecto.id)}
    onMouseLeave={onMouseLeave}
  >
    <div className="hover__item-image_wrapper top-1/2 left-1/2 opacity-100 flex">
      <TransitionLink href={`/projects/${projecto.slug}`} className="hover__item-text relative font-works flex ">
        <div className="hover__item-innertext flex gap-2 uppercase">
          <div className="w-full">
            <span >{projecto.title.rendered}, </span>
            {selectedFilter === "ano" ?
            (<span className="font-intl">{projecto.acf.page_title}</span>) :
            (<span className="font-intl">{projecto.acf.year}</span>)
          }
          </div>
        </div>
      </TransitionLink>
      <div 
        data-id={projecto.id} 

        className={`hover__item-image_inner fixed top-0 h-auto w-[20vw] object-cover hidden z-10`}
      >
        <Image className="hover__item-image absolute z-50 rounded-md" src={projecto.featured_image.url} alt={""} width={500} height={500} loading="eager" priority={true} />
      </div>
    </div>
  </li>
));
ProjectListItem.displayName = "ProjectListItem";
    return (
      <div className="flex flex-col items-center w-screen text-sm md:text-xl justify-items-center h-screen min-h-screen pb-32 px-4 md:px-10 gap-4">
        <div className="project-inner flex w-full flex-col h-[80dvh] mt-[12dvh] gap-4 md:gap-8 ">

        {/* Filter Options */}
        <div className="filtering flex  justify-between w-full uppercase">
          <form id="term-options" className="view-filter col gap-y-0 form-check flex flex-row flex-wrap md:flex-row w-full md:w-1/2 ">
            {FilterOptions.map((option, index) => (
              <React.Fragment key={option.id}>
                <CustomRadio
                  id={option.id}
                  label={option.label}
                  name="term"
                  value={option.value}
                  checked={selectedFilter === option.value}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                />
                {index < FilterOptions.length - 1 && <span className="separador1 pr-4  md:block"> \ </span>}
              </React.Fragment>
            ))}
          </form>
    
          {/* View Options */}
          <form id="view-options" className="pl-2 hidden view-options col form-check md:flex w-1/2">
            {viewOptions.map((option, index) => (
              <React.Fragment key={option.id}>
                <CustomRadio
                  id={option.id}
                  label={option.label}
                  name="term"
                  value={option.value}
                  checked={viewMode === option.value}
                  onChange={() => setViewMode(option.value)}
                />
                {index < viewOptions.length - 1 && <span className="separador1 pr-4"> \ </span>}
              </React.Fragment>
            ))}
          </form>
        </div>
    
        {/* Conditional Rendering Based on View Mode and Filter */}
        {viewMode === "gallery" && (
          <>
            {selectedFilter === "artistas" && (







              <ul className="grid grid-cols-2 md:grid-cols-6 gap-4 overflow-y-scroll pb-[12vh]">
                {filteredProjects.map((projecto) => (
                  <li  key={uuidv4()} className="relative w-full ">
                    <TransitionLink href={`/projects/${projecto.slug}`} className="flex flex-col gap-4">
                  
                    {projecto.featured_image &&   <Image
                          src={projecto.featured_image.url}
                          alt={projecto.title.rendered}
                          width={projecto.featured_image.width}
                          height={projecto.featured_image.height}
                          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                          className="w-full h-auto rounded-md"
                        />}
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
            )}
    












            {selectedFilter === "materiais" && (
              <>
                <div id="field7" className="w-full  h-min">
                {loading ? (
                  <>
                  <div className="h-[15dvh]"><Loading/></div> 
                  </>
                      ) : (
                   
                 
                          <div className="flex flex-wrap uppercase justify-center md:justify-normal">
                            
                            {/* <form id="tetions" className="view-filter form-check flex flex-wrap"> */}
                            
                            {materials.map((option, index) => (
                              <React.Fragment key={option.id}>
                       
                                  <CustomRadioMaterial
                                    id={option.id.toString()}
                                    label={option.name}
                                    value={option.id.toString()}
                                    name="materialcheckbox"
                                    checked={selectedMaterial === option.id}
                                    onChange={(e) => {
                                      // console.log("Selected Material:", selectedMaterial, e.target.value); // Debugging line
                                      setSelectedMaterial(Number(e.target.value));
                                    }}
                                  />
                                  {index < materials.length - 1 && <span className="separador1 pr-2 items-baseline font-mono text-[0.55rem] md:text-rodape leading-3 "> \ </span>}
                                </React.Fragment>


    
                            ))}

                          </div>
              
            )}
            </div>
                <ul className="grid grid-cols-2 md:grid-cols-6 gap-4 overflow-y-scroll pb-[12vh]" >
                  {filteredMaterialProjects.map((projecto) => (
                    <li  key={uuidv4()} className="relative w-full">
                      <TransitionLink href={`/projects/${projecto.slug}`} className="flex flex-col gap-4">
                  
                      {projecto.featured_image &&   <Image
                          src={projecto.featured_image.url}
                          alt={projecto.title.rendered}
                          width={projecto.featured_image.width}
                          height={projecto.featured_image.height}
                          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                          className="w-full h-auto rounded-md"
                        />}
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
              </>
            )}
    









          {selectedFilter === "ano" && (
        <div className="overflow-y-scroll pb-[12vh]">
          {groupedYearsProjects.map(({ year, projects }) => ( // Iterate over the array
            <div key={uuidv4()}>
              <h2 className="text-xl py-4">{year}</h2>
              <ul className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {projects.map((projecto: Projecto) => (
                      <li  key={uuidv4()} className="relative w-full">
                      <TransitionLink href={`/projects/${projecto.slug}`} className="flex flex-col gap-4">
                  
                       {projecto.featured_image &&   <Image
                          src={projecto.featured_image.url}
                          alt={projecto.title.rendered}
                          width={projecto.featured_image.width}
                          height={projecto.featured_image.height}
                          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                          className="w-full h-auto rounded-md"
                        />}
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
            </div>
          ))}
        </div>
      )}

          </>
        )}
    
        {viewMode === "list" && (
          <div className="flex w-full h-[70dvh]">
            <div className="w-1/2 pr-4 overflow-y-scroll pb-[12vh]">
                {loading && (artists.length === 0 || years.length === 0 || materials.length === 0) ? (
                        <div className="w-full h-full"><Loading/></div> // Customize loading message/UI as needed
                      ) : (
                   
      //           <>  
      //               <ul>
      //               {selectedFilter === "artistas" &&
      //                 artists.map((artist) => (
      //                   <li className="js-filter-item" key={artist.id}>
      //                    <a 
      //                    data-name={artist.name} 
      //                    data-id={artist.id} 
      //                    href="#" 
      //                    onClick={() => handleArtistClick(artist.id)}
      //                    className={`js-filter-item ${selectedArtist === artist.id ? "ml-10 font-works" : ""}`}>

      //                     {artist.name}
      //                    </a>

      //                     </li>
      //                 ))}
      //             </ul>
      //  {loading && (artists.length === 0 || years.length === 0 || materials.length === 0) ? (
      //                   <div className="w-auto h-20"><Loading/></div> // Customize loading message/UI as needed
      //                 ) : (
      //             <ul>
      //                 {selectedFilter === "materiais" &&
      //                   materials.map((material) => (
      //                     <li className="js-filter-item" key={material.id}>
      //                    <a 
      //                    data-name={material.name} 
      //                    data-id={material.id} 
      //                    href="#" 
      //                    onClick={() => handleMaterialClick(material.id)}
      //                    className={`js-filter-item uppercase ${selectedMaterial === material.id ? "ml-10 font-works" : ""}`}>

      //                     {material.name}
      //                    </a>
      //                     </li>
      //                   ))}
      //               </ul>


      //                 )}
      //                   {loading && (artists.length === 0 || years.length === 0 || materials.length === 0) ? (
      //                   <div className="w-auto h-20"><Loading/></div> // Customize loading message/UI as needed
      //                 ) : (

      //               <ul>
      //                 {selectedFilter === "ano" &&
      //                   years.map((year) => (
                        
      //                     <li className="js-filter-item" key={year}>
      //                     <a 
      //                     data-name={year} 
      //                     data-id={year} 
      //                     href="#" 
      //                     onClick={() => handleYearClick(year)}
      //                     className={`js-filter-item ${selectedYear === year ? "ml-10 font-works" : ""}`}>
 
      //                      {year}
      //                     </a>
      //                      </li>
      //                 )
      //                 )}
      //               </ul>
      //                )}
                    
      //           </>
      <>
      {selectedFilter === "artistas" && (
        <FilterList items={artists} onClick={handleArtistClick} selectedId={selectedArtist} />
      )}
      {selectedFilter === "materiais" && (
        <FilterList items={materials} onClick={handleMaterialClick} selectedId={selectedMaterial} />
      )}
      {selectedFilter === "ano" && (
        <FilterList items={years.map(year => ({ id: year, name: year.toString() }))} onClick={handleYearClick} selectedId={selectedYear} />
      )}
    </>
               )}
            </div>
    
            <div className="w-1/2 pl-4 overflow-y-scroll pb-[12vh]">
            {/* {selectedFilter === "artistas" &&
         (   <ul id={artist} class="'.$term_id.'">
            <h5 class="nome '.$term_id.'">'.$termName.' </h5>';


          <li id="listaaaa" class="'.$term_id.'"><a id="font-proj" class="'. $term_id.'" href="'. get_permalink($post->ID).'" data-value="'. get_post_field( 'post_name', $post->ID ).'">
          '. get_the_title($post->ID).',  '. get_field('year', $post->ID).'
          </a>
          <div id="thum" class="'. $post->ID.'">'. get_the_post_thumbnail( $post->ID, 'full',array('class' =>  get_post_field( 'post_name', $post->ID ) )).'</div>
          </li>

          </ul>)
            } */}
              {/* <ul ref={containerRef} className="w-full h-full">
              {selectedFilter === "artistas" &&
                <>
                <li className="pb-4 uppercase w-full">
                    {artists.find(artist => artist.id === selectedArtist)?.name}
                </li>
                



               { filteredArtistProjects.map((projecto) => (
                  <li 
                  key={projecto.id} 
                  className="hover__item flex gap-4 w-9/12 pl-10 -indent-10"
                  onMouseEnter={() => handleMouseEnter(projecto.id)}
                  onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className="hover__item-image_wrapper top-1/2 left-1/2 opacity-100 flex">


                      <TransitionLink href={`/projects/${projecto.slug}`} className="hover__item-text relative font-works flex ">
                          <div className="hover__item-innertext flex gap-2 uppercase">

                          <div className=" w-full"><span className="font-intl">{projecto.title.rendered}, </span><span>{projecto.acf.year}</span></div>
                          </div>

                      </TransitionLink>
                      <div data-id={projecto.id} className={`hover__item-image_inner relative  w-[20vw] h-auto  transition-opacity duration-1000 ${ hoveredProjectId === projecto.id ? 'flex opacity-100' : 'hidden opacity-0'}`}>

                        <Image className="hover__item-image absolute w-[20vw] h-auto object-contain" src={projecto.featured_image.url} alt={""} width={500} height={500} loading="eager" priority={true}/>

                      </div>
                    </div>
                  </li>
                ))}
                </>
                }
                {selectedFilter === "materiais" &&
                <>
                <h5 className="pb-4 uppercase">
                    {materials.find(material => material.id === selectedMaterial)?.name}
                </h5>
               { filteredMaterialProjects.map((projecto) => (
                  // <li key={projecto.id} className="flex gap-4">


                  //   <TransitionLink href={`/projects/${projecto.slug}`} className="font-works flex gap-4 uppercase">
                  //       <div className="whitespace-nowrap">{projecto.title.rendered},</div>
                  //       <div className="w-max">{projecto.acf.year}</div>
                  //   </TransitionLink>
                  //   <Image src={projecto.featured_image.url} alt={""} width={500} height={500}>

                  //   </Image>
                  // </li>
                  <li 
                  key={projecto.id} 
                  className="hover__item flex gap-4 w-9/12 pl-10 -indent-10"
                  onMouseEnter={() => handleMouseEnter(projecto.id)}
                  onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className="hover__item-image_wrapper top-1/2 left-1/2 opacity-100 flex">


                      <TransitionLink href={`/projects/${projecto.slug}`} className="hover__item-text relative font-works flex ">
                          <div className="hover__item-innertext flex gap-2 uppercase">

                          <div className=" w-full"><span className="font-intl">{projecto.title.rendered}, </span><span>{projecto.acf.year}</span></div>

                          </div>

                      </TransitionLink>
                      <div data-id={projecto.id} className={`hover__item-image_inner  left-1/2 top-0 h-full w-full object-cover transition-opacity duration-1000 ${ hoveredProjectId === projecto.id ? 'flex opacity-100' : 'hidden opacity-0'}`}>

                        <Image className="hover__item-image absolute" src={projecto.featured_image.url} alt={""} width={500} height={500} loading="eager" priority={true}/>

                      </div>
                    </div>
                  </li>
                ))}
                </>
                }
                {selectedFilter === "ano" &&
                <>
                <h5 className="pb-4">
                    {years.find(year => year === selectedYear)}
                </h5>
               { filteredYearProjects.map((group) => (
                <div key={group.year}>
                  <ul>
                    {group.projects.map((projecto) => (
       
                <li 
                key={projecto.id} 
                className="hover__item flex gap-4 w-9/12 pl-10 -indent-10"
                onMouseEnter={() => handleMouseEnter(projecto.id)}
                onMouseLeave={() => handleMouseLeave()}
                >
                  <div className="hover__item-image_wrapper top-1/2 left-1/2 opacity-100 flex">


                    <TransitionLink href={`/projects/${projecto.slug}`} className="hover__item-text relative font-works flex ">
                        <div className="hover__item-innertext flex gap-2 uppercase">

                        <div className=" w-full"><span className="font-intl">{projecto.acf.page_title}, </span><span>{projecto.title.rendered}</span></div>

                        </div>

                    </TransitionLink>
                    <div 
                    data-id={projecto.id} 
                    className={`hover__item-image_inner  top-0 h-full w-full object-cover ${ hoveredProjectId === projecto.id ? 'flex opacity-100' : 'hidden opacity-0'}`}
                    style={{
                      position: "fixed",
                      marginLeft: `${positions[projecto.id]?.x || 0}vw`,
                      marginTop: `${positions[projecto.id]?.y || 0}dvh`,
                      zIndex: positions[projecto.id]?.z || 1,
                    }}
                    >

                      <Image 
                      className="hover__item-image absolute" 
                      src={projecto.featured_image.url} alt={""} 
                      width={500} 
                      height={500} 
                      loading="eager" 
                      priority={true}
                      
                      />

                    </div>
                  </div>
                </li>
                    ))}
                  </ul>
          
                </div>
               ))}
                </>
                }
              </ul> */}
              <ul ref={containerRef} className="w-full h-full">
  {selectedFilter === "artistas" && (
    <>
      <li className=" uppercase w-full">
        {artists.find(artist => artist.id === selectedArtist)?.name}
      </li>
      <div className={`${selectedArtist ? "pt-4" : ""}`}>
      {filteredArtistProjects.map((projecto) => (
        <ProjectListItem 
           key={uuidv4()}
          projecto={projecto} 
          onMouseEnter={() => {handleMouseEnter(projecto.id)}} 
          onMouseLeave={handleMouseLeave} 
          hoveredProjectId={hoveredProjectId} 
        /> 
      ))}
      </div>
    </>
  )}
  
  {selectedFilter === "materiais" && (
    <>
      <h5 className="uppercase">
        {materials.find(material => material.id === selectedMaterial)?.name}
      </h5>
      <div  className={`${selectedMaterial ? "pt-4" : ""}`}>
      {filteredMaterialProjects.map((projecto) => (

          <ProjectListItem 
             key={uuidv4()}
            projecto={projecto} 
            onMouseEnter={() => {handleMouseEnter(projecto.id)}} 
            onMouseLeave={handleMouseLeave} 
            hoveredProjectId={hoveredProjectId} 
          />
        ))}
        </div>
    </>
  )}
  
  {selectedFilter === "ano" && (
    <>
      <h5 className="">
        {years.find(year => year === selectedYear)}
      </h5>
      {filteredYearProjects.map((group) => (
        <div key={uuidv4()} className={`${selectedYear ? "py-4" : ""}`}>
          <ul>
            {group.projects.map((projecto) => (
              <ProjectListItem 
                 key={uuidv4()}
                projecto={projecto} 
                onMouseEnter={() => {handleMouseEnter(projecto.id)}} 
                onMouseLeave={handleMouseLeave} 
                hoveredProjectId={hoveredProjectId} 
              />
            ))}
          </ul>
        </div>
      ))}
    </>
  )}
</ul>
            </div>
          </div>
        )}
        </div>
      </div>
    );
    
  }
export default ProjectList;
