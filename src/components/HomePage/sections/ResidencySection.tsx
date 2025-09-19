import React from "react";
import { Link as TransitionLink } from "next-transition-router";
import AnimatedText from "@/lib/AnimatedText ";
import RandomVideoPosition from "@/components/RandomVideoPosition";
import { ResidencySection as ResidencySectionType } from "@/utils/types";

interface ResidencySectionProps {
  residencyData: ResidencySectionType;
}

const ResidencySection: React.FC<ResidencySectionProps> = ({ residencyData }) => {
  return (
    <div className="residency-section px-4 md:px-10 text-center w-full flex flex-col justify-center h-[80vh] mt-[12vh] relative py-8">
      <div className="text-[1.5em] md:text-destaque-xl">
        <AnimatedText
          trigger="#residency0"
          splitType="lines"
          x={-500}
          y={0}
          duration={1}
          stagger={0.05}
          ease="power1.out"
          start="top bottom"
          end="top top"
          scrub
        >
          <h2 className="">
            {residencyData?.title && (
              <div
                dangerouslySetInnerHTML={{ __html: residencyData?.title }}
              />
            )}
          </h2>
        </AnimatedText>
      </div>
      <div className="relative flex items-center justify-center w-full h-full leading-tight">
        <RandomVideoPosition
          src="/videos/p.webm"
          poster="/images/residencias/1.png"
        />
        <RandomVideoPosition
          src="/videos/c.webm"
          poster="/images/residencias/11.png"
          position="random"
          overlay
        />
        <RandomVideoPosition
          src="/videos/c.webm"
          poster="/images/residencias/12.png"
          position="random"
          overlay
        />
        <RandomVideoPosition
          src="/videos/p.webm"
          poster="/images/residencias/9.png"
          position="random"
        />
        <div className="w-full px-0 text-center text-destaque-md md:px-20 movable-elements-wrapper">
          <AnimatedText
            trigger="#residency0"
            splitType="lines"
            x={-500}
            y={0}
            duration={1}
            stagger={0.05}
            ease="power1.out"
            start="top bottom"
            end="top top"
            scrub
          >
            <div className="absolute w-full text-center transform -translate-x-1/2 -translate-y-1/2 z-1 top-1/2 left-1/2">
              {residencyData?.subtitle && (
                <div
                  className="text-6xl"
                  dangerouslySetInnerHTML={{
                    __html: residencyData?.subtitle,
                  }}
                />
              )}
            </div>
          </AnimatedText>
        </div>
      </div>
      <div id="text1" className="staggerElements">
        <RandomVideoPosition
          src="/videos/p.webm"
          poster="/images/residencias/10.png"
          overlay
          position="random"
        />
      </div>
      <div id="text2" className="staggerElements">
        <RandomVideoPosition
          src="/videos/p.webm"
          poster="/images/residencias/2.png"
          overlay
          position="random"
        />
      </div>
      <div id="text3" className="staggerElements">
        <RandomVideoPosition
          src="/videos/p.webm"
          poster="/images/residencias/7.png"
          overlay
        />
      </div>
      <TransitionLink
        href={`/residencias/`}
        className="text-[1.5em] md:text-corpo-a-md"
      >
        {residencyData?.link.title}
      </TransitionLink>
    </div>
  );
};

export default ResidencySection;