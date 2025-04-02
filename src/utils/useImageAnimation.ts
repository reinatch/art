import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ImageAnimationProps {
  trigger: string | HTMLElement;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  end?: string;
  scrub?: boolean;
  scroller?: string | HTMLElement,
}
const useImageAnimation = ({
  trigger,
  scroller,
  x = 0,
  y = 0,
  scale = 1,
  opacity = 1,
  duration = 1,
  stagger = 0.1,
  ease = 'power2.out',
  start = 'top bottom',
  end = 'start bottom',
  scrub = false,
}: ImageAnimationProps) => {
  const imageRefs = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    if (!imageRefs.current.length) return;
    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter(imageRefs.current, "skewY", "deg"); 
    const clamp = gsap.utils.clamp(-20, 20); 
    gsap.fromTo(
      imageRefs.current,
      { x, y, scale, opacity: 1 },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          scroller,
          id: 'homeeeeeee',
          trigger,
          start,
          end,
          scrub,
          
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -300);
            
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {skew: 0, duration: 0.4, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
            }
          }
        },
      }
    );
    gsap.set(imageRefs.current, {transformOrigin: "right center", force3D: true});
  }, [trigger, x, y, scale, opacity, duration, stagger, ease, start, end, scrub, scroller]);
  return imageRefs;
};
export default useImageAnimation;
