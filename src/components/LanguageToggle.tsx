"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex rounded-full border border-salone-green/30 bg-white text-xs font-medium">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1 ${
          locale === "en" ? "bg-salone-green text-white" : "text-salone-ink"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("kri")}
        className={`rounded-full px-3 py-1 ${
          locale === "kri" ? "bg-salone-green text-white" : "text-salone-ink"
        }`}
        aria-pressed={locale === "kri"}
      >
        Krio
      </button>
    </div>
  );
}
