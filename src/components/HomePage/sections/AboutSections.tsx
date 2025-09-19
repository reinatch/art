import React from "react";
import { Link as TransitionLink } from "next-transition-router";
import AnimatedText from "@/lib/AnimatedText ";
import AnimatedImages from "@/lib/AnimatedImages";
import Image from "next/image";
import { AboutSection, AboutSectionWithSubtitle } from "@/utils/types";

interface AboutSectionsProps {
  aboutData: {
    about0?: AboutSection;
    about1?: AboutSectionWithSubtitle;
  };
}

const AboutSections: React.FC<AboutSectionsProps> = ({ aboutData }) => {
  const { about0, about1 } = aboutData;

  return (
    <>
      {/* About Section 0 */}
      {about0 && (
        <div className="about-section px-0 md:px-10 md:py-8 md:pb-[10vh] text-center w-11/12 self-center flex flex-col justify-center gap-4 md:gap-[10vh] h-[25vh] md:h-[80vh] md:mt-[10vh]">
          <div
            id="target"
            className="w-full md:w-10/12 m-auto 0toAnim text-destaque-2xl leading-tight md:leading-[1.04]"
          >
            <AnimatedText
              trigger="#about0"
              splitType="words"
              x={1000}
              y={0}
              scale={1}
              duration={2}
              stagger={1}
              ease="power1.out"
              start="top bottom"
              end="center center"
              scrub
            >
              {about0?.title && (
                <div
                  dangerouslySetInnerHTML={{ __html: about0?.title }}
                />
              )}
            </AnimatedText>
          </div>
          <TransitionLink
            href={`/about/`}
            className="toAnim text-[1.5em] md:text-corpo-a-md"
          >
            {about0?.link.title}
          </TransitionLink>
        </div>
      )}

      {/* About Section 1 */}
      {about1 && (
        <div className="about-section px-4 mt-20 gap-4 md:gap-0 md:px-10 md:py-20 w-full flex-col justify-around h-[80vh] md:mt-[10vh] grid-cols-1 grid md:grid-cols-2 relative">
          <div
            className="w-full leading-tight title text-corpo-a md:w-10/12"
            style={{ gridArea: "title" }}
          >
            <AnimatedText
              trigger="#about1"
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
              {about1?.title && (
                <div
                  dangerouslySetInnerHTML={{ __html: about1?.title }}
                />
              )}
            </AnimatedText>
          </div>
          <div
            className="md:self-end w-full font-mono leading-tight md:leading-5 toAnimLeft subtitle text-[10px] md:text-rodape md:w-3/6"
            style={{ gridArea: "subtitle" }}
          >
            <AnimatedText
              trigger="#about1"
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
              {about1?.subtitle && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: about1?.subtitle,
                  }}
                />
              )}
            </AnimatedText>
          </div>
          <div>
            <div style={{ gridArea: "image" }}>
              <AnimatedImages
                trigger="#about1"
                x={500}
                y={0}
                scale={0.5}
                opacity={1}
                duration={1}
                stagger={0.2}
                ease="power1.out"
                start="top bottom"
                end="top top"
                scrub
              >
                <Image
                  width={100}
                  height={500}
                  src={about1.image.toString()}
                  alt="about1"
                  className="w-full h-auto image md:w-10/12 rounded-xl"
                  priority
                  unoptimized
                />
              </AnimatedImages>
            </div>
          </div>
          <TransitionLink
            href={`/about/`}
            className="toAnimRight text-center md:text-start w-full text-[1.5em] md:text-corpo-a-md link md:self-end"
            style={{ gridArea: "link" }}
          >
            {about1?.link.title}
          </TransitionLink>
        </div>
      )}
    </>
  );
};

export default AboutSections;