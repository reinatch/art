"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorShapeRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<(value: number) => void>(() => {});
  const yTo = useRef<(value: number) => void>(() => {});
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    gsap.registerPlugin(ScrollTrigger, useGSAP);
  }, []);
  useGSAP(() => {
    if (!isClient) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    xTo.current = gsap.quickTo(cursor, "x", {
      duration: 0.016,
      ease: "power3",
    });
    yTo.current = gsap.quickTo(cursor, "y", {
      duration: 0.016,
      ease: "power3",
    });
    ScrollTrigger.observe({
      target: window,
      type: "pointer",
      onMove: (self) => {
        if (self.x !== undefined && self.y !== undefined) {
          xTo.current(self.x);
          yTo.current(self.y);
        }
      },
    });
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isClient]);
  if (!isClient) return null;
  return (
    <div
      ref={cursorRef}
      className="cursor hidden md:block w-5 h-5 bg-white rounded-full fixed top-0 left-0 pointer-events-none z-[1000] mix-blend-difference"
    >
      <div
        className="shape opacity-0 h-full w-full absolute"
        ref={cursorShapeRef}
      ></div>
    </div>
  );
}
