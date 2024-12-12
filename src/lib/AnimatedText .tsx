import React, { ReactNode } from 'react';
import useSplitTextAnimation from '@/utils/useSplitTextAnimation';

interface AnimatedTextProps {
  children: ReactNode;
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

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  trigger,
  splitType = 'chars',
  x,
  y,
  duration,
  stagger,
  ease,
  scale,
  start,
  end,
  scrub,
  scroller,
  markers
}) => {
  const textRef = useSplitTextAnimation({
    trigger,
    splitType,
    x,
    y,
    duration,
    stagger,
    scale,
    ease,
    start,
    end,
    scrub,
    scroller,
    markers
  });

  return (
    <div ref={textRef} className="animated-text kerning">
      {children}
    </div>
  );
};

export default AnimatedText;
