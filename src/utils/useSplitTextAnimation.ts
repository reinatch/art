import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
interface SplitTextAnimationProps {
  trigger: string | HTMLElement;
  splitType?: 'lines' | 'words' | 'chars';
  x?: number;
  y?: number;
  duration?: number;
  stagger?: number;
  scale?: number;
  ease?: string;
  start?: string;
  end?: string;
  scrub?: boolean;
  markers?: boolean;
  scroller?: string | HTMLElement,
}
const useSplitTextAnimation = ({
  trigger,
  scroller,
  splitType = 'chars',
  x = 0,
  y = 0,
  duration = 1,
  stagger = 0.1,
  scale= 1,
  ease = 'power2.out',
  start = 'top bottom',
  end = 'bottom top',
  scrub = false,
  markers = false,
}: SplitTextAnimationProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const splitText = new SplitType(containerRef.current, {
      types: splitType,
    });
    const animation = gsap.fromTo(
      splitText[splitType],
      { x, y, scale:1, opacity: 1,
      },
      {
        x: 0,
        y: 0,
        scale,
        opacity: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          scroller,
          id: "splitTextAnimation",
          trigger,
          start,
          end,
          scrub,
          markers: markers,
        },
      }
    );
    const handleResize = () => {
      splitText.split({ types: splitType });  
    };
    const debouncedResize = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(handleResize, 500);
    };
    let debounceTimeout: NodeJS.Timeout;
    window.addEventListener('resize', debouncedResize);
    return () => {
      splitText.revert();
      animation.kill();
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(debounceTimeout);
    };
  }, [trigger, splitType, x, y, duration, stagger, ease, start, end, scrub, scroller, markers, scale]);
  return containerRef;
};
export default useSplitTextAnimation;
