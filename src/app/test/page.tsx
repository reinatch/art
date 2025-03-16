"use client"


import { useInfiniteQuery } from '@tanstack/react-query'
import { Projecto } from "@/utils/types";
// import { getLocale } from "next-intl/server";
import React, { useCallback, useEffect, useState } from 'react';
import { shimmer, toBase64 } from '@/utils/imageUtils';
import Image from 'next/image';

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const perPage = 30;

// export const revalidate = 3600;
// export const dynamic = 'force-static';
interface props {
projects : Projecto[];
totalPages: number;
maxProject:number;

}

export default function Projects() {
  const locale = "en";

  const fetchData = useCallback(async ({ pageParam = 1 }: { pageParam: number; locale: string }): Promise<props> => {
    const url = `${baseUrl}/projectos_cache?acf_format=standard&lang=${locale}&per_page=${perPage}&page=${pageParam}&locale=${locale}`;
    const response = await fetch(url);
    console.log(url)
    if (!response.ok) {
      throw new Error("Failed to fetch tab data");
    }
    return response.json();
  }, [locale]);

  // const tabData = await fetchData();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => fetchData({ pageParam, locale }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage.projects) {
        return undefined
      }
      console.log(lastPage, allPages, lastPageParam, "GGGGGGGGGGGGGGG")
      return lastPageParam + 1
    },
  })
  const [p, setP] = useState<props>({ projects: [], totalPages: 0, maxProject: 0 });
  

 useEffect(() => {
    const handleScroll = () => {
      // alert("oi")
      console.log(hasNextPage, isFetchingNextPage, fetchNextPage(), "RRRRRRRRRRRRRRRR", data)
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 2) {
        if (data && hasNextPage && !isFetchingNextPage && data.pages[data.pages.length - 1].totalPages) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);
  // useEffect(() => {
  //   fetchData().then(data =>{
      
  //     setP(data)
  //     console.log(data, "eu")
  //   });
  // }, [fetchData])
  
  console.log( data);

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          <ul className='grid grid-cols-2 md:grid-cols-6 gap-4 p-[10vh] overflow-y-scroll pb-[12vh]'>
          {group.projects && group.projects.map((project) => (
              <li key={project.id} >
                
                {project.title.rendered}
                {project.featured_image && (
                                  <Image
                                    src={project.featured_image.url}
                                    alt={project.title.rendered}
                                    width={project.featured_image.width}
                                    height={project.featured_image.height}
                                    // loading="lazy" // Use lazy loading
                                    // priority={false} // Remove priority to defer loading
                                    placeholder={`data:image/svg+xml;base64,${toBase64(
                                      shimmer(700, 475)
                                    )}`}
                                    className="w-full h-auto rounded-md"
                                  />
                                )}
                </li>
              
            ))}
            </ul>
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  )
  // return (
  //   <div><HorizontalTabs slug={"residencias"} /></div>
  // );
}
