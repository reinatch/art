"use client";
import Link from "next/link";

const ContactInfo: React.FC = () => {
  return (
    <div className="text-rodape w-1/2 flex flex-col gap-2 md:gap-10 font-mono leading-tight md:leading-relaxed">
      <div>
        <p>440 Rua Manuel Dias,</p>
        <p>4495-129 Póvoa de Varzim,</p>
        <p>Portugal</p>
      </div>
      <div>
        <Link
          href="mailto:info@artworks.pt"
          target="_blank"
          rel="noopener noreferrer"
        >
          info@artworks.pt
        </Link>
        <p>+351 252 023 590</p>
      </div>
    </div>
  );
};

export default ContactInfo;
