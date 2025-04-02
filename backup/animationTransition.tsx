"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { TransitionRouter } from "next-transition-router";

export function TemplateTransition({ children }: { children: React.ReactNode }) {
  const firstLayer = useRef<HTMLDivElement | null>(null);
  const secondLayer = useRef<HTMLDivElement | null>(null);

  // Initialize layer positions only once on component mount
  useEffect(() => {
    if (firstLayer.current && secondLayer.current) {
      gsap.set([firstLayer.current, secondLayer.current], { y: "100%" });
    }
  }, []);

  // Separate initial page animation from transition
  // useEffect(() => {
  //   if (mainRef.current) {
  //     gsap.fromTo(
  //       mainRef.current,
  //       { opacity: 0, y: 20 },
  //       { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
  //     );
  //   }
  // }, []);

  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        // Remove console logs in production for better performance
        // console.log("Leave Transition:", { from, to });
        
        const tl = gsap.timeline({
          onComplete: next,
        });

        // Simplified animation without redundant checks and settings
        tl.to(firstLayer.current, {
          y: 0,
          duration: 0.5,
          ease: "circ.inOut",
        }).to(secondLayer.current, {
          y: 0,
          duration: 0.5,
          ease: "circ.inOut",
        }, "<50%");

        return () => {
          tl.kill();
        };
      }}
      enter={(next) => {
        const tl = gsap.timeline();

        tl.to(secondLayer.current, {
          y: "100%",
          duration: 0.5,
          ease: "circ.inOut",
        }).to(firstLayer.current, {
          y: "100%",
          duration: 0.5,
          ease: "circ.inOut",
        }, "<50%").call(next, undefined, "<50%");

        return () => {
          tl.kill();
        };
      }}
    >

        {children}
  

      <div
        ref={firstLayer}
        className="fixed inset-0 z-50 w-screen h-screen"
        style={{ backgroundColor: "#991b1b" }}
      ></div>
      <div
        ref={secondLayer}
        className="fixed inset-0 z-50 w-screen h-screen"
        style={{ backgroundColor: "#3b82f6" }}
      ></div>
    </TransitionRouter>
  );
}