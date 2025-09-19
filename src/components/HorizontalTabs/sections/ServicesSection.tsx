"use client";

import React from 'react';
import Showcase from '../AcordionCards';
import { ImageMedia } from "@/utils/types";

interface Card {
  title: string;
  lista: string;
  capa: ImageMedia;
  thumbnail: ImageMedia;
}

interface ServicesSectionProps {
  tabContent: {
    services?: Card[];
  };
  sectionKey: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ tabContent, sectionKey }) => {
  const cardArray = tabContent.services;
  
  return (
    <div
      id="cards_wrapper"
      className="relative w-full text-4xl flex gap-10 mt-[20vh] md:mt-0"
    >
      <Showcase cardData={cardArray} sectionID={sectionKey} cardWidth={500} />
    </div>
  );
};

export default ServicesSection;