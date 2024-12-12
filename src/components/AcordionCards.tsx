

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { useWindowSize } from '@custom-react-hooks/use-window-size';
import { ImageMedia } from '@/utils/types';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Card {
  title: string;
  lista: string;
  capa: ImageMedia;
  thumbnail: ImageMedia;
}

interface ShowcaseProps {
  cardData: Card[] | undefined;
  cardWidth: number;
  sectionID: string;
}
// let showcasePos = 0;

const Showcase: React.FC<ShowcaseProps> = ({ cardData, cardWidth }) => {
  const [, setHoveredCardId] = useState<number | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(408);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const { contextSafe } = useGSAP({ scope: containerRef });
  const showcaseCount = cardData ? cardData.length : 0;
  const centerIndex = Math.floor(showcaseCount / 2);
  const depthFactor = 1; // Adjust this to control the depth effect
  
  const mm = gsap.matchMedia();
  useGSAP(() => {
    mm.add("(max-width: 899px)", () => {
      const showcaseCards = document.querySelectorAll('.showcase--cards .card');
      showcaseCards.forEach((card, index) => {
        const offset = (80  * (showcaseCount - 1 - index));
        // console.log(offset, "offfffffffffffffffffffffffffffffff")
        card.setAttribute('style', `left: ${offset}vw;`);
      });
    });
  }, [showcaseCount, windowSize.width]);

  const handleMEnter = contextSafe((id: number, index: number) => {
    setHoveredCardId(id);
    const showcaseCards: HTMLElement[] = gsap.utils.toArray('.showcase--cards .card');

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

  const handleCardClick = contextSafe((id: number, index: number) => {
    const cardInner = document.querySelector(`.card-${id} .card-inner`);
    if (flippedCardId === id) {
      gsap.to(cardInner, { rotateY: 0, duration: 0.2 });
      setFlippedCardId(null);
    } else {
      setFlippedCardId(id);
      gsap.to(cardInner, { rotateY: 180, duration: 0.2 });
    }



  mm.add("(max-width: 899px)", () => {
      // const width = window.innerWidth;
      // const pos = (250 / width) * 1.4 - 0.2;
      // const clampedPos = Math.min(Math.max(pos, 0), 1);
      // const index = Math.round(clampedPos * (showcaseCount - 1));
      // document.querySelectorAll('.showcase--cards .card').forEach((card, i) => {
      //   if ((showcaseCount - 1) - i < index) {
      //     card.classList.add('push');
      //   } else {
      //     card.classList.remove('push');
      //   }
      // });
      // const edge = 100;
      // const g = (((showcaseCount - 1) + cardWidth) - width + edge * 2) / (showcaseCount - 1);
      // const offset = edge - (index * g);
      // showcasePos += (offset - showcasePos) / 10;
      // document.querySelector('.showcase--cards')!.setAttribute('style', `transform: translate(${showcasePos}px, 0px)`);
   
      const showcaseCards: HTMLElement[] = gsap.utils.toArray('.showcase--cards .card');
      showcaseCards.forEach((card, i) => {
        if (i < index) {
          card.classList.add('left-group');
          card.classList.remove('right-group');
        } else if (i > index) {
          card.classList.add('right-group');
          card.classList.remove('left-group');
        } else {
          card.classList.remove('left-group');
          card.classList.remove('right-group');
        }
      });
    });
  });

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const trigger = document.getElementById("servicos");
    const cards = showcaseRef.current?.querySelectorAll(".card");
    const totalCards = cards?.length;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      if (totalCards) {
        cards.forEach((card, index) => {
          let x, y = 0;
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
            }
          });
        });
      }
    });
  }, [containerRef]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const showcaseCards = gsap.utils.toArray('.showcase--cards .card');
    mm.add("(min-width: 900px)", () => {
      showcaseCards.forEach((card, index) => {
        const zIndex = index < centerIndex ? index + 1 : showcaseCount - index;
        gsap.set(card as HTMLElement, { zIndex });
      });
    });
    mm.add("(max-width: 899px)", () => {
      showcaseCards.forEach((card, index) => {
        const zIndex = index + 1;
        gsap.set(card as HTMLElement, { zIndex });
      });
    });
  }, [cardWidth, centerIndex, showcaseCount]);

  return (
    <div ref={containerRef} className="showcase w-full md:w-auto">
      <div ref={showcaseRef} className="showcase--cards h-[60vh] md:h-[76vh] py-8 w-screen md:w-full">
        {cardData && cardData.map((card, index) => (
          <div
            key={card.capa.ID}
            className={`card card-${card.capa.ID}`}
            onMouseEnter={() => handleMEnter(card.capa.ID, index)}
            onMouseLeave={() => handleMouseLeave(card.capa.ID)}
            onClick={() => handleCardClick(card.capa.ID, index)}
          >
            <div className="card-inner p-10 pt-0">
              <div className="card-front flex flex-col justify-between items-center">
                <Image width={1000} height={1000} src={card.capa.url} alt={card.capa.alt} className="w-full h-auto object-contain block" />
                <div className="card--text text-center">
                  <span className="text-xl md:text-4xl">{card.title}</span>
                </div>
              </div>
              <div className="card-back bg-red-500">
                <div className="card--text text-start relative">
                  <div className="flex flex-col p-4 md:p-10">
                    <p className="text-rodape-lg md:text-[1.5rem] pb-6">{card.title}</p>
                    <div className="gap-10 text-[0.3em] md:text-rodape-sm font-mono" dangerouslySetInnerHTML={{ __html: card.lista }} />
                  </div>
                </div>
                <Image width={100} height={100} src={card.thumbnail.url} alt={card.thumbnail.alt} className="absolute bottom-8 right-8 w-[10vh] h-auto object-contain block" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showcase;