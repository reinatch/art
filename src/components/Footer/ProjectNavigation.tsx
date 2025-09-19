"use client";
import { useCallback } from "react";
import { Link as TransitionLink } from "next-transition-router";
import { useTranslations } from "next-intl";
import { useThumbnailsContext } from "@/lib/useThumbnailsContext";

interface ProjectNavigationProps {
  isProjectPage: boolean;
  isContactOpen: boolean;
  closeContact: () => void;
}

export default function ProjectNavigation({ 
  isProjectPage, 
  isContactOpen, 
  closeContact 
}: ProjectNavigationProps) {
  const p = useTranslations("ProjectDetailPage");
  const { prevProject, nextProject } = useThumbnailsContext();

  const handleNavClick = useCallback(
    () => {
      if (isContactOpen) {
        closeContact();
      }
      // Don't prevent default - allow normal navigation
    },
    [closeContact, isContactOpen]
  );

  if (!isProjectPage) return null;

  return (
    <>
      {/* Desktop version */}
      <div className="absolute hidden md:flex flex-col font-mono w-max md:flex-row right-4 md:right-10 bottom-4 md:bottom-10">
        <span className="flex gap-2 leading-3 md:flex-row">
          <TransitionLink
            className="block"
            href={`/projects/${prevProject?.slug}`}
          >
            {p("prev")}{" "}
          </TransitionLink>
          <span className="block"> / </span>
          <TransitionLink
            className="block"
            href={`/projects/${nextProject?.slug}`}
          >
            {" "}
            {p("next")}
          </TransitionLink>
        </span>
      </div>
      {/* Mobile version */}
      <div className="uppercase absolute md:hidden right-4 md:left-10  z-[55] text-start bottom-4 md:bottom-10 leading-3  w-[20vw]">
        <TransitionLink href={`/projects/`} onClick={handleNavClick}>
          <div className="justify-end flex font-mono leading-3 text-rodape">
            <span className="pr-2 font-intl">← </span> {p("goBackMobile")}
          </div>
        </TransitionLink>
      </div>
    </>
  );
}
