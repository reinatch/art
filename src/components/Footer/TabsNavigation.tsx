"use client";
import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { useTabsContext } from "@/lib/TabsContext";

interface TabsNavigationProps {
  tabsFooter: boolean;
}

export default function TabsNavigation({ tabsFooter }: TabsNavigationProps) {
  const windowSize = useWindowSize();
  const tabsRef = useRef<HTMLDivElement>(null);
  const {
    selectedTab,
    setSelectedTab,
    tabs,
    tabTitle,
    scrollSmootherInstanceRef,
    sectionRefs,
  } = useTabsContext();

  // Animate tabs navigation visibility
  useEffect(() => {
    if (tabsRef.current) {
      if (tabsFooter) {
        console.log('TabsNavigation: Showing tabs');
        gsap.fromTo(tabsRef.current, 
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      } else {
        console.log('TabsNavigation: Hiding tabs');
        gsap.to(tabsRef.current, {
          autoAlpha: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  }, [tabsFooter]);

  const handleTabsClick = useCallback(
    (slug: string, e: React.MouseEvent<HTMLAnchorElement>) => {
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
          if (slug === "jornais") {
            scrollSmootherInstanceRef.current.scrollTo(
              targetOffsetTop,
              true,
              "center center"
            );
          }
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
          gsap.to(window, {
            scrollTo: {
              y: targetOffsetTop,
              autoKill: false,
            },
            duration: 1,
          });
        }
      }
    },
    [scrollSmootherInstanceRef, sectionRefs, setSelectedTab, windowSize.height]
  );

  if (!tabsFooter) return null;

  return (
    <div
      ref={tabsRef}
      className={` w-full hidden   md:relative md:-bottom-[1.25vh] absolute md:flex-nowrap cenas_essencials md:flex justify-center items-center space-x-4 font-mono text-md"`}
      style={{ opacity: 0 }} // Initial state for GSAP
    >
      <div className="py-2 ">{tabTitle} </div>
      <span className="py-2 font-works">→</span>
      {tabs.map((tab) => (
        <a
          key={tab.slug}
          href={`#${tab.slug}`}
          className={`tabsClick px-4 md:py-0 ${
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
              className={`rounded-[5px] w-auto h-8 md:h-10 ${
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
  );
}
