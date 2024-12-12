"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface VideoComponentProps {
  src?: string;
  poster: string;
  overlay?: boolean;
  position?: "left" | "right" | "random";
}

const VideoComponent: React.FC<VideoComponentProps> = ({ poster, overlay = false, position = "random" }) => {
  const [randomPosition, setRandomPosition] = useState<{ top: string; left: string }>({ top: '0%', left: '0%' });
  // const [currentX, setCurrentX] = useState(0); // Store current X position
  // const [currentY, setCurrentY] = useState(0); // Store current Y position

  // Throttling function
  // const throttled = (delay: number, fn: (e: MouseEvent) => void) => {
  //   let lastCall = 0;
  //   return function (...args: [MouseEvent]) {
  //     const now = (new Date()).getTime();
  //     if (now - lastCall < delay) return;
  //     lastCall = now;
  //     return fn(...args);
  //   };
  // };

  // // Mouse move handler for the GSAP animation
  // const mouseMoveHandler2 = (e: MouseEvent) => {
  //   const movableElements = document.querySelectorAll('.movable');
  //   movableElements.forEach((movableElement) => {
  //     const shiftValue = parseFloat(movableElement.getAttribute('data-value') || "1");
  //     const moveX = (e.clientX * shiftValue) / 10;
  //     const moveY = (e.clientY * shiftValue) / 10;

  //     // Update current position based on mouse movement
  //     // setCurrentX(moveX);
  //     // setCurrentY(moveY);

  //     // Update position based on mouse movement
  //     gsap.to(movableElement, { x: moveX, y: moveY, duration: 0.1 }); // Short duration for immediate response
  //   });
  // };

  // Throttled handler for mousemove events
  // const tHandler = throttled(200, mouseMoveHandler2);

  // useEffect(() => {
  //   const wrapper = document.querySelector('.movable-elements-wrapper');
  //   if (wrapper) {
  //     wrapper.addEventListener('mousemove', tHandler as EventListener);
  //   }

  //   return () => {
  //     if (wrapper) {
  //       wrapper.removeEventListener('mousemove', tHandler as EventListener);
  //     }
  //   };
  // }, [tHandler]);

  useEffect(() => {
    if (position === "random") {
      // Set initial random position on mount
      const top = `${Math.random() * 80}%`;
      const left = `${Math.random() * 80}%`;
      setRandomPosition({ top, left });
    }
  }, [position]);

  const handleMouseEnter = () => {
    if (position === "random") {
      // Generate new random position on hover
      const top = `${Math.random() * 80}%`;
      const left = `${Math.random() * 30}%`;
      setRandomPosition({ top, left });
    }
  };
    // Function to generate a random duration between min and max
    const getRandomDuration = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min; // Generate an integer between min and max
    };
  
  useEffect(() => {
    const movableElements = gsap.utils.toArray('.movable');
    movableElements.forEach((value) => {
      const movableElement = value as Element;
      // Start continuous rotation with a random duration
      const randomDuration = getRandomDuration(15, 25); // Random duration between 10 and 30 seconds
      // console.log(randomDuration, i)
      gsap.to(movableElement, {
        rotation: "+=360", // Continuous rotation
        duration: randomDuration, // Use random duration
        ease: "none",
        repeat: -1 // Repeat indefinitely
      });
    });
  }, []);
  // useEffect(() => {
  //   const movableElements = document.querySelectorAll('.movable');
  //   movableElements.forEach((movableElement) => {
  //     // Start continuous rotation
  //     gsap.to(movableElement, {
  //       rotation: "+=360", // Continuous rotation
  //       duration: 10, // Duration for one full rotation
  //       ease: "none",
  //       repeat: -1 // Repeat indefinitely
  //     });

  //     // Start continuous translation
  //     // const randomX = (Math.random() - 0.5) * 2; // Small random translation in X
  //     // const randomY = (Math.random() - 0.5) * 2; // Small random translation in Y

  //     // // Accumulate the translation with currentX and currentY
  //     // gsap.to(movableElement, {
  //     //   x: `+=${randomX + currentX}`, // Translate X
  //     //   y: `+=${randomY + currentY}`, // Translate Y
  //     //   duration: 2, // Duration for translation
  //     //   ease: "power1.inOut",
  //     //   repeat: -1, // Repeat indefinitely
  //     //   yoyo: true // Reverse the translation for a back-and-forth effect
  //     // });
  //   });
  // }, [currentX, currentY]); // Update when currentX or currentY changes

  const positionClass = position === "left" ? 'left-0' : position === "right" ? 'right-0' : '';

  return (
    <div
      className={`w-40 absolute ${positionClass} movable `}
      data-value="1" // Add data attribute for shift effect
      style={{
        top: position === "random" ? randomPosition.top : undefined,
        left: position === "random" ? randomPosition.left : undefined,
        transition: 'top 0.5s ease, left 0.5s ease', // Smooth transition for random positioning
        zIndex: overlay ? 0 : 90, // Set z-index based on overlay prop
      }}
      onMouseEnter={handleMouseEnter}
    >
      <Image
        src={poster}
        alt="Thumbnail"
        width={200}
        height={200}
        className={`object-contain rounded-lg floating ${overlay ? "mix-blend-multiply" : "mix-blend-normal"}`}
      />
    </div>
  );
};

export default VideoComponent;