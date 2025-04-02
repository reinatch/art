import { useEffect } from "react";

export const useContactToggle = (
  isContactOpen: boolean,
  closeContact: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sitemap = document.querySelector("#sitemap");
      if (sitemap && !sitemap.contains(event.target as Node)) {
        closeContact();
      }
    };

    const handleScroll = () => {
      if (isContactOpen) {
        closeContact();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isContactOpen, closeContact]);
};