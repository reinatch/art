"use client";
import { useEffect, useRef, useState } from "react";
import { useTabsContext } from "@/lib/TabsContext";
import {
  AboutTabData,
  ContentItem,
  ImageMedia,
} from "@/utils/types";
import Showcase from "./AcordionCards";
import Image from "next/image";
import RandomVideoPosition from "./RandomVideoPosition";
import Jornais from "./Jornais";
// import SvgComponent_en from "./Equipa_en";
// import SvgComponent_pt from "./Equipa_pt";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { useDataFetchContext } from "@/lib/DataFetchContext";
import { useToggleContact } from "@/lib/useToggleContact";
import { usePathname } from "next/navigation";
// import { isMobile } from "react-device-detect";
// import { useLocale } from "next-intl";
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
  image?: ImageMedia;
  description?: string;
  content?: string;
  jornais?: JornaisType[] | undefined;
  services?: Card[] | undefined;
  grafico?: ImageMedia;
  chefia?:{titulo:string, cargos: { name: string; cargo: string; image?: ImageMedia }[]};
  producao?: { equipas: {id_name: string; titulo: string; trabalhador : {nome: string; cargo: string; image: ImageMedia}[]}[], id_name: string, titulo: string }[];
  projecto?: { equipas: {id_name: string; titulo: string; trabalhador : {nome: string; cargo: string; image: ImageMedia}[]}[], id_name: string, titulo: string }[];
}
interface HorizontalTabsProps {
  tabData: AboutTabData[];
}
const HorizontalTabs: React.FC<HorizontalTabsProps> = ({ tabData }) => {
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
  
  // Hover image state
  const [hoveredImage, setHoveredImage] = useState<{
    url: string;
    alt: string;
    x: number;
    y: number;
    sizes?: { medium_large: string };
  } | null>(null);
  // Add mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Visibility flag to control show/hide animation
  const [hoverVisible, setHoverVisible] = useState(false);
  // ref to the floating element so we can animate with GSAP
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, []);

  // Handle mouse enter for team member with image - only on desktop
  const handleMouseEnter = (image: ImageMedia, nome: string, event: React.MouseEvent) => {
    if (isMobile || !image?.url) return; // Skip on mobile

    // clear any pending hide timeout
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Use the actual mouse coordinates so the hover image appears where the cursor is
    const clientX = event.clientX;
    const clientY = event.clientY;

    // set the image quickly so it can render
    setHoveredImage({
      url: image.url,
      alt: nome,
      x: clientX + 15,
      y: clientY - 50,
    });

    // kill previous tweens for the hover element
    if (hoverRef.current) gsap.killTweensOf(hoverRef.current);

    // place element at cursor using transforms and animate in
    if (hoverRef.current) {
      gsap.set(hoverRef.current, { x: clientX + 15, y: clientY - 50, scale: 0.95, opacity: 0 });
      setHoverVisible(true);
      gsap.to(hoverRef.current, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' });
    }
  };

  // Handle mouse leave - only on desktop
  const handleMouseLeave = () => {
    if (isMobile) return; // Skip on mobile

    if (hoverRef.current) {
      // animate out then clear
      gsap.killTweensOf(hoverRef.current);
      gsap.to(hoverRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          setHoverVisible(false);
          setHoveredImage(null);
        }
      });
    } else {
      setHoverVisible(false);
      setHoveredImage(null);
    }
  };

  // Handle mouse move to update position - only on desktop
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMobile || !hoverRef.current) return; // Skip on mobile

    // Smoothly animate to the new cursor position
    gsap.to(hoverRef.current, {
      x: event.clientX + 15,
      y: event.clientY - 50,
      duration: 0.12,
      ease: 'power3.out',
    });
  };
  
  // const locale = useLocale();
  const isProduction = pathname === `/production`;
  const isAbout = pathname === `/about`;
  const isResidencias = pathname === `/residencias`;
  useEffect(() => {
    if (tabData.length > 0 && tabData[0].acf) {
      const tabs = Object.entries(tabData[0].acf).map(([key, value]) => {
        const content = value as ContentItem;
        return {
          slug: key,
          label: content.title || key.charAt(0).toUpperCase() + key.slice(1),
          content: content,
        };
      });
      setTabs(tabs);
      setTabTitle(tabData[0].title.rendered);
      setSelectedTab(tabs[0].slug);
    }
  }, [tabData, setTabs, setSelectedTab, setTabTitle]);
  useEffect(() => {
    const sitempa = document.querySelector("#sitemap");
    const handleClickOutside = (event: MouseEvent) => {
      if (sitempa && !sitempa.contains(event.target as Node)) {
        closeContact();
      }
    };
    const handleScroll = () => {
      if (isContactOpen) {
        closeContact();
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
    // sectionRefs.current.forEach((section, i) => {
    //   // console.log(`Section ${i} offsetTop: ${section?.offsetTop}`);
    // });
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
          start: "top top",
          end: "bottom-=50px top",
          scrub: true,
          onEnter: (self) => {
            if (self.trigger) {
            }
            goToSection(i);
          },
          onEnterBack: () => {
            goToSection(i);
          },
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
        onToggle: (self) => {
          if (self.isActive) {
            if (self.trigger) {
              setSelectedTab(self.trigger.id);
            }
          }
        },
      });
    });
    const movableArray = gsap.utils.toArray(".movable");
    gsap
      .timeline({
        scrollTrigger: {
          id: "MOOOOOOOOOVVVVVEEEEEEEEE",
          trigger: "#no_entulho",
          start: "top bottom",
          end: `bottom top`,
        },
      })
      .from(movableArray, { x: -2000, duration: 5, stagger: 1 });
  }, [scrollContainerRef, setSelectedTab]);

  useEffect(() => {
     const videoElement = videoRef.current;
     const handleVideoCanPlay = () => {
       setIsVideoReady(true);
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
     // console.log(tabContent);
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
                     loading="lazy"
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
             className="relative w-full  gap-10  flex flex-col md:flex-row h-fit  md:h-[80dvh] py-4 "
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
       case "teams":
           return (
             <div
               id="svgimage"
               className="svgimage relative w-full text-4xl flex flex-col gap-10 h-fit md:h-[80dvh]  py-8 pt-[10dvh] "
             >
               <div className="flex flex-col w-full gap-10 md:w-[60vw] md:mx-auto items-center">
                 {tabContent.heading && (
                   <div
                     className="w-2/3 gap-10 m-auto text-center text-destaque  md:w-2/3 md:m-0"
                     dangerouslySetInnerHTML={{ __html: tabContent.heading }}
                   />
                 )}
                 {tabContent.description && (
                   <div
                     className=" gap-10 text-center text-corpo-b leading-[1.25]"
                     dangerouslySetInnerHTML={{ __html: tabContent.description }}
                   />
                 )}
               
               </div>
             </div>
           );
         
       case "team":
         return (
           <div className="relative w-full 
       2xl:text-teams-1400
        3xl:text-teams-1600
        4xl:text-teams-1920
        5xl:text-teams-2000
        
           leading-snug gap-10 h-full  md:h-[75dvh] py-4 mt-[10dvh] md:mt-0 columns-1 md:columns-3  justify-start" style={{ columnFill: "auto" }}>
 
 
      
             {/* Render grafico as an image if present */}
             {tabContent.grafico && tabContent.grafico.url && (
               <div className="w-1/2 pb-8">
                 {/* <h3>Gráfico</h3> */}
                 <Image
                   src={tabContent.grafico.url}
                   alt={tabContent.grafico.alt || "Gráfico"}
                   width={tabContent.grafico.width || 200}
                   height={tabContent.grafico.height || 200}
                   className="object-contain"
                 />
               </div>
             )}
 
             {/* Example rendering for legenda */}
             {tabContent.producao && tabContent.producao.length > 0 && (
               <div className="pb-8 text-rodape leading-tight">
                 {/* <h3>Legenda</h3> */}
                 <ul>
 
                   {tabContent.producao.map((prod, idx) => (
                   <div key={idx}>
                     {prod.equipas && prod.equipas.length > 0 && (
                       <ul>
                         <li key={"idx"} className="gap-4 flex"><span className="w-[1em] font-mono"> {prod.id_name}</span><span className="lowercase font-mono">{"[" + prod.titulo + "]"}</span>  </li>
                         {prod.equipas.map((e, eidx) => (
                           <li key={eidx} className="gap-4 flex">
                             <span className="w-[1em] font-mono">{e.id_name}</span>
                             <span className="lowercase  font-mono">{"[" + e.titulo + "]"}</span>
  
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                 ))}
                   {tabContent.projecto && tabContent.projecto.map((prod, idx) => (
                   <div key={idx}>
                     {prod.equipas && prod.equipas.length > 0 && (
                       <ul>
                         <li key={"idx"} className="gap-4 flex"><span className="w-[1em] font-mono"> {prod.id_name}</span><span className="lowercase font-mono">{"[" + prod.titulo + "]"}</span>  </li>
                         {prod.equipas.map((e, eidx) => (
                           <li key={eidx} className="gap-4 flex">
                             <span className="w-[1em] font-mono">{e.id_name}</span>
                             <span className="lowercase font-mono font-bold">{"[" + e.titulo + "]"}</span>
  
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                 ))}
                 </ul>
               </div>
             )}
 
             {/* Example rendering for direccao */}
             {tabContent.chefia && tabContent.chefia.cargos && tabContent.chefia.cargos.length > 0 && (
               <div className="pb-4">
                 <h3 className="uppercase">{tabContent.chefia.titulo}</h3>
                 <ul>
                   {tabContent.chefia.cargos.map((member, idx) => (
                     <li key={idx}>
                       <span
                         className={`${member.image?.url ? 'cursor-pointer' : ''}`}
                         onMouseEnter={member.image?.url ? (e) => handleMouseEnter(member.image!, member.name, e) : undefined}
                         onMouseLeave={member.image?.url ? handleMouseLeave : undefined}
                         onMouseMove={member.image?.url ? handleMouseMove : undefined}
                       >
                        <span className="font-works">{member.name}</span>{member.cargo && `, ${member.cargo}`}
                       </span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}
 
             {/* Example rendering for producao */}
             {tabContent.producao && tabContent.producao.length > 0 && (
               <div  className="">
                 {tabContent.producao.map((prod, idx) => (
                   <div key={idx}>
                   
                 <h3 className="uppercase">{prod.titulo} <sup className="font-mono text-teams">{prod.id_name}</sup></h3>
                   <div >
                     {prod.equipas && prod.equipas.length > 0 && (
                       <ul>
                         {prod.equipas.map((e, eidx) => (
                           <li key={eidx} className="pb-4">
                             <h3>{e.titulo } <sup className="font-mono text-teams">{e.id_name}</sup> </h3>
                             <ul>
                               {e.trabalhador.map((t, tidx) => (
                                 <li key={tidx}>
                                   <span
                                     className={`${t.image?.url ? 'cursor-pointer transition-colors' : ''}`}
                                     onMouseEnter={t.image?.url ? (e) => handleMouseEnter(t.image!, t.nome, e) : undefined}
                                     onMouseLeave={t.image?.url ? handleMouseLeave : undefined}
                                     onMouseMove={t.image?.url ? handleMouseMove : undefined}
                                   >
                                     {t.nome}<span className="font-works">{t.cargo && `, ${t.cargo}`}</span>
                                   </span>
                                 </li>
                               ))}
                             </ul>
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                   </div>
                 ))}
               </div>
             )}
 
             {/* Example rendering for projecto */}
             {tabContent.projecto && tabContent.projecto.length > 0 && (
               <div className="pb-4">
                 {tabContent.projecto.map((proj, idx) => (
                   <div key={idx}>
                   <h3 className="uppercase">{proj.titulo} <sup className="font-mono text-teams">{proj.id_name}</sup></h3>
                   <div key={proj.id_name + idx}>
                     {proj.equipas && proj.equipas.length > 0 && (
                       <ul >
                         {proj.equipas.map((e, eidx) => (
                           <li key={eidx} className="pb-4">
                             <h3>{e.titulo}  <sup className="font-mono text-teams">{e.id_name}</sup></h3>
                             <ul>
                               {e.trabalhador.map((t, tidx) => (
                                 <li key={tidx}>
                                   <span
                                     className={`${t.image?.url ? 'cursor-pointer transition-colors' : ''}`}
                                     onMouseEnter={t.image?.url ? (e) => handleMouseEnter(t.image!, t.nome, e) : undefined}
                                     onMouseLeave={t.image?.url ? handleMouseLeave : undefined}
                                     onMouseMove={t.image?.url ? handleMouseMove : undefined}
                                   >
                                     {t.nome}<span className="font-works">{t.cargo && `, ${t.cargo}`}</span>
                                   </span>
                                 </li>
                               ))}
                             </ul>
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                   </div>
                 ))}
               </div>
             )}
 
             {/* Render content if it exists */}
             {tabContent.content && (
               <div
                 className="flex flex-col w-full max-h-full leading-tight font-works  md:w-full"
                 dangerouslySetInnerHTML={{ __html: tabContent.content }}
               />
             )}
           </div>
         );
 
 
 
 
         case "support_artists":
         return (
           <div className="relative w-full  gap-10 flex flex-col md:flex-row h-fit  md:h-[80dvh] py-4">
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
     <div id="smooth-wrapper" className="
     ">
       <div
         id="smooth-container"
         className={`${isProduction ? "h-[230dvh] md:h-[300dvh]" : ""} ${
           isAbout ? "h-[680dvh] md:h-[680dvh] " : ""
         } ${isResidencias ? "h-[125dvh] md:h-[100dvh]" : ""}   `}
         ref={scrollContainerRef}
         style={{
           // Improve mobile scrolling performance
           WebkitOverflowScrolling: 'touch',
         }}
       >
         {/*snap-y snap-mandatory <pre >{JSON.stringify(tabData, null, 2)}</pre> */}
         {Object.entries(tabData[0].acf).map(
           ([key, tabContent]: [string, TabContent], index) => {
             return (
               <div
                 key={`${key}-${index}`}
                 id={key}
                 ref={(el: HTMLDivElement | null) => {
                   sectionRefs.current[index] = el;
                 }}
                 className={`   relative md:pt-[12dvh]
                   ${key === "no_entulho" ? "md:overflow-hidden  md:px-32 " : ""} 
                   ${key === "mission" ? "h-fit md:h-screen  md:px-32 " : ""}
                   ${key === "teams" ? "h-fit md:h-screen md:pt-[20dvh]  md:px-32 " : ""}
                   ${key === "about_aw" ? "h-fit md:px-32 " : ""}
                   ${key === "support_artists" ? "md:px-32 " : ""}
                   ${
                     key === "jornais"
                       ? " w-full overflow-x-scroll px-20 md:w-screen h-screen"
                       : ""
                   }
                   ${
                     key === "servicos"
                       ? "w-full overflow-x-scroll px-20 md:w-screen h-screen  md:px-32 "
                       : "w-screen"
                   }
                   ${
                     key === "splash"
                       ? "px-4 h-[30dvh] md:px-40 md:h-screen  mt-[22dvh] md:mt-0 mb-8 md:pb-0"
                       : "px-4 "
                   }
                   ${
                     key === "team"
                       ? "px-4 md:px-12"
                       : ""
                   }`}
                 style={{
                   // Optimize mobile rendering
                   transform: isMobile ? 'translateZ(0)' : undefined,
                   willChange: isMobile ? 'auto' : undefined
                 }}
               >
                 {renderContent(key, tabContent)}
               </div>
             );
           }
         )}
       </div>
       
       {/* Floating hover image - only render on desktop */}
       {!isMobile && (
         <div
           ref={hoverRef}
           className={`fixed pointer-events-none z-50 transform origin-top-left ${hoverVisible ? '' : ''}`}
           style={{
             // We let GSAP control transforms (x/y) for smooth movement — keep container at top-left
             left: 0,
             top: 0,
             visibility: hoveredImage ? 'visible' : 'hidden',
             // initial transform styles will be applied by GSAP
           }}
         >
           {hoveredImage && (
             <Image
               src={hoveredImage.sizes?.medium_large ?? hoveredImage.url}
               alt={hoveredImage.alt ?? hoveredImage.url}
               width={170}
               height={170}
               className="object-cover rounded-md"
               unoptimized
             />
           )}
         </div>
       )}
     </div>
   );
 };
 
 export default HorizontalTabs;
