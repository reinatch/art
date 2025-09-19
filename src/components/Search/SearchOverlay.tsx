"use client";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useToggleSearch } from "@/lib/useToggleSearch";
import SearchSimplified from "./SearchSimplified";
import gsap from "gsap";
interface SearchOverlayProps {
  className?: string;
}
const SearchOverlay: React.FC<SearchOverlayProps> = ({ className = "" }) => {
  const { isSearchOpen, closeSearch } = useToggleSearch();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;
    if (isSearchOpen) {
      // Animate in
      gsap.fromTo(
        overlayRef.current,
        { 
          opacity: 0,
          backdropFilter: "blur(0px)",
        },
        { 
          opacity: 1,
          backdropFilter: "blur(20px)",
          duration: 0.4,
          ease: "power2.out"
        }
      );
      gsap.fromTo(
        contentRef.current,
        { 
          y: 100,
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.1
        }
      );
    } else {
      // Animate out
      gsap.to(overlayRef.current, {
        opacity: 0,
        backdropFilter: "blur(0px)",
        duration: 0.3,
        ease: "power2.in"
      });
      gsap.to(contentRef.current, {
        y: -50,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isSearchOpen]);
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, closeSearch]);
  if (!isSearchOpen) return null;
  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] bg-white/30 backdrop-blur-fallback md:hidden ${className}`}
      onClick={closeSearch}
    >
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-start justify-center pt-16 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-h-[80vh] overflow-hidden">
          {/* Search content */}
          <div className="p-4 pt-4 max-h-[80vh] overflow-y-auto">
            <SearchSimplified />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default SearchOverlay;
