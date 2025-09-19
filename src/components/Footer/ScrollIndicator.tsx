"use client";
import { useTranslations } from "next-intl";

interface ScrollIndicatorProps {
  isHome: boolean;
  isSearchOpen: boolean;
}

export default function ScrollIndicator({ isHome, isSearchOpen }: ScrollIndicatorProps) {
  const f = useTranslations("Footer");

  if (!isHome) return null;

  return (
    <>
      <div
        className={`seta   hidden md:flex text-rodape justify-end scroll-indicator w-full ${
          isSearchOpen ? "opacity-0" : ""
        }`}
      >
        <div className="relative leading-3">
          {f("scroll")} <span className={`font-works relative`}>↓</span>
        </div>
      </div>

      <div
        className={`seta hidden md:flex text-rodape justify-start  scroll-indicator  w-full ${
          isSearchOpen ? "opacity-0" : ""
        }`}
      >
        <div className="relative leading-3">
          {f("scroll")} <span className="relative font-works">↓</span>
        </div>
      </div>
    </>
  );
}
