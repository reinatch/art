"use client";
import { useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Link as TransitionLink } from "next-transition-router";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useNavigation } from "@/lib/useNavigation";

interface MobileNavigationProps {
  isHome: boolean;
  isHomePage: boolean;
  isContactOpen: boolean;
  closeContact: () => void;
  openContact: () => void;
}

export default function MobileNavigation({ 
  isHome, 
  isHomePage, 
  isContactOpen, 
  closeContact, 
  openContact 
}: MobileNavigationProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isNavOpen, setIsNavOpen } = useNavigation();
  const t = useTranslations("NavbarLinks");

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  const handleContactClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      
      if (isHomePage) {
        // Robust scroll to #mapa using GSAP with position verification (mobile version)
        const mapaElement = document.querySelector('#mapa') as HTMLElement;
        console.log('Mobile: Mapa element found:', mapaElement);
        
        if (mapaElement) {
          console.log('Mobile: Scrolling to mapa element with GSAP');
          
          // First make the element visible and wait for layout
          gsap.set(mapaElement, { autoAlpha: 1 });
          
          // Use requestAnimationFrame to ensure layout is complete
          requestAnimationFrame(() => {
            // Get the actual position after visibility change
            const rect = mapaElement.getBoundingClientRect();
            const targetY = window.pageYOffset + rect.top;
            
            console.log('Mobile: Target scroll position:', targetY);
            
            // Use GSAP to scroll to calculated position
            gsap.to(window, {
              duration: 1.5,
              scrollTo: {
                y: targetY,
                autoKill: false
              },
              ease: "power2.inOut",
              onComplete: () => {
                console.log('Mobile: First scroll complete, verifying position...');
                
                // Verify we reached the target
                setTimeout(() => {
                  const currentScroll = window.pageYOffset;
                  const difference = Math.abs(currentScroll - targetY);
                  
                  console.log('Mobile: Current scroll:', currentScroll, 'Target:', targetY, 'Difference:', difference);
                  
                  // If we're not close enough, do one more precise scroll
                  if (difference > 50) {
                    console.log('Mobile: Doing precision scroll...');
                    gsap.to(window, {
                      duration: 0.5,
                      scrollTo: {
                        y: targetY,
                        autoKill: false
                      },
                      ease: "power1.out"
                    });
                  }
                }, 100);
              }
            });
          });
        } else {
          console.error('Mobile: Mapa element not found!');
        }
      } else {
        // Toggle contact overlay for non-home pages
        if (isContactOpen) {
          closeContact();
        } else {
          openContact();
        }
      }
    },
    [isHomePage, isContactOpen, closeContact, openContact]
  );

  const handleNavClick = useCallback(
    () => {
      if (isContactOpen) {
        closeContact();
      }
      // Don't prevent default - allow normal navigation
    },
    [closeContact, isContactOpen]
  );

  return (
    <div className="absolute flex items-center justify-center w-full bottom-4 lg:hidden">
      <button
        ref={buttonRef}
        onClick={() => setIsNavOpen(!isNavOpen)}
        className={`text-2xl ${
          isHome ? "" : "text-black"
        } z-[59]  focus:outline-none relative`}
      >
        <svg
          className={`w-10 h-10  transform ${
            isNavOpen ? "-rotate-[135deg]" : "rotate-0"
          } transition-transform duration-500`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeWidth="1" d="M0 15h30M15 0v30" />
        </svg>
      </button>
      {isNavOpen && (
        <>
          <nav
            onClick={() => setIsNavOpen(false)}
            ref={menuRef}
            className="fixed uppercase inset-0 z-[490] font-intl flex flex-col items-center justify-center space-y-8 text-4xl bg-white bg-opacity-70"
          >
            <TransitionLink
              href={`/projects`}
              className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}
               onClick={handleNavClick}
            >
              {t("projects")}
            </TransitionLink>
            <TransitionLink
              href={`/production`}
              className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}
               onClick={handleNavClick}
            >
              {t("production")}
            </TransitionLink>
            <TransitionLink
              href={`/residencias`}
              className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}
               onClick={handleNavClick}
            >
              {t("residencies")}
            </TransitionLink>
            <TransitionLink
              href={`/about`}
              className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}
               onClick={handleNavClick}
            >
              {t("about")}
            </TransitionLink>
            <Link
              href="#"
              className={`block pt-1 whitespace-nowrap text-black hover:text-[#6b6a6a]`}
              onClick={handleContactClick}
            >
              {t("contact")}
            </Link>
            <div
              className={`" fixed flex flex-col-reverse gap-4 items-center space-y-4 text-xs text-center mx-10 bottom-4 " ${
                isHome ? "text-black" : ""
              }`}
            ></div>
          </nav>
        </>
      )}
    </div>
  );
}
