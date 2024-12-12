// src/components/CustomCursorContext.tsx
"use client"
import { createContext, useState, useContext, ReactNode } from 'react';

interface CursorContextType {
  initialCursorVariant: string;
  setInitialCursorVariant: (variant: string) => void;
  animateCursorVariant: string;
  setAnimateCursorVariant: (variant: string) => void;
  animateCursor: (variant: string) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const useCursorContext = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursorContext must be used within a CursorContextProvider');
  }
  return context;
};

interface CursorContextProviderProps {
  children: ReactNode;
}

export const CursorContextProvider = ({ children }: CursorContextProviderProps) => {
  const [initialCursorVariant, setInitialCursorVariant] = useState('');
  const [animateCursorVariant, setAnimateCursorVariant] = useState('');

  const animateCursor = (variant: string) => {
    setInitialCursorVariant(animateCursorVariant);
    setAnimateCursorVariant(variant);
  };

  return (
    <CursorContext.Provider
      value={{
        initialCursorVariant,
        setInitialCursorVariant,
        animateCursorVariant,
        setAnimateCursorVariant,
        animateCursor,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};
