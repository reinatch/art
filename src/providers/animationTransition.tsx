"use client";

import React, { useState, useEffect, useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import { usePathname } from "next/navigation";
import { animatePageIn, animatePageOut } from "@/utils/animations";
import { isMobile as detectMobile } from "react-device-detect";
import { useLocale } from "next-intl";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import gsap from "gsap";

export function TemplateTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const firstLayer = useRef<HTMLDivElement | null>(null);
  const secondLayer = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const locale = useLocale();
  const windowSize = useWindowSize();

  // Initialize layer positions only once on component mount
  useEffect(() => {
    if (firstLayer.current && secondLayer.current) {
      gsap.set([firstLayer.current, secondLayer.current], { x: "-100%" });
    }
  }, []);

  useEffect(() => {
    setIsMobile(detectMobile);
  }, [windowSize]);

  useEffect(() => {
    animatePageIn(pathname);
  }, [isMobile, locale, pathname]);

  return (
    <TransitionRouter
      auto={true}
      leave={(next, from, to) => {
        if (from === to) return;

        const tl = gsap.timeline({
          onComplete: () => {
            animatePageOut(pathname)?.then(next);
          },
        });

        // Ensure layers cover the screen during the transition
        tl.set([firstLayer.current, secondLayer.current], { x: "-100%" })
          .to(firstLayer.current, {
            x: 0,
            duration: 0.5,
            ease: "circ.inOut",
          })
          .to(
            secondLayer.current,
            {
              x: 0,
              duration: 0.5,
              ease: "circ.inOut",
            },
            "<50%"
          );

        return () => {
          tl.kill();
        };
      }}
      enter={(next) => {
        const tl = gsap.timeline({
          onComplete: () => {
            animatePageIn(pathname)?.then(next);
          },
        });

        // Ensure layers slide out smoothly
        tl.to(secondLayer.current, {
          x: "-100%",
          duration: 0.5,
          ease: "circ.inOut",
        })
          .to(
            firstLayer.current,
            {
              x: "-100%",
              duration: 0.5,
              ease: "circ.inOut",
            },
            "<50%"
          )
          .call(next, undefined, "<50%");

        return () => {
          tl.kill();
        };
      }}
    >
      {children}
      <div
        ref={firstLayer}
        className="fixed inset-0 z-[5000] w-screen h-screen bg-white"
      ></div>
      <div
        ref={secondLayer}
        className="fixed inset-0 z-[5000] w-screen h-screen bg-white"
      ></div>
    </TransitionRouter>
  );
}