"use client";
import ContactInfo from "./ContactInfo";
import SocialMedia from "./SocialMedia";
import EntulhoSection from "./EntulhoSection";

interface SitemapContentProps {
  socialMedia: {
    instagram: string;
    vimeo: string;
    linkedin: string;
    youtube: string;
  };
}

const SitemapContent: React.FC<SitemapContentProps> = ({ socialMedia }) => {
  return (
    <div className="flex flex-row md:flex-row w-full md:w-1/2 gap-2">
      <ContactInfo />
      <div className="flex flex-col justify-between gap-2 md:gap-10">
        <SocialMedia socialMedia={socialMedia} />
        <EntulhoSection />
      </div>
    </div>
  );
};

export default SitemapContent;
