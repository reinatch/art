// // app/lib/HorizontalSnapSlider.tsx

"use client";
import { useRef, useEffect } from "react";
import { useThumbnailsContext } from "@/lib/useThumbnailsContext";
import Image from "next/image";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { Observer } from "gsap/Observer";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";
interface GaleriaImage {
  ID: number;
  url: string;
  alt: string;
}

interface HorizontalSnapSliderProps {
  galeria: GaleriaImage[];
  video: string;
}

const HorizontalSnapSlider: React.FC<HorizontalSnapSliderProps> = ({
  galeria,
  video,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    setThumbnails,
    selectedThumbnail,
    setSelectedThumbnail,
    thumbRefs,
  } = useThumbnailsContext();
  const windowSize = useWindowSize();
  useEffect(() => {}, [selectedThumbnail]);

  useEffect(() => {
    const thumbnails = video
      ? [
          { id: 0, url: "/images/frames/Video-icon_01.png" },
          ...galeria.map((image) => ({ id: image.ID, url: image.url })),
        ]
      : galeria.map((image) => ({ id: image.ID, url: image.url }));
    setThumbnails(thumbnails);
    setSelectedThumbnail(video ? 0 : galeria[0].ID);
  }, [galeria, video, setSelectedThumbnail, setThumbnails]);
  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === "ArrowRight") {
  //       // console.log(`Key pressed: ${event.key}`);
  //       if (scrollContainerRef.current) {
  //         gsap.to(scrollContainerRef.current, { scrollTo: { x: "+=" + window.innerWidth }, duration: 0.5 });
  //       }
  //     } else if (event.key === "ArrowLeft") {
  //       // console.log(`Key pressed: ${event.key}`);
  //       if (scrollContainerRef.current) {
  //         gsap.to(scrollContainerRef.current, { scrollTo: { x: "-=" + window.innerWidth }, duration: 0.5 });
  //       }
  //     }
  //   };

  //   // const handleClick = (index: number) => {
  //   //   console.log(`Thumbnail clicked: ${index}`);
  //   // };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  useGSAP(() => {
    gsap.registerPlugin(
      ScrollTrigger,
      ScrollSmoother,
      ScrollToPlugin,
      Observer,
      useGSAP
    );
    const mm = gsap.matchMedia();
    mm.add("(min-width: 700px)", () => {
      // const panelsContainer = scrollContainerRef.current;
      const projectDetail = document.getElementById("projectDetail");
      // const sectionEls = thumbRefs.current;
      const sectionEls = thumbRefs.current.filter(Boolean);
      // console.log(sectionEls, panelsContainer)
      const totalWidth = (sectionEls.length - 1) * windowSize.height;

      if (sectionEls.length > 0) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: projectDetail,
              pin: true,
              pinSpacing: true,
              // markers: true,
              snap: {
                snapTo: 1 / (sectionEls.length - 1),
                duration: { min: 0.1, max: 0.3 },
              },
              onSnapComplete: ({ progress }) => {
                const index = Math.round(progress * (sectionEls.length - 1));
                const activeSection = sectionEls[index];
                if (activeSection) {
                  setSelectedThumbnail(Number(activeSection.id));
                }
              },
              scrub: 1,
              start: "center center",
              end: () => `+=${totalWidth}`,
            },
          })
          .to(sectionEls, {
            xPercent: -100 * (sectionEls.length - 1),
            ease: "none",
            duration: sectionEls.length,
          });
      }
    });
  }, [galeria, video]);

  const extractSrc = (str: string): string | null => {
    const match = str.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  const videoSrc = extractSrc(video);
  // console.log(videoSrc + "?autoplay=1")

  return (
    <div
      className="flex  flex-col md:flex-row gap-8 md:gap-0 h-full md:h-[65vh] pb-[40vh] md:pb-0 w-screen overflow-y-scroll md:overflow-y-hidden"
      ref={scrollContainerRef}
    >
      {video && (
        <div className=" w-screen h-[65vh]">
          <div
            id="0"
            className="video_wrap h-full w-screen max-h-[30vh]"
            ref={(el) => {
              thumbRefs.current[0] = el;
            }}
          >
            {/* <iframe
                  id="videoIframe"
                  src={videoSrc + "&autoplay=1&controls=0&title=0&byline=0&portrait=0" || ""}
                  width="640"
                  height="360"
                  allow="autoplay"
                  allowFullScreen
                  title="Embedded Video"
                ></iframe> */}
            <div className="video_wrapper ">
              <div className="relative pt-[56.25%] md:h-[65vh] w-[65vw]">
                <iframe
                  className="absolute top-0 md:left-[17.5vw] w-full h-full"
                  src={
                    videoSrc +
                      "&autoplay=1&controls=0&title=0&byline=0&portrait=0&muted=1&loop=1" ||
                    ""
                  }
                  allow="autoplay"
                  allowFullScreen
                  title="Embedded"
                >
                  {" "}
                </iframe>
              </div>
            </div>
          </div>
        </div>
      )}
      {galeria.map((image, index) => (
        <div
          key={image.ID}
          id={image.ID.toString()}
          ref={(el: HTMLDivElement | null) => {
            thumbRefs.current[videoSrc ? index + 1 : index] = el;
          }}
          // onClick={() => handleClick(index)}
          className="h-auto md:h-full w-[100vw] snap-start px-4 md:px-0"
        >
          <div className="w-full md:w-screen h-full m-auto flex justify-center items-center">
            <Image
              src={image.url}
              alt={image.alt}
              width={500}
              height={600}
              className=" w-auto h-full object-contain rounded-md bg-gray-50"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalSnapSlider;
