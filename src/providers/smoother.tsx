"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useRef } from "react";

interface SmootherProps {
  children: React.ReactNode;
}

export function Smoother({ children }: SmootherProps) {
  const smoother = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      smoother.current = ScrollSmoother.create({
        smooth: 2,
        effects: true,
        smoothTouch: 0.1,
      });
    },
    {
      dependencies: [pathname],
      revertOnUpdate: true,
    }
  );

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content" className="snap-y snap-mandatory">{children}</div>
    </div>
  );
}
