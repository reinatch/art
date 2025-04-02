import { useEffect } from "react";

export const useVideoReady = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  setIsVideoReady: (ready: boolean) => void
) => {
  useEffect(() => {
    const videoElement = videoRef.current;

    const handleVideoCanPlay = () => {
      setIsVideoReady(true);
    };

    if (videoElement) {
      videoElement.addEventListener("canplay", handleVideoCanPlay);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("canplay", handleVideoCanPlay);
      }
    };
  }, [videoRef, setIsVideoReady]);
};