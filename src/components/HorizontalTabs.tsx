// app/lib/HorizontalTabs.tsx
"use client";
import { useEffect, useRef } from "react";
import { useTabsContext } from "@/lib/TabsContext";
// import { motion } from "framer-motion";
// import useVerticalScrollSnap from "@/utils/useVerticalSnap"; // Import the hook
import {
  AboutTabData,
  ContentItem,
  GalleryImage,
  ImageMedia,
} from "@/utils/types";
import Showcase from "./AcordionCards";
import Image from "next/image";
import RandomVideoPosition from "./RandomVideoPosition";
import Jornais from "./Jornais";
// import SvgComponent from "./EquipasSVG";
import SvgComponent_en from "./Equipa_en";
import SvgComponent_pt from "./Equipa_pt";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { useDataFetchContext } from "@/lib/DataFetchContext";
// import ReactLenis from "@studio-freight/react-lenis";
import { useToggleContact } from "@/lib/useToggleContact";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { usePage } from "@/utils/usePages";  

// import { GSDevTools } from "gsap/GSDevTools";
// import SmoothScrolling from "@/components/SmoothScrolling";
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
  image?: GalleryImage; // Use the existing GalleryImage type
  description?: string;
  content?: string;
  jornais?: JornaisType[] | undefined;
  services?: Card[] | undefined;
}
// interface Card {
//   id: number;
//   text: string;
//   img: string;
//   imgBack: string;
//   link: string;
// }
// interface JornaisType {
//   id: number;
//   img: string;
//   imgBack: string;
//   link: string;
//   text: string;
// }
// Define a type for images in the gallery

interface HorizontalTabsProps {
  slug: string;
}

