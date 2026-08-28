"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import type { Opportunity, Profile } from "@/lib/types";

export function AdminPanel({
  pendingPosters,
  pendingListings,
}: {
  pendingPosters: Profile[];
  pendingListings: Opportunity[];
}) {
  const { t } = useLanguage();
  const router = useRouter();

  const setPosterStatus = async (id: string, poster_status: "verified" | "rejected") => {
    const supabase = createClient();
    await supabase.from("profiles").update({ poster_status }).eq("id", id);
    router.refresh();
  };

  const setListingStatus = async (id: string, status: "approved" | "rejected") => {
    const supabase = createClient();
    await supabase.from("opportunities").update({ status }).eq("id", id);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 font-bold">{t("pendingPosters")}</h2>
        {pendingPosters.length === 0 ? (
          <p className="text-sm text-salone-ink/60">{t("noPending")}</p>
        ) : (
          <ul className="space-y-2">
            {pendingPosters.map((profile) => (
              <li
                key={profile.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 text-sm"
              >
                <div>
                  <p className="font-semibold">{profile.full_name || profile.id}</p>
                  <p className="text-salone-ink/60">
                    {profile.organization} · {profile.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPosterStatus(profile.id, "verified")}
                    className="rounded-lg bg-salone-green px-3 py-1 text-white"
                  >
                    {t("approve")}
                  </button>
                  <button
                    onClick={() => setPosterStatus(profile.id, "rejected")}
                    className="rounded-lg border border-red-500 px-3 py-1 text-red-600"
                  >
                    {t("reject")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">{t("pendingListings")}</h2>
        {pendingListings.length === 0 ? (
          <p className="text-sm text-salone-ink/60">{t("noPending")}</p>
        ) : (
          <ul className="space-y-2">
            {pendingListings.map((opportunity) => (
              <li key={opportunity.id} className="rounded-lg bg-white p-3 text-sm">
                <p className="font-semibold">{opportunity.title}</p>
                <p className="text-salone-ink/60">
                  {opportunity.organization} · {opportunity.type}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-salone-ink/80">
                  {opportunity.description}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setListingStatus(opportunity.id, "approved")}
                    className="rounded-lg bg-salone-green px-3 py-1 text-white"
                  >
                    {t("approve")}
                  </button>
                  <button
                    onClick={() => setListingStatus(opportunity.id, "rejected")}
                    className="rounded-lg border border-red-500 px-3 py-1 text-red-600"
                  >
                    {t("reject")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
