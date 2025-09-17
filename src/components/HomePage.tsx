"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ScrollTrigger,
  ScrollToPlugin,
  ScrollSmoother,
  Flip,
  Observer,
} from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { useDataFetchContext } from "@/lib/DataFetchContext";
import { useToggleContact } from "@/lib/useToggleContact";
import { useLocale } from "next-intl";
import { Link as TransitionLink } from "next-transition-router";
import RandomVideoPosition from "@/components/RandomVideoPosition";
import AnimatedText from "@/lib/AnimatedText ";
import AnimatedImages from "@/lib/AnimatedImages";
import Marquee from "@/components/Marquee";
import Image from "next/image";
import { HomePageData, homeProjecto } from "@/utils/types";
import { useHome } from "@/utils/useHome";
import { isMobile } from "react-device-detect";
import Sitemap from "./Sitemap";
const HomePageContent: React.FC = () => {
  const locale = useLocale();
  const { data } = useHome(locale);
  const [sections, setSections] = useState<HomePageData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isContactOpen, openContact, closeContact } = useToggleContact();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const windowSize = useWindowSize();
  const { setIsVideoReady } = useDataFetchContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMobileClient, setIsMobileClient] = useState(false);
  useEffect(() => {
    setIsMobileClient(isMobile);
  }, []);
  useEffect(() => {
    if (!data) return;
    setSections(data);
  }, [data]);
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
  useEffect(() => {
    const isMobileDevice = () => {
      const isSmallScreen = window.innerWidth <= 900;
      const hasMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (window.innerWidth > 900) {
        return false;
      }
      return isSmallScreen || hasMobileUserAgent;
    };
    const sitempa = document.querySelector("#sitemap");
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('form') || target.closest('input') || target.closest('button') || target.closest('label')) {
        return;
      }
      if (sitempa && !sitempa.contains(target)) {
        closeContact();
      }
    };
    const handleScroll = () => {
      if (isContactOpen) {
        closeContact();
      }
    };
    if (isContactOpen && !isMobileDevice()) {
      console.log('Adding desktop event listeners - sitemap will close on click outside/scroll');
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    } else if (isContactOpen) {
      console.log('Mobile device detected - sitemap will only close via close button');
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeContact, isContactOpen]);
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    Observer,
    useGSAP,
    Flip
  );
  useGSAP(() => {
    if (!sections || sections.length === 0) return;
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });
    const sectionElements = sectionRefs.current;
    const movableArray: HTMLDivElement[] = gsap.utils.toArray(".movable");
    const scrolll = gsap.utils.toArray(".scroll-indicator");
    ScrollTrigger.config({ 
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });
    if (ScrollTrigger.isTouch === 1) {
      ScrollTrigger.normalizeScroll(true);
    }
    const mm = gsap.matchMedia();
    const smoother: ScrollSmoother = ScrollSmoother.create({
      content: containerRef.current,
      smooth: 1,
      smoothTouch: 1,
      ignoreMobileResize: true,
    });
    mm.add("(max-width: 899px)", () => {
      gsap.set(scrolll, {
        autoAlpha: 0,
        opacity: 0,
        display: "none",
        force3D: true, 
      });
      gsap.timeline({
        scrollTrigger: {
          id: "residency-pin-mobile",
          trigger: "#residency0",
          start: "top top",
          end: () => `+=${(document.querySelector("#mapa") as HTMLElement)?.offsetHeight || 500}`,
          pin: "#residency0",
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    mm.add("(min-width: 900px)", () => {
      gsap.set(scrolll, {
        autoAlpha: 0,
        opacity: 0,
        display: "none",
        force3D: true, 
      });
      const scrollToSection = (index: number) => {
        const target = sectionElements[index];
        if (target && smoother) {
          smoother.scrollTo(target, true);
        }
      };
      sectionElements.forEach((panel, index) => {
        if (!panel) return;
        ScrollTrigger.create({
          id: `section-nav-${index}`,
          trigger: panel,
          start: "top top",
          end: "bottom-=50px 10%",
          scrub: true,
          onEnter: () => scrollToSection(index),
          onEnterBack: () => scrollToSection(index),
        });
      });
      gsap.timeline({
        scrollTrigger: {
          id: "residency-desktop",
          trigger: "#residency0",
          start: "top top",
          end: "bottom center",
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            if (self.progress > 0.99 && self.direction === 1) {
              requestAnimationFrame(() => openContact());
            }
          },
        },
      });
      return () => {
        if (smoother) smoother.kill();
      };
    });
    gsap
      .timeline({
        scrollTrigger: {
          id: "home-video-scale",
          trigger: "#home_splash",
          start: "bottom bottom",
          end: "bottom center",
          scrub: 1,
        },
      })
      .to(".home_video", { 
        scale: 0.9, 
        y: -40,
        duration: 1, 
        ease: "none",
        force3D: true 
      });
    gsap
      .timeline({
        scrollTrigger: {
          id: "scroll-indicator-fade",
          trigger: "#home_splash",
          start: "bottom bottom-=10px",
          end: "bottom 90%",
        },
      })
      .to(scrolll, { 
        autoAlpha: 0, 
        opacity: 0, 
        ease: "none",
        force3D: true
      });
    const sphere = document.querySelector(".production0_video");
    const target = document.querySelector(".production0_video_wrapper_target");
    if (sphere && target) {
      const proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(sphere, "skewY", "deg");
      const clamp = gsap.utils.clamp(-20, 20);
      const state = Flip.getState(sphere);
      target.appendChild(sphere);
      const animation = Flip.from(state, {
        simple: true,
        ease: "power2.out"
      });
      ScrollTrigger.create({
        id: "sphere-animation",
        trigger: "#production0",
        start: "center center",
        endTrigger: "#production0",
        end: "bottom top",
        scrub: 1,
        animation,
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (Math.abs(velocity) > 50) { 
            const skew = clamp(velocity / -200);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.4,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          }
        },
      });
    }
    const toPXCache = new Map<string, number>();
    const toPX = (value: string): number => {
      if (toPXCache.has(value)) {
        return toPXCache.get(value)!;
      }
      const result = (parseFloat(value) / 100) *
        (/dvh/gi.test(value) ? windowSize.height : windowSize.width);
      toPXCache.set(value, result);
      return result;
    };
    gsap
      .timeline({
        scrollTrigger: {
          id: "project-parallax",
          trigger: "#project0",
          start: "top+=100px top",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .to("#pro-title", { 
        y: toPX("-50dvh"), 
        duration: 1, 
        ease: "none",
        force3D: true
      }, "start")
      .from("#pro-row2", { 
        y: toPX("50dvh"), 
        duration: 1, 
        ease: "none",
        force3D: true
      }, "start+=0.1")
      .from("#pro-link", { 
        y: toPX("60dvh"), 
        duration: 1, 
        ease: "none",
        force3D: true
      }, "start+=0.2");
    const negativeXArray: HTMLDivElement[] = [];
    const positiveXArray: HTMLDivElement[] = [];
    movableArray.forEach((item, i) => {
      if (i % 2 === 0) {
        negativeXArray.push(item);
      } else {
        positiveXArray.push(item);
      }
    });
    if (negativeXArray.length > 0 || positiveXArray.length > 0) {
      gsap
        .timeline({
          scrollTrigger: {
            id: "movable-elements",
            trigger: "#residency0",
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none none reverse", 
          },
        })
        .from(negativeXArray, { 
          x: -2000, 
          duration: 2, 
          stagger: 0.1, 
          ease: "power2.out",
          force3D: true
        })
        .from(positiveXArray, { 
          x: 2000, 
          duration: 2, 
          stagger: 0.1,
          ease: "power2.out",
          force3D: true
        }, "<0.2");
    }
    mm.add("(max-width: 899px)", () => {
      const mapaElement = document.querySelector("#mapa");
      if (mapaElement) {
        gsap.timeline({
          scrollTrigger: {
            id: "mapa-fade-in",
            trigger: "#home_splash",
            start: "bottom bottom",
            end: "bottom center",
            onEnter: () => {
              gsap.to(mapaElement, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out"
              });
            }
          }
        });
      }
    });
    return () => {
      try {
        toPXCache.clear();
        const sphereWrapper = document.querySelector(".production0_video_wrapper_main");
        if (sphereWrapper && sphere) {
          sphereWrapper.appendChild(sphere);
        }
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger) trigger.kill();
        });
        if (smoother) {
          smoother.kill();
        }
        mm.kill();
      } catch (error) {
        console.warn("Error during GSAP cleanup:", error);
      }
    };
  }, [sections]);
  return (
    <div id="smooth-wrapper">
      <div
        ref={containerRef}
        id="smooth-content"
        className="relative grid w-screen min-h-full "
      >
        {sections &&
          sections[0]?.acf &&
          Object.entries(sections[0].acf).map(([key, value], index) => {
            return (
              <div
                key={key}
                ref={(el: HTMLDivElement | null) => {
                  sectionRefs.current[index + 1] = el;
                }}
                id={key}
                className={`
                ${key === "home_splash" ? "md:px-10 px-0" : ""} 
                ${
                  key === "about0" || key === "about1" || key === "production0"
                    ? "h-full md:h-screen "
                    : ""
                } 
                ${key === "production1" ? "h-auto md:h-screen" : ""}   
                ${key === "production0" ? "my-20 md:my-0" : ""}   
                ${key === "project0" ? "h-[40dvh]" : ""}   
                ${
                  key === "project1"
                    ? "h-[270dvh] pb-[10dvh] md:h-screen md:pb-0"
                    : ""
                }   
                ${
                  key != "project0" &&
                  key != "about0" &&
                  key != "project1" &&
                  key != "about1" &&
                  key != "production0"
                    ? "h-screen"
                    : ""
                }   
                panel  relative flex flex-col items-center  w-screen gap-8 sm:items-start rounded-3xl snap-start`}
              >
                {key === "home_splash" && (
                  <div className="flex flex-col items-center h-screen w-screen  md:h-[76dvh] md:mt-[12dvh] md:w-full gap-8  sm:items-start ">
                    <video
                      ref={videoRef}
                      poster={value.poster.url}
                      className="object-cover w-full h-full home_video md:rounded-xl"
                      autoPlay
                      muted
                      loop
                      preload="true"
                      playsInline
                    >
                      <source src={value.video.url} type="video/mp4" />
                      <source src={value.mov.url} type="video/mov" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {key === "about0" && (
                  <div className="about-section  px-0  md:px-10 md:py-8 md:pb-[10dvh] text-center  w-11/12 self-center flex flex-col justify-center gap-4 md:gap-[10dvh] h-[25dvh] md:h-[80dvh]  md:mt-[10dvh] ">
                    <div
                      id="target"
                      className="w-full md:w-10/12 m-auto 
                    0toAnim text-destaque-2xl leading-tight  md:leading-[1.04]"
                    >
                      <AnimatedText
                        trigger="#about0"
                        splitType="words"
                        x={1000}
                        y={0}
                        scale={1}
                        duration={2}
                        stagger={1}
                        ease="power1.out"
                        start="top bottom"
                        end="center center"
                        scrub
                      >
                        {value?.title && (
                          <div
                            dangerouslySetInnerHTML={{ __html: value?.title }}
                          />
                        )}
                      </AnimatedText>
                    </div>
                    <TransitionLink
                      href={`/about/`}
                      className="toAnim text-[1.5em] md:text-corpo-a-md"
                    >
                      {value?.link.title}
                    </TransitionLink>
                  </div>
                )}
                {key === "about1" && (
                  <div className="about-section px-4 mt-20 gap-4 md:gap-0  md:px-10 md:py-20 w-full flex-col justify-around h-[80dvh]  md:mt-[10dvh] grid-cols-1 grid md:grid-cols-2 relative">
                    <div
                      className="w-full leading-tight title text-corpo-a md:w-10/12"
                      style={{ gridArea: "title" }}
                    >
                      <AnimatedText
                        trigger="#about1"
                        splitType="lines"
                        x={-500}
                        y={0}
                        duration={1}
                        stagger={0.05}
                        ease="power1.out"
                        start="top bottom"
                        end="top top"
                        scrub
                      >
                        {value?.title && (
                          <div
                            dangerouslySetInnerHTML={{ __html: value?.title }}
                          />
                        )}
                      </AnimatedText>
                    </div>
                    <div
                      className="md:self-end w-full font-mono leading-tight md:leading-5 toAnimLeft subtitle text-[10px] md:text-rodape md:w-3/6"
                      style={{ gridArea: "subtitle" }}
                    >
                      <AnimatedText
                        trigger="#about1"
                        splitType="lines"
                        x={-500}
                        y={0}
                        duration={1}
                        stagger={0.05}
                        ease="power1.out"
                        start="top bottom"
                        end="top top"
                        scrub
                      >
                        {value?.subtitle && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: value?.subtitle,
                            }}
                          />
                        )}
                      </AnimatedText>
                    </div>
                    {/* </div> */}
                    <div>
                      <div style={{ gridArea: "image" }}>
                        <AnimatedImages
                          trigger="#about1"
                          x={500}
                          y={0}
                          scale={0.5}
                          opacity={1}
                          duration={1}
                          stagger={0.2}
                          ease="power1.out"
                          start="top bottom"
                          end="top top"
                          scrub
                        >
                          <Image
                            width={100}
                            height={500}
                            src={value.image}
                            alt={key}
                            className="w-full h-auto image md:w-10/12 rounded-xl"
                            priority
                            unoptimized
                          />
                        </AnimatedImages>
                      </div>
                    </div>
                    <TransitionLink
                      href={`/about/`}
                      className="toAnimRight text-center md:text-start w-full text-[1.5em]  md:text-corpo-a-md link md:self-end"
                      style={{ gridArea: "link" }}
                    >
                      {value?.link.title}
                    </TransitionLink>
                  </div>
                )}
                {key === "production0" && (
                  <div className="production-section px-4 py-0 md:px-10 md:py-20 gap-8 md:gap-0 w-full flex-col justify-around h-[80dvh] md:mt-[10dvh] grid grid-cols-1 md:grid-cols-2 relative grid-rows-[15%_40%_30%_15%] md:grid-rows-[75%_25%]">
                    <div
                      className="w-full leading-tight toAnim text-corpo-a md:w-10/12 title"
                      style={{ gridArea: "title" }}
                    >
                      <AnimatedText
                        trigger="#production0"
                        splitType="lines"
                        x={500}
                        y={0}
                        duration={1}
                        stagger={0.05}
                        ease="power1.out"
                        start="top 80%"
                        end="top 20%"
                        scrub
                      >
                        {value?.title && (
                          <div
                            dangerouslySetInnerHTML={{ __html: value?.title }}
                          />
                        )}
                      </AnimatedText>
                    </div>
                    <div
                      className="self-end w-full font-mono leading-tight md:leading-5 md:self-end toAnim text-rodape subtitle md:w-3/5"
                      style={{ gridArea: "subtitle" }}
                    >
                      <AnimatedText
                        trigger="#production0"
                        splitType="lines"
                        x={-500}
                        y={0}
                        duration={1}
                        stagger={0.05}
                        ease="power1.out"
                        start="top bottom"
                        end="top top"
                        scrub
                      >
                        {value?.subtitle && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: value?.subtitle,
                            }}
                          />
                        )}
                      </AnimatedText>
                    </div>
                    <div
                      className="production0_video_wrapper_main  md:max-h-[40dvh] max-w-full md:max-w-[90%] perspective-200"
                      style={{ gridArea: "image" }}
                    >
                      <video
                        poster={value.poster.url}
                        className="object-cover w-full h-full rounded-3xl production0_video "
                        autoPlay
                        muted
                        loop
                        preload="true"
                        playsInline
                      >
                        <source src={value.video.url} type="video/mp4" />
                        <source src={value.mov.url} type="video/mov" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <TransitionLink
                      href={`/about/`}
                      className="toAnim text-center md:text-start text-[1.5em] md:text-corpo-a-md link self-start md:self-end"
                      style={{ gridArea: "link" }}
                    >
                      {value?.link.title}
                    </TransitionLink>
                  </div>
                )}
                {key === "production1" && (
                  <div className="production-section px-8 md:px-20 w-screen md:w-full items-center flex-col grid gap-2 relative  h-[80dvh] py-8 mt-[10dvh]">
                    <div
                      id="productionHighlight"
                      className="marquee mx-8 text-rodape  title1 font-mono capitalize flex w-[65dvw] md:w-[95%]  overflow-x-hidden gap-4 "
                    >
                      <Marquee>
                        {[...Array(8)].map((_, index) => (
                          <span key={index} className="whitespace-nowrap ">
                            {value?.title && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: value?.title,
                                }}
                              />
                            )}
                          </span>
                        ))}
                      </Marquee>
                    </div>
                    <div
                      id="secondGsap"
                      className="flex flex-col items-center h-[70dvh] w-full md:w-full row-start-2  sm:items-start rounded-3xl "
                    >
                      <div className="production0_video_target flex w-[80dvw] md:w-full h-full">
                        <div className="production0_video_wrapper_target w-full h-[70dvh] perspective-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Project Sections */}
                {key === "project0" && (
                  <div className="project-value h-[40dvh] md:mt-[10dvh] w-full text-center items-center py-8 gap-32">
                    <div
                      id="pro-title"
                      className="flex flex-col items-center w-full gap-16 text-center "
                    >
                      <span className="w-9/12 text-destaque-xl">
                        {value.title}
                      </span>
                      <span className="text-corpo-a md:text-3xl font-works">
                        {value.subtitle}
                      </span>
                    </div>
                    {/* <div className="h-[12dvh] w-full snap-start "></div> */}
                  </div>
                )}
                {key === "project1" && (
                  <div className="project-section h-[80dvh] md:mt-[10dvh] w-full text-center items-center py-8 gap-32 ">
                    {/* <div className="h-[12dvh] w-full snap-start "></div> */}
                    <div className="h-[80dvh] flex flex-col md:grid pb-[10dvh] justify-between md:justify-center gap-10 md:gap-12 w-10/12 md:w-full mx-auto md:mx-0">
                      <div
                        id="pro-row1"
                        className="grid justify-around w-full grid-cols-1 gap-10 flex-nowrap sm:grid-cols-3 md:w-full"
                      >
                        {value.items &&
                          value.items.map((item: homeProjecto, idx: number) => {
                            return(
                            <div
                              key={idx}
                              className="flex flex-col items-center h-full md:h-[20dvh] w-auto gap-4"
                            >
                              <TransitionLink
                                href={`/projects/${item.slug}`} 
                                className="flex flex-col items-center h-auto md:h-[20dvh] w-auto gap-4"
                              >
                                <Image
                                  width={1000}
                                  height={1000}
                                  src={item.thumbnail}
                                  alt={item.title}
                                  priority
                                  className="object-contain w-full h-auto rounded-md md:w-auto md:h-full"
                                />
                                <div className="w-8/12 text-sm">
                                  <span className="uppercase md:text-xl kerning">
                                    {item.acf.page_title},{" "}
                                  </span>
                                  <span className="capital capitalize md:text-lg font-works kerning">
                                    {item.title}, {item.acf.year}
                                  </span>
                                </div>
                              </TransitionLink>
                            </div>
                          )})}
                      </div>
                      <div
                        id="pro-row2"
                        className="grid justify-around w-full grid-cols-1 gap-10 mx-auto flex-nowrap md:mx-0 sm:grid-cols-3 md:w-full"
                      >
                        {value.items0 &&
                          value.items0.map(
                            (item: homeProjecto, idx: number) => {
                              return(
                              <div
                                key={idx}
                                className="flex flex-col items-center h-full md:h-[20dvh] md:w-auto gap-4"
                              >
                                <TransitionLink
                                  href={`/projects/${item.slug}`}
                                  className="flex flex-col items-center h-auto md:h-[20dvh] w-auto gap-4"
                                >
                                  <Image
                                    width={1000}
                                    height={1000}
                                    src={item.thumbnail}
                                    alt={item.title}
                                    priority
                                    className="object-contain w-full h-auto rounded-md md:w-auto md:h-full"
                                  />
                                  <div className="w-8/12 text-sm">
                                    <span className="uppercase md:text-xl">
                                      {item.acf.page_title},{" "}
                                    </span>
                                    <span className="capital capitalize md:text-lg font-works">
                                      {item.title}, {item.acf.year}
                                    </span>
                                  </div>
                                </TransitionLink>
                              </div>
                            )}
                          )}
                      </div>
                      <div id="pro-link" className="py-10 md:py-0">
                        <TransitionLink
                          href={`/projects/`}
                          className="text-[1.5em]  md:text-corpo-a-md "
                        >
                          {value.link.title}
                        </TransitionLink>
                      </div>
                    </div>
                  </div>
                )}
                {/* Residency Sections */}
                {key === "residency0" && (
                  <div className="residency-section px-4 md:px-10 text-center w-full flex flex-col justify-center h-[80dvh] mt-[12dvh] relative py-8">
                    <div className="text-[1.5em] md:text-destaque-xl">
                      <AnimatedText
                        trigger="#residency0"
                        splitType="lines"
                        x={-500}
                        y={0}
                        duration={1}
                        stagger={0.05}
                        ease="power1.out"
                        start="top bottom"
                        end="top top"
                        scrub
                      >
                        {/* {section.content?.title} */}
                        <h2 className="">
                          {value?.title && (
                            <div
                              dangerouslySetInnerHTML={{ __html: value?.title }}
                            />
                          )}
                        </h2>
                      </AnimatedText>
                    </div>
                    <div className="relative flex items-center justify-center w-full h-full leading-tight">
                      <RandomVideoPosition
                        src="/videos/p.webm"
                        poster="/images/residencias/1.png"
                      />
                      <RandomVideoPosition
                        src="/videos/c.webm"
                        poster="/images/residencias/11.png"
                        position="random"
                        overlay
                      />
                      <RandomVideoPosition
                        src="/videos/c.webm"
                        poster="/images/residencias/12.png"
                        position="random"
                        overlay
                      />
                      <RandomVideoPosition
                        src="/videos/p.webm"
                        poster="/images/residencias/9.png"
                        position="random"
                      />
                      <div className="w-full px-0 text-center text-destaque-md md:px-20 movable-elements-wrapper">
                        <AnimatedText
                          trigger="#residency0"
                          splitType="lines"
                          x={-500}
                          y={0}
                          duration={1}
                          stagger={0.05}
                          ease="power1.out"
                          start="top bottom"
                          end="top top"
                          scrub
                        >
                          <div className="absolute w-full text-center transform -translate-x-1/2 -translate-y-1/2 z-1 top-1/2 left-1/2">
                            {value?.subtitle && (
                              <div
                                className="text-6xl"
                                dangerouslySetInnerHTML={{
                                  __html: value?.subtitle,
                                }}
                              />
                            )}
                          </div>
                        </AnimatedText>
                      </div>
                    </div>
                    <div id="text1" className="staggerElements">
                      <RandomVideoPosition
                        src="/videos/p.webm"
                        poster="/images/residencias/10.png"
                        overlay
                        position="random"
                      />
                    </div>
                    <div id="text2" className="staggerElements">
                      <RandomVideoPosition
                        src="/videos/p.webm"
                        poster="/images/residencias/2.png"
                        overlay
                        position="random"
                      />
                    </div>
                    <div id="text3" className="staggerElements">
                      <RandomVideoPosition
                        src="/videos/p.webm"
                        poster="/images/residencias/7.png"
                        overlay
                      />
                    </div>
                    <TransitionLink
                      href={`/residencias/`}
                      className="text-[1.5em]  md:text-corpo-a-md"
                    >
                      {value?.link.title}
                    </TransitionLink>
                  </div>
                )}
              </div>
            );
          })}
          {
            isMobileClient && (
          <div id="mapa" className="pt-10 flex md:hidden opacity-0  relative z-10 h-[80vh] w-screen bg-white border-t-2 border-black" >
            <Sitemap asSection/>
          </div>
            ) 
          }
      </div>
    </div>
  );
};
export default HomePageContent;
