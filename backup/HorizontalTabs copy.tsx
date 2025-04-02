"use client";
import {  useEffect, useRef, useState } from "react";
import { useTabsContext } from "@/lib/TabsContext";

import {
  AboutTabData,
  GalleryImage,
  ImageMedia,
} from "@/utils/types";
import Showcase from "./AcordionCards";
import Image from "next/image";
import RandomVideoPosition from "./RandomVideoPosition";
import Jornais from "./Jornais";

import SvgComponent_en from "./Equipa_en";
import SvgComponent_pt from "./Equipa_pt";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import ScrollSmoother from "gsap/ScrollSmoother";
// import ScrollToPlugin from "gsap/ScrollToPlugin";
import { useDataFetchContext } from "@/lib/DataFetchContext";

import { useToggleContact } from "@/lib/useToggleContact";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { usePage } from "@/utils/usePages";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { useTabData } from "@/hooks/useTabData";
import { useVideoReady } from "@/hooks/useVideoReady";
import { useContactToggle } from "@/hooks/useContactToggle";
// import { useGSAP } from "@gsap/react";
interface JornaisType {
  capa: ImageMedia;
  contra: ImageMedia;
  link: {
    target: string;
    title: string;
    url: string;
  };
}

interface Card {
  title: string;
  lista: string;
  capa: ImageMedia;
  thumbnail: ImageMedia;
}
interface TabContent {
  mov?: { url: string };
  sub_content?: string;
  heading?: string;
  subHeading?: string;
  title?: string;
  video?: { url: string };
  image?: GalleryImage;
  description?: string;
  content?: string;
  jornais?: JornaisType[] | undefined;
  services?: Card[] | undefined;
}

interface HorizontalTabsProps {
  slug: string;
}
// Initialize GSAP plugins safely
// let pluginsInitialized = false;
// const initializeGSAP = async () => {
//   if (typeof window === 'undefined') return;
  
//   const { ScrollTrigger } = await import("gsap/ScrollTrigger");
//   const { ScrollSmoother } = await import("gsap/ScrollSmoother");
//   const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
  
