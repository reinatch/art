import gsap from "gsap";

interface ImageSequenceConfig {
  urls: string[]; // Array of image URLs
  canvas: HTMLCanvasElement; // Canvas element
  onUpdate?: () => void; // Optional callback for when the Tween updates
}

export const imageSequence = (config: ImageSequenceConfig): gsap.core.Tween => {
  const playhead = { frame: 0 };
  const ctx = config.canvas.getContext("2d");
  const onUpdate = config.onUpdate;
//   const images: HTMLImageElement[];

  // Function to update the canvas with the current frame
  const updateImage = () => {
    if (!ctx || !images) return;
    ctx.clearRect(0, 0, config.canvas.width, config.canvas.height); // Clear the canvas
    ctx.drawImage(images[Math.round(playhead.frame)], 0, 0); // Draw the current image
    if (onUpdate) onUpdate();
  };

  // Preload images
  const images: HTMLImageElement[] = config.urls.map((url, i) => {
    const img = new Image();
    img.src = url;
    if (i === 0) img.onload = updateImage; // Update on first image load
    return img;
  });

  // Return a GSAP tween for looping through frames
  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    repeat: -1, // Infinite loop
    duration: 2, // Adjust the duration as needed
    onUpdate: updateImage,
  });
};
