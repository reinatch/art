import gsap from "gsap";
interface ImageSequenceConfig {
  urls: string[];
  canvas: HTMLCanvasElement;
  onUpdate?: () => void;
}
export const imageSequence = (config: ImageSequenceConfig): gsap.core.Tween => {
  const playhead = { frame: 0 };
  const ctx = config.canvas.getContext("2d");
  const onUpdate = config.onUpdate;
  const updateImage = () => {
    if (!ctx || !images) return;
    ctx.clearRect(0, 0, config.canvas.width, config.canvas.height);
    ctx.drawImage(images[Math.round(playhead.frame)], 0, 0);
    if (onUpdate) onUpdate();
  };
  const images: HTMLImageElement[] = config.urls.map((url, i) => {
    const img = new Image();
    img.src = url;
    if (i === 0) img.onload = updateImage;
    return img;
  });
  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    repeat: -1,
    duration: 2,
    onUpdate: updateImage,
  });
};
