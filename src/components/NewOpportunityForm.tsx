"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import type { OpportunityType } from "@/lib/types";

const TYPES: OpportunityType[] = ["job", "internship", "scholarship", "grant"];

export function NewOpportunityForm({ posterId }: { posterId: string }) {
  const { t } = useLanguage();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<OpportunityType>("job");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applyInfo, setApplyInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("opportunities").insert({
      poster_id: posterId,
      title,
      type,
      organization,
      description,
      location: location || "Remote / Nationwide",
      deadline: deadline || null,
      apply_info: applyInfo,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-3 rounded-xl bg-white p-6">
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("title")}
        className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as OpportunityType)}
        className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
      >
        {TYPES.map((t2) => (
          <option key={t2} value={t2}>
            {t(t2)}
          </option>
        ))}
      </select>
      <input
        required
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        placeholder={t("organization")}
        className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
      />
      <textarea
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("description")}
        rows={4}
        className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder={t("location")}
        className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
      />
      <label className="block text-sm text-salone-ink/70">
        {t("deadline")}
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="mt-1 w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
      </label>
      <textarea
        required
        value={applyInfo}
        onChange={(e) => setApplyInfo(e.target.value)}
        placeholder={t("applyInfo")}
        rows={2}
        className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-salone-green px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {t("submit")}
      </button>
    </form>
  );
}
