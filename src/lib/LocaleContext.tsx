"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
const LocaleContext = createContext<
  { locale: "en" | "pt"; setLocale: (locale: "en" | "pt") => void } | undefined
>(undefined);
export const LocaleProvider = ({
  initialLocale,
  children,
}: {
  initialLocale: "en" | "pt";
  children: ReactNode;
}) => {
  const [locale, setLocale] = useState(initialLocale);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
