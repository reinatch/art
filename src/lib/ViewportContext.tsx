"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ViewportContextType {
  viewportHeight: number;
  viewportWidth: number;
  isMobile: boolean;
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewport = () => {
      // Use the most reliable method for getting viewport dimensions on mobile
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      setViewportHeight(vh);
      setViewportWidth(vw);
      setIsMobile(vw <= 768);
      
      // Update CSS custom properties for global use
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
      document.documentElement.style.setProperty('--vw', `${vw * 0.01}px`);
      
      // Add mobile class to body for CSS targeting
      if (vw <= 768) {
        document.body.classList.add('mobile-viewport');
      } else {
        document.body.classList.remove('mobile-viewport');
      }
    };

    // Initial update
    updateViewport();

    // Listen for all viewport changes
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', () => {
      // Delay to ensure orientation change is complete
      setTimeout(updateViewport, 100);
    });

    // Listen for virtual keyboard on mobile
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', updateViewport);
    }

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', updateViewport);
      }
    };
  }, []);

  return (
    <ViewportContext.Provider value={{ viewportHeight, viewportWidth, isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport() {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
}
