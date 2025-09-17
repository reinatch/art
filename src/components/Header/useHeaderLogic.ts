"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface UseHeaderLogicReturn {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHomePage: boolean;
  isProjectPage: boolean;
  tabsFooter: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export function useHeaderLogic(pathname: string): UseHeaderLogicReturn {
  const [isOpen, setIsOpen] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Page type detection
  const isHomePage = pathname === "/";
  const isProjectPage = pathname.startsWith("/projects/");
  const tabsFooter = ["/production", "/about", "/residencias"].includes(pathname);

  // Timeout management
  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const setAutoCloseTimeout = useCallback((delay: number) => {
    clearCurrentTimeout();
    timeoutRef.current = setTimeout(() => setIsOpen(false), delay);
  }, [clearCurrentTimeout]);

  // Mouse event handlers
  const handleMouseEnter = useCallback(() => {
    clearCurrentTimeout();
    setIsOpen(true);
  }, [clearCurrentTimeout]);

  const handleMouseLeave = useCallback(() => {
    setAutoCloseTimeout(4000);
  }, [setAutoCloseTimeout]);

  // Initial auto-close effect
  useEffect(() => {
    const initialTimeout = setTimeout(() => setIsOpen(false), 3000);
    timeoutRef.current = initialTimeout;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    isOpen,
    setIsOpen,
    isHomePage,
    isProjectPage,
    tabsFooter,
    handleMouseEnter,
    handleMouseLeave,
  };
}
