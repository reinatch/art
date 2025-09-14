"use client";
import Link from "next/link";
import { useCallback, useRef } from "react";
import Image from "next/image";
import { useToggleContact } from "@/lib/useToggleContact";
import SubscribeForm from "@/components/SubscribeForm";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Link as TransitionLink } from "next-transition-router";

// import { gsap } from "gsap";
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
  asSection?: boolean; // When true, renders as static section instead of fixed overlay
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
  const t = useTranslations("Sitemap");

  // Prevent event bubbling for form interactions
  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Prevent navigation when clicking on the sitemap container (mobile overlay only)
  const handleSitemapClick = (e: React.MouseEvent) => {
    if (!asSection) {
      // Only prevent if it's the overlay version and the target is a form element or within form
      const target = e.target as HTMLElement;
      if (target.closest('form') || target.closest('input') || target.closest('button') || target.closest('label')) {
        e.stopPropagation();
        e.preventDefault();
      }
      // Don't prevent other clicks - let the HomePage click outside handler work
    }
  };

  // useEffect(() => {
  //   if (sitemapRef.current) {
  //     gsap.to(sitemapRef.current, {
  //       y: isContactOpen ? "0%" : "100%",
  //       opacity: 1,
  //       duration: 0.5,
  //       ease: "easeInOut"
  //     });
  //   }
  // }, [isContactOpen]);
  return (
    <div
      ref={sitemapRef}
      id="sitemap"
      onClick={handleSitemapClick}
      className={`pt-4 md:pt-10 px-4 md:px-10 flex flex-col items-start ${
        asSection 
          ? "relative h-full min-h-screen bg-white w-full" 
          : `fixed h-[100dvh] md:max-h-[60vh] z-[100] md:pb-[12vh] bottom-0 w-full bg-white border-t-2 border-black transform transition-transform duration-300 ease-in-out ${
              isContactOpen ? "translate-y-0" : "translate-y-full"
            }`
      } gap-y-10`}
    >
      {/* Close button for mobile */}
      {!asSection && (
        <button
          className="absolute top-4 right-4 z-50 md:hidden text-3xl font-bold text-black  w-8 h-8 flex items-center justify-center "
          aria-label="Close sitemap"
          onClick={closeContact}
          type="button"
        >
                <svg
                className={`w-auto h-full rotate-[135deg] transition-transform duration-500`} // Fixed: use rotate-[135deg] instead of transform-rotate-[135deg]
                fill="black"
                stroke="black"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeWidth="1" d="M0 15h30M15 0v30" />
              </svg>
        </button>

      )}
      <TransitionLink
        className={`${asSection ? "hidden" : ""}  mt-4 flex md:hidden w-full h-auto justify-center`}
        href={`/`}
        onClick={handleContactClick}
        passHref
      >
        <div className="relative flex md:items-end items-end justify-center md:justify-start w-[80vw] md:w-[20vw] h-[6dvh]">
          <Image
            src={"/lo.svg"}
            alt="Logo Closed"
            width={300}
            height={50}
            loading="lazy"
            className={`relative w-auto h-full left-0 transition-opacity duration-100 ease-in-out `}
          />
        </div>
      </TransitionLink>

      
      {sitemap.map((section, index) => (
        <div
          key={index}
          className="sitemap-section w-full flex flex-col md:flex-row gap-10 md:gap-8 md:justify-around h-full"
        >
          <div className="flex flex-col md:flex-row w-full md:w-1/2 gap-2">
            <div className="text-rodape w-full md:w-1/2 flex flex-col gap-2 md:gap-10 font-mono leading-tight md:leading-relaxed">
              <div>
                <p>440 Rua Manuel Dias,</p>
                <p>4495-129 Póvoa de Varzim,</p>
                <p>Portugal</p>
              </div>
              <div>
                <Link
                  href="mailto:info@artworks.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info@artworks.pt
                </Link>
                <p>+351 252 023 590</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2 md:gap-10">
              <div className="social-media flex flex-col w-full md:w-1/2 font-mono text-rodape leading-relaxed">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={section.content.social_media.instagram}
                >
                  Instagram
                </Link>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={section.content.social_media.vimeo}
                >
                  Vimeo
                </Link>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={section.content.social_media.linkedin}
                >
                  LinkedIn
                </Link>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={section.content.social_media.youtube}
                >
                  Youtube
                </Link>
              </div>
              <a
                target="_blank"
                href={"https://noentulho.com/pt"}
                rel="noopener noreferrer"
              >
                <div className="flex flex-row-reverse items-start md:flex-col justify-between gap-0 text-rodape">
                  <Image
                    src="/images/entulho.png"
                    loading="lazy"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="pb-4 w-10 h-auto md:w-auto"
                  />
                  <div className="flex flex-col text-start ">
                    <p>NO ENTULHO</p>
                    <p>{t("residencias")}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <footer 
            className="text-rodape w-full justify-between md:w-1/2 flex flex-col gap-4 md:gap-10"
            onClick={handleFormClick}
          >
            <SubscribeForm />
            <div>
              {/* <p className="font-mono "> © ArtWorks 2024 all rights reserved.</p>
              <p className="font-mono "> Website design by Ana Luísa Martelo, code by Rei Rodrigues</p> */}
              <p className="font-mono text-[0.5rem] md:text-rodape">
                {" "}
                {t("right")}
              </p>
              <p className="font-mono text-[0.5rem] md:text-rodape">
                {" "}
                {t("credits")}{" "}
                <a
                  className="underline"
                  href="https://reinatch.website/"
                  target="_blank"
                >
                  reinatch
                </a>
              </p>
            </div>
          </footer>
        </div>
      ))}

      {!asSection && (
        <>
          <Footer />
        </>
      )}
    </div>
  );
};
export default Sitemap;