//   gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, ScrollToPlugin);
//   pluginsInitialized = true;
// };
const HorizontalTabs: React.FC<HorizontalTabsProps> = ({ slug }) => {
  const {
    setTabs,
    setSelectedTab,
    setTabTitle,
    scrollSmootherInstanceRef,
    sectionRefs,
  } = useTabsContext();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { setIsVideoReady } = useDataFetchContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isContactOpen, closeContact } = useToggleContact();

  const pathname = usePathname();
  const locale = useLocale();
  const { data, isFetching } = usePage(locale, slug);
  const tabData: AboutTabData[] = data;
  console.log(tabData, "tabdata");
  const isProduction = pathname === `/production`;
  const isAbout = pathname === `/about`;
  const isResidencias = pathname === `/residencias`;
  const [isReady, setIsReady] = useState(false);

  // Always call hooks in the same order
  useTabData(tabData, setTabs, setTabTitle, setSelectedTab);
  useContactToggle(isContactOpen, closeContact);
  useVideoReady(videoRef, setIsVideoReady);
  useEffect(() => {
    if (!isFetching && tabData) {
      setIsReady(true); // Trigger re-render when data is ready
    }
  }, [isFetching, tabData]);
  useGSAPAnimations(
    scrollContainerRef,
    sectionRefs,
    scrollSmootherInstanceRef,
    setSelectedTab,
    isReady// Only initialize GSAP when data is fetched
  );

  // Perform conditional logic after hooks
  if (!isFetching && data) {
    console.log("fetcheddddd")
    sectionRefs.current.forEach((section, i) => {

      console.log(`Section ${i} offsetTop: ${section?.offsetTop}`);

    });
    // Additional logic if needed
  }
  // useEffect(() => {
  //   initializeGSAP();
  //   console.log("plugin initialized");
  // }, []);


  // useGSAP(() => {

  //   if (!pluginsInitialized || !scrollContainerRef.current) return;
  //   const mm = gsap.matchMedia();
  //   sectionRefs.current.forEach((section, i) => {
  //     console.log(`Section ${i} offsetTop: ${section?.offsetTop}`);
  //   });
  //   const scrollSmootherInstance = new ScrollSmoother({
  //     content: scrollContainerRef.current,
  //     smooth: 1,
  //     smoothTouch: 1,
  //     ignoreMobileResize: true,
  //   });
  //   scrollSmootherInstanceRef.current = scrollSmootherInstance;

  //   mm.add("(min-width: 700px)", () => {
  //     function goToSection(i: number) {
  //       scrollSmootherInstance.scrollTo(sectionRefs.current[i], true);
  //     }
  //     sectionRefs.current.forEach((section, i) => {
  //       ScrollTrigger.create({
  //         trigger: section,

  //         start: "top top",
  //         end: "bottom-=50px top",
  //         scrub: true,
  //         onEnter: (self) => {
  //           if (self.trigger) {
  //           }
  //           goToSection(i);
  //         },
  //         onEnterBack: () => {
  //           goToSection(i);
  //         },
  //       });
  //     });
  //     return () => {
  //       scrollSmootherInstance.kill();
  //     };
  //   });

  //   sectionRefs.current.forEach((section, i) => {
  //     ScrollTrigger.create({
  //       id: `NAAAAAAAAAAAAAAAAAAAAAA${i}`,
  //       trigger: section,

  //       start: "top 1px",
  //       end: "bottom center",

  //       onToggle: (self) => {
  //         if (self.isActive) {
  //           if (self.trigger) {
  //             setSelectedTab(self.trigger.id);
  //           }
  //         }
  //       },
  //     });
  //   });

  //   const movableArray = gsap.utils.toArray(".movable");

  //   gsap
  //     .timeline({
  //       scrollTrigger: {
  //         id: "MOOOOOOOOOVVVVVEEEEEEEEE",
  //         trigger: "#no_entulho",
  //         start: "top bottom",
  //         end: `bottom top`,
  //       },
  //     })
  //     .from(movableArray, { x: -2000, duration: 5, stagger: 1 });
  // }, [scrollContainerRef]);

  // useGSAP(() => {
  //   const circulos1 = document.querySelector("#circulos1") as HTMLElement;
  //   const dis1 = document.querySelector("#dis1") as HTMLElement;
  //   const dots1 = document.querySelector("#dots1") as HTMLElement;
  //   const circulos2 = document.querySelector("#circulos2") as HTMLElement;
  //   const dis2 = document.querySelector("#dis2") as HTMLElement;
  //   const cargos1 = document.querySelector("#cargos1") as HTMLElement;
  //   const dots3 = document.querySelector("#dots2") as HTMLElement;
  //   const cargos3 = document.querySelector("#cargos2") as HTMLElement;
  //   const svgimage = document.querySelector("#teams") as HTMLElement | null;
  //   if (!svgimage) return;

  //   const paths: SVGPathElement[] = Array.from(
  //     circulos1.querySelectorAll("path")
  //   );
  //   const circles: SVGPathElement[] = Array.from(
  //     circulos1.querySelectorAll("circle")
  //   );
  //   const paths2: SVGPathElement[] = Array.from(
  //     circulos2.querySelectorAll("path")
  //   );

  //   const tl = gsap.timeline({
  //     defaults: {
  //       ease: "none",
  //     },
  //     scrollTrigger: {
  //       trigger: svgimage,
  //       start: "top top",
  //       end: "+=" + innerHeight * 5,
  //       scrub: 0.1,
  //       pin: true,
  //       pinSpacing: true,
  //       anticipatePin: 1,

  //       onUpdate: () => {},
  //       onLeave: () => {},
  //       onEnterBack: () => {},
  //     },
  //   });
  //   if (paths.length > 0 || circles.length > 0) {
  //     paths.forEach((path) => {
  //       const pathLength = path.getTotalLength();
  //       path.style.strokeDasharray = `${pathLength} ${pathLength}`;
  //       path.style.strokeDashoffset = `${pathLength}`;

  //       tl.to(path, {
  //         strokeDashoffset: 0,
  //         duration: 1,
  //         ease: "power1.inOut",
  //         scrollTrigger: {
  //           trigger: svgimage,
  //           start: "top bottom",
  //           end: "bottom top",
  //           scrub: true,

  //           onUpdate: (self) => {
  //             const drawLength = pathLength * self.progress;
  //             path.style.strokeDashoffset = `${pathLength - drawLength}`;
  //           },
  //         },
  //       });
  //     });

  //     circles.forEach((circle) => {
  //       const circleLength = circle.getTotalLength();
  //       circle.style.strokeDasharray = `${circleLength} ${circleLength}`;
  //       circle.style.strokeDashoffset = `${circleLength}`;

  //       tl.to(circle, {
  //         strokeDashoffset: 0,
  //         duration: 1,
  //         ease: "power1.inOut",
  //         scrollTrigger: {
  //           trigger: svgimage,
  //           start: "top bottom",
  //           end: "bottom top",
  //           scrub: true,
  //           onUpdate: (self) => {
  //             const drawLength = circleLength * self.progress;
  //             circle.style.strokeDashoffset = `${circleLength - drawLength}`;
  //           },
  //         },
  //       });
  //     });
  //   }

  //   gsap.set(paths2, { autoAlpha: 0 });

  //   tl.fromTo(dis1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
  //     .fromTo(dots1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 })
  //     .fromTo(cargos1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 })

  //     .add(() => {
  //       paths2.forEach((path) => {
  //         const pathLength = path.getTotalLength();
  //         path.style.strokeDasharray = `${pathLength} ${pathLength}`;
  //         path.style.strokeDashoffset = `${pathLength}`;

  //         tl.to(
  //           path,
  //           {
  //             id: "path2",
  //             strokeDashoffset: 0,
  //             duration: 3,
  //             ease: "power1.inOut",
  //             autoAlpha: 1,
  //             scrollTrigger: {
  //               trigger: path,
  //               start: "bottom center",
  //               end: "bottom top",
  //               scrub: true,
  //             },
  //           },
  //           "+=0"
  //         );
  //       });
  //     })
  //     .fromTo(dis2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "+=0")

  //     .fromTo(dots3, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, "+=0")
  //     .fromTo(
  //       cargos3,
  //       { autoAlpha: 0 },
  //       { autoAlpha: 1, duration: 0.2 },
  //       "+=0"
  //     );
  // }, [scrollContainerRef]);


  const renderContent = (key: string, tabContent: TabContent) => {
    switch (key) {
      case "splash":
        if (tabContent.video?.url) {
          return (
            <div className="flex flex-col items-center gap-8 rounded-sm md:rounded-xl w-full relative mt-[20dvh] md:mt-0">
              <div className="relative w-full h-full md:h-[76dvh] py-4 md:py-0 text-4xl flex flex-col gap-10">
                {/* Render video if it exists */}
                {tabContent.video?.url && (
                  <video
                    ref={videoRef}
                    id="wait-video"
                    poster={tabContent.image?.url}
                    className="object-cover w-full h-full bg-gray-100 rounded-lg md:rounded-xl"
                    autoPlay
                    muted
                    loop
                    preload="true"
                    playsInline
                  >
                    <source src={tabContent.video.url} type="video/mp4" />
                    {tabContent.mov?.url && (
                      <source src={tabContent.mov.url} type="video/mov" />
                    )}
                    Your browser does not support the video tag.
                  </video>
                )}
                {/* Render image if there is no video but an image exists */}
                {tabContent.image?.url && !tabContent.video && (
                  <Image
                    src={tabContent.image.url}
                    alt={tabContent.image.alt || tabContent.title || "Image"}
                    width={tabContent.image.width}
                    height={tabContent.image.height}
                    className="object-cover w-full h-full toAnim image rounded-xl"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          );
        }
        return null;

      case "about_aw":
        return (
          <div
            className="relative w-full  gap-10  flex flex-col md:flex-row h-[80dvh] py-4 "
            style={{ columnFill: "auto" }}
          >
            <div className="w-full md:w-1/2">
              {tabContent.heading && (
                <div
                  className="gap-10 text-destaque md:pb-16"
                  dangerouslySetInnerHTML={{ __html: tabContent.heading }}
                />
              )}
              {tabContent.subHeading && (
                <div
                  className="gap-10 text-corpo-a md:pb-16"
                  dangerouslySetInnerHTML={{ __html: tabContent.subHeading }}
                />
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              {tabContent.description && (
                <div
                  className="flex flex-col gap-10 text-corpo-b md:pb-4"
                  dangerouslySetInnerHTML={{ __html: tabContent.description }}
                />
              )}
              {tabContent.content && (
                <div
                  className="flex flex-col self-end md:self-start md:w-3/4 h-auto max-h-full gap-6 font-mono leading-tight text-rodape"
                  dangerouslySetInnerHTML={{ __html: tabContent.content }}
                />
              )}
            </div>
          </div>
        );
      case "mission":
        return (
          <div className="relative w-full  gap-10 flex flex-col md:flex-row md:h-[80dvh] py-4 mt-[10dvh] md:mt-0">
            {tabContent.description && (
              <div
                className="w-full gap-10 text-destaque md:w-1/2"
                dangerouslySetInnerHTML={{ __html: tabContent.description }}
              />
            )}
            {tabContent.content && (
              <div
                className="text-corpo-b leading-[1.12] font-intl flex flex-col items-end gap-10 max-h-full w-full md:w-1/2"
                dangerouslySetInnerHTML={{ __html: tabContent.content }}
              />
            )}
          </div>
        );
      case "team":
        return (
          <div className="relative w-full  gap-10 flex flex-col md:flex-row  h-[80dvh] py-4 mt-[10dvh] md:mt-0">
            <div className="flex flex-col w-full gap-10 md:w-1/2">
              {tabContent.heading && (
                <div
                  className="w-2/3 gap-10 m-auto text-center text-destaque md:w-full md:text-start md:m-0"
                  dangerouslySetInnerHTML={{ __html: tabContent.heading }}
                />
              )}
              {tabContent.description && (
                <div
                  className=" gap-10 text-corpo-b leading-[1.25]"
                  dangerouslySetInnerHTML={{ __html: tabContent.description }}
                />
              )}
            </div>
            {tabContent.content && (
              <div
                className="flex flex-col w-full max-h-full gap-1 font-mono leading-tight text-rodape md:w-1/2"
                dangerouslySetInnerHTML={{ __html: tabContent.content }}
              />
            )}
          </div>
        );
      case "teams":
        return (
          <div
            id="svgimage"
            className="svgimage relative w-full text-4xl flex flex-col gap-10 h-[80dvh] py-8 pt-[10dvh] md:pt-0"
          >
            {locale === "en" ? (
              <SvgComponent_en className="w-auto" />
            ) : (
              <SvgComponent_pt className="w-auto" />
            )}

            {/* {tabContent.image && (
              <Image
                src={tabContent.image.url}
                alt={tabContent.image.alt || tabContent.title || "Image"}
                width={tabContent.image.width}
                height={tabContent.image.height}
                className="object-contain w-full h-full toAnim image rounded-xl"
              />
            )} */}
          </div>
        );
      case "support_artists":
        return (
          <div className="relative w-full  gap-10 flex flex-col md:flex-row h-[80dvh] py-4">
            <div className="flex flex-col justify-start w-full gap-10 md:w-1/2">
              {tabContent.heading && (
                <div
                  className="gap-10 text-corpo-a"
                  dangerouslySetInnerHTML={{ __html: tabContent.heading }}
                />
              )}
              {tabContent.description && (
                <div
                  className="gap-10 text-destaque"
                  dangerouslySetInnerHTML={{ __html: tabContent.description }}
                />
              )}
            </div>
            <div className="flex flex-col justify-start w-full gap-10 md:w-1/2">
              {tabContent.content && (
                <div
                  className="gap-16 text-corpo-a"
                  dangerouslySetInnerHTML={{ __html: tabContent.content }}
                />
              )}
              {tabContent.sub_content && (
                <div
                  className="w-3/4 gap-10 font-mono leading-tight text-rodape"
                  dangerouslySetInnerHTML={{ __html: tabContent.sub_content }}
                />
              )}
            </div>
          </div>
        );
      case "jornais":
        const jornaisArray: JornaisType[] | undefined = tabContent.jornais;

        return (
          <div className="relative w-full text-4xl md:px-60 flex flex-col gap-10 mt-[20dvh] md:mt-0">
            <Jornais jornaisData={jornaisArray} cardWidth={500} />
          </div>
        );
      case "art_production":
        return (
          <div
            className="relative w-full  gap-10 h-[70dvh] md:h-[76dvh] py-4 columns-1 md:columns-2"
            style={{ columnFill: "auto" }}
          >
            <div className="flex flex-col justify-between w-full gap-10 ">
              {tabContent.heading && (
                <div
                  className="gap-10 text-destaque"
                  dangerouslySetInnerHTML={{ __html: tabContent.heading }}
                />
              )}
              {tabContent.description && (
                <div
                  className="gap-10 text-corpo-a"
                  dangerouslySetInnerHTML={{ __html: tabContent.description }}
                />
              )}
              {tabContent.content && (
                <div
                  className="gap-10 text-corpo-a"
                  dangerouslySetInnerHTML={{ __html: tabContent.content }}
                />
              )}
            </div>
          </div>
        );
      case "servicos":
        const cardArray = tabContent.services;

        return (
          <div
            id="cards_wrapper"
            className="relative w-full text-4xl flex gap-10 mt-[20vh] md:mt-0"
          >
            <Showcase cardData={cardArray} sectionID={key} cardWidth={500} />
          </div>
        );

      case "no_entulho":
        return (
          <div className="relative w-full  gap-10 flex flex-col md:flex-row  h-[80dvh] py-4 md:py-0 mt-[20dvh] md:mt-0">
            <RandomVideoPosition
              src="/videos/luva/1/a.webm"
              poster="/images/residencias/5.png"
            />
            <RandomVideoPosition
              src="/videos/luva/1/b.webm"
              poster="/images/residencias/13.png"
            />
            <RandomVideoPosition
              src="/videos/luva/1/c.webm"
              poster="/images/residencias/14.png"
            />
            <RandomVideoPosition
              src="/videos/luva/1/d.webm"
              poster="/images/residencias/8.png"
            />

            <div className="flex flex-col justify-start w-full gap-10 md:w-1/2">
              {tabContent.heading && (
                <div
                  className="gap-10 text-destaque"
                  dangerouslySetInnerHTML={{ __html: tabContent.heading }}
                />
              )}
            </div>
            <div className="flex flex-col justify-start w-full gap-4 md:w-1/2 md:gap-16">
              {tabContent.description && (
                <div
                  className="gap-10 text-corpo-a"
                  dangerouslySetInnerHTML={{ __html: tabContent.description }}
                />
              )}
              <Image
                src="/images/entulho.png"
                alt="Logo"
                width={100}
                height={100}
                className="pb-4"
                loading="lazy"
              />
              {tabContent.content && (
                <div
                  className="w-3/4 gap-10 font-mono leading-tight rodapeLink text-rodape"
                  dangerouslySetInnerHTML={{ __html: tabContent.content }}
                />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id="smooth-wrapper">
      <div
        id="smooth-container"
        className={`${isProduction ? "h-[230dvh] md:h-[300dvh]" : ""} ${
          isAbout ? "h-[1100dvh] md:h-[1180dvh] " : ""
        } ${isResidencias ? "h-[125dvh] md:h-[100dvh]" : ""}   `}
        ref={scrollContainerRef}
      >
        {/*snap-y snap-mandatory <pre >{JSON.stringify(tabData, null, 2)}</pre> */}
        {tabData &&
          Object.entries(tabData[0].acf).map(
            ([key, tabContent]: [string, TabContent], index) => {
              return (
                <div
                  key={`${key}-${index}`}
                  id={key}
                  ref={(el: HTMLDivElement | null) => {
                    sectionRefs.current[index] = el;
                  }}
                  className={`   relative md:pt-[12dvh]
                  ${key === "no_entulho" ? "md:overflow-hidden" : ""} 
                  ${key === "mission" ? "h-fit md:h-screen" : ""}
                  ${key === "teams" ? "h-screen pt-[20dvh]" : ""}
                  ${
                    key === "jornais"
                      ? "pt-[20dvh] w-full overflow-x-scroll px-20 md:w-screen h-screen"
                      : ""
                  }
                  ${
                    key === "servicos"
                      ? "w-full overflow-x-scroll px-20 md:w-screen h-screen"
                      : "w-screen"
                  }
                  ${
                    key === "splash"
                      ? "px-4 h-[30dvh] md:px-40 md:h-screen  mt-[22dvh] md:mt-0 mb-8 md:pb-0"
                      : "px-4 md:px-32 "
                  }`}
                >
                  {renderContent(key, tabContent)}
                </div>
              );
            }
          )}
      </div>
    </div>
  );
};

export default HorizontalTabs;
