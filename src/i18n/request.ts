import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "@/services/locale";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {
      locale,
      messages: {}, // Fallback to an empty object
    };
  }
});