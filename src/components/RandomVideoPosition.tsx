"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
interface VideoComponentProps {
  src?: string;
  poster: string;
  overlay?: boolean;
  position?: "left" | "right" | "random";
}
const VideoComponent: React.FC<VideoComponentProps> = ({
  poster,
  overlay = false,
  position = "random",
}) => {
  const [randomPosition, setRandomPosition] = useState<{
    top: string;
    left: string;
  }>({ top: "200%", left: "200%" });
  useEffect(() => {
    if (position === "random") {
      const top = `${Math.random() * 80}%`;
      const left = `${Math.random() * 80}%`;
      setRandomPosition({ top, left });
    }
  }, [position]);
  const handleMouseEnter = () => {
    if (position === "random") {
      const top = `${Math.random() * 80}%`;
      const left = `${Math.random() * 30}%`;
      setRandomPosition({ top, left });
    }
  };
  const getRandomDuration = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  useEffect(() => {
    const movableElements = gsap.utils.toArray(".movable");
    movableElements.forEach((value) => {
      const movableElement = value as Element;
      const randomDuration = getRandomDuration(15, 25);
      gsap.to(movableElement, {
        rotation: "+=360",
        duration: randomDuration,
        ease: "none",
        repeat: -1,
      });
    });
  }, []);
  const positionClass =
    position === "left" ? "left-0" : position === "right" ? "right-0" : "";
  return (
    <div
      className={`w-40 absolute ${positionClass} movable `}
      data-value="1"
      style={{
        top: position === "random" ? randomPosition.top : undefined,
        left: position === "random" ? randomPosition.left : undefined,
        transition: "top 0.5s ease, left 0.5s ease",
        zIndex: overlay ? 0 : 90,
      }}
      onMouseEnter={handleMouseEnter}
    >
      <Image
        src={poster}
        alt="Thumbnail"
        width={200}
        height={200}
        loading="lazy"
        className={`object-contain rounded-lg floating ${
          overlay ? "mix-blend-multiply" : "mix-blend-normal"
        }`}
      />
    </div>
  );
};
export default VideoComponent;
