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
  const isProjectDetailPage = pathname.startsWith("/projects/") && pathname.split("/").length > 2;

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
          isProjectDetailPage={isProjectDetailPage}
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
          isProjectDetailPage={isProjectDetailPage}
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
  isProjectDetailPage: boolean;
  isOpen: boolean;
  variant: "desktop" | "mobile";
}

function LogoContainer({ isHovered, setIsHovered, isHomePage, isProjectDetailPage, isOpen, variant }: LogoContainerProps) {
  const containerClasses = variant === "desktop" 
    ? "relative flex md:items-center items-center  justify-center md:justify-start m-auto md:m-0 w-[80vw] md:w-[40vw] h-full"
    : `relative flex md:items-end items-end justify-center md:justify-start m-auto md:m-0 w-[80vw] md:w-[20vw]  ${isHomePage ? "h-12" : "h-10"}`;

  return (
    <div
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {variant === "desktop" ? (
        <DesktopLogos isHovered={isHovered} isHomePage={isHomePage} isProjectDetailPage={isProjectDetailPage} isOpen={isOpen} />
      ) : (
        <MobileLogos isHomePage={isHomePage} />
      )}
    </div>
  );
}

interface LogoImagesProps {
  isHovered?: boolean;
  isHomePage: boolean;
  isProjectDetailPage?: boolean;
  isOpen?: boolean;
}

function DesktopLogos({ isHovered, isHomePage, isProjectDetailPage, isOpen }: LogoImagesProps) {
  // Same logic as original Navbar: show open logo when hovered, navigation is open, or not on home page
  const showOpen = isHovered || isOpen || !isHomePage;
  
  // On project detail pages: use logo.svg, on homepage: use la.svg, on other pages: use logo.svg
  const openLogoSrc = isProjectDetailPage ? "/logo.svg" : (isHomePage ? "/la.svg" : "/logo.svg");
  
  // Add vertical centering for logo.svg to match the height baseline of la.svg
  const isUsingLogoSvg = openLogoSrc === "/logo.svg";
  
  return (
    <>
      <Image
        src="/lo.svg"
        alt="Logo Closed"
        width={300}
        height={50}
        loading="lazy"
        className={`relative w-auto h-[5dvh] left-0 transition-opacity duration-100 ease-out ${
          showOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={openLogoSrc}
        alt="Logo Open"
        width={300}
        height={50}
        loading="lazy"
        className={`absolute hidden md:block w-auto  left-0 transition-opacity duration-100 ease-out ${
          showOpen ? "opacity-100" : "opacity-0"
        } ${isUsingLogoSvg ? "object-center  h-[4dvh]" : " h-[5dvh]"}`}
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
