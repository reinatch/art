import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollToPlugin from "gsap/ScrollToPlugin";

export const useTabsAnimations = (
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  scrollSmootherInstanceRef: React.MutableRefObject<ScrollSmoother | null>,
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  setSelectedTab: (tab: string) => void
) => {
  // Register GSAP plugins
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    gsap.registerPlugin(ScrollSmoother);
  }, []);

  // Main scroll and animation setup
  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    // Create scroll smoother instance
    const scrollSmootherInstance = ScrollSmoother.create({
      content: scrollContainerRef.current,
      smooth: 1,
      smoothTouch: 1,
      ignoreMobileResize: true,
    });
    
    scrollSmootherInstanceRef.current = scrollSmootherInstance;

    // Desktop scroll navigation
    mm.add("(min-width: 700px)", () => {
      function goToSection(i: number) {
        scrollSmootherInstance.scrollTo(sectionRefs.current[i], true);
      }

      sectionRefs.current.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom-=50px top",
          scrub: true,
          onEnter: (self) => {
            if (self.trigger) {
              // Could add additional logic here if needed
            }
            goToSection(i);
          },
          onEnterBack: () => {
            goToSection(i);
          },
        });
      });

      return () => {
        scrollSmootherInstance.kill();
      };
    });

    // Section visibility tracking for tab switching
    sectionRefs.current.forEach((section, i) => {
      ScrollTrigger.create({
        id: `section-visibility-${i}`,
        trigger: section,
        start: "top 1px",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            if (self.trigger) {
              setSelectedTab(self.trigger.id);
            }
          }
        },
      });
    });

    // Movable elements animation for no_entulho section
    const movableArray = gsap.utils.toArray(".movable");
    gsap
      .timeline({
        scrollTrigger: {
          id: "movable-elements-animation",
          trigger: "#no_entulho",
          start: "top bottom",
          end: `bottom top`,
        },
      })
      .from(movableArray, { x: -2000, duration: 5, stagger: 1 });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger) trigger.kill();
      });
      if (scrollSmootherInstance) {
        scrollSmootherInstance.kill();
      }
      mm.kill();
    };
  }, [scrollContainerRef, setSelectedTab]);
};