"use client";

import React from 'react';
import Jornais from '../Jornais';
import { ImageMedia } from "@/utils/types";

interface JornaisType {
  capa: ImageMedia;
  contra: ImageMedia;
  link: {
    target: string;
    title: string;
    url: string;
  };
}

interface JornaisSectionProps {
  tabContent: {
    jornais?: JornaisType[];
  };
}

const JornaisSection: React.FC<JornaisSectionProps> = ({ tabContent }) => {
  const jornaisArray: JornaisType[] | undefined = tabContent.jornais;
  
  return (
    <div className="relative w-full text-4xl md:px-60 flex flex-col gap-10 mt-[20vh] md:mt-0">
      <Jornais jornaisData={jornaisArray} cardWidth={500} />
    </div>
  );
};

export default JornaisSection;