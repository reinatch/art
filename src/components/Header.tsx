"use client";

import Navbar from "./Navbar";
// import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const isHomePage = pathname === "/";

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 4000); // Delay of 500ms
    setTimeoutId(id);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 3000); // Initial delay of 3000ms
    setTimeoutId(id);
    return () => {
      if (id) clearTimeout(id);
    };
  }, []);

  return (
    <header
      id="header"
      className={`fixed flex justify-center w-screen mx-auto h-[10dvh] items-center z-[55] ${
        isHomePage ? "mix-blend-difference md:mix-blend-normal" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
