"use client";
import Link from "next/link";

interface SocialMediaProps {
  socialMedia: {
    instagram: string;
    vimeo: string;
    linkedin: string;
    youtube: string;
  };
}

const SocialMedia: React.FC<SocialMediaProps> = ({ socialMedia }) => {
  return (
    <div className="social-media flex flex-col w-full md:w-1/2 font-mono gap-2 text-rodape leading-relaxed">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={socialMedia.instagram}
      >
        Instagram
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={socialMedia.vimeo}
      >
        Vimeo
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={socialMedia.linkedin}
      >
        LinkedIn
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={socialMedia.youtube}
      >
        Youtube
      </Link>
    </div>
  );
};

export default SocialMedia;
