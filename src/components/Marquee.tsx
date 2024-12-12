import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ScrollingBoxesProps {
  children: React.ReactNode; 
}

const ScrollingBoxes: React.FC<ScrollingBoxesProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boxes = gsap.utils.toArray<HTMLElement>(".box");

    const loop = horizontalLoop(boxes, {
      paused: false,
      repeat: -1,
      speed: 0.75,
      snap: true,
    });

    return () => {
      loop.kill(); 
    };
  }, []);

  function horizontalLoop(items: HTMLElement[], config: {
    snap: boolean; paused?: boolean; repeat?: number; speed?: number; reversed?: boolean;
  }) {
    items = gsap.utils.toArray(items);
    config = config || {};
    const tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); },
    });

    const length = items.length;
    const startX = items[0].offsetLeft;
    const times: number[] = [];
    const widths: number[] = [];
    const xPercents: number[] = [];
    let curIndex = 0;
    const pixelsPerSecond = (config.speed || 1) * 100;
    const snap = typeof config.snap === 'number' || Array.isArray(config.snap) ? gsap.utils.snap(config.snap) : (v: number) => v;
    let totalWidth: number = 0;
    let curX: number, distanceToStart: number, distanceToLoop: number, item: HTMLElement;

    gsap.set(items, {
      xPercent: (i, el) => {
        const w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
        xPercents[i] = snap(parseFloat((gsap.getProperty(el, "x", "px") as string)) / w * 100 + parseFloat(gsap.getProperty(el, "xPercent") as string));
        return xPercents[i];
      },
    });

    gsap.set(items, { x: 0 });
    totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * parseFloat(gsap.getProperty(items[length - 1], "scaleX") as string);

    for (let i = 0; i < length; i++) {
      item = items[i];
      curX = xPercents[i] / 100 * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      distanceToLoop = distanceToStart + widths[i] * parseFloat(gsap.getProperty(item, "scaleX") as string);
      tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
        .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index: number, vars: gsap.TweenVars) {
      vars = vars || {};
      if (Math.abs(index - curIndex) > length / 2) {
        index += index > curIndex ? -length : length;
      }
      const newIndex = gsap.utils.wrap(0, length, index);
      let time = times[newIndex];
      if (time > tl.time() !== index > curIndex) {
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }

    tl.next = (vars: gsap.TweenVars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars: gsap.TweenVars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index: number, vars: gsap.TweenVars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); 

    if (config.reversed) {
      if (tl.vars && tl.vars.onReverseComplete) {
        tl.vars.onReverseComplete();
      }
      tl.reverse();
    }
    return tl;
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className="wrapper relative mx-auto  w-full h-auto" 
      >
        <div
          ref={boxesRef}
          className="boxes relative flex gap-4 h-10" 
        >
          {React.Children.map(children, (child, index) => (
            <div key={index} className="box relative h-auto  text-black whitespace-nowrap"> 
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScrollingBoxes;