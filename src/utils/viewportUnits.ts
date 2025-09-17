// Viewport units with fallbacks
export const getViewportHeight = (percentage: number = 100): string => {
  if (typeof window === 'undefined') {
    return `${percentage}vh`; // Server-side fallback
  }
  
  // Check if dvh is supported
  if (CSS.supports('height', '100dvh')) {
    return `${percentage}dvh`;
  }
  
  // Fallback to calculated vh
  const vh = window.innerHeight * (percentage / 100);
  return `${vh}px`;
};

export const getViewportWidth = (percentage: number = 100): string => {
  if (typeof window === 'undefined') {
    return `${percentage}vw`; // Server-side fallback
  }
  
  // Check if dvw is supported
  if (CSS.supports('width', '100dvw')) {
    return `${percentage}dvw`;
  }
  
  // Fallback to calculated vw
  const vw = window.innerWidth * (percentage / 100);
  return `${vw}px`;
};

// Hook for dynamic viewport units
import { useEffect, useState } from 'react';

export const useViewportUnits = () => {
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [viewportWidth, setViewportWidth] = useState('100vw');

  useEffect(() => {
    const updateViewport = () => {
      setViewportHeight(getViewportHeight());
      setViewportWidth(getViewportWidth());
    };

    updateViewport();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewport, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewport, 500);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateViewport);
      clearTimeout(resizeTimer);
    };
  }, []);

  return { viewportHeight, viewportWidth };
};
