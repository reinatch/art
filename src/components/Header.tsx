"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/lib/useNavigation";
import Logo from "./Header/Logo";
import Navigation from "./Header/Navigation";
import ProjectBackButton from "./Header/ProjectBackButton";
import TabsNavigation from "./Header/TabsNavigation";
import { useHeaderLogic } from "./Header/useHeaderLogic";

export default function Header() {
  const pathname = usePathname();
  const { setIsNavOpen } = useNavigation();
  const {
    isOpen,
    setIsOpen,
    isHomePage,
    isProjectPage,
    tabsFooter,
    handleMouseEnter,
    handleMouseLeave,
  } = useHeaderLogic(pathname);

  // Reset navigation state on route change
  useEffect(() => {
    setIsOpen(false);
    setIsNavOpen(false);
  }, [pathname, setIsNavOpen, setIsOpen]);

  return (
    <header
      id="header"
      className={`fixed flex justify-center w-screen mx-auto h-auto items-center z-[55] px-10 
        ${isHomePage ? "mix-blend-difference md:mix-blend-normal" : isProjectPage ? "bg-transparent" : "bg-white"}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={` left-0 top-0 w-screen md:w-full mx-auto z-[1000] flex gap-4 md:flex-row items-start md:justify-between my-4  md:my-10 ${
          tabsFooter 
            ? "  justify-center flex-col mb-0  h-48" 
            : " flex-row  h-10"
        }`}
      >
        <Logo isOpen={isOpen} />
        
        {isProjectPage ? (
          <ProjectBackButton />
        ) : (
          <Navigation 
            isOpen={isOpen} 
            setIsOpen={setIsOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}
        
        {tabsFooter && <TabsNavigation />}
      </div>
    </header>
  );
}
