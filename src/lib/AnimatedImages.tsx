import React, { ReactNode } from 'react';
import useImageAnimation from '@/utils/useImageAnimation';

interface AnimatedImageProps {
  children: ReactNode; // Accepts any children elements
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

const AnimatedImages: React.FC<AnimatedImageProps> = ({
  children,
  trigger,
  x,
  y,
  scale,
  opacity,
  duration,
  stagger,
  ease,
  start,
  end,
  scrub,
  scroller
}) => {
  const imageRefs = useImageAnimation({
    trigger,
    x,
    y,
    scale,
    opacity,
    duration,
    stagger,
    ease,
    start,
    end,
    scrub,
     scroller
  });

  return (
    <>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? 
          React.cloneElement(child as React.ReactElement<unknown>, {
            ...(React.isValidElement(child) && { ref: (el: HTMLDivElement | null) => (imageRefs.current[index] = el as HTMLDivElement) }),
          }) 
          : child
      )}
    </>
  );
};

export default AnimatedImages;
