import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import Link from "next/link";
import { ImageMedia } from "@/utils/types";
import { ScrollTrigger } from "gsap/ScrollTrigger";
interface Jornais {
  capa: ImageMedia;
  contra: ImageMedia;
  link: {
    target: string;
    title: string;
    url: string;
  };
}
interface ShowcaseProps {
  jornaisData: Jornais[] | undefined;
  cardWidth: number;
}
const Jornais: React.FC<ShowcaseProps> = ({ jornaisData, cardWidth }) => {
  const [, setHoveredCardId] = useState<number | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(1946);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const { contextSafe } = useGSAP({ scope: containerRef });
  const mm = gsap.matchMedia();
  const showcaseCount = jornaisData ? jornaisData.length : 0;
  const centerIndex = Math.floor(showcaseCount / 2);
  const depthFactor = 1;
  // console.log(jornaisData)
  useGSAP(() => {
    mm.add("(max-width: 899px)", () => {
      const showcaseCards = document.querySelectorAll(".jornais--cards .card");
      showcaseCards.forEach((card, index) => {
        const offset = 30 * index;
        card.setAttribute("style", `left: ${offset}vw;`);
      });
    });
  }, [showcaseCount, windowSize.width]);
  const handleMEnter = contextSafe((id: number, index: number) => {
    setHoveredCardId(id);
    const showcaseCards: HTMLElement[] = gsap.utils.toArray(
      ".jornais--cards .card"
    );
    mm.add("(min-width: 900px)", () => {
      showcaseCards.forEach((card, i) => {
        let zOffset = 0;
        if (i === index) {
          zOffset = 0;
        } else if (i < index) {
          zOffset = -(depthFactor * (index - i));
        } else {
          zOffset = -(depthFactor * (i - index));
        }
        gsap.to(card, {
          zIndex: zOffset,
          translateZ: `${zOffset}px`,
          duration: 0.1,
        });
      });
    });
  });
  const handleMouseLeave = contextSafe((id: number) => {
    setHoveredCardId(null);
    if (flippedCardId === id) {
      const cardElement = document.querySelector(`.card-${id} .card-inner`);
      gsap.to(cardElement, { rotateY: 0, duration: 0.1 });
      setFlippedCardId(null);
    }
  });
  const handleCardClick = contextSafe((id: number) => {
    const cardInner = document.querySelector(`.card-${id} .card-inner`);
    if (flippedCardId === id) {
      gsap.to(cardInner, { rotateY: 0, duration: 0.2 });
      setFlippedCardId(null);
    } else {
      setFlippedCardId(id);
      gsap.to(cardInner, { rotateY: 180, duration: 0.2 });
    }
  });
  useEffect(() => {
    const showcaseCards = gsap.utils.toArray(".jornais--cards .card");
    showcaseCards.forEach((card, index) => {
      const zIndex = index < centerIndex ? index + 1 : showcaseCount - index;
      gsap.set(card as HTMLElement, { zIndex });
    });
  }, [cardWidth, centerIndex, showcaseCount]);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const trigger = document.getElementById("jornais");
    const cards = showcaseRef.current?.querySelectorAll(".card");
    const totalCards = cards?.length;
    mm.add("(min-width: 900px)", () => {
      if (totalCards) {
        cards.forEach((card, index) => {
          let x,
            y = 0;
          if (index < Math.floor(totalCards / 2)) {
            x = -200 * (totalCards - index);
            y = -100 * (totalCards - index);
          } else if (index >= Math.floor(totalCards / 2)) {
            x = 200 * index;
            y = -100 * index;
          } else {
            y = -100;
          }
          gsap.from(card, {
            x: x,
            y: y,
            scale: 0.2,
            rotationX: 90,
            duration: 1,
            ease: "none",
            stagger: 2,
            scrollTrigger: {
              trigger: trigger,
              start: "top-=5px bottom",
              end: () => `+=${windowSize.height}`,
              scrub: 0.1,
              id: `${index}`,
            },
          });
        });
      }
    });
  }, [containerRef]);
  return (
    <div ref={containerRef} className="jornais">
      <div ref={showcaseRef} className="jornais--cards h-auto py-8">
        {jornaisData &&
          jornaisData.map((card, index) => {
            return (
              <div
                key={card.capa.ID}
                className={`card card-${card.capa.ID}`}
                onMouseEnter={() => handleMEnter(card.capa.ID, index)}
                onMouseLeave={() => handleMouseLeave(card.capa.ID)}
                onClick={() => handleCardClick(card.capa.ID)}
              >
                <div className="card-inner">
                  <div className="card-front flex flex-col justify-between items-center">
                    <Image
                      width={1000}
                      height={1000}
                      src={card.capa.url}
                      alt={card.capa.alt}
                      className="w-full h-auto object-contain block"
                      priority
                    />
                  </div>
                  <div className="card-back ">
                    <div className="card--text text-start relative">
                      <div>
                        <Image
                          width={1000}
                          height={1000}
                          src={card.contra.url}
                          alt={card.contra.alt}
                          className="w-full h-auto object-cover block"
                          priority
                        />
                      </div>
                    </div>
                    <div className="w-full flex justify-center">
                      {" "}
                      {
                        <Link
                          rel="noopener noreferrer"
                          target="_blank"
                          href={card.link.url}
                          className="absolute bottom-16 w-max text-center bg-black text-gray-200 text-corpo-a underline"
                        >
                          {card.link.title}
                        </Link>
                      }{" "}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default Jornais;
