"use client";
import Image from "next/image";
import { Link as TransitionLink } from "next-transition-router";

interface LogoSectionProps {
  asSection: boolean;
  onContactClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({ asSection, onContactClick }) => {
  if (asSection) return null;

  return (
    <TransitionLink
      className="mt-4 flex md:hidden w-full h-auto justify-center"
      href="/"
      onClick={onContactClick}
      passHref
    >
      <div className="relative flex md:items-end items-end justify-center md:justify-start w-[80vw] md:w-[20vw] h-[6vh]">
        <Image
          src="/lo.svg"
          alt="Logo Closed"
          width={300}
          height={50}
          loading="lazy"
          className="relative w-auto h-full left-0 transition-opacity duration-100 ease-in-out"
        />
      </div>
    </TransitionLink>
  );
};

export default LogoSection;
