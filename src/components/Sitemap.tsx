"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useToggleContact } from '@/lib/useToggleContact';
import SubscribeForm from "@/components/SubscribeForm";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';
import TransitionLink from "./TransitionLink";
import { gsap } from "gsap";

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
        linkedin: "https://www.linkedin.com/company/aw-artworks/posts/?feedView=all",
      },
      privacy: `© ArtWorks 2024 all rights reserved. Website design by Ana Luísa Martelo, code by Rei Rodrigues`,
    },
  },
];

const Sitemap = () => {
  const sitemapRef = useRef<HTMLDivElement>(null);
  const { isContactOpen } = useToggleContact();
  const t = useTranslations("Sitemap");

  useEffect(() => {
    if (sitemapRef.current) {
      gsap.to(sitemapRef.current, {
        y: isContactOpen ? "0%" : "100%",
        opacity: 1,
        duration: 0.5,
        ease: "easeInOut"
      });
    }
  }, [isContactOpen]);

  return (
    <div
      ref={sitemapRef}
      id="sitemap"
      className=" pt-4 md:pt-10 px-4 md:px-10 flex flex-col items-start fixed h-[100dvh] md:max-h-[60vh] z-[100] md:pb-[12vh] bottom-0 w-full  bg-white border-t-2 border-black gap-y-10 "
    >
             <TransitionLink className={` mt-4 flex md:hidden w-full h-auto justify-center`} href={`/`} passHref>
                  <div
                    className="relative flex md:items-end items-end justify-center md:justify-start w-[80vw] md:w-[20vw] h-[6dvh]"
            
                  >
                          <Image
                            src={"/lo.svg" }
                            alt="Logo Closed"
                            width={300}
                            height={50}
                            className={`relative w-auto h-full left-0 transition-opacity duration-100 ease-in-out `}
                          />
                  
                </div>

          </TransitionLink>
      {sitemap.map((section, index) => (
        <div key={index} className="sitemap-section w-full flex flex-col md:flex-row gap-10 md:gap-8 md:justify-around h-full">
          <div className="flex flex-col md:flex-row w-full md:w-1/2 gap-2">
            <div className="text-rodape w-full md:w-1/2 flex flex-col gap-2 md:gap-10 font-mono leading-tight md:leading-relaxed">
              <div>
                <p>440 Rua Manuel Dias,</p>
                <p>4495-129 Póvoa de Varzim,</p>
                <p>Portugal</p>
              </div>
              <div>
                <Link href="mailto:info@artworks.pt" target="_blank" rel="noopener noreferrer">info@artworks.pt</Link>
                <p>+351 252 023 590</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2 md:gap-10">
              <div className="social-media flex flex-col w-full md:w-1/2 font-mono text-rodape leading-relaxed">
                <Link target="_blank" rel="noopener noreferrer" href={section.content.social_media.instagram}>Instagram</Link>
                <Link target="_blank" rel="noopener noreferrer" href={section.content.social_media.vimeo}>Vimeo</Link>
                <Link target="_blank" rel="noopener noreferrer" href={section.content.social_media.linkedin}>LinkedIn</Link>
              </div>

              <a target="_blank" href={"https://noentulho.com/pt"} rel="noopener noreferrer">
              
              <div className="flex flex-row-reverse items-start md:flex-col justify-between gap-0 text-rodape">
                <Image src="/images/entulho.png" alt="Logo" width={100} height={100} className="pb-4 w-10 h-auto md:w-auto"/>
                <div className="flex flex-col text-start ">

                <p>NO ENTULHO</p>
                <p>{t("residencias")}</p>
                </div>
              </div>
              </a>
            </div>
          </div>
          <footer className="text-rodape w-full justify-between md:w-1/2 flex flex-col gap-4 md:gap-10">
            <SubscribeForm />
            <div>
              {/* <p className="font-mono "> © ArtWorks 2024 all rights reserved.</p>
              <p className="font-mono "> Website design by Ana Luísa Martelo, code by Rei Rodrigues</p> */}
              <p className="font-mono text-[0.5rem] md:text-rodape"> {t("right")}</p>
              <p className="font-mono text-[0.5rem] md:text-rodape"> {t("credits")} <a className="underline" href='https://reinatch.website/' target='_blank'>reinatch</a></p>
            </div>
          </footer>
        </div>
      ))}
      <Footer />
    </div>
  );
};

export default Sitemap;
