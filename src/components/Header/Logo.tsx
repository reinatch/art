"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link as TransitionLink } from "next-transition-router";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { isMobile as detectMobile } from "react-device-detect";
import { useNavigation } from "@/lib/useNavigation";
import { useEffect } from "react";

interface LogoProps {
  isOpen?: boolean;
}

export default function Logo({ isOpen = false }: LogoProps) {
  const pathname = usePathname();
  const windowSize = useWindowSize();
  const { setIsNavOpen } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isHomePage = pathname === "/";
  const isProjectPage = pathname.startsWith("/projects/");

  useEffect(() => {
    setIsMobile(detectMobile);
  }, [windowSize]);

  const shouldHideMobile = isProjectPage && isMobile;

  return (
    <>
      {/* Desktop Logo */}
      <TransitionLink
        className={`${shouldHideMobile ? "hidden" : ""} hidden md:flex w-full md:w-[25vw] h-10`}
        href="/"
        passHref
      >
        <LogoContainer
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isHomePage={isHomePage}
          isOpen={isOpen}
          variant="desktop"
        />
      </TransitionLink>

      {/* Mobile Logo */}
      <TransitionLink
        className={`${shouldHideMobile ? "hidden" : ""} flex md:hidden w-full md:w-[20vw] h-auto`}
        href="/"
        onClick={() => setIsNavOpen(false)}
        passHref
      >
        <LogoContainer
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isHomePage={isHomePage}
          isOpen={isOpen}
          variant="mobile"
        />
      </TransitionLink>
    </>
  );
}

interface LogoContainerProps {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isHomePage: boolean;
  isOpen: boolean;
  variant: "desktop" | "mobile";
}

function LogoContainer({ isHovered, setIsHovered, isHomePage, isOpen, variant }: LogoContainerProps) {
  const containerClasses = variant === "desktop" 
    ? "relative flex md:items-start items-center justify-center md:justify-start m-auto md:m-0 w-[80vw] md:w-[40vw] h-full"
    : `relative flex md:items-end items-end justify-center md:justify-start m-auto md:m-0 w-[80vw] md:w-[20vw]  ${isHomePage ? "h-12" : "h-10"}`;

  return (
    <div
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {variant === "desktop" ? (
        <DesktopLogos isHovered={isHovered} isHomePage={isHomePage} isOpen={isOpen} />
      ) : (
        <MobileLogos isHomePage={isHomePage} />
      )}
    </div>
  );
}

interface LogoImagesProps {
  isHovered?: boolean;
  isHomePage: boolean;
  isOpen?: boolean;
}

function DesktopLogos({ isHovered, isHomePage, isOpen }: LogoImagesProps) {
  // Same logic as original Navbar: show open logo when hovered, navigation is open, or not on home page
  const showOpen = isHovered || isOpen || !isHomePage;
  
  return (
    <>
      <Image
        src="/lo.svg"
        alt="Logo Closed"
        width={300}
        height={50}
        loading="lazy"
        className={`relative w-auto h-[3.25rem] left-0 transition-opacity duration-100 ease-in-out ${
          showOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src="/logo.svg"
        alt="Logo Open"
        width={300}
        height={50}
        loading="lazy"
        className={`absolute hidden md:block w-auto h-full left-0 transition-opacity duration-100 ease-in-out ${
          showOpen ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

function MobileLogos({ isHomePage }: LogoImagesProps) {
  return (
    <>
      <Image
        src="/logo_white.svg"
        alt="Logo Closed"
        width={300}
        height={50}
        loading="lazy"
        className={`relative w-auto h-full left-0 transition-opacity duration-100 ease-in-out ${
          isHomePage ? "opacity-100" : "opacity-0"
        }`}
      />
      <Image
        src="/logo.svg"
        alt="Logo Open"
        width={300}
        height={50}
        loading="lazy"
        className={`absolute md:hidden w-auto h-full transition-opacity duration-100 ease-in-out ${
          isHomePage ? "opacity-0" : "opacity-100"
        }`}
      />
    </>
  );
}
