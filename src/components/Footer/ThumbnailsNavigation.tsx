"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { useThumbnailsContext } from "@/lib/useThumbnailsContext";

interface ThumbnailsNavigationProps {
  isProjectPage: boolean;
}

export default function ThumbnailsNavigation({ isProjectPage }: ThumbnailsNavigationProps) {
  const windowSize = useWindowSize();
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const {
    thumbnails,
    selectedThumbnail,
    setSelectedThumbnail,
    thumbRefs,
  } = useThumbnailsContext();

  const [aspectRatios, setAspectRatios] = useState<{ [key: string]: string }>({});

  // Animate thumbnails navigation visibility
  useEffect(() => {
    if (thumbnailsRef.current) {
      if (isProjectPage) {
        console.log('ThumbnailsNavigation: Showing thumbnails');
        gsap.fromTo(thumbnailsRef.current, 
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      } else {
        console.log('ThumbnailsNavigation: Hiding thumbnails');
        gsap.to(thumbnailsRef.current, {
          autoAlpha: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  }, [isProjectPage]);

  const handleImageLoad = (
    thumbnailId: string,
    width: number,
    height: number
  ) => {
    const aspectRatio = width / height;
    setAspectRatios((prevRatios) => ({
      ...prevRatios,
      [thumbnailId]: aspectRatio > 1 ? "landscape" : "portrait",
    }));
  };

  const handleThumbailsClick = useCallback(
    (slug: number, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setSelectedThumbnail(slug);
      const targetElement = thumbRefs.current.find(
        (thumb) => thumb?.id === `${slug}`
      );
      if (targetElement) {
        const sectionsHeights = thumbRefs.current.map((thumb, index) => ({
          id: thumb?.id,
          height: windowSize.height * index,
        }));
        const targetSection = sectionsHeights.find(
          (section) => section.id === `${slug}`
        );
        if (targetSection) {
          const targetHeight = targetSection.height;
          gsap.to(window, {
            scrollTo: {
              y: targetHeight,
              autoKill: false,
            },
            duration: 1,
          });
        }
      }
    },
    [thumbRefs, setSelectedThumbnail, windowSize.height]
  );

  if (!isProjectPage) return null;

  return (
    <div
      ref={thumbnailsRef}
      className={`"${
        isProjectPage ? "pl-32" : ""
      } hidden relative -bottom-[1.25vh] cenas_essencials w-full md:flex overflow-x-auto gap-3 justify-center items-center py-10 "`}
      style={{ opacity: 0 }} // Initial state for GSAP
    >
      {thumbnails.map((thumbnail) => (
        <a
          key={thumbnail.id}
          href={`#${thumbnail.id}`}
          className=""
          onClick={(e) => handleThumbailsClick(thumbnail.id, e)}
        >
          <Image
            src={thumbnail.url}
            alt="Thumbnail"
            width={60}
            height={60}
            loading="lazy"
            className={`object-cover rounded-[0.2em]  ${
              selectedThumbnail === thumbnail.id ? "opacity-100" : "opacity-20"
            } ${
              aspectRatios[thumbnail.id] === "landscape"
                ? "fit-width w-[40px] h-[30px]"
                : "fit-height w-[30px] h-[40px]"
            }`}
            onLoad={(e) =>
              handleImageLoad(
                thumbnail.id.toString(),
                (e.target as HTMLImageElement).naturalWidth,
                (e.target as HTMLImageElement).naturalHeight
              )
            }
          />
        </a>
      ))}
    </div>
  );
}
