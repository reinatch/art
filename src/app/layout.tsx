// app/layout.tsx

import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Template from "@/components/transitionTemplate";
import { TabsProvider } from "@/lib/TabsContext";
import Sitemap from "@/components/Sitemap";
import { ToggleContactProvider } from "@/lib/useToggleContact";
import { ToggleSearchProvider } from "@/lib/useToggleSearch";
import { ThumbnailsProvider } from "@/lib/useThumbnailsContext";
import CustomCursor from '@/components/CustomCursor';
import { CursorContextProvider } from "@/lib/CustomCursorContext";
import { DataFetchProvider } from "@/lib/DataFetchContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import {getLocale} from 'next-intl/server';
import { LocaleProvider } from '@/lib/LocaleContext'; // Import the provider

const suisse_mono = localFont({
  src: "./fonts/SuisseIntlMono-Regular.ttf",
  variable: "--suisse_mono",
  weight: "100 900",
  display: "swap",
});
const suisse_intl = localFont({
  src: "./fonts/SuisseIntl-Regular.otf",
  variable: "--suisse_intl",
  weight: "100 900",
  display: "swap",
});
const suisse_works = localFont({
  src: "./fonts/SuisseWorks-Regular.otf",
  variable: "--suisse_works",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARTWORKS",
  description: "art works",
};

export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as "en" | "pt";
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="snap-y snap-proximity " suppressHydrationWarning>
      <body
        className={`${suisse_mono.variable} ${suisse_intl.variable} ${suisse_works.variable} !cursor-none overflow-x-hidden font-intl`}
      >
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>
            <DataFetchProvider>
              <CursorContextProvider>
                <ToggleSearchProvider>
                <ToggleContactProvider>
                  <TabsProvider>
                    <ThumbnailsProvider>
                      <CustomCursor />
                      <Template>
                        <Header />
                        {children}
                        <Footer />
                      </Template>
                      <Sitemap />
                    </ThumbnailsProvider>
                  </TabsProvider>
                </ToggleContactProvider>
                </ToggleSearchProvider>
              </CursorContextProvider>
            </DataFetchProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
