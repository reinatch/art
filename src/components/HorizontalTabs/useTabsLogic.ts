import { useEffect, useRef, useState } from "react";
import { useTabsContext } from "@/lib/TabsContext";
import { useDataFetchContext } from "@/lib/DataFetchContext";
import { useToggleContact } from "@/lib/useToggleContact";
import { AboutTabData, ContentItem, ImageMedia } from "@/utils/types";
import gsap from "gsap";

interface HoveredImageState {
  url: string;
  alt: string;
  x: number;
  y: number;
  sizes?: { medium_large: string };
}

export const useTabsLogic = (tabData: AboutTabData[]) => {
  const {
    setTabs,
    setSelectedTab,
    setTabTitle,
    scrollSmootherInstanceRef,
    sectionRefs,
  } = useTabsContext();
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { setIsVideoReady } = useDataFetchContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isContactOpen, closeContact } = useToggleContact();
  
  const [hoveredImage, setHoveredImage] = useState<HoveredImageState | null>(null);
  const [isMobileClient, setIsMobileClient] = useState(false);
  const [hoverVisible, setHoverVisible] = useState(false);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Mobile detection effect - use window width instead of user agent
  useEffect(() => {
    // Your desktop has iPhone user agent but 1920px width - prioritize width
    setIsMobileClient(window.innerWidth <= 768);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, []);

  // Mouse interaction handlers - clean version
  const handleMouseEnter = (image: ImageMedia, nome: string, event: React.MouseEvent) => {
    if (isMobileClient || !image?.url) return; 
    
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    const clientX = event.clientX;
    const clientY = event.clientY;
    
    setHoveredImage({
      url: image.url,
      alt: nome,
      x: clientX + 15,
      y: clientY - 50,
    });

    if (hoverRef.current) gsap.killTweensOf(hoverRef.current);
    if (hoverRef.current) {
      gsap.set(hoverRef.current, { x: clientX + 15, y: clientY - 50, scale: 0.95, opacity: 0 });
      setHoverVisible(true);
      gsap.to(hoverRef.current, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (isMobileClient) return; 
    
    if (hoverRef.current) {
      gsap.killTweensOf(hoverRef.current);
      gsap.to(hoverRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          setHoverVisible(false);
          setHoveredImage(null);
        }
      });
    } else {
      setHoverVisible(false);
      setHoveredImage(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMobileClient || !hoverRef.current) return; 
    
    gsap.to(hoverRef.current, {
      x: event.clientX + 15,
      y: event.clientY - 50,
      duration: 0.12,
      ease: 'power3.out',
    });
  };

  // Tab data initialization effect
  useEffect(() => {
    if (tabData.length > 0 && tabData[0].acf) {
      const tabs = Object.entries(tabData[0].acf).map(([key, value]) => {
        const content = value as ContentItem;
        return {
          slug: key,
          label: content.title || key.charAt(0).toUpperCase() + key.slice(1),
          content: content,
        };
      });
      setTabs(tabs);
      setTabTitle(tabData[0].title.rendered);
      setSelectedTab(tabs[0].slug);
    }
  }, [tabData, setTabs, setSelectedTab, setTabTitle]);

  // Contact handling effect
  useEffect(() => {
    const isMobileDevice = () => {
      const isSmallScreen = window.innerWidth <= 900;
      const hasMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (window.innerWidth > 900) {
        return false;
      }
      return isSmallScreen || hasMobileUserAgent;
    };

    const sitempa = document.querySelector("#sitemap");
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('form') || target.closest('input') || target.closest('button') || target.closest('label')) {
        return;
      }
      if (sitempa && !sitempa.contains(target)) {
        closeContact();
      }
    };

    const handleScroll = () => {
      if (isContactOpen) {
        closeContact();
      }
    };

    if (isContactOpen && !isMobileDevice()) {
      console.log('Adding desktop event listeners - sitemap will close on click outside/scroll');
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    } else if (isContactOpen) {
      console.log('Mobile device detected - sitemap will only close via close button');
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [closeContact, isContactOpen]);

  // Video ready state effect
  useEffect(() => {
    const videoElement = videoRef.current;
    const handleVideoCanPlay = () => {
      setIsVideoReady(true);
    };
    if (videoElement) {
      videoElement.addEventListener("canplay", handleVideoCanPlay);
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("canplay", handleVideoCanPlay);
      }
    };
  }, [setIsVideoReady]);

  return {
    // Refs
    scrollContainerRef,
    videoRef,
    hoverRef,
    
    // State
    hoveredImage,
    isMobileClient,
    hoverVisible,
    
    // Context values
    scrollSmootherInstanceRef,
    sectionRefs,
    setSelectedTab,
    
    // Handlers
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  };
};