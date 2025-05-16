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
import { Projecto } from "@/utils/types";
import ReactPlayer from 'react-player'
interface HorizontalSnapSliderProps {
  project: Projecto;
}
const HorizontalSnapSlider: React.FC<HorizontalSnapSliderProps> = ({
  project,

}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    setThumbnails,
    selectedThumbnail,
    setSelectedThumbnail,
    thumbRefs,
  } = useThumbnailsContext();
  const windowSize = useWindowSize();
  const videoPlayerRef = useRef<ReactPlayer | null>(null);
  const galeria= project.acf.galeria;
  const video= project.acf.video;
  useEffect(() => {}, [selectedThumbnail]);
  useEffect(() => {
    const thumbnails = video
      ? [
          { id: 0, url: "/images/frames/Video-icon_01.png" },
          ...galeria.map((image) => ({ id: image.id, url: image.sizes.thumbnail })),
        ]
      : galeria.map((image) => ({ id: image.id, url: image.sizes.thumbnail }));
    setThumbnails(thumbnails);
    setSelectedThumbnail(video ? 0 : galeria[0].id);
  }, [galeria, video, setSelectedThumbnail, setThumbnails]);
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
      const projectDetail = document.getElementById("projectDetail");
      const sectionEls = thumbRefs.current.filter(Boolean);
      const totalWidth = (sectionEls.length - 1) * windowSize.height;
      if (sectionEls.length > 0) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: projectDetail,
              pin: true,
              pinSpacing: true,
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
     
                if (activeSection?.id === "0") {
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.getInternalPlayer()?.play();
                    console.log("Video paused");
                  }
                } else {
                  // Play the video if the active section is the video
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.getInternalPlayer()?.pause();
                    console.log("Video playing");
                  }
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
  const getSizes = () => {
    if (windowSize.width < 768) return "100vw";
    if (windowSize.width < 1200) return "50vw";
    return "33vw";
  };
  const extractSrc = (str: string): string | null => {
    const match = str.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };
  const videoSrc = extractSrc(video);
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
          <div className="relative md:h-[65vh] w-[65vw]">
          <ReactPlayer ref={videoPlayerRef}
                  id="videoIframe"
                  className="absolute top-0 md:left-[17.5vw] w-full h-full"
                  width='100%'
                  height='100%'
                  muted={false}
                  volume={1}
                  controls={true}
                  preload="true"
                  onReady={() => {
                    console.log("Video is ready");
                  }}
                  url={
                    videoSrc +
                      "&autoplay=1&controls=1&title=0&byline=0&portrait=0&muted=1&loop=1" ||
                    ""
                    } 
                  playing={true}
                  config={{
                    vimeo: {  playerOptions: { autoplay: 1, responsive : true, unmute_button: false} },
                  }}  
            />
          </div>
        </div>
        </div>
      </div>
      )}

      {galeria.map((image, index) => {
      // console.log(image)
      return(
      <div
        key={image.id}
        id={image.id.toString()}
        ref={(el: HTMLDivElement | null) => {
        thumbRefs.current[videoSrc ? index + 1 : index] = el;
        }}
        className="h-auto md:h-full w-[100vw] snap-start px-4 md:px-0"
      >
        <div className="w-full md:w-screen h-full m-auto flex justify-center items-center">
        {/* Debugging: console.log("Rendering image:", image) */}
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width / 2}
          height={image.height / 2}
          placeholder="blur"
          blurDataURL={image.base64}
          className=" w-auto h-full object-contain rounded-md bg-gray-50"
          priority
          sizes={getSizes()}
          // loading="lazy"
        />
        </div>
      </div>
      )})}
    </div>
  );
};
export default HorizontalSnapSlider;
