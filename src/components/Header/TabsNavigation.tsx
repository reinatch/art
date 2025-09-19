"use client";
import Image from "next/image";
import { useTabsContext } from "@/lib/TabsContext";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import gsap from "gsap";

export default function TabsNavigation() {
  const windowSize = useWindowSize();
  const {
    selectedTab,
    setSelectedTab,
    tabs,
    tabTitle,
    scrollSmootherInstanceRef,
    sectionRefs,
  } = useTabsContext();

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
    <div className="cenas_essencials w-full relative pt-4 md:hidden flex-wrap md:flex-nowrap flex justify-center items-center space-x-4 font-mono text-xs gap-y-2 p-4">
      <div className="py-0 uppercase">{tabTitle}</div>
      <span className="py-0 font-works">→</span>
      
      {tabs.map((tab) => (
        <TabItem
          key={tab.slug}
          tab={tab as {
            slug: string;
            label: string;
            content?: {
              image?: { url: string };
            };
          }}
          selectedTab={selectedTab}
          onTabClick={handleTabsClick}
        />
      ))}
    </div>
  );
}

interface TabItemProps {
  tab: {
    slug: string;
    label: string;
    content?: {
      image?: { url: string };
    };
  };
  selectedTab: string;
  onTabClick: (slug: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function TabItem({ tab, selectedTab, onTabClick }: TabItemProps) {
  const isSelected = selectedTab === tab.slug;
  const isSplash = tab.slug === "splash";
  
  return (
    <a
      href={`#${tab.slug}`}
      className={`tabsClick px-4 py-0 h-4 ${
        isSelected
          ? "underline underline-offset-4 md:underline-offset-8 decoration-1"
          : ""
      }`}
      onClick={(e) => onTabClick(tab.slug, e)}
    >
      {isSplash && tab.content?.image ? (
        <Image
          src={tab.content.image.url}
          className={`rounded-[5px] w-auto h-4 md:h-10 ${
            isSelected ? "opacity-100" : "opacity-30"
          } pointer-events-none`}
          alt=""
          width={100}
          height={100}
          loading="lazy"
        />
      ) : (
        tab.label
      )}
    </a>
  );
}
