import { useState, useEffect } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

// Hook
function useWindowSize(): WindowSize {
  // Initialize state with undefined width/height to prevent hydration issues
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Only execute on the client side
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler immediately to update state with initial window size
    handleResize();

    // Cleanup on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount

  return windowSize;
}

export default useWindowSize;
