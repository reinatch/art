"use client";
import { Projecto } from "@/utils/types";
import { Link as TransitionLink } from "next-transition-router";
import Image from "next/image";

interface SearchResultItemProps {
  projecto: Projecto;
  onItemClick: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ projecto, onItemClick }) => {
  return (
    <li key={projecto.id} className="relative w-full">
      <TransitionLink 
        href={`/projects/${projecto.slug}`} 
        className="flex flex-col gap-4"
        onClick={onItemClick}
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
  );
};

export default SearchResultItem;
