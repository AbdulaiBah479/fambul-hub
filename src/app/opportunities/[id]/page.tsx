import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerLocale, translate } from "@/lib/i18n/server";
import type { Opportunity, Profile } from "@/lib/types";

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const locale = getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const supabase = createClient();

  const { data: opportunity } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", params.id)
    .single<Opportunity>();

  if (!opportunity) notFound();

  const { data: poster } = await supabase
    .from("profiles")
    .select("full_name, organization")
    .eq("id", opportunity.poster_id)
    .single<Pick<Profile, "full_name" | "organization">>();

  return (
    <article className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white p-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-salone-blue">
          {t(opportunity.type)}
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-salone-ink">{opportunity.title}</h1>
        <p className="text-salone-ink/70">{opportunity.organization}</p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-salone-ink/60">
        <span>📍 {opportunity.location}</span>
        <span>
          🗓 {t("deadline")}: {opportunity.deadline ?? t("noDeadline")}
        </span>
      </div>

      <div>
        <h2 className="font-semibold">{t("description")}</h2>
        <p className="mt-1 whitespace-pre-wrap text-salone-ink/90">{opportunity.description}</p>
      </div>

      <div>
        <h2 className="font-semibold">{t("howToApply")}</h2>
        <p className="mt-1 whitespace-pre-wrap text-salone-ink/90">{opportunity.apply_info}</p>
      </div>

      {poster && (
        <p className="text-xs text-salone-ink/50">
          {t("postedBy")}: {poster.organization || poster.full_name}
        </p>
      )}
    </article>
  );
}
