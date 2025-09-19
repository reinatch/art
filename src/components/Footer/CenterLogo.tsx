"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

type CenterLogoProps = Record<string, never>;

export default function CenterLogo({}: CenterLogoProps) {
  const [toMailHovered, setToMailHovered] = useState(false);
  const f = useTranslations("Footer");

  return (
    <div
      id="wrapper_footer_luva"
      className="absolute left-1/2 -translate-x-1/2 translate-y-1/4 m-auto w-auto text-2xl bottom-0 h-full z-40"
      // Remove inline styles - let GSAP handle everything
    >
      <Link
        href="mailto:info@artworks.pt"
        passHref
        className="flex items-center footerLuva h-[6vh]"
        onMouseEnter={() => setToMailHovered(true)}
        onMouseLeave={() => setToMailHovered(false)}
      >
        <span
          className={`toMail relative top-2 text-rodape pr-4 ${
            toMailHovered ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          {f("lets")}
        </span>
        <div
          id="footer_luva"
          className="relative w-auto h-[10vh] opacity-0 footer_luva top-2 will-change-transform "
          data-flip-id=""
        >
          <Image
            src="/videos/luva/output.gif"
            alt="Logo Text"
            width={100}
            height={100}
            className="relative hidden md:flex  w-auto h-full transition-opacity duration-300 ease-in-out will-change-transform kerning"
            priority
            data-flip-id="img"
          />
        </div>
        <span
          className={`toMail relative top-2 text-rodape pl-4 ${
            toMailHovered ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          {f("talk")}
        </span>
      </Link>
    </div>
  );
}
