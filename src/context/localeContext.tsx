import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, defaultLocale } from '@/i18n/config';

interface LocaleContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
