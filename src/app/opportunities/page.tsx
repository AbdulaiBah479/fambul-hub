import { createClient } from "@/lib/supabase/server";
import { getServerLocale, translate } from "@/lib/i18n/server";
import { OpportunityCard } from "@/components/OpportunityCard";
import type { Opportunity, OpportunityType } from "@/lib/types";

const TYPES: OpportunityType[] = ["job", "internship", "scholarship", "grant"];

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { type?: string; q?: string };
}) {
  const locale = getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const supabase = createClient();

  let query = supabase
    .from("opportunities")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (searchParams.type && TYPES.includes(searchParams.type as OpportunityType)) {
    query = query.eq("type", searchParams.type);
  }
  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,organization.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`
    );
  }

  const { data } = await query;
  const opportunities = (data ?? []) as Opportunity[];

  return (
    <div className="space-y-6">
      <form method="get" className="flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder={t("searchPlaceholder")}
          className="min-w-[200px] flex-1 rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <select
          name="type"
          defaultValue={searchParams.type ?? ""}
          className="rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        >
          <option value="">{t("allTypes")}</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {t(type)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-salone-green px-4 py-2 text-sm font-semibold text-white"
        >
          {t("searchPlaceholder").replace("...", "")}
        </button>
      </form>

      {opportunities.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-salone-ink/60">
          {t("noResults")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
