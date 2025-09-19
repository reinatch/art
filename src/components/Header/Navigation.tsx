"use client";
import { useRef, useCallback } from "react";
import React from "react";
import { Link as TransitionLink } from "next-transition-router";
import { useTranslations } from "next-intl";
import { useToggleContact } from "@/lib/useToggleContact";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Navigation({ isOpen, setIsOpen, onMouseEnter, onMouseLeave }: NavigationProps) {
  const pathname = usePathname();
  const t = useTranslations("NavbarLinks");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const { isContactOpen, closeContact, openContact } = useToggleContact();
  
  const isHomePage = pathname === "/";

  // Register GSAP plugins
  React.useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  const navLinks = [
    { href: "/projects", label: t("projects"), isActive: pathname === "/projects" },
    { href: "/production", label: t("production"), isActive: pathname === "/production" },
    { href: "/residencias", label: t("residencies"), isActive: pathname === "/residencias" },
    { href: "/about", label: t("about"), isActive: pathname === "/about" },
  ];

  const handleNavLinkClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleContactClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (isHomePage) {
      // Robust scroll to #mapa using GSAP with position verification
      const mapaElement = document.querySelector('#mapa') as HTMLElement;
      console.log('Mapa element found:', mapaElement);
      
      if (mapaElement) {
        console.log('Scrolling to mapa element with GSAP');
        
        // First make the element visible and wait for layout
        gsap.set(mapaElement, { autoAlpha: 1 });
        
        // Use requestAnimationFrame to ensure layout is complete
        requestAnimationFrame(() => {
          // Get the actual position after visibility change
          const rect = mapaElement.getBoundingClientRect();
          const targetY = window.pageYOffset + rect.top;
          
          console.log('Target scroll position:', targetY);
          
          // Use GSAP to scroll to calculated position
          gsap.to(window, {
            duration: 1.5,
            scrollTo: {
              y: targetY,
              autoKill: false
            },
            ease: "power2.inOut",
            onComplete: () => {
              console.log('First scroll complete, verifying position...');
              
              // Verify we reached the target
              setTimeout(() => {
                const currentScroll = window.pageYOffset;
                const difference = Math.abs(currentScroll - targetY);
                
                console.log('Current scroll:', currentScroll, 'Target:', targetY, 'Difference:', difference);
                
                // If we're not close enough, do one more precise scroll
                if (difference > 50) {
                  console.log('Doing precision scroll...');
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
        console.error('Mapa element not found!');
      }
    } else {
      // Toggle contact overlay
      if (isContactOpen) {
        closeContact();
      } else {
        openContact();
      }
    }
  }, [isHomePage, isContactOpen, closeContact, openContact]);

  return (
    <div
      className="relative items-start justify-center hidden h-full gap-8 md:justify-between lg:flex"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MenuToggleButton
        ref={buttonRef}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      <NavigationMenu
        ref={menuRef}
        isOpen={isOpen}
        navLinks={navLinks}
        onNavLinkClick={handleNavLinkClick}
        onContactClick={handleContactClick}
        contactLabel={t("contact")}
      />
    </div>
  );
}

interface MenuToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuToggleButton = React.forwardRef<HTMLButtonElement, MenuToggleButtonProps>(
  ({ isOpen, onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className="text-2xl text-black hover:text-[#6b6a6a] focus:outline-none transition-transform duration-300 nav-button-height"
    >
      <svg
        className={`w-auto h-full transform ${
          isOpen ? "-rotate-[135deg]" : "rotate-0"
        } transition-transform duration-500`}
        fill="black"
        stroke="black"
        viewBox="0 0 30 30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeWidth="1" d="M0 15h30M15 0v30" />
      </svg>
    </button>
  )
);

MenuToggleButton.displayName = "MenuToggleButton";

interface NavigationMenuProps {
  isOpen: boolean;
  navLinks: Array<{
    href: string;
    label: string;
    isActive: boolean;
  }>;
  onNavLinkClick: () => void;
  onContactClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  contactLabel: string;
}

const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ isOpen, navLinks, onNavLinkClick, onContactClick, contactLabel }, ref) => (
    <nav
      ref={ref}
      className={`pb-1 text-xl absolute uppercase items-end right-full leading-3 mr-8 bottom-0 space-x-8 flex z-50 transform transition-all duration-200 ease-in-out ${
        isOpen
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-[60%] opacity-0 scale-0"
      }`}
    >
      {navLinks.map((link) => (
        <TransitionLink
          key={link.href}
          href={link.href}
          className="flex gap-2 whitespace-nowrap text-black"
          onClick={onNavLinkClick}
        >
          <span className={`icon ${link.isActive ? "" : "hidden"}`}>→</span>
          {link.label}
        </TransitionLink>
      ))}
      <div
        className="block whitespace-nowrap text-black cursor-pointer"
        onClick={onContactClick}
      >
        {contactLabel}
      </div>
    </nav>
  )
);

NavigationMenu.displayName = "NavigationMenu";
