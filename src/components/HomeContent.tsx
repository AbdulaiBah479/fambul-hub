"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function HomeContent() {
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold text-salone-green-dark sm:text-4xl">
          {t("appName")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg font-medium">{t("tagline")}</p>
        <p className="mx-auto mt-2 max-w-xl text-salone-ink/70">{t("heroSubtitle")}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/opportunities"
            className="rounded-lg bg-salone-green px-5 py-3 font-semibold text-white hover:bg-salone-green-dark"
          >
            {t("browseOpportunities")}
          </Link>
          <Link
            href="/profile"
            className="rounded-lg border border-salone-blue px-5 py-3 font-semibold text-salone-blue hover:bg-salone-blue hover:text-white"
          >
            {t("postOpportunity")}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { type: "job" as const, emoji: "💼" },
          { type: "scholarship" as const, emoji: "🎓" },
          { type: "grant" as const, emoji: "🌱" },
        ].map((item) => (
          <Link
            key={item.type}
            href={`/opportunities?type=${item.type}`}
            className="rounded-xl border border-salone-green/20 bg-white p-5 text-center hover:border-salone-green"
          >
            <div className="text-2xl" aria-hidden>
              {item.emoji}
            </div>
            <div className="mt-2 font-semibold">{t(item.type)}</div>
          </Link>
        ))}
      </section>

      <section className="rounded-xl bg-white p-5 text-sm text-salone-ink/80">
        {t("verifiedPostersOnly")}
      </section>
    </div>
  );
}
