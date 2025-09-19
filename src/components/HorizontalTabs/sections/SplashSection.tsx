"use client";

import React from 'react';
import Image from 'next/image';

interface VideoSource {
  url: string;
}

interface ImageSource {
  url: string;
  alt?: string;
  width: number;
  height: number;
}

interface SplashSectionProps {
  tabContent: {
    video?: VideoSource;
    mov?: VideoSource;
    image?: ImageSource;
    title?: string;
  };
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const SplashSection: React.FC<SplashSectionProps> = ({ tabContent, videoRef }) => {
  if (!tabContent.video?.url && !tabContent.image?.url) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-8 rounded-sm md:rounded-xl w-full relative mt-[20vh] md:mt-0">
      <div className="relative w-full h-full md:h-[calc(100vh-16rem)] py-4 md:py-0 text-4xl flex flex-col gap-10">
        {/* Render video if it exists */}
        {tabContent.video?.url && (
          <video
            ref={videoRef}
            id="wait-video"
            poster={tabContent.image?.url}
            className="object-cover w-full h-full bg-gray-100 rounded-lg md:rounded-xl"
            autoPlay
            muted
            loop
            preload="true"
            playsInline
          >
            <source src={tabContent.video.url} type="video/mp4" />
            {tabContent.mov?.url && (
              <source src={tabContent.mov.url} type="video/mov" />
            )}
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Render image if there is no video but an image exists */}
        {tabContent.image?.url && !tabContent.video && (
          <Image
            src={tabContent.image.url}
            alt={tabContent.image.alt || tabContent.title || "Image"}
            width={tabContent.image.width}
            height={tabContent.image.height}
            loading="lazy"
            className="object-cover w-full h-full toAnim image rounded-xl"
          />
        )}
      </div>
    </div>
  );
};

export default SplashSection;