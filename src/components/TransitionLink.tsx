"use client"
import { usePathname, useRouter } from "next/navigation"
import { animatePageOut } from "@/utils/animations"
import Link, { LinkProps } from "next/link";
import { useToggleSearch } from "@/lib/useToggleSearch";
import { useToggleContact } from "@/lib/useToggleContact";
import { isMobile as detectMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { useWindowSize } from '@custom-react-hooks/use-window-size';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
}
// const TransitionLink = ({ href, label }: Props) => {
export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  style,
  ...props
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const {isSearchOpen, closeSearch} = useToggleSearch();
  const {isContactOpen, closeContact} = useToggleContact();
  const windowSize = useWindowSize();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(detectMobile);
  }, [windowSize]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault(); // Prevent the default link navigation
    // console.log("Navigating from", pathname, "to", href);
    if (isSearchOpen) {
      closeSearch();
    }
    if (isContactOpen) {
      closeContact();
    }
    if (pathname !== href) {
      animatePageOut(href, router, pathname, isMobile); // Trigger the page out animation
    } else {
      router.push(href); // Fallback to normal navigation if paths are the same
    }
  };

  return (

    <Link {...props} className={className}  style={style} href={href} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default TransitionLink




// "use client";
// import Link, { LinkProps } from "next/link";
// import React from "react";
// import { useRouter } from "next/navigation";

// interface TransitionLinkProps extends LinkProps {
//   children: React.ReactNode;
//   href: string;
// }

// function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export const TransitionLink: React.FC<TransitionLinkProps> = ({
//   children,
//   href,
//   ...props
// }) => {
//   const router = useRouter();

//   const handleTransition = async (
//     e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
//   ) => {
//     e.preventDefault();
//     const body = document.querySelector("body");

//     body?.classList.add("page-transition");

//     await sleep(500);
//     router.push(href);
//     await sleep(500);

//     body?.classList.remove("page-transition");
//   };

//   return (
//     <Link {...props} href={href} onClick={handleTransition}>
//       {children}
//     </Link>
//   );
// };