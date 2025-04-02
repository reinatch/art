"use client";

import React, { useState, useEffect } from "react";

import { TransitionRouter } from "next-transition-router";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { animatePageIn, animatePageOut } from "@/utils/animations";
import { isMobile as detectMobile } from "react-device-detect";
import { useLocale } from "next-intl";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
// import gsap from "gsap";

const DEBUG = true;
const debug = (message: string, data?: unknown) => {
  if (DEBUG) {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
};

export function TemplateTransition({
  children,
}: {
  children: React.ReactNode;
}) {
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
        animatePageOut(pathname, isMobile)?.then(next);
        debug(`Leave transition started: from ${from} to ${to}`);
        // console.log(from, to, next);
     
    }}
      enter={(next, from, to) => {
        animatePageIn(pathname, true, locale, isMobile)?.then(next);
        debug(`Enter transition started: from ${from} to ${to}`);

      }}
    >
      <div
        id="banner-1"
        className={`z-[60]  h-screen w-screen  ${
          isAbout ? "bg-transparent" : "bg-transparent"
        } opacity-100  fixed top-0 flex items-center justify-center origin-bottom`}
      >
        <div id="banner_luva" className="z-[60] h-20">
          <Image
            src="/videos/luva/output.gif"
            alt="Logo Text"
            width={100}
            height={100}
            className="relative w-auto h-full transition-opacity duration-300 ease-in-out will-change-transform"
            priority
            data-flip-id="img"
          />
        </div>
        <div className="back bg-white w-full h-full absolute z-[65]"></div>
      </div>
   
      {children}
    </TransitionRouter>
  );
}
