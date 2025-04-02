import gsap from 'gsap';

interface HorizontalLoopConfig {
  speed?: number; 
  paused?: boolean; 
  repeat?: number; 
  reversed?: boolean; 
  paddingRight?: number; 
  snap?: number | false; 
}

function horizontalLoop(
  items: HTMLElement[] | string, 
  config: HorizontalLoopConfig = {}
) {
  const elements = gsap.utils.toArray<HTMLElement>(items);
  const tl = gsap.timeline({
    repeat: config.repeat ?? -1,
    paused: config.paused ?? false,
    defaults: { ease: "none" },
    onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); },
  });

  const length = elements.length;
  const startX = elements[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (config.speed ?? 1) * 100;
  const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap ?? 1);

  
  gsap.set(elements, {
    xPercent: (i, el) => {
      const width = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / width) * 100 +
        parseFloat(gsap.getProperty(el, "xPercent") as string)
      );
      return xPercents[i];
    }
  });
  
  gsap.set(elements, { x: 0 });

  const totalWidth: number =
    elements[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] - startX +
    elements[length - 1].offsetWidth * (parseFloat(gsap.getProperty(elements[length - 1], "scaleX") as string) || 1) +
    (config.paddingRight ?? 0);

  
  elements.forEach((item, i) => {
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop = distanceToStart + widths[i] * (parseFloat(gsap.getProperty(item, "scaleX") as string) || 1);

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
        {
          xPercent: xPercents[i],
          duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add(`label${i}`, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  });

  function toIndex(index: number, vars: gsap.TweenVars = {}) {
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];

    if ((time > tl.time()) !== (index > curIndex)) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }

    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  
  tl.next = (vars: gsap.TweenVars = {}) => toIndex(curIndex + 1, vars);
  tl.previous = (vars: gsap.TweenVars = {}) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars: gsap.TweenVars = {}) => toIndex(index, vars);
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

export default horizontalLoop;
