import React from "react";

interface HomeSplashSectionProps {
  value: {
    poster: { url: string };
    video: { url: string };
    mov: { url: string };
  };
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const HomeSplashSection: React.FC<HomeSplashSectionProps> = ({ value, videoRef }) => {
  return (
    <div className="flex flex-col items-center h-screen w-screen md:h-[calc(100vh-16rem)] md:mt-[8rem] md:w-full gap-8 sm:items-start">
      <video
        ref={videoRef}
        poster={value.poster.url}
        className="object-cover w-full h-full home_video md:rounded-xl"
        autoPlay
        muted
        loop
        preload="true"
        playsInline
      >
        <source src={value.video.url} type="video/mp4" />
        <source src={value.mov.url} type="video/mov" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default HomeSplashSection;