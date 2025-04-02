"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/services/locale";
import { Locale } from "@/i18n/config";
import { Link as TransitionLink } from "next-transition-router";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const activeLocale = useLocale();
  const [currentLocale, setCurrentLocale] = useState<Locale>(activeLocale as Locale);

  const handleClick = async (locale: Locale) => {
    await setUserLocale(locale);
    setCurrentLocale(locale); // Update the local state
    window.location.reload(); // Reload the page to apply the new locale
  };

  return (
    <div className="flex gap-1 font-mono">
      <TransitionLink href={pathname}
        className={`${
          currentLocale === "pt"
            ? "underline underline-offset-4 md:underline-offset-8 decoration-1"
            : ""
        }`}
        onClick={() => handleClick("pt")}
      >
        PT
      </TransitionLink>
      \
      <TransitionLink href={pathname}
        className={`${
          currentLocale === "en"
            ? "underline underline-offset-4 md:underline-offset-8 decoration-1"
            : ""
        }`}
        onClick={() => handleClick("en")}
      >
        EN
        </TransitionLink>
    </div>
  );
}