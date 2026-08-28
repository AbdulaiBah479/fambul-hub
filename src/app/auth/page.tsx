"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const { error: authError } =
      mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">{mode === "signIn" ? t("signIn") : t("createAccount")}</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-salone-green/30 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-salone-green px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {mode === "signIn" ? t("signIn") : t("createAccount")}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
        className="mt-4 text-sm text-salone-blue underline"
      >
        {mode === "signIn" ? t("needAccount") : t("alreadyHaveAccount")}
      </button>
    </div>
  );
}
