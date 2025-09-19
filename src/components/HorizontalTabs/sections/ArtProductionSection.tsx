"use client";

import React from 'react';

interface ArtProductionSectionProps {
  tabContent: {
    heading?: string;
    description?: string;
    content?: string;
  };
}

const ArtProductionSection: React.FC<ArtProductionSectionProps> = ({ tabContent }) => {
  return (
    <div
      className="relative w-full gap-10 h-[70vh] md:h-[76vh] py-4 columns-1 md:columns-2"
      style={{ columnFill: "auto" }}
    >
      <div className="flex flex-col justify-between w-full gap-10">
        {tabContent.heading && (
          <div
            className="gap-10 text-destaque"
            dangerouslySetInnerHTML={{ __html: tabContent.heading }}
          />
        )}
        
        {tabContent.description && (
          <div
            className="gap-10 text-corpo-a"
            dangerouslySetInnerHTML={{ __html: tabContent.description }}
          />
        )}
        
        {tabContent.content && (
          <div
            className="gap-10 text-corpo-a"
            dangerouslySetInnerHTML={{ __html: tabContent.content }}
          />
        )}
      </div>
    </div>
  );
};

export default ArtProductionSection;