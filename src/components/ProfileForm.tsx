"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const { t } = useLanguage();
  const router = useRouter();

  const [fullName, setFullName] = useState(profile.full_name);
  const [bio, setBio] = useState(profile.bio);
  const [skills, setSkills] = useState(profile.skills.join(", "));
  const [location, setLocation] = useState(profile.location);
  const [phone, setPhone] = useState(profile.phone);
  const [organization, setOrganization] = useState(profile.organization);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        location,
        phone,
        organization,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (!error) {
      setSavedMessage(t("saved"));
      router.refresh();
    }
  };

  const requestVerification = async () => {
    const supabase = createClient();
    await supabase.from("profiles").update({ poster_status: "pending" }).eq("id", profile.id);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <form onSubmit={saveProfile} className="space-y-3 rounded-xl bg-white p-6">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t("fullName")}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <input
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder={t("organization")}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("phone")}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t("location")}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("bio")}
          rows={3}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder={t("skills")}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-salone-green px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {t("save")}
        </button>
        {savedMessage && <p className="text-sm text-salone-green-dark">{savedMessage}</p>}
      </form>

      <div className="rounded-xl bg-white p-6 text-sm">
        {profile.poster_status === "verified" && (
          <>
            <p className="text-salone-green-dark">{t("posterVerified")}</p>
            <Link href="/opportunities/new" className="mt-2 inline-block font-semibold text-salone-blue underline">
              {t("postOpportunity")}
            </Link>
          </>
        )}
        {profile.poster_status === "pending" && <p>{t("posterPending")}</p>}
        {profile.poster_status === "rejected" && <p className="text-red-600">{t("posterRejected")}</p>}
        {profile.poster_status === "none" && (
          <>
            <p className="mb-3 text-salone-ink/70">{t("verifiedPostersOnly")}</p>
            <button
              type="button"
              onClick={requestVerification}
              className="rounded-lg border border-salone-blue px-4 py-2 font-semibold text-salone-blue hover:bg-salone-blue hover:text-white"
            >
              {t("requestVerification")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
