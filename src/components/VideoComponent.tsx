"use client";
import React, { useEffect, useState } from "react";
interface VideoComponentProps {
  src: string;
  poster: string;
  overlay?: boolean;
  position?: "left" | "right" | "random";
}
const VideoComponent: React.FC<VideoComponentProps> = ({
  src,
  poster,
  overlay,
  position = "random",
}) => {
  const [randomPosition, setRandomPosition] = useState<{
    top: string;
    left: string;
  }>({ top: "0%", left: "0%" });
  useEffect(() => {
    if (position === "random") {
      const top = `${Math.random() * 80}%`;
      const left = `${Math.random() * 80}%`;
      setRandomPosition({ top, left });
    }
  }, [position]);
  const positionClass =
    position === "left" ? "left-0" : position === "right" ? "right-0" : "";
  return (
    <div
      className={`w-40 absolute ${positionClass}`}
      style={{
        top: position === "random" ? randomPosition.top : undefined,
        left: position === "random" ? randomPosition.left : undefined,
        zIndex: overlay ? 0 : 15,
      }}
    >
      <video
        className="w-full h-auto object-cover"
        style={{ mixBlendMode: overlay ? "multiply" : "normal" }}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};
export default VideoComponent;
