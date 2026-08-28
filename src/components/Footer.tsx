"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-salone-green/15 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-salone-ink/60">
        {t("footerNote")}
      </div>
    </footer>
  );
}
