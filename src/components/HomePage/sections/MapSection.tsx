import React from "react";
import Sitemap from "@/components/Sitemap";

const MapSection: React.FC = () => {
  return (
    <div id="mapa" className="pt-10 flex opacity-0 relative z-10 h-[80vh] md:h-[60vh] w-screen bg-white border-t-2 border-black">
      <Sitemap asSection />
    </div>
  );
};

export default MapSection;