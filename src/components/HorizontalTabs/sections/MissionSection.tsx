"use client";

import React from 'react';

interface MissionSectionProps {
  tabContent: {
    description?: string;
    content?: string;
  };
}

const MissionSection: React.FC<MissionSectionProps> = ({ tabContent }) => {
  return (
    <div className="relative w-full gap-10 flex flex-col md:flex-row md:h-[80vh] py-4 mt-[10vh] md:mt-0">
      {tabContent.description && (
        <div
          className="w-full gap-10 text-destaque md:w-1/2"
          dangerouslySetInnerHTML={{ __html: tabContent.description }}
        />
      )}
      
      {tabContent.content && (
        <div
          className="text-corpo-b leading-[1.12] font-intl flex flex-col items-end gap-10 max-h-full w-full md:w-1/2"
          dangerouslySetInnerHTML={{ __html: tabContent.content }}
        />
      )}
    </div>
  );
};

export default MissionSection;