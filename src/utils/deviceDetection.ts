export function isClientMobile() {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobilePlatform = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(platform);
      return isMobileUserAgent || isMobilePlatform;
    }
    return false;
  }