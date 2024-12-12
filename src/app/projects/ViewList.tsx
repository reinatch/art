"use client"

import { useState } from "react";
import { Projecto } from "@/utils/types";
import { fetchProjectsByPage } from "@/utils/fetch";
import Image from "next/image";

interface ProjectListProps {
  initialProjects: Projecto[];
}

const ViewList: React.FC<ProjectListProps> = ({ initialProjects }) => {
  const [projects, setProjects] = useState<Projecto[]>(initialProjects);
  const [page, setPage] = useState(2); // Start with page 2 for the next load
  const [loading, setLoading] = useState(false);

  const loadMoreProjects = async () => {
    setLoading(true);
    const { projects: newProjects } = await fetchProjectsByPage(page, 30); // Fetch 6 more projects
    setProjects((prevProjects) => [...prevProjects, ...newProjects]); // Append new projects
    setPage(page + 1);
    setLoading(false);
  };

  return (
    <div
    data-scroll-section
    className="flex flex-col overflow-y-scroll items-center justify-items-center h-screen min-h-screen p-8 pb-20 gap-16 sm:p-20"
  >
      {/* Existing filtering and view logic goes here */}
      
      {/* Render the projects */}
      <ul className="grid grid-cols-6 gap-4">
        {projects.map((projecto) => (
            <li className="relative w-full" key={projecto.id}>
            <Image
              src={projecto.featured_image.url}
              alt={projecto.title.rendered}
              width={projecto.featured_image.width}
              height={projecto.featured_image.height}
              className="w-full h-auto"
            />
            <div className="uppercase text-sm font-intl text-ellipsis whitespace-nowrap overflow-hidden w-full leading-[1.25em] block my-0">
              {projecto.acf.page_title}
            </div>
            <div className="text-ellipsis whitespace-nowrap font-works overflow-hidden w-full text-xs my-0">
              {projecto.title.rendered}
            </div>
          </li>
        ))}
      </ul>

      {/* Load More Button */}
      <button
        onClick={loadMoreProjects}
        disabled={loading}
        className="mt-4 p-2 bg-blue-500 text-white"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

export default ViewList;