const HorizontalTabs: React.FC<HorizontalTabsProps> = ({slug }) => {
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
  const { data } = usePage(locale, slug)
  const tabData: AboutTabData[] = data;
  console.log(tabData)
  const isProduction = pathname === `/production`;
  const isAbout = pathname === `/about`;
  const isResidencias = pathname === `/residencias`;

  useEffect(() => {
    if (tabData && tabData.length > 0 && tabData[0]?.acf) {
      const tabs = Object.entries(tabData[0].acf).map(([key, value]) => {
        const content = value as ContentItem;
        return {
          slug: key,
          label: content.title || key.charAt(0).toUpperCase() + key.slice(1),
          content: content,
        };
      });

      // console.log("tabs", tabs)

      setTabs(tabs);
      setTabTitle(tabData[0].title.rendered);
      setSelectedTab(tabs[0].slug);
    }
  }, [tabData, setTabs, setSelectedTab, setTabTitle]);

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
        closeContact();  //Toggle contact on scroll if it's open
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeContact, isContactOpen]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    gsap.registerPlugin(ScrollSmoother);
    sectionRefs.current.forEach((section, i) => {
      console.log(`Section ${i} offsetTop: ${section?.offsetTop}`);
    });

  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    const scrollSmootherInstance = new ScrollSmoother({
      content: scrollContainerRef.current,
      smooth: 1,
      smoothTouch: 1,
      ignoreMobileResize: true,
    });
    scrollSmootherInstanceRef.current = scrollSmootherInstance;

    mm.add("(min-width: 700px)", () => {
      function goToSection(i: number) {
        scrollSmootherInstance.scrollTo(sectionRefs.current[i], true);
      }
      sectionRefs.current.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          // start:"top 1px",
          // markers:true,
          // start: "top+=100px top",
          // end: "bottom-=100px top",
          start: "top top",
          end: "bottom-=50px top",
          scrub: true,
          onEnter: (self) => {
            // console.log("enter");
            //  console.log("self onEnter",self.trigger)
            if (self.trigger) {
              // setSelectedTab(self.trigger.id);
            }
            goToSection(i);
          },
          onEnterBack: () => {
            // console.log("enterBack");
            goToSection(i);
          },
          // onToggle: (self)=> {
          //   //animate respective list item based on active state
          //   console.log("self",self.trigger)
          //   if (self.trigger) {
          //     setSelectedTab(self.trigger.id);
          //   }
          //   // gsap.to(`li:nth-child(${index+1})`, {
          //   //   duration:0.2,
          //   //   opacity:self.isActive ? 1 : 0.2, // if active then 1 or else 0.5
          //   //   color:self.isActive ? "white" : "black" // if active then white or else black
          //   // })
          // }
        });
      });
      return () => {
        scrollSmootherInstance.kill();
      };
    });

    sectionRefs.current.forEach((section, i) => {
      ScrollTrigger.create({
        id: `NAAAAAAAAAAAAAAAAAAAAAA${i}`,
        trigger: section,

        start: "top 1px",
        end: "bottom center",
        // markers:true,

        onToggle: (self) => {
          //animate respective list item based on active state
          // console.log("self onToggle",self.isActive, self.trigger, self)
          if (self.isActive) {
            if (self.trigger) {
              setSelectedTab(self.trigger.id);
            }
          }
          // gsap.to(`li:nth-child(${index+1})`, {
          //   duration:0.2,
          //   opacity:self.isActive ? 1 : 0.2, // if active then 1 or else 0.5
          //   color:self.isActive ? "white" : "black" // if active then white or else black
          // })
        },
      });
    });

    // const buttons = gsap.utils.toArray<HTMLElement>('footer .tabsClick');

    // buttons.forEach((button) => {
    //   console.log("button",button)
    //   button.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const target = e.target as HTMLElement | null;
    //     if (target) {
    //       const id = target.getAttribute('href');
    //       if (id) {
    //         scrollSmootherInstance.scrollTo(id, true, 'top top');
    //       }
    //     }
    //   });
    // });

    // const animateMovableArray = () => {
    // const movableArray = gsap.utils.toArray(".movable"); // Ensure type safety
    // // const movableArray = gsap.utils.toArray<HTMLElement>(".movable"); // Ensure type safety
    // // console.log("movable", movableArray);

    // // Create a timeline for better control and chaining
    // const movableTimeline = gsap.timeline({
    //   scrollTrigger:{
    //     trigger: "#no_entulho",
    //     start: "center center",
    //     end: "center center",
    //     // scrub: 1,
    //     // pin: true,
    //     // markers: true,
    //     // animation: animation,
    //     // toggleActions: "play pause resume reset",
    //   }
    // });
    const movableArray = gsap.utils.toArray(".movable");
    // console.log("movable", movableArray);
    gsap
      .timeline({
        scrollTrigger: {
          id: "MOOOOOOOOOVVVVVEEEEEEEEE",
          trigger: "#no_entulho",
          start: "top bottom",
          end: `bottom top`,
          // pin: true,
          // pinSpacing: true,
          // scrub: 1,
          // pinType: "transform",
          // anticipatePin: 1,
          // markers:true,
        },
      })
      .from(movableArray, { x: -2000, duration: 5, stagger: 1 });

    // ScrollTrigger.create({
    //         trigger: "#no_entulho",
    //         start: "top center",
    //         end: "+=500",
    //         // scrub: 1,
    //         markers: true,
    //         // animation: animation,
    //         toggleActions: "play pause resume reset",
    //         // pin: true,
    //         // pinSpacing: true,
    //         // onEnter: () =>,
    //         // onLeave: () => ,
    //         // onEnterBack: () => ,
    //         // onLeaveBack: () => ,
    //         // onRefresh: () => ,
    //         // onUpdate: () => ,
    // })
    // Use the timeline to animate each item with stagger
    // movableTimeline.from(movableArray, {
    //   y: 500,
    //   duration: 3,
    //   stagger: 0.5, // Adjust stagger timing as needed
    //   ease: "power2.out", // Optional easing for smooth animation

    // });
  }, [scrollContainerRef, setSelectedTab]);

  // useEffect(() => {
  //   const buttons = document.querySelectorAll('a.tabsClick');
  //   console.log(selectedTab, "selectedTab", buttons);
  //   console.log(scrollSmootherInstanceRef.current);

  //   // const handleClick = (e: Event) => {
  //     // e.preventDefault();
  //     const target = "#" +
  //     if (target) {
  //       const id = target.getAttribute('href');
  //       console.log(id, "hhhHhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  //       if (id && scrollSmootherInstanceRef.current) {
  //         scrollSmootherInstanceRef.current.scrollTo(id, true, 'top top');
  //       }
  //     }
  //   // };

  //   // buttons.forEach(button => {
  //   //   button.addEventListener('click', handleClick);
  //   // });

  //   // // Cleanup event listeners on unmount
  //   // return () => {
  //   //   buttons.forEach(button => {
  //   //     button.removeEventListener('click', handleClick);
  //   //   });
  //   // };
  // }, [selectedTab]);

  //   useEffect(() => {
  //     if (selectedTab && scrollSmootherInstanceRef.current) {
  //         const index = sectionRefs.current.findIndex(section => section?.id === selectedTab);
  //         if (index !== -1) {
  //             scrollSmootherInstanceRef.current.scrollTo(sectionRefs.current[index], true);
  //         }
  //     }
  // }, [selectedTab]);

  useGSAP(() => {
    const circulos1 = document.querySelector("#circulos1") as HTMLElement;
    const dis1 = document.querySelector("#dis1") as HTMLElement;
    const dots1 = document.querySelector("#dots1") as HTMLElement;
    const circulos2 = document.querySelector("#circulos2") as HTMLElement;
    const dis2 = document.querySelector("#dis2") as HTMLElement;
    const cargos1 = document.querySelector("#cargos1") as HTMLElement;
    const dots3 = document.querySelector("#dots2") as HTMLElement;
    const cargos3 = document.querySelector("#cargos2") as HTMLElement;
    const svgimage = document.querySelector("#teams") as HTMLElement | null;
    if (!svgimage) return;

    // Define a function to animate paths
    // const animatePaths = (paths: SVGPathElement[], label: string) => {
    //   paths.forEach((path) => {
    //     const pathLength = path.getTotalLength();
    //     path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    //     path.style.strokeDashoffset = `${pathLength}`;

    //     tl.to(
    //       path,
    //       {
    //         strokeDashoffset: 0,
    //         duration: 1,
    //         ease: "power1.inOut",
    //         scrollTrigger: {
    //           trigger: path,
    //           start: "center bottom",
    //           end: "bottom top",
    //           scrub: true,
    //         },
    //       },
    //       label // Aligns with the provided label
    //     );
    //   });
    // };
    const paths: SVGPathElement[] = Array.from(
      circulos1.querySelectorAll("path")
    ); // Select all paths inside circulos1
    const circles: SVGPathElement[] = Array.from(
      circulos1.querySelectorAll("circle")
    ); // Select all circles inside circulos1
    const paths2: SVGPathElement[] = Array.from(
      circulos2.querySelectorAll("path")
    ); // Select all paths inside circulos1
    // const pontos2: SVGPathElement[] = Array.from(dots3.querySelectorAll('path')); // Select all paths inside circulos1
    // const cargos: SVGTextElement[] = Array.from(cargos3.querySelectorAll('text')); // Select all paths inside circulos1
    // const descricao2: SVGTextElement[] = Array.from(dis2.querySelectorAll('text')); // Select all paths inside circulos1

    const tl = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        // scroller:scrollContainerRef.current,
        trigger: svgimage, // Use containerRef here
        start: "top top",
        end: "+=" + innerHeight * 5,
        scrub: 0.1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        // pinType: 'transform',
        // pinReparent: true,
        // markers: true,
        onUpdate: () => {
          // const drawLength = pathLength * self.progress;
          // path.style.strokeDashoffset = `${pathLength - drawLength}`;
        },
        onLeave: () => {
          // toggleContact();
          // const sup = document.querySelector("#support_artists") as HTMLElement | null;
          // const jor = document.querySelector("#jornais") as HTMLElement | null;
          // const team = document.querySelector("#team") as HTMLElement | null;
          // if (sup && jor && team) {
          //   // Re-enable snapping with your desired alignment
          //   sup.style.scrollSnapAlign = "start"; // or "center" as needed
          //   jor.style.scrollSnapAlign = "start"; // or "center" as needed
          //   // team.style.scrollSnapAlign = "none"; // or "center" as needed
          // }
          // if (scrollContainerRef.current) {
          //   // scrollContainerRef.current.style.scrollSnapType = "none";
          // }
          // console.log("onleave", sup)
        },
        onEnterBack: () => {
          // const sup = document.querySelector("#support_artists") as HTMLElement | null;
          // const jor = document.querySelector("#jornais") as HTMLElement | null;
          // const team = document.querySelector("#team") as HTMLElement | null;
          // if (sup && jor) {
          //   // Re-enable snapping with your desired alignment
          //   sup.style.scrollSnapAlign = "none"; // or "center" as needed
          //   jor.style.scrollSnapAlign = "none"; // or "center" as needed
          // }
          // if (team) {
          //   // Re-enable snapping with your desired alignment
          //   team.style.scrollSnapAlign = "none"; // or "center" as needed
          // }
          // if (scrollContainerRef.current) {
          //   // scrollContainerRef.current.style.scrollSnapType = "none";
          // }
          // console.log("onEnterBack")
        },
      },
      // repeat: -1,
      // yoyo: true
    });
    if (paths.length > 0 || circles.length > 0) {
      // Create a ScrollTrigger instance for each path
      paths.forEach((path) => {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = `${pathLength} ${pathLength}`;
        path.style.strokeDashoffset = `${pathLength}`;

        tl.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: svgimage,
            start: "top bottom", // Start when the top of the path hits the bottom of the viewport
            end: "bottom top", // End when the bottom of the path hits the top of the viewport
            scrub: true, // Smooth scrubbing, link animation to scroll position
            // markers: true,
            onUpdate: (self) => {
              const drawLength = pathLength * self.progress;
              path.style.strokeDashoffset = `${pathLength - drawLength}`;
            },
          },
        });
      });

      // Create a ScrollTrigger instance for each circle if needed
      circles.forEach((circle) => {
        const circleLength = circle.getTotalLength();
        circle.style.strokeDasharray = `${circleLength} ${circleLength}`;
        circle.style.strokeDashoffset = `${circleLength}`;

        tl.to(circle, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: svgimage,
            start: "top bottom", // Start when the top of the circle hits the bottom of the viewport
            end: "bottom top", // End when the bottom of the circle hits the top of the viewport
            scrub: true, // Smooth scrubbing, link animation to scroll position
            onUpdate: (self) => {
              const drawLength = circleLength * self.progress;
              circle.style.strokeDashoffset = `${circleLength - drawLength}`;
            },
          },
        });
      });
    }

    gsap.set(paths2, { autoAlpha: 0 });
    // gsap.set(pontos2, {autoAlpha: 0,transformOrigin: "50% 50%", scale: 0})
    // gsap.set(cargos, {autoAlpha: 0,transformOrigin: "50% 50%", scale: 0})
    // gsap.set(descricao2, {autoAlpha: 0,transformOrigin: "50% 50%", scale: 0})
    // Add animations to the timeline
    tl
      // .fromTo(circulos1, { opacity: 1 }, { opacity: 1, duration: 0.5 }, "+=2")
      .fromTo(dis1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
      .fromTo(dots1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 })
      .fromTo(cargos1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 })
      // .fromTo(circulos2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, "+=2")
      .add(() => {
        paths2.forEach((path) => {
          const pathLength = path.getTotalLength();
          path.style.strokeDasharray = `${pathLength} ${pathLength}`;
          path.style.strokeDashoffset = `${pathLength}`;

          tl.to(
            path,
            {
              id: "path2",
              strokeDashoffset: 0,
              duration: 3,
              ease: "power1.inOut",
              autoAlpha: 1,
              scrollTrigger: {
                trigger: path,
                start: "bottom center",
                end: "bottom top",
                scrub: true,
                // markers: true,
              },
            },
            "+=0"
          );
        });
      })
      .fromTo(dis2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "+=0")
      // .add(() => {

      //   descricao2.forEach((path) => {

      //     tl.to(path, {
      //       id: "descricao2",
      //       scale: 1,
      //       duration: 3,
      //       ease: "power1.inOut",
      //       autoAlpha: 1,
      //       scrollTrigger: {
      //         trigger: path,
      //         start: "bottom center",
      //         end: "bottom top",
      //         scrub: true,
      //         // markers: true,
      //       },
      //     },
      //     "+=3"
      //   );
      //   });
      // })
      .fromTo(dots3, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, "+=0")
      .fromTo(
        cargos3,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2 },
        "+=0"
      );
    // .add(() => {

    //   pontos2.forEach((path) => {
    //     const pathLength = path.getTotalLength();
    //     path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    //     path.style.strokeDashoffset = `${pathLength}`;

    //     tl.to(path, {
    //       id: "pontos2",
    //       scale: 1,
    //       duration: 3,
    //       ease: "power1.inOut",
    //       autoAlpha: 1,
    //       scrollTrigger: {
    //         trigger: path,
    //         start: "bottom center",
    //         end: "bottom top",
    //         scrub: true,
    //         markers: true,
    //       },
    //     },
    //     "+=3"
    //   );
    //   });
    // })
    // .add(() => {

    //   cargos.forEach((path) => {

    //     tl.to(path, {
    //       id: "cargos",
    //       scale: 1,
    //       duration: 3,
    //       ease: "power1.inOut",
    //       autoAlpha: 1,
    //       scrollTrigger: {
    //         trigger: path,
    //         start: "bottom center",
    //         end: "bottom top",
    //         scrub: true,
    //         markers: true,
    //       },
    //     },
    //     "+=3"
    //   );
    //   });
    // })
  }, [scrollContainerRef]);

  // useEffect(() => {
  //   // Reset the data fetch state when the component is mounted
  //   setIsDataFetched(false);
  // }, [setIsDataFetched]);

  // const handleDataFetched = () => {
  //   setIsDataFetched(true); // Update the context when the data is loaded
  // };
  useEffect(() => {
    const videoElement = videoRef.current;

    const handleVideoCanPlay = () => {
      setIsVideoReady(true); // Update the context when video can play
      // console.log("Video is ready to play.");
    };

    if (videoElement) {
      videoElement.addEventListener("canplay", handleVideoCanPlay);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("canplay", handleVideoCanPlay);
      }
    };
  }, [setIsVideoReady]);

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
        // console.log("jornaisArray",jornaisArray)
        return (
          <div className="relative w-full text-4xl md:px-60 flex flex-col gap-10 mt-[20dvh] md:mt-0">
            <Jornais
              jornaisData={jornaisArray}
              cardWidth={500}
            />
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
        // console.log("cardArray",cardArray)
        return (
          <div id="cards_wrapper" className="relative w-full text-4xl flex gap-10 mt-[20vh] md:mt-0">
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

  // useVerticalScrollSnap(sectionRefs, setSelectedTab);
  return (
    // <SmoothScrolling>

    // <div className="w-full h-screen ">
    <div id="smooth-wrapper">
      <div
        id="smooth-container"
        className={`${isProduction ? "h-[230dvh] md:h-[300dvh]" : ""} ${
          isAbout ? "h-[1100dvh] md:h-[1180dvh] " : ""
        } ${isResidencias ? "h-[125dvh] md:h-[100dvh]" : ""}   `}
        ref={scrollContainerRef}
        // style={{ x: scrollXProgress }} // Link horizontal scroll with vertical scroll progress${key === "support_artists" || key === "jornais"  ? "snap-none" : "snap-start"}
      >
        {/*snap-y snap-mandatory <pre >{JSON.stringify(tabData, null, 2)}</pre> */}
        {tabData && Object.entries(tabData[0].acf).map(
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
                  ${key === "jornais" ? "pt-[20dvh] w-full overflow-x-scroll px-20 md:w-screen h-screen" : ""}
                  ${key === "servicos" ? "w-full overflow-x-scroll px-20 md:w-screen h-screen" : "w-screen"}
                  ${key === "splash" ? "px-4 h-[30dvh] md:px-40 md:h-screen  mt-[22dvh] md:mt-0 mb-8 md:pb-0" : "px-4 md:px-32 "}`
                }
              >
                {renderContent(key, tabContent)}
              </div>
            );
          }
        )}
      </div>
    </div>
    // </div>
    // </SmoothScrolling>
  );
};

export default HorizontalTabs;
