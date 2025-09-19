"use client";

import React from 'react';

interface AboutSectionProps {
  tabContent: {
    heading?: string;
    subHeading?: string;
    description?: string;
    content?: string;
  };
}

const AboutSection: React.FC<AboutSectionProps> = ({ tabContent }) => {
  return (
    <div
      className="relative w-full gap-10 flex flex-col md:flex-row h-screen md:h-[80vh] py-4"
      style={{ columnFill: "auto" }}
    >
      <div className="w-full md:w-1/2">
        {tabContent.heading && (
          <div
            className="gap-10 text-destaque md:pb-16"
            dangerouslySetInnerHTML={{ __html: tabContent.heading }}
          />
        )}
        {tabContent.subHeading && (
          <div
            className="gap-10 text-corpo-a md:pb-16"
            dangerouslySetInnerHTML={{ __html: tabContent.subHeading }}
          />
        )}
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col gap-8">
        {tabContent.description && (
          <div
            className="flex flex-col gap-10 text-corpo-b md:pb-4"
            dangerouslySetInnerHTML={{ __html: tabContent.description }}
          />
        )}
        {tabContent.content && (
          <div
            className="flex flex-col self-end md:self-start md:w-3/4 h-auto max-h-full gap-6 font-mono leading-tight text-rodape"
            dangerouslySetInnerHTML={{ __html: tabContent.content }}
          />
        )}
      </div>
    </div>
  );
};

export default AboutSection;