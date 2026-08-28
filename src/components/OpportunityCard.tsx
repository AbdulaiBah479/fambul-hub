import Link from "next/link";
import type { Opportunity } from "@/lib/types";
import type { Locale } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/server";

const TYPE_EMOJI: Record<Opportunity["type"], string> = {
  job: "💼",
  internship: "🧑‍💻",
  scholarship: "🎓",
  grant: "🌱",
};

export function OpportunityCard({
  opportunity,
  locale,
}: {
  opportunity: Opportunity;
  locale: Locale;
}) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className="block rounded-xl border border-salone-green/20 bg-white p-4 hover:border-salone-green"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-salone-blue">
            {TYPE_EMOJI[opportunity.type]} {t(opportunity.type)}
          </span>
          <h3 className="mt-1 font-bold text-salone-ink">{opportunity.title}</h3>
          <p className="text-sm text-salone-ink/70">{opportunity.organization}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-salone-ink/60">
        <span>📍 {opportunity.location}</span>
        <span>
          🗓 {t("deadline")}: {opportunity.deadline ?? t("noDeadline")}
        </span>
      </div>
    </Link>
  );
}
