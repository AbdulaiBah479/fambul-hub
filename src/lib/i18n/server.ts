import { cookies } from "next/headers";
import { translations, type Locale, type TranslationKey } from "./translations";
import { LOCALE_COOKIE } from "./constants";

export function getServerLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value === "kri" ? "kri" : "en";
}

export function translate(locale: Locale, key: TranslationKey): string {
  return translations[locale][key];
}
