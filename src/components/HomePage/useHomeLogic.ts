import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { useDataFetchContext } from "@/lib/DataFetchContext";
import { useToggleContact } from "@/lib/useToggleContact";
import { useHome } from "@/utils/useHome";
import { HomePageData } from "@/utils/types";

export const useHomeLogic = () => {
  const locale = useLocale();
  const { data } = useHome(locale);
  const [sections, setSections] = useState<HomePageData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isContactOpen, closeContact } = useToggleContact();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const windowSize = useWindowSize();
  const { setIsVideoReady } = useDataFetchContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Data fetching effect
  useEffect(() => {
    if (!data) return;
    setSections(data);
  }, [data]);

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

  // Mobile device detection and contact handling
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

  return {
    sections,
    containerRef,
    sectionRefs,
    windowSize,
    videoRef,
    isContactOpen,
    closeContact
  };
};