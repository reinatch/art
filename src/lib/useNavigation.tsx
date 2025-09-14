"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  toggleNav: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <NavigationContext.Provider value={{ isNavOpen, setIsNavOpen, toggleNav }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
