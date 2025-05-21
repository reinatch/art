"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/config";
import { Link as TransitionLink } from "next-transition-router";
import { usePathname, useRouter } from "next/navigation";
import { setUserLocale } from "@/services/locale";
export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale();
  const [currentLocale, setCurrentLocale] = useState<Locale>(activeLocale as Locale);

  // const handleClick = async (locale: Locale) => {
  //   const res = await fetch("/api/locale", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ locale }),
  //   });
  //   if (res.ok) {
  //     setCurrentLocale(locale);
  //     router.refresh();
  //   } else {
  //     const data = await res.json();
  //     console.error("Error updating locale:", data.error);
  //   }
  // };
  useEffect(() => {
    console.log(currentLocale)
  }, [currentLocale])

  
  const handleClick = async (locale: Locale) => {
    await setUserLocale(locale);
    setCurrentLocale(locale); // Update the local state
    console.log(locale)
    // window.location.reload(); // Reload the page to apply the new locale
    router.refresh();
  };
  return (
    <div className="flex gap-1 font-mono">
      <TransitionLink
        href={pathname}
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
      <TransitionLink
        href={pathname}
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