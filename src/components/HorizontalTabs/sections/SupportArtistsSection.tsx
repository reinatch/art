"use client";

import React from 'react';

interface SupportArtistsSectionProps {
  tabContent: {
    heading?: string;
    description?: string;
    content?: string;
    sub_content?: string;
  };
}

const SupportArtistsSection: React.FC<SupportArtistsSectionProps> = ({ tabContent }) => {
  return (
    <div className="relative w-full gap-10 flex flex-col md:flex-row h-screen md:h-[80vh] py-4">
      <div className="flex flex-col justify-start w-full gap-10 md:w-1/2">
        {tabContent.heading && (
          <div
            className="gap-10 text-corpo-a"
            dangerouslySetInnerHTML={{ __html: tabContent.heading }}
          />
        )}
        {tabContent.description && (
          <div
            className="gap-10 text-destaque"
            dangerouslySetInnerHTML={{ __html: tabContent.description }}
          />
        )}
      </div>
      
      <div className="flex flex-col justify-start w-full gap-10 md:w-1/2">
        {tabContent.content && (
          <div
            className="gap-16 text-corpo-a"
            dangerouslySetInnerHTML={{ __html: tabContent.content }}
          />
        )}
        {tabContent.sub_content && (
          <div
            className="w-3/4 gap-10 font-mono leading-tight text-rodape"
            dangerouslySetInnerHTML={{ __html: tabContent.sub_content }}
          />
        )}
      </div>
    </div>
  );
};

export default SupportArtistsSection;