"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { TransitionRouter } from "next-transition-router";

export function SimpleTransition({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);

  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        const tl = gsap.timeline({
          onComplete: next,
        });
        
        tl.to(overlay.current, {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.inOut"
        });
        
        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = gsap.timeline();
        
        tl.to(overlay.current, {
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.inOut"
        }).call(next);
        
        return () => tl.kill();
      }}
    >
      {children}
      <div 
        ref={overlay} 
        className="fixed inset-0 z-50 bg-black pointer-events-none opacity-0"
      />
    </TransitionRouter>
  );
}
