import { useEffect, RefObject } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export const useGSAPAnimations = (
  scrollContainerRef: RefObject<HTMLDivElement | null>, 
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>, 
  scrollSmootherInstanceRef: React.RefObject<ScrollSmoother | null>, 
  setSelectedTab: (tab: string) => void, 
  isReady: boolean 
) => {
  useEffect(() => {
    if (!isReady || !scrollContainerRef.current) return;

    
    const scrollSmootherInstance = new ScrollSmoother({
      content: scrollContainerRef.current,
      smooth: 1,
      smoothTouch: 1,
      ignoreMobileResize: true,
    });
    if (scrollSmootherInstanceRef.current) {
      scrollSmootherInstanceRef.current = scrollSmootherInstance;
    }

    
    const mm = gsap.matchMedia();

    mm.add("(min-width: 700px)", () => {
      function goToSection(index: number) {
        scrollSmootherInstance.scrollTo(sectionRefs.current?.[index], true);
      }

      sectionRefs.current?.forEach((section, i) => {
        if (section) {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom-=50px top",
            scrub: true,
            onEnter: () => goToSection(i),
            onEnterBack: () => goToSection(i),
          });
        }
      });

      return () => {
        scrollSmootherInstance.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    });

    
    sectionRefs.current?.forEach((section, i) => {
      if (section) {
        ScrollTrigger.create({
          id: `section-${i}`,
          trigger: section,
          start: "top 1px",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive && self.trigger) {
              setSelectedTab(self.trigger.id);
            }
          },
        });
      }
    });

    
    const movableArray = gsap.utils.toArray(".movable");
    gsap
      .timeline({
        scrollTrigger: {
          id: "movable-animation",
          trigger: "#no_entulho",
          start: "top bottom",
          end: "bottom top",
        },
      })
      .from(movableArray, { x: -2000, duration: 5, stagger: 1 });

    
    const circulos1 = document.querySelector("#circulos1") as HTMLElement;
    const dis1 = document.querySelector("#dis1") as HTMLElement;
    const dots1 = document.querySelector("#dots1") as HTMLElement;
    const circulos2 = document.querySelector("#circulos2") as HTMLElement;
    const dis2 = document.querySelector("#dis2") as HTMLElement;
    const cargos1 = document.querySelector("#cargos1") as HTMLElement;
    const dots3 = document.querySelector("#dots2") as HTMLElement;
    const cargos3 = document.querySelector("#cargos2") as HTMLElement;
    const svgimage = document.querySelector("#teams") as HTMLElement | null;

    if (svgimage) {
      const paths: SVGPathElement[] = Array.from(
        circulos1.querySelectorAll("path")
      );
      const circles: SVGPathElement[] = Array.from(
        circulos1.querySelectorAll("circle")
      );
      const paths2: SVGPathElement[] = Array.from(
        circulos2.querySelectorAll("path")
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: svgimage,
          start: "top top",
          end: "+=" + innerHeight * 5,
          scrub: 0.1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      if (paths.length > 0 || circles.length > 0) {
        paths.forEach((path) => {
          const pathLength = path.getTotalLength();
          path.style.strokeDasharray = `${pathLength} ${pathLength}`;
          path.style.strokeDashoffset = `${pathLength}`;

          tl.to(path, {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: svgimage,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onUpdate: (self) => {
                const drawLength = pathLength * self.progress;
                path.style.strokeDashoffset = `${pathLength - drawLength}`;
              },
            },
          });
        });

        circles.forEach((circle) => {
          const circleLength = circle.getTotalLength();
          circle.style.strokeDasharray = `${circleLength} ${circleLength}`;
          circle.style.strokeDashoffset = `${circleLength}`;

          tl.to(circle, {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: svgimage,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onUpdate: (self) => {
                const drawLength = circleLength * self.progress;
                circle.style.strokeDashoffset = `${circleLength - drawLength}`;
              },
            },
          });
        });
      }

      gsap.set(paths2, { autoAlpha: 0 });

      tl.fromTo(dis1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
        .fromTo(dots1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 })
        .fromTo(cargos1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 })
        .add(() => {
          paths2.forEach((path) => {
            const pathLength = path.getTotalLength();
            path.style.strokeDasharray = `${pathLength} ${pathLength}`;
            path.style.strokeDashoffset = `${pathLength}`;

            tl.to(
              path,
              {
                id: "path2",
                strokeDashoffset: 0,
                duration: 3,
                ease: "power1.inOut",
                autoAlpha: 1,
                scrollTrigger: {
                  trigger: path,
                  start: "bottom center",
                  end: "bottom top",
                  scrub: true,
                },
              },
              "+=0"
            );
          });
        })
        .fromTo(dis2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "+=0")
        .fromTo(dots3, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, "+=0")
        .fromTo(
          cargos3,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.2 },
          "+=0"
        );
    }

    return () => {
      scrollSmootherInstance.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [scrollContainerRef, sectionRefs, scrollSmootherInstanceRef, setSelectedTab, isReady]);
};