"use client";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/lib/useNavigation";
export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const { setIsNavOpen } = useNavigation(); 
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
    }, 4000);
    setTimeoutId(id);
  };
  useEffect(() => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 3000);
    setTimeoutId(id);
    return () => {
      if (id) clearTimeout(id);
    };
  }, []);
  useEffect(() => {
    setIsOpen(false);
    setIsNavOpen(false); 
  }, [pathname, setIsNavOpen]);
  return (
    <header
      id="header"
      className={`fixed flex justify-center w-screen mx-auto h-[10vh] items-center z-[55] ${
        isHomePage ? "mix-blend-difference md:mix-blend-normal" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
