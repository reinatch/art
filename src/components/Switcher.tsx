'use client';

// import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// import { Locale, routing, useRouter } from "@/i18n/routing";
import TransitionLink from './TransitionLink';
import { useLocale } from 'next-intl';
import {setUserLocale} from '@/services/locale';
import {Locale} from '@/i18n/config';

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale();
// alert(activeLocale)
  // const getRedirectedPath = (locale: Locale) => {
  //   const segments = pathname.split('/');
  //   segments[1] = locale;

  //   return segments.join('/');
  // };
  const handleClick = async (locale: Locale) => {
    await setUserLocale(locale);
    router.refresh();
  };
  return (
      <div className="flex gap-1 font-mono">

          <div key={"pt"}>
            <TransitionLink href={pathname}>
      

                <button className={`${activeLocale === "pt" ? "underline underline-offset-4 md:underline-offset-8 decoration-1" : ""}`} onClick={() => handleClick("pt")}>
                PT
              </button>
            </TransitionLink>
          </div>
          \ 
          <div key={"en"}>
            <TransitionLink href={pathname}>
              <button className={`${activeLocale === "en" ? "underline underline-offset-4 md:underline-offset-8 decoration-1" : ""}`} onClick={() => handleClick("en")}>
                EN
              </button>
            </TransitionLink>
          </div>
        {/* {routing.locales.map((locale, index) => (
        ))} */}
      </div>
  );
}