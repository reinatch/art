import { NextResponse } from "next/server";
import { setUserLocale } from "@/services/locale";
import { locales } from "@/i18n/config";

export async function POST(request: Request) {
  const { locale } = await request.json();
  if (!locales.includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  // Update the cookie with the new locale.
  await setUserLocale(locale);
  return NextResponse.json({ success: true });
}