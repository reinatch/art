// Cross-browser compatibility utilities
export class BrowserCompatibility {
  
  // Set CSS custom properties for viewport units
  static initViewportUnits() {
    const setViewportUnits = () => {
      const vh = window.innerHeight * 0.01;
      const vw = window.innerWidth * 0.01;
      
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--vw', `${vw}px`);
      
      // For dynamic viewport units
      if (CSS.supports('height', '100dvh')) {
        document.documentElement.style.setProperty('--dvh', '1dvh');
      } else {
        document.documentElement.style.setProperty('--dvh', `${vh}px`);
      }
      
      if (CSS.supports('width', '100dvw')) {
        document.documentElement.style.setProperty('--dvw', '1dvw');
      } else {
        document.documentElement.style.setProperty('--dvw', `${vw}px`);
      }
    };

    // Set on load
    setViewportUnits();
    
    // Update on resize with throttling
    let resizeTimer: NodeJS.Timeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setViewportUnits, 100);
    });
    
    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportUnits, 500);
    });
  }

  // Detect browser capabilities
  static detectCapabilities() {
    const capabilities = {
      backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
      mixBlendMode: CSS.supports('mix-blend-mode', 'difference'),
      cssGrid: CSS.supports('display', 'grid'),
      flexbox: CSS.supports('display', 'flex'),
      transforms3d: CSS.supports('transform-style', 'preserve-3d'),
      willChange: CSS.supports('will-change', 'transform'),
      customProperties: CSS.supports('--custom', 'property'),
      dvhUnit: CSS.supports('height', '100dvh'),
      dvwUnit: CSS.supports('width', '100dvw'),
    };

    // Add classes to document based on capabilities
    Object.entries(capabilities).forEach(([feature, supported]) => {
      document.documentElement.classList.add(
        supported ? `supports-${feature}` : `no-${feature}`
      );
    });

    return capabilities;
  }

  // Browser detection for specific fixes
  static detectBrowser() {
    const userAgent = navigator.userAgent;
    const browsers = {
      firefox: /firefox/i.test(userAgent),
      safari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
      chrome: /chrome/i.test(userAgent) && !/edge/i.test(userAgent),
      edge: /edge/i.test(userAgent),
      ie: /msie|trident/i.test(userAgent),
      ios: /ipad|iphone|ipod/i.test(userAgent),
      android: /android/i.test(userAgent),
    };

    // Add browser classes
    Object.entries(browsers).forEach(([browser, detected]) => {
      if (detected) {
        document.documentElement.classList.add(`browser-${browser}`);
      }
    });

    return browsers;
  }

  // Fix iOS viewport issues
  static fixIOSViewport() {
    if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) return;

    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
      );
    }

    // Fix 100vh issue on iOS
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    
    window.addEventListener('resize', appHeight);
    appHeight();
  }


  // Initialize all fixes
  static init() {
    // Run on DOM content loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initViewportUnits();
        this.detectCapabilities();
        this.detectBrowser();
        this.fixIOSViewport();

      });
    } else {
      this.initViewportUnits();
      this.detectCapabilities();
      this.detectBrowser();
      this.fixIOSViewport();

    }
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  BrowserCompatibility.init();
}
