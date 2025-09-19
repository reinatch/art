"use client";

import React from 'react';

interface TeamsSectionProps {
  tabContent: {
    heading?: string;
    description?: string;
  };
}

const TeamsSection: React.FC<TeamsSectionProps> = ({ tabContent }) => {
  return (
    <div
      id="svgimage"
      className="svgimage relative w-full text-4xl flex flex-col gap-10 h-screen md:h-[80vh] justify-center md:justify-start"
    >
      <div className="flex flex-col w-full gap-10 md:w-[60vw] md:mx-auto items-center">
        {tabContent.heading && (
          <div
            className="w-2/3 gap-10 m-auto text-center text-destaque md:w-full md:m-0"
            dangerouslySetInnerHTML={{ __html: tabContent.heading }}
          />
        )}
        
        {tabContent.description && (
          <div
            className="gap-10 text-center text-corpo-b leading-[1.25]"
            dangerouslySetInnerHTML={{ __html: tabContent.description }}
          />
        )}
      </div>
    </div>
  );
};

export default TeamsSection;