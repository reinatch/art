"use client";

import React from 'react';
import Image from 'next/image';
import RandomVideoPosition from '@/components/RandomVideoPosition';

interface NoEntulhoSectionProps {
  tabContent: {
    heading?: string;
    description?: string;
    content?: string;
  };
}

const NoEntulhoSection: React.FC<NoEntulhoSectionProps> = ({ tabContent }) => {
  return (
    <div className="relative w-full gap-10 flex flex-col md:flex-row h-[80vh] py-4 md:py-0 mt-28 md:mt-0">
      <RandomVideoPosition
        src="/videos/luva/1/a.webm"
        poster="/images/residencias/5.png"
      />
      <RandomVideoPosition
        src="/videos/luva/1/b.webm"
        poster="/images/residencias/13.png"
      />
      <RandomVideoPosition
        src="/videos/luva/1/c.webm"
        poster="/images/residencias/14.png"
      />
      <RandomVideoPosition
        src="/videos/luva/1/d.webm"
        poster="/images/residencias/8.png"
      />
      
      <div className="flex flex-col justify-start w-full gap-10 md:w-1/2">
        {tabContent.heading && (
          <div
            className="gap-10 text-destaque"
            dangerouslySetInnerHTML={{ __html: tabContent.heading }}
          />
        )}
      </div>
      
      <div className="flex flex-col justify-start w-full gap-4 md:w-1/2 md:gap-16">
        {tabContent.description && (
          <div
            className="gap-10 text-corpo-a"
            dangerouslySetInnerHTML={{ __html: tabContent.description }}
          />
        )}
        
        <Image
          src="/images/entulho.png"
          alt="Logo"
          width={100}
          height={100}
          className="pb-4"
          loading="lazy"
        />
        
        {tabContent.content && (
          <div
            className="w-3/4 gap-10 font-mono leading-tight rodapeLink text-rodape"
            dangerouslySetInnerHTML={{ __html: tabContent.content }}
          />
        )}
      </div>
    </div>
  );
};

export default NoEntulhoSection;