"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useToggleContact } from "@/lib/useToggleContact";
import { useToggleSearch } from "@/lib/useToggleSearch";
import { useNavigation } from "@/lib/useNavigation";
import LocaleSwitcher from "./Switcher";
import SearchOverlay from "../Search/SearchOverlay";
import SearchSection from "./SearchSection";
import ThumbnailsNavigation from "./ThumbnailsNavigation";
import TabsNavigation from "./TabsNavigation";
import CenterLogo from "./CenterLogo";
import MobileNavigation from "./MobileNavigation";
import ProjectNavigation from "./ProjectNavigation";
import ScrollIndicator from "./ScrollIndicator";

export default function Footer() {
  const pathname = usePathname();
  const { isSearchOpen } = useToggleSearch();
  const { isContactOpen, openContact, closeContact } = useToggleContact();
  const { isNavOpen } = useNavigation();

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  // Path-based conditionals
  const isHomePage = pathname === "/";
  const tabsFooter =
    pathname === `/production` ||
    pathname === `/about` ||
    pathname === `/residencias`;
  const isHome = pathname === `/`;
  const isProjectPage = pathname.startsWith(`/projects/`);
  const isProjectsListPage = pathname === `/projects`; // Just the projects list page
  const isMatchingPath =
    pathname === `/production` ||
    pathname === `/about` ||
    pathname === `/residencias` ||
    pathname.startsWith(`/projects/`);
  
  // Footer luva should show on: home, projects list, but NOT on tabs pages or individual project pages
  const shouldShowFooterLuva = isHome || isProjectsListPage;

  // Handle footer_luva visibility with direct useEffect
  useEffect(() => {
    // Add a delay to ensure page transition animations complete first
    const timer = setTimeout(() => {
      const footer_wrapper = document.querySelector("#wrapper_footer_luva");
      
      console.log('Footer useEffect: pathname =', pathname, 'shouldShowFooterLuva =', shouldShowFooterLuva, 'isSearchOpen =', isSearchOpen);
      
      if (footer_wrapper) {
        if (isSearchOpen) {
          console.log('Footer useEffect: Hiding footer_luva (search open)');
          gsap.set(footer_wrapper, { 
            display: "none", 
            autoAlpha: 0,
            visibility: "hidden"
          });
        } else if (shouldShowFooterLuva) {
          console.log('Footer useEffect: Showing footer_luva');
          gsap.set(footer_wrapper, { 
            display: "flex",
            visibility: "visible"
          });
          gsap.to(footer_wrapper, {
            autoAlpha: 1,
            duration: 0.5,
            delay: 0.1, // Reduced delay since we already have setTimeout
            ease: "power2.out",
            onComplete: () => {
              console.log('Footer useEffect: Animation complete - footer_luva should be visible');
            }
          });
        } else {
          console.log('Footer useEffect: Hiding footer_luva (wrong page)');
          gsap.set(footer_wrapper, { 
            display: "none", 
            autoAlpha: 0,
            visibility: "hidden"
          });
        }
      } else {
        console.log('Footer useEffect: #wrapper_footer_luva not found in DOM');
      }
    }, 500); // Wait 500ms for page transition animations to complete

    return () => clearTimeout(timer);
  }, [pathname, shouldShowFooterLuva, isSearchOpen]);

  // GSAP animations for other footer elements
  useGSAP(() => {
    const footer_essencials = document.querySelector("#footer_essencials");
    const scrollIndicator = gsap.utils.toArray(".scroll-indicator");
    const searchInputRef = document.querySelector(".cenas_essencials");

    console.log('Footer GSAP: Search animation - isSearchOpen =', isSearchOpen);

    if (isSearchOpen) {
      gsap.set(scrollIndicator, { autoAlpha: 0 });
      gsap.set(footer_essencials, {
        y: 0,
        duration: 1,
        display: "flex",
        autoAlpha: 1,
      });
      
      // Animate search input when it appears
      if (searchInputRef) {
        gsap.fromTo(
          searchInputRef,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    }
  }, [isSearchOpen]);

  return (
    <>
      <SearchOverlay />
      <footer
        id="footer"
        className={`fixed z-[55] w-screen h-[10vh] md:h-[12vh] ${
          isHome && !isNavOpen && !isSearchOpen ? "mix-blend-difference md:mix-blend-normal bg-transparent text-white md:text-black md:bg-white"
            : "" } ${ isHome ? "bg-transparent md:bg-white" : "bg-white" } font-mono text-rodape text-black left-0 bottom-0 text-center inset-x-0 mx-auto container-full `}
      >
        <div
          className={`${ isMatchingPath ? "items-center" : "items-end" }  h-full footer-inner md:py-10 md:flex md:justify-between lg:px-10`}
        >
          {/* Search Toggle Button */}
          <SearchSection isSearchOpen={isSearchOpen} />

          {/* Scroll Indicators */}
          <ScrollIndicator isHome={isHome} isSearchOpen={isSearchOpen} />

          {/* Footer Essentials - Search Input Area */}
          <div
            id="footer_essencials"
            className={`absolute left-0 w-full ${
              isSearchOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {isSearchOpen && <SearchSection isSearchOpen={isSearchOpen} renderSearchInput={true} />}
          </div>

          {/* Navigation Content - Shows when search is closed */}
          <div
            className={`absolute left-0 w-full ${
              !isSearchOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <ThumbnailsNavigation isProjectPage={isProjectPage} />
            <TabsNavigation tabsFooter={tabsFooter} />
          </div>

          {/* Center Logo */}
          <CenterLogo />

          {/* Project Navigation */}
          {!isSearchOpen && (
            <ProjectNavigation 
              isProjectPage={isProjectPage} 
              isContactOpen={isContactOpen}
              closeContact={closeContact}
            />
          )}

          {/* Locale Switcher - Non-project pages */}
          {!isProjectPage && (
            <div className="absolute z-50 flex whitespace-nowrap right-4 md:right-10 bottom-3 md:bottom-8">
              <LocaleSwitcher />
            </div>
          )}

          {/* Mobile Navigation */}
          <MobileNavigation 
            isHome={isHome}
            isHomePage={isHomePage}
            isContactOpen={isContactOpen}
            closeContact={closeContact}
            openContact={openContact}
          />
        </div>
      </footer>
    </>
  );
}
