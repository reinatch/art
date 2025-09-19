import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useWindowSize } from "@custom-react-hooks/use-window-size";
import { ImageMedia } from "@/utils/types";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
const Showcase: React.FC<ShowcaseProps> = ({ cardData, cardWidth }) => {
  const [, setHoveredCardId] = useState<number | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(408);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const { contextSafe } = useGSAP({ scope: containerRef });
  const showcaseCount = cardData ? cardData.length : 0;
  const centerIndex = Math.floor(showcaseCount / 2);
  const depthFactor = 1;
  const mm = gsap.matchMedia();
  useGSAP(() => {
    mm.add("(max-width: 899px)", () => {
      const showcaseCards = document.querySelectorAll(".showcase--cards .card");
      showcaseCards.forEach((card, index) => {
        const offset = 80 * (showcaseCount - 1 - index);
        card.setAttribute("style", `left: ${offset}vw;`);
      });
    });
  }, [showcaseCount, windowSize.width]);
  const handleMEnter = contextSafe((id: number, index: number) => {
    setHoveredCardId(id);
    const showcaseCards: HTMLElement[] = gsap.utils.toArray(
      ".showcase--cards .card"
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
  const handleCardClick = contextSafe((id: number, index: number) => {
    const cardInner = document.querySelector(`.card-${id} .card-inner`);
    
    // Debug logging for iOS issues
    console.log('🃏 Card click debug:', {
      cardId: id,
      currentFlipped: flippedCardId,
      element: cardInner,
      userAgent: navigator.userAgent,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      devicePixelRatio: window.devicePixelRatio
    });
    
    if (!cardInner) {
      console.error('🃏 Card inner element not found for id:', id);
      return;
    }
    
    // Check current transform before animation
    const computedStyle = window.getComputedStyle(cardInner);
    console.log('🃏 Current transform before animation:', computedStyle.transform);
    
    if (flippedCardId === id) {
      console.log('🃏 Flipping card back to front');
      gsap.to(cardInner, { 
        rotateY: 0, 
        duration: 0.2,
        // iOS-specific fixes
        force3D: true,
        transformOrigin: "center center",
        ease: "power2.inOut",
        onStart: () => {
          console.log('🃏 Back to front animation started');
          // Ensure proper 3D context on iOS
          gsap.set(cardInner, { 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            perspective: "1000px"
          });
        },
        onComplete: () => {
          console.log('🃏 Back to front animation completed');
          const finalStyle = window.getComputedStyle(cardInner);
          console.log('🃏 Final transform:', finalStyle.transform);
        }
      });
      setFlippedCardId(null);
    } else {
      console.log('🃏 Flipping card front to back');
      setFlippedCardId(id);
      gsap.to(cardInner, { 
        rotateY: 180, 
        duration: 0.2,
        // iOS-specific fixes
        force3D: true,
        transformOrigin: "center center", 
        ease: "power2.inOut",
        onStart: () => {
          console.log('🃏 Front to back animation started');
          // Ensure proper 3D context on iOS
          gsap.set(cardInner, { 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            perspective: "1000px"
          });
        },
        onComplete: () => {
          console.log('🃏 Front to back animation completed');
          const finalStyle = window.getComputedStyle(cardInner);
          console.log('🃏 Final transform:', finalStyle.transform);
        }
      });
    }
    
    mm.add("(max-width: 899px)", () => {
      const showcaseCards: HTMLElement[] = gsap.utils.toArray(
        ".showcase--cards .card"
      );
      showcaseCards.forEach((card, i) => {
        if (i < index) {
          card.classList.add("left-group");
          card.classList.remove("right-group");
        } else if (i > index) {
          card.classList.add("right-group");
          card.classList.remove("left-group");
        } else {
          card.classList.remove("left-group");
          card.classList.remove("right-group");
        }
      });
    });
  });
  useGSAP(() => {
    const cardInners = document.querySelectorAll('.card-inner');
    const cardFronts = document.querySelectorAll('.card-front');
    const cardBacks = document.querySelectorAll('.card-back');

    
    gsap.set(cardInners, {
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      perspective: "1000px",
      WebkitPerspective: "1000px",
      transformOrigin: "center center",
      force3D: true,
      z: 0.01 
    });
    
    gsap.set(cardFronts, {
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      rotateY: 0,
      force3D: true
    });
    
    gsap.set(cardBacks, {
      backfaceVisibility: "hidden", 
      WebkitBackfaceVisibility: "hidden",
      rotateY: 180,
      force3D: true
    });
    
    gsap.registerPlugin(ScrollTrigger);
    const trigger = document.getElementById("servicos");
    const cards = showcaseRef.current?.querySelectorAll(".card");
    const totalCards = cards?.length;
    const mm = gsap.matchMedia();
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
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const showcaseCards = gsap.utils.toArray(".showcase--cards .card");
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
    <div ref={containerRef} className="showcase w-full md:w-full">
      <div
        ref={showcaseRef}
        className="showcase--cards h-[60vh] md:h-[76vh] py-8 w-screen md:w-full"
      >
        {cardData &&
          cardData.map((card, index) => (
            <div
              key={card.capa.ID}
              className={`card card-${card.capa.ID}`}
              onMouseEnter={() => handleMEnter(card.capa.ID, index)}
              onMouseLeave={() => handleMouseLeave(card.capa.ID)}
              onClick={() => handleCardClick(card.capa.ID, index)}
            >
              <div className="card-inner p-10 pt-0">
                <div className="card-front flex flex-col justify-between items-center">
                  <Image
                    width={1000}
                    height={1000}
                    src={card.capa.url}
                    alt={card.capa.alt}
                    className="w-full h-auto object-contain block"
                    priority
                  />
                  <div className="card--text text-center">
                    <span className="text-xl md:text-4xl relative bottom-4">
                      {card.title}
                    </span>
                  </div>
                </div>
                <div className="card-back bg-red-500">
                  <div className="card--text text-start relative">
                    <div className="flex flex-col p-4 md:p-10">
                      <p className="text-rodape-lg md:text-[1.5rem] pb-6">
                        {card.title}
                      </p>
                      <div
                        className="gap-10 text-[0.3em] md:text-rodape-sm font-mono"
                        dangerouslySetInnerHTML={{ __html: card.lista }}
                      />
                    </div>
                  </div>
                  <Image
                    width={100}
                    height={100}
                    src={card.thumbnail.url}
                    alt={card.thumbnail.alt}
                    className="absolute bottom-8 right-8 w-[10vh] h-auto object-contain block"
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Showcase;
