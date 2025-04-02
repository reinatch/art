"use client";

import React, { useState, useEffect, useRef } from "react";

import { TransitionRouter } from "next-transition-router";
// import Image from "next/image";
import { usePathname } from "next/navigation";
import { animatePageIn, animatePageOut } from "@/utils/animations";
import { isMobile as detectMobile } from "react-device-detect";
import { useLocale } from "next-intl";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import gsap from "gsap";



export function TemplateTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const firstLayer = useRef<HTMLDivElement | null>(null);
  const secondLayer = useRef<HTMLDivElement | null>(null);

  // Initialize layer positions only once on component mount
  useEffect(() => {
    if (firstLayer.current && secondLayer.current) {
      gsap.set([firstLayer.current, secondLayer.current], { x: "-100%" });
    }
  }, []);
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const locale = useLocale();
  const isAbout = pathname === "/about";
  const windowSize = useWindowSize();
  useEffect(() => {
    setIsMobile(detectMobile);
  }, [windowSize]);

  useEffect(() => {
    animatePageIn(pathname, false, locale, isMobile);
  }, [isMobile, locale, pathname]);
  return (
    <TransitionRouter
      auto={true}
      leave={(next, from, to) => {
        const tl = gsap.timeline({
          onComplete: next,
        });

        // Simplified animation without redundant checks and settings
        tl.to(firstLayer.current, {
          x: 0,
          duration: 0.5,
          ease: "circ.inOut",
        }).to(secondLayer.current, {
          x: 0,
          duration: 0.5,
          ease: "circ.inOut",
        }, "<50%");

        animatePageOut(pathname, isMobile, from, to)?.then(next);
        // debug(`Leave transition started: from ${from} to ${to}`);
        return () => {
          tl.kill();
        };
        // console.log(from, to, next);
     
    }}
      enter={(next, from, to) => {
        const tl = gsap.timeline();

        tl.to(secondLayer.current, {
          x: "-100%",
          duration: 0.5,
          ease: "circ.inOut",
        }).to(firstLayer.current, {
          x: "-100%",
          duration: 0.5,
          ease: "circ.inOut",
        }, "<50%").call(next, undefined, "<50%");
        animatePageIn(pathname, true, locale, isMobile, from, to)?.then(next);
        // debug(`Enter transition started: from ${from} to ${to}`);

        return () => {
          tl.kill();
        };

      }}
    >
      <div
        id="banner-1"
        className={`z-[60]  h-screen w-screen  ${
          isAbout ? "bg-transparent" : "bg-transparent"
        } opacity-100  fixed top-0 flex items-center justify-center origin-bottom`}
      >
        <div id="banner_luva" className="z-[60] h-20">
          {/* <Image
            src="/videos/luva/output.gif"
            alt="Logo Text"
            width={100}
            height={100}
            className="relative w-auto h-full transition-opacity duration-300 ease-in-out will-change-transform"
            priority
            data-flip-id="img"
          /> */}
        </div>
        <div className="back bg-white w-full h-full absolute z-[45]"></div>
      </div>
   
      {children}
      <div
        ref={firstLayer}
        className="fixed inset-0 z-[5000] w-screen h-screen bg-white"
        // style={{ backgroundColor: "#991b1b" }}
      ></div>
      <div
        ref={secondLayer}
        className="fixed inset-0 z-[5000] w-screen h-screen bg-white"
        // style={{ backgroundColor: "#3b82f6" }}
      ></div>
    </TransitionRouter>
  );
}
