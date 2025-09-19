import React from "react";
import { Link as TransitionLink } from "next-transition-router";
import AnimatedText from "@/lib/AnimatedText ";
import Marquee from "@/components/HomePage/Marquee";
import { ProductionSection } from "@/utils/types";

interface ProductionSectionsProps {
  productionData: {
    production0?: ProductionSection;
    production1?: { title: string };
  };
}

const ProductionSections: React.FC<ProductionSectionsProps> = ({ productionData }) => {
  const { production0, production1 } = productionData;

  return (
    <>
      {/* Production Section 0 */}
      {production0 && (
        <div className="production-section px-4 py-0 md:px-10 md:py-20 gap-8 md:gap-0 w-full flex-col justify-around h-[80vh] md:mt-[10vh] grid grid-cols-1 md:grid-cols-2 relative grid-rows-[15%_40%_30%_15%] md:grid-rows-[75%_25%]">
          <div
            className="w-full leading-tight toAnim text-corpo-a md:w-10/12 title"
            style={{ gridArea: "title" }}
          >
            <AnimatedText
              trigger="#production0"
              splitType="lines"
              x={500}
              y={0}
              duration={1}
              stagger={0.05}
              ease="power1.out"
              start="top 80%"
              end="top 20%"
              scrub
            >
              {production0?.title && (
                <div
                  dangerouslySetInnerHTML={{ __html: production0?.title }}
                />
              )}
            </AnimatedText>
          </div>
          <div
            className="self-end w-full font-mono leading-tight md:leading-5 md:self-end toAnim text-rodape subtitle md:w-3/5"
            style={{ gridArea: "subtitle" }}
          >
            <AnimatedText
              trigger="#production0"
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
              {production0?.subtitle && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: production0?.subtitle,
                  }}
                />
              )}
            </AnimatedText>
          </div>
          <div
            className="production0_video_wrapper_main md:max-h-[40vh] max-w-full md:max-w-[90%] perspective-200"
            style={{ gridArea: "image" }}
          >
            <video
              poster={production0.poster.url}
              className="object-cover w-full h-full rounded-3xl production0_video"
              autoPlay
              muted
              loop
              preload="true"
              playsInline
            >
              <source src={production0.video.url} type="video/mp4" />
              <source src={production0.mov.url} type="video/mov" />
              Your browser does not support the video tag.
            </video>
          </div>
          <TransitionLink
            href={`/about/`}
            className="toAnim text-center md:text-start text-[1.5em] md:text-corpo-a-md link self-start md:self-end"
            style={{ gridArea: "link" }}
          >
            {production0?.link.title}
          </TransitionLink>
        </div>
      )}

      {/* Production Section 1 */}
      {production1 && (
        <div className="production-section px-8 md:px-20 w-screen md:w-full items-center flex-col grid gap-2 relative h-[80vh] py-8 mt-[10vh]">
          <div
            id="productionHighlight"
            className="marquee mx-8 text-rodape title1 font-mono capitalize flex w-[65dvw] md:w-[95%] overflow-x-hidden gap-4"
          >
            <Marquee>
              {[...Array(8)].map((_, index) => (
                <span key={index} className="whitespace-nowrap">
                  {production1?.title && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: production1?.title,
                      }}
                    />
                  )}
                </span>
              ))}
            </Marquee>
          </div>
          <div
            id="secondGsap"
            className="flex flex-col items-center h-[70vh] w-full md:w-full row-start-2 sm:items-start rounded-3xl"
          >
            <div className="production0_video_target flex w-[80dvw] md:w-full h-full">
              <div className="production0_video_wrapper_target w-full h-[70vh] perspective-200"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductionSections;