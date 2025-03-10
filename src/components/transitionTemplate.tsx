// app/template.tsx

'use client';
// import { useDataFetchContext } from "@/lib/DataFetchContext";
import { animatePageIn } from "@/utils/animations";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {  useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { isMobile as detectMobile } from 'react-device-detect';
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { useToggleContact } from '@/lib/useToggleContact';
import { useToggleSearch } from '@/lib/useToggleSearch';

// import gsap from "gsap";



export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const isAbout = pathname === '/about';
  const windowSize  = useWindowSize();
  // const [, setHasVisited] = useState(false);
const {isContactOpen, closeContact} = useToggleContact();
const { isSearchOpen, closeSearch} = useToggleSearch();

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(detectMobile);
  }, [windowSize]);
  // alert(firstVisit);
  // gsap.set
  useEffect(() => {
    // const firstVisit = localStorage.getItem("hasVisited");

    // If this is the first visit, run a special animation and set hasVisited to true
    // if (!firstVisit) {
      if (isSearchOpen) {
        closeSearch()
      }
      if (isContactOpen) {
        closeContact()
      }
      // setTimeout(() => {
        // animatePageIn(pathname, true, locale,isMobile); // Special first-time animation
        // localStorage.setItem("hasVisited", "true");
        // setHasVisited(true);
      // }, 1000); // Adjust delay as needed
    // } else {
      // For subsequent visits, run the regular animation
      // setTimeout(() => {
        animatePageIn(pathname, false, locale, isMobile);
      // }, 1000); // Adjust delay as needed
      // setHasVisited(false);
    // }
  }, [ isMobile, locale, pathname]);
  // useEffect(() => {
  //   // if (isVideoReady) {
  //     setTimeout(() => {
  //       animatePageIn(pathname);
  //     }, 1000); // 2-second delay before animation
  //   // }
  // }, [ pathname]);

 
  return (
    <div>
      {/* Loading banner while video is not ready */}
      <div
        id="banner-1"
        className={`z-[60]  h-screen w-screen  ${isAbout ? "bg-transparent" : "bg-transparent"} opacity-100  fixed top-0 w-full flex items-center justify-center origin-bottom`}
      >

        <div id="banner_luva" className="z-[60] h-20">
        {/* <Image
          src={"/videos/luva/1/output.gif"}
          alt="Logo Text"
          width={1000}
          height={1000}
          className="relative bottom-0 w-auto h-full "
          unoptimized
        /> */}
                      {/* <video className="relative bottom-0 w-auto h-full" autoPlay loop muted playsInline>
                          <source src="/luva/a.mov" type="video/mov" />
                          <source src="/luva/b.webm" type="video/webm" />

                      </video> */}
                  {/* {locale === "pt" ? ( */}
                <Image
                src="/videos/luva/output.gif"
                alt="Logo Text"
                width={100}
                height={100}
                className="relative w-auto h-full transition-opacity duration-300 ease-in-out will-change-transform"
                unoptimized={true}
                data-flip-id="img" 
              />

              
            {/* ) : (
                <video className="relative bottom-0 w-auto h-full" autoPlay loop muted playsInline preload="auto">
                <source src="/luva/a.mov" type="video/mov" />
                <source src="/luva/b.webm" type="video/webm" />

            </video>
              )} */}

        </div>
        <div className="back bg-white w-full h-full absolute z-[65]"></div>
      </div>

      {/* Suspense wrapper around children */}
      {/* {isVideoReady && ( */}
          {children}
      {/* )} */}
    </div>
  );
}
