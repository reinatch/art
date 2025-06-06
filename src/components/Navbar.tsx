"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useToggleContact } from "@/lib/useToggleContact";
// import { Link as TransitionLink } from "next-transition-router";
import { Link as TransitionLink } from "next-transition-router";
import { useTranslations } from "next-intl";
import { useTabsContext } from "@/lib/TabsContext";
import gsap from "gsap";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { isMobile as detectMobile } from "react-device-detect";
interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  const windowSize = useWindowSize();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("NavbarLinks");
  const p = useTranslations("ProjectDetailPage");
  const { isContactOpen, closeContact, openContact } = useToggleContact();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(detectMobile);
  }, [windowSize]);
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";
  const isProductionPage = pathname === "/production";
  const isResidenciesPage = pathname === "/residencias";
  const isProPage = pathname === "/projects";
  const isProjectPage = pathname.startsWith(`/projects/`);

  const navLinks = [
    { href: "/projects", label: t("projects"), isActive: isProPage },
    { href: "/production", label: t("production"), isActive: isProductionPage },
    { href: "/residencias", label: t("residencies"), isActive: isResidenciesPage },
    { href: "/about", label: t("about"), isActive: isAboutPage },
  ];
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 4000);
    setTimeoutId(id);
  };
  useEffect(() => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 3000);
    setTimeoutId(id);
  }, [setIsOpen]);
  const handleContactClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    // console.log(e)
    console.log("Contact clicked");  // Debug: Check if this is logged
    if (isContactOpen) {
      closeContact();
    } else {
      openContact();
    }
  };
  //mobile
  const {
    selectedTab,
    setSelectedTab,
    tabs,
    tabTitle,
    scrollSmootherInstanceRef,
    sectionRefs,
  } = useTabsContext();
  const tabsFooter =
    pathname === `/production` ||
    pathname === `/about` ||
    pathname === `/residencias`;
  const handleTabsClick = (
    slug: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setSelectedTab(slug);
    if (scrollSmootherInstanceRef.current) {
      const sectionsOffsetTop = sectionRefs.current.map((section) => ({
        id: section?.id,
        offsetTop: section?.offsetTop ?? 0,
      }));
      const targetSection = sectionsOffsetTop.find(
        (section) => section.id === slug
      );
      if (targetSection) {
        let targetOffsetTop = targetSection.offsetTop;
        if (slug === "teams") {
          const targetIndex = sectionsOffsetTop.findIndex(
            (section) => section.id === slug
          );
          if (targetIndex > 0) {
            const previousSection = sectionsOffsetTop[targetIndex - 1];
            targetOffsetTop = previousSection.offsetTop + windowSize.height;
          } else {
            targetOffsetTop = windowSize.height;
          }
        }
        // console.log(`Scrolling to ${slug} at offset ${targetOffsetTop}`);
        gsap.to(window, {
          scrollTo: {
            y: targetOffsetTop,
            autoKill: false,
          },
          duration: 1,
        });
      }
    }
  };
  return (
    <div
      className={`fixed left-0 top-0 w-screen md:py-10 md:w-full mx-auto z-[1000]  ${
        tabsFooter ? "h-[22dvh] md:h-[12dvh] bg-white" : "h-[12dvh]"
      }`}
    >
      <div
        className={`flex gap-4 md:flex-row items-end  md:justify-between w-screen md:w-full md:px-8 lg:px-10  h-full ${
          tabsFooter ? "justify-center flex-col mb-8" : "flex-row"
        }`}
      >
        {/* Left - Logo */}
        <>
          <TransitionLink
            className={`${
              isProjectPage && isMobile ? "hidden" : ""
            } hidden md:flex w-full md:w-[25vw] h-[5dvh] `}
            href={`/`}
            passHref
          >
            <div
              className="relative flex md:items-end items-center justify-center md:justify-start m-auto md:m-0 w-[80vw] md:w-[20vw] h-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={"/lo.svg"}
                alt="Logo Closed"
                width={300}
                height={50}
                loading="lazy"
                className={`relative w-auto h-[5dvh] left-0 transition-opacity duration-100 ease-in-out ${
                  isHovered || isOpen || !isHomePage
                    ? "opacity-0"
                    : "opacity-100"
                } `}
              />
              <Image
                src={"/la.svg"}
                alt="Logo Open"
                width={300}
                height={50}
                loading="lazy"
                className={`absolute hidden md:block w-auto h-[5dvh] left-0 transition-opacity duration-100 ease-in-out ${
                  isHovered || isOpen || !isHomePage
                    ? "opacity-100"
                    : "opacity-0"
                } `}
              />
            </div>
          </TransitionLink>
          {/* //mobile */}
          <TransitionLink
            className={`${
              isProjectPage && isMobile ? "hidden" : ""
            } mt-4 flex md:hidden w-full md:w-[20vw] h-full `}
            href={`/`}
            passHref
          >
            <div
              className="relative flex md:items-end items-end justify-center md:justify-start m-auto md:m-0 w-[80vw] md:w-[20vw] h-[6dvh]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={"/logo_white.svg"}
                alt="Logo Closed"
                width={300}
                height={50}
                loading="lazy"
                className={`relative w-auto h-full left-0 transition-opacity duration-100 ease-in-out ${
                  isHomePage ? "opacity-100" : "opacity-0"
                } `}
              />
              <Image
                src={"/logo.svg"}
                alt="Logo Open"
                width={300}
                height={50}
                loading="lazy"
                className={`absolute md:hidden w-auto h-[4.5dvh] transition-opacity duration-100 ease-in-out ${
                  isHomePage ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </TransitionLink>
        </>
        {isProjectPage ? (
          <div className="flex items-start h-full projectoBack ">
            <TransitionLink href={`/projects/`}>
              <div className="self-end hidden font-mono leading-3 md:flex text-rodape">
                <span className="pr-2 font-intl">← </span> {p("goBack")}
              </div>
            </TransitionLink>
          </div>
        ) : (
          <div
            className="relative items-center justify-center hidden h-full gap-8 md:justify-between lg:flex" // Show on large screens
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className={`text-2xl text-black hover:text-[#6b6a6a] focus:outline-none transition-transform duration-300 h-[4dvh]`}
            >
              <svg
                className={`w-auto h-full  transform ${
                  isOpen ? "-rotate-[135deg]" : "rotate-0"
                } transition-transform duration-500`} // Rotate in the opposite direction
                fill="black"
                stroke="black"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeWidth="1" d="M0 15h30M15 0v30" />
              </svg>
            </button>
            <nav
              ref={menuRef}
              className={` pb-1 text-xl absolute uppercase items-end right-full leading-3 mr-8 bottom-0 space-x-8 flex z-50 transform transition-all duration-200 ease-in-out ${
                isOpen
                  ? "translate-x-0 opacity-100 scale-100"
                  : "translate-x-[60%] opacity-0 scale-0"
              } `}
            >
              {navLinks.map((link) => (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className={`flex gap-2 whitespace-nowrap text-black`}
                >
                  <span className={`icon ${link.isActive ? "" : "hidden"}`}>→</span>{" "}
                  {link.label}
                </TransitionLink>
              ))}
              <div
                className={`block whitespace-nowrap text-black`}
                onClick={handleContactClick}
              >
                {t("contact")}
              </div>
              {/* <Link href="/about" className={`block pt-1 whitespace-nowrap text-black`}>
                        test
                      </Link> */}
            </nav>
          </div>
        )}
        <div
          className={`cenas_essencials ${
            tabsFooter ? "" : "hidden"
          } w-full relative  pt-4 md:hidden flex-wrap md:flex-nowrap  flex justify-center items-center space-x-4 font-mono text-xs gap-y-2 p-4`}
        >
          <div className="py-0 uppercase">{tabTitle} </div>
          <span className="py-0 font-works">→</span>
          {tabs.map((tab) => (
            <a
              key={tab.slug}
              href={`#${tab.slug}`}
              className={`tabsClick px-4 py-0 h-4 ${
                selectedTab === tab.slug
                  ? "underline underline-offset-4 md:underline-offset-8 decoration-1"
                  : ""
              }`}
              onClick={(e) => handleTabsClick(tab.slug, e)}
            >
              {tab.slug !== "splash" ? (
                tab.label
              ) : typeof tab.content === "object" &&
                tab.content !== null &&
                "image" in tab.content ? (
                <Image
                  src={(tab.content as { image: { url: string } }).image.url}
                  className={`rounded-[5px] w-auto h-4 md:h-10 ${
                    selectedTab === "splash" ? "opacity-100" : "opacity-30"
                  } pointer-events-none`}
                  alt={""}
                  width={100}
                  height={100}
                  loading="lazy"
                />
              ) : null}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
