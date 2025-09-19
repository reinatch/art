import gsap from "gsap";
import {
  ScrollTrigger,
  ScrollToPlugin,
  ScrollSmoother,
  Flip,
  Observer,
} from "gsap/all";
import { useGSAP } from "@gsap/react";
import { HomePageData } from "@/utils/types";

// Register GSAP plugins
gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  Observer,
  useGSAP,
  Flip
);

export const useHomeAnimations = (
  sections: HomePageData[],
  containerRef: React.RefObject<HTMLDivElement | null>,
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  windowSize: { width: number; height: number }
) => {
  useGSAP(() => {
    if (!sections || sections.length === 0) return;

    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    const sectionElements = sectionRefs.current;
    const movableArray: HTMLDivElement[] = gsap.utils.toArray(".movable");
    const scrolll = gsap.utils.toArray(".scroll-indicator");

    ScrollTrigger.config({ 
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    if (ScrollTrigger.isTouch === 1) {
      ScrollTrigger.normalizeScroll(true);
    }

    const mm = gsap.matchMedia();
    const smoother: ScrollSmoother = ScrollSmoother.create({
      content: containerRef.current,
      smooth: 1,
      smoothTouch: 1,
      ignoreMobileResize: true,
    });

    // Mobile animations
    mm.add("(max-width: 899px)", () => {
      gsap.set(scrolll, {
        autoAlpha: 0,
        opacity: 0,
        display: "none",
        force3D: true, 
      });

      gsap.timeline({
        scrollTrigger: {
          id: "residency-pin-mobile",
          trigger: "#residency0",
          start: "top top",
          end: () => `+=${(document.querySelector("#mapa") as HTMLElement)?.offsetHeight || 500}`,
          pin: "#residency0",
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    // Desktop animations
    mm.add("(min-width: 900px)", () => {
      gsap.set(scrolll, {
        autoAlpha: 0,
        opacity: 0,
        display: "none",
        force3D: true, 
      });

      const scrollToSection = (index: number) => {
        const target = sectionElements[index];
        if (target && smoother) {
          smoother.scrollTo(target, true);
        }
      };

      sectionElements.forEach((panel, index) => {
        if (!panel) return;
        ScrollTrigger.create({
          id: `section-nav-${index}`,
          trigger: panel,
          start: "top top",
          end: "bottom-=50px 10%",
          scrub: true,
          onEnter: () => scrollToSection(index),
          onEnterBack: () => scrollToSection(index),
        });
      });

      return () => {
        if (smoother) smoother.kill();
      };
    });

    // Home video scale animation
    gsap
      .timeline({
        scrollTrigger: {
          id: "home-video-scale",
          trigger: "#home_splash",
          start: "bottom bottom",
          end: "bottom center",
          scrub: 1,
        },
      })
      .to(".home_video", { 
        scale: 0.9, 
        y: -40,
        duration: 1, 
        ease: "none",
        force3D: true 
      });

    // Scroll indicator fade
    gsap
      .timeline({
        scrollTrigger: {
          id: "scroll-indicator-fade",
          trigger: "#home_splash",
          start: "bottom bottom-=10px",
          end: "bottom 90%",
        },
      })
      .to(scrolll, { 
        autoAlpha: 0, 
        opacity: 0, 
        ease: "none",
        force3D: true
      });

    // Sphere animation with FLIP
    const sphere = document.querySelector(".production0_video");
    const target = document.querySelector(".production0_video_wrapper_target");
    if (sphere && target) {
      const proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(sphere, "skewY", "deg");
      const clamp = gsap.utils.clamp(-20, 20);
      const state = Flip.getState(sphere);
      target.appendChild(sphere);
      const animation = Flip.from(state, {
        simple: true,
        ease: "power2.out"
      });

      ScrollTrigger.create({
        id: "sphere-animation",
        trigger: "#production0",
        start: "center center",
        endTrigger: "#production0",
        end: "bottom top",
        scrub: 1,
        animation,
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (Math.abs(velocity) > 50) { 
            const skew = clamp(velocity / -200);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.4,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          }
        },
      });
    }

    // Viewport unit conversion utility
    const toPXCache = new Map<string, number>();
    const toPX = (value: string): number => {
      if (toPXCache.has(value)) {
        return toPXCache.get(value)!;
      }
      const result = (parseFloat(value) / 100) *
        (/vh/gi.test(value) ? windowSize.height : windowSize.width);
      toPXCache.set(value, result);
      return result;
    };

    // Project parallax animation
    gsap
      .timeline({
        scrollTrigger: {
          id: "project-parallax",
          trigger: "#project0",
          start: "top+=100px top",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .to("#pro-title", { 
        y: toPX("-50vh"), 
        duration: 1, 
        ease: "none",
        force3D: true
      }, "start")
      .from("#pro-row2", { 
        y: toPX("50vh"), 
        duration: 1, 
        ease: "none",
        force3D: true
      }, "start+=0.1")
      .from("#pro-link", { 
        y: toPX("60vh"), 
        duration: 1, 
        ease: "none",
        force3D: true
      }, "start+=0.2");

    // Movable elements animation
    const negativeXArray: HTMLDivElement[] = [];
    const positiveXArray: HTMLDivElement[] = [];
    movableArray.forEach((item, i) => {
      if (i % 2 === 0) {
        negativeXArray.push(item);
      } else {
        positiveXArray.push(item);
      }
    });

    if (negativeXArray.length > 0 || positiveXArray.length > 0) {
      gsap
        .timeline({
          scrollTrigger: {
            id: "movable-elements",
            trigger: "#residency0",
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none none reverse", 
          },
        })
        .from(negativeXArray, { 
          x: -2000, 
          duration: 2, 
          stagger: 0.1, 
          ease: "power2.out",
          force3D: true
        })
        .from(positiveXArray, { 
          x: 2000, 
          duration: 2, 
          stagger: 0.1,
          ease: "power2.out",
          force3D: true
        }, "<0.2");
    }

    // Mapa fade-in animation
    const mapaElement = document.querySelector("#mapa");
    if (mapaElement) {
      gsap.timeline({
        scrollTrigger: {
          id: "mapa-fade-in",
          trigger: "#home_splash",
          start: "bottom bottom",
          end: "bottom center",
          onEnter: () => {
            gsap.to(mapaElement, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out"
            });
          }
        }
      });
    }

    // Cleanup function
    return () => {
      try {
        toPXCache.clear();
        const sphereWrapper = document.querySelector(".production0_video_wrapper_main");
        if (sphereWrapper && sphere) {
          sphereWrapper.appendChild(sphere);
        }
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger) trigger.kill();
        });
        if (smoother) {
          smoother.kill();
        }
        mm.kill();
      } catch (error) {
        console.warn("Error during GSAP cleanup:", error);
      }
    };
  }, [sections]);
};