import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useLenisScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Adjust for smoother/slower scroll
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    // Lenis scroll handling
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP's ScrollTrigger with Lenis's scroll position
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      ScrollTrigger.removeEventListener('scrollEnd', ScrollTrigger.update);
    };
  }, []);
};

export default useLenisScroll;
