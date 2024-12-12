// utils/deviceDetection.ts

export function isClientMobile() {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();
  
      // Check for mobile user agents
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
      // Check for mobile platforms
      const isMobilePlatform = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(platform);
  
      return isMobileUserAgent || isMobilePlatform;
    }
    return false;
  }