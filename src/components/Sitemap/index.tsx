"use client";
import { useCallback, useRef } from "react";
import { useToggleContact } from "@/lib/useToggleContact";
import Footer from "../Footer";
import CloseButton from "./CloseButton";
import LogoSection from "./LogoSection";
import SitemapContent from "./SitemapContent";
import NewsletterSection from "./NewsletterSection";

const sitemap = [
  {
    id: "sitemap",
    content: {
      address: `"440 Rua Manuel Dias, 4495-129 Póvoa de Varzim, Portugal"`,
      mail: "info@artworks.pt",
      phone: "+351 252 023 590",
      social_media: {
        instagram: "https://www.instagram.com/aw_artworks/?igshid=3rs6xir7bxf5",
        vimeo: "https://vimeo.com/user79925672",
        youtube: "http://www.youtube.com/@aw_artworks",
        linkedin:
          "https://www.linkedin.com/company/aw-artworks/posts/?feedView=all",
      },
      privacy: `© ArtWorks 2024 all rights reserved. Website design by Ana Luísa Martelo, code by Rei Rodrigues`,
    },
  },
];

interface SitemapProps {
  asSection?: boolean; 
}

const Sitemap: React.FC<SitemapProps> = ({ asSection = false }) => {
  const sitemapRef = useRef<HTMLDivElement>(null);
  const { isContactOpen, openContact, closeContact } = useToggleContact();
  
  const handleContactClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      if (isContactOpen) {
        closeContact();
      } else {
        openContact();
      }
    },
    [closeContact, isContactOpen, openContact]
  );

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSitemapClick = (e: React.MouseEvent) => {
    if (!asSection) {
      const target = e.target as HTMLElement;
      if (target.closest('form') || target.closest('input') || target.closest('button') || target.closest('label')) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  };

  return (
    <div
      ref={sitemapRef}
      id="sitemap"
      onClick={handleSitemapClick}
      className={`pt-4 md:pt-10 px-4 md:px-10 flex flex-col items-start mobile-safe-area ${
        asSection 
          ? "relative h-full md:h-[40vh] bg-white w-full" 
          : `fixed mobile-viewport-height md:max-h-[60vh] z-[100] md:pb-[12vh] bottom-0 w-full bg-white border-t-2 border-black transform transition-transform duration-300 ease-in-out ${
              isContactOpen ? "translate-y-0" : "translate-y-full"
            }`
      } gap-y-10`}
    >
      {/* Close button for mobile */}
      {!asSection && <CloseButton onClose={closeContact} />}
      
      {/* Mobile logo */}
      <LogoSection asSection={asSection} onContactClick={handleContactClick} />
      
      {/* Main content */}
      {sitemap.map((section, index) => (
        <div
          key={index}
          className="sitemap-section w-full flex flex-col md:flex-row gap-10 md:gap-8 md:justify-around h-full"
        >
          <SitemapContent socialMedia={section.content.social_media} />
          <NewsletterSection onFormClick={handleFormClick} />
        </div>
      ))}
      
      {/* Footer component */}
      {!asSection && <Footer />}
    </div>
  );
};

export default Sitemap;
