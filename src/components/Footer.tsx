// Footer.tsx
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTabsContext } from "@/lib/TabsContext";
import { useThumbnailsContext } from '@/lib/useThumbnailsContext';
import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import Search from "@/components/Search";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import TransitionLink from './TransitionLink';
import {useLocale, useTranslations} from 'next-intl';
import { useWindowSize } from '@custom-react-hooks/use-window-size';
// import { isMobile as detectMobile } from 'react-device-detect';



import LocaleSwitcher from "./Switcher";
// import { useLocale } from 'next-intl';
import { useToggleContact } from '@/lib/useToggleContact';
import { useToggleSearch } from '@/lib/useToggleSearch';
// import {inter} from "@/app/fonts";


export default function Footer() {
  const pathname = usePathname();
  const locale = useLocale(); // Get the active locale
  const windowSize = useWindowSize();
  const t = useTranslations("NavbarLinks");
  const p = useTranslations("ProjectDetailPage");
  const f = useTranslations("Footer");
  
  // const [isMobile, setIsMobile] = useState(false);


  const { selectedTab, setSelectedTab, tabs, tabTitle, scrollSmootherInstanceRef, sectionRefs } = useTabsContext();
  const { thumbnails, selectedThumbnail, setSelectedThumbnail, prevProject, nextProject, thumbRefs } = useThumbnailsContext();
  const [toMailHovered, setToMailHovered] = useState(false);
  // const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const tabsFooter = pathname === `/production` || pathname === `/about` || pathname === `/residencias`;
  const isHome = pathname === `/`;
  const isProjectPage = pathname.startsWith(`/projects/`);
  
  const isMatchingPath =
    pathname === `/production` ||
    pathname === `/about` ||
    pathname === `/residencias` ||
    pathname.startsWith(`/projects/`);




  // useEffect(() => {
  //   setIsMobile(detectMobile);
  // }, [windowSize.width]);

  // useEffect(() => {
  //   if (isMobile) {
  //     console.log('User is on a mobile device');
  //   } else {
  //     console.log('User is not on a mobile device');
  //   }
  // }, [isMobile]);


//mobile
const menuRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);
const [isOpen, setIsOpen] = useState(false);
const { isSearchOpen, openSearch, closeSearch } = useToggleSearch();
const {isContactOpen, openContact, closeContact } = useToggleContact();


const handleContactClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  e.preventDefault();
  
  if (isContactOpen) {
    closeContact();

  }else {
    openContact()
  }
  


}, [closeContact, isContactOpen, openContact]);








  // console.log("thumbnails", thumbnails);
  const handleTabsClick = useCallback((slug: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedTab(slug);
  
    if (scrollSmootherInstanceRef.current) {
      // Create an array of objects containing the id and offsetTop of each section
      const sectionsOffsetTop = sectionRefs.current.map(section => ({
        id: section?.id,
        offsetTop: section?.offsetTop ?? 0
      }));
      // console.log(sectionsOffsetTop)
      // Find the target section in the array
      const targetSection = sectionsOffsetTop.find(section => section.id === slug);
  
      if (targetSection) {
        let targetOffsetTop = targetSection.offsetTop;
        if (slug === "jornais") {
          // console.log(targetOffsetTop)
          scrollSmootherInstanceRef.current.scrollTo(targetOffsetTop, true, 'center center');
        }
        // If the slug is "teams", calculate the offsetTop based on the previous section
        if (slug === "teams") {
          const targetIndex = sectionsOffsetTop.findIndex(section => section.id === slug);
          if (targetIndex > 0) {
            const previousSection = sectionsOffsetTop[targetIndex - 1];
            targetOffsetTop = previousSection.offsetTop  + windowSize.height;
          } else {
            // If there is no previous section, it means it's the first section
            targetOffsetTop = windowSize.height;
          }
        }
  
        // console.log(`Scrolling to ${slug} at offset ${targetOffsetTop}`);
  
        gsap.to(window, {
          scrollTo: {
            y: targetOffsetTop,
            autoKill: false
          },
          duration: 1
        });
  
        // Alternatively, you can use scrollSmootherInstanceRef.current.scrollTo
        // scrollSmootherInstanceRef.current.scrollTo(targetOffsetTop, true, 'center center');
      }
    }
  }, [scrollSmootherInstanceRef, sectionRefs, setSelectedTab, windowSize.height]);
  
  const handleThumbailsClick = useCallback((slug: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedThumbnail(slug);
  
    const targetElement = thumbRefs.current.find(thumb => thumb?.id === `${slug}`);
    // console.log(`targetElement to ${slug} at offset`, targetElement);
  
    if (targetElement) {
      // const targetOffsetLeft = targetElement.offsetLeft;
      // console.log(`Scrolling to ${slug} at offset ${targetOffsetLeft}`);
  
      // Create an array of heights for each section
      const sectionsHeights = thumbRefs.current.map((thumb, index) => ({
        id: thumb?.id,
        height: windowSize.height * index
      }));
  
      // Find the target section in the array
      const targetSection = sectionsHeights.find(section => section.id === `${slug}`);
  
      if (targetSection) {
        const targetHeight = targetSection.height;
        // console.log(`Scrolling to ${slug} at height ${targetHeight}`);
     // Calculate the duration based on the index difference
    //  const currentIndex = thumbRefs.current.findIndex(thumb => thumb?.id === `${selectedThumbnail}`);
    //  const targetIndex = thumbRefs.current.findIndex(thumb => thumb?.id === `${slug}`);
    //  const indexDifference = Math.abs(targetIndex - currentIndex);
    //  const duration = indexDifference * 0.2; // Adjust the multiplier as needed

        gsap.to(window, {
          scrollTo: {
            y: targetHeight,
            autoKill: false
          },
          duration: 1
        });
      }
    }
  }, [thumbRefs, setSelectedThumbnail, windowSize.height]);

  // GSAP animation effect for search visibility
  
  
  
  useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin);
    const footer_essencials = document.querySelector("#footer_essencials");
    const footer_wrapper = document.querySelector("#wrapper_footer_luva");

    const scrollIndicator = gsap.utils.toArray(".scroll-indicator");
    // const luvaWrapper = document.getElementById("wrapper_footer_luva");
    if (searchInputRef.current) {
      if (isSearchOpen) {
        // console.log(isSearchOpen , "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        gsap.set(scrollIndicator, { autoAlpha: 0 });
        gsap.set(footer_wrapper, { display: "flex" });
        // gsap.set(luvaWrapper, { display: "none" });
        gsap.fromTo(
          searchInputRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      } else {
        // console.log(isSearchOpen , "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
        gsap.set(scrollIndicator, { autoAlpha: 0 });
        gsap.set(footer_wrapper, { display: "none" });
        gsap.set(footer_essencials, {
                y: 0,
                duration: 1,
                display: "flex",
                autoAlpha: 1,
              }); // Hide footerLuva after it fades out
        // gsap.set(luvaWrapper, { display: "flex" });
        gsap.to(searchInputRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            // searchInputRef.current?.classList.remove('search-input-visible');
            // searchInputRef.current?.classList.add('search-input-hidden');
          }
        });
      }
    }
  }, [isSearchOpen]);


  const [aspectRatios, setAspectRatios] = useState<{ [key: string]: string }>({});

  const handleImageLoad = (thumbnailId: string, width: number, height: number) => {
    const aspectRatio = width / height;
    setAspectRatios((prevRatios) => ({
      ...prevRatios,
      [thumbnailId]: aspectRatio > 1 ? 'landscape' : 'portrait',
    }));
  };

  // Modular rendering logic for thumbnails
  const renderThumbnails = () => (
    <div className={`"${isProjectPage ? "pl-32" : ""} hidden relative -bottom-[1.25dvh] cenas_essencials w-full md:flex overflow-x-auto gap-3 justify-center items-center py-10 "`}>
      {thumbnails.map((thumbnail) => (
        <a
          key={thumbnail.id}
          href={`#${thumbnail.id}`}
          className=""
          onClick={(e) => handleThumbailsClick(thumbnail.id, e)}
          // onClick={() => setSelectedThumbnail(thumbnail.id)}
        >
          <Image
            src={thumbnail.url}
            alt="Thumbnail"
            width={60}
            height={60}
            className={`object-cover rounded-[0.2em]  ${selectedThumbnail === thumbnail.id ? "opacity-100" : "opacity-20"} ${aspectRatios[thumbnail.id] === 'landscape' ? 'fit-width w-[40px] h-[30px]' : 'fit-height w-[30px] h-[40px]'}`}
            onLoad={(e) => handleImageLoad(thumbnail.id.toString(), (e.target as HTMLImageElement).naturalWidth, (e.target as HTMLImageElement).naturalHeight)}

          />
        </a>
      ))}
    </div>
  );

  // Modular rendering logic for tabs [@media(max-height:900px)]:bg-blue-500 [@media(max-height:1080px)]:bg-yellow-500
  const renderTabs = () => (
    <div className={` w-full hidden   md:relative md:-bottom-[1.25dvh] absolute md:flex-nowrap cenas_essencials md:flex justify-center items-center space-x-4 font-mono text-md"`}>
      <div className="py-2 ">{tabTitle} </div><span className='py-2 font-works' >→</span>
      {tabs.map((tab) => (
        <a
          
          key={tab.slug}
          href={`#${tab.slug}`}
          className={`tabsClick px-4 md:py-0 ${selectedTab === tab.slug ? "underline underline-offset-4 md:underline-offset-8 decoration-1" : ""}`}
          onClick={(e) => handleTabsClick(tab.slug, e)}
        >
          {tab.slug !== "splash" ? tab.label : 
            typeof tab.content === 'object' && tab.content !== null && 'image' in tab.content ? (
              <Image
                src={(tab.content as { image: { url: string } }).image.url}
                className={`rounded-[5px] w-auto h-8 md:h-10 ${selectedTab === "splash" ? "opacity-100" : "opacity-30"} pointer-events-none`}
                alt={''}
                width={100}
                height={100}
              />
            ) : null
          }
        </a>
      ))}
    </div>
  );

  // Modular rendering logic for search input visibility
  const renderSearchInput = () => (
    <div ref={searchInputRef} className="cenas_essencials bottom-0 absolute flex caret_container flex-end justify-center items-end w-full h-[7dvh]">
      <Search />
    </div>
  );
  // console.log('isSearchOpen:', isSearchOpen);
  // console.log('isProjectPage:', isProjectPage);
  // console.log('tabsFooter:', tabsFooter);
  return (
    <footer id='footer' className={`fixed z-[55] w-screen  h-[10dvh] md:h-[12dvh] ${isHome && !isOpen ? 'mix-blend-difference md:mix-blend-normal bg-transparent text-white md:text-black md:bg-white' : ''} ${isHome  ? 'bg-transparent md:bg-white' : 'bg-white'} font-mono text-rodape text-black left-0 bottom-0 text-center inset-x-0 mx-auto container-full `}>
      <div className={`${isMatchingPath ? "items-center" : "items-end"}  h-full footer-inner md:py-10 md:flex md:justify-between lg:px-10`}>
        <div className="uppercase absolute left-4 md:left-10 w-[10vw] z-[55] text-start bottom-4 md:bottom-10 leading-3 "  onClick={() => {
          // console.log(e)
          if (isSearchOpen){
            closeSearch();
          }else{
            openSearch();
          }


        }}>
          {t("search")}
        </div>

        {isHome  && (
          <div className={`seta   hidden md:flex text-rodape justify-end scroll-indicator w-full ${isSearchOpen ? 'opacity-0' : ''}`}>
             <div className='relative leading-3'>
            {f("scroll")} <span className={`font-works relative`}>↓</span>

           </div>
          </div>
        )}

        <div id="footer_essencials"  className={`absolute left-0 w-full ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}>
          {isSearchOpen ? renderSearchInput() : isProjectPage ? renderThumbnails() : tabsFooter ? renderTabs() : null}
        </div>

        <div id="wrapper_footer_luva" className={`absolute hidden left-1/2 -translate-x-1/2 translate-y-1/4 m-auto md:flex w-auto text-2xl bottom-0 h-full z-40 ${isSearchOpen ? 'hidden opacity-0' : 'flex opacity-100'}`}>
          <Link href="mailto:info@artworks.pt" passHref className="flex items-center footerLuva h-[6dvh]" onMouseEnter={() => setToMailHovered(true)} onMouseLeave={() => setToMailHovered(false)}>
            <span className={`toMail relative top-2 text-rodape pr-4 ${toMailHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>{f("lets")}</span>
            <div id="footer_luva" className="relative w-auto h-24 opacity-0 footer_luva top-2 will-change-transform" data-flip-id="">
              
              {/* {locale === "pt" ? ( */}
                <Image
                src="/videos/luva/t.gif"
                alt="Logo Text"
                width={1000}
                height={1000}
                className="relative w-auto h-full transition-opacity duration-300 ease-in-out will-change-transform kerning"
                unoptimized={true}
                data-flip-id="img" 

              />












              
            {/* ) : (
                <video className="relative bottom-0 w-auto h-full" preload="auto" autoPlay loop muted playsInline>
                <source src="/luva/a.mov" type="video/mov" />
                <source src="/luva/b.webm" type="video/webm" />

            </video>
              )} */}
           
                   
                    </div>
            <span className={`toMail relative top-2 text-rodape pl-4 ${toMailHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>{f("talk")}</span>
          </Link>
        </div>
      {/* Right - Hamburger Menu  MOBILE*/}
        <div
          className="absolute flex items-center justify-center w-full bottom-4 lg:hidden" // Hide on large screensLet&apos;s
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={`text-2xl ${isHome ? '' : 'text-black'} z-[59]  focus:outline-none relative`}
          >
            <svg
              className={`w-10 h-10  transform ${isOpen ? '-rotate-[135deg]' : 'rotate-0'} transition-transform duration-500`} // Rotate in the opposite direction
              fill="none"
              stroke="currentColor"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
               <path
                        strokeWidth="1"
                        d="M0 15h30M15 0v30" // Keeps the "+" shape as is
                      />
            </svg>
          </button>
          {/* <div className="fixed top-0 left-0 flex flex-col justify-center w-screen h-screen"> */}

          {/* Full-Screen Mobile Menu */}
          {isOpen && (
             <>
             
             <nav
              onClick={() => setIsOpen(!isOpen)}
              ref={menuRef}
              className="fixed inset-0 z-[49] font-intl flex flex-col items-center justify-center space-y-8 text-4xl bg-white bg-opacity-70"
            >
              <TransitionLink href={`/projects`} className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}>{t("projects")}</TransitionLink>
                
                <TransitionLink href={`/production`}  className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}>{t("production")}</TransitionLink>
          
            
                <TransitionLink href={`/residencias`}  className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}>{t("residencies")}</TransitionLink>
                <TransitionLink href={`/about`}  className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}>{t("about")}</TransitionLink>
            
                <Link href="/about" className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`} onClick={handleContactClick}>
                    {t("contact")}
                  </Link>
            <div className={`" fixed flex flex-col-reverse gap-4 items-center space-y-4 text-xs text-center mx-10 bottom-4 " ${isHome ? "text-black" : ""}`}>
          
            
   

            </div>
            </nav>
             
        </>
          )}
          {/* </div> */}


        </div>

        {isHome  && (
          <div className={`seta hidden md:flex text-rodape justify-start  scroll-indicator  w-full ${isSearchOpen ? 'opacity-0' : ''}`}>
           <div className='relative leading-3'>

           {f("scroll")} <span className='relative font-works'>↓</span>
           </div>

          </div>
        )}

        {isProjectPage ? (
          <div className="absolute flex flex-col font-mono w-max md:flex-row right-4 md:right-10 bottom-4 md:bottom-10">
            <span className="flex gap-2 leading-3 md:flex-row">
              <TransitionLink className='hidden md:block' href={`/projects/${prevProject?.slug}`}>{p("prev")} </TransitionLink>
              <TransitionLink className='block md:hidden' href={`/projects/${prevProject?.slug}`}>{locale === "pt" ? "Ante" : "Prev"}</TransitionLink>
              <span className=':block'> / </span>
              <TransitionLink className='hidden md:block' href={`/projects/${nextProject?.slug}`}> {p("next")}</TransitionLink>
              <TransitionLink className='block md:hidden' href={`/projects/${nextProject?.slug}`}> {locale === "pt" ? "Prox" : "Next"}</TransitionLink>
            </span>
          </div>
        ) : (
          <div className="absolute z-50 flex whitespace-nowrap right-4 md:right-10 bottom-3 md:bottom-8">
            <LocaleSwitcher />
          </div>
        )}
      </div>
    </footer>
  );
}

