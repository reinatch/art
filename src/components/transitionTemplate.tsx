"use client";
import { animatePageIn } from "@/utils/animations";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { isMobile as detectMobile } from "react-device-detect";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { useToggleContact } from "@/lib/useToggleContact";
import { useToggleSearch } from "@/lib/useToggleSearch";
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const isAbout = pathname === "/about";
  const windowSize = useWindowSize();
  const { isContactOpen, closeContact } = useToggleContact();
  const { isSearchOpen, closeSearch } = useToggleSearch();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(detectMobile);
  }, [windowSize]);
  useEffect(() => {
    if (isSearchOpen) {
      closeSearch();
    }
    if (isContactOpen) {
      closeContact();
    }
    animatePageIn(pathname, false, locale, isMobile);
  }, [
    closeContact,
    closeSearch,
    isContactOpen,
    isMobile,
    isSearchOpen,
    locale,
    pathname,
  ]);
  return (
    <div>
      {/* Loading banner while video is not ready */}
      <div
        id="banner-1"
        className={`z-[60]  h-screen w-screen  ${
          isAbout ? "bg-transparent" : "bg-transparent"
        } opacity-100  fixed top-0 w-full flex items-center justify-center origin-bottom`}
      >
        <div id="banner_luva" className="z-[60] h-20">
          <Image
            src="/videos/luva/output.gif"
            alt="Logo Text"
            width={100}
            height={100}
            className="relative w-auto h-full transition-opacity duration-300 ease-in-out will-change-transform"
            priority
            data-flip-id="img"
          />
        </div>
        <div className="back bg-white w-full h-full absolute z-[65]"></div>
      </div>
      {children}
    </div>
  );
}
