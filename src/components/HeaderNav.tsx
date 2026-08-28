"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import { LanguageToggle } from "./LanguageToggle";

interface HeaderNavProps {
  isSignedIn: boolean;
  isAdmin: boolean;
}

export function HeaderNav({ isSignedIn, isAdmin }: HeaderNavProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-salone-green/15 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-salone-green-dark">
          <span
            aria-hidden
            className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-salone-green via-white to-salone-blue"
          />
          {t("appName")}
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/opportunities" className="hover:text-salone-green-dark">
            {t("browseOpportunities")}
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/profile" className="hover:text-salone-green-dark">
                {t("myProfile")}
              </Link>
              {isAdmin && (
                <Link href="/admin" className="hover:text-salone-green-dark">
                  {t("admin")}
                </Link>
              )}
              <button type="button" onClick={signOut} className="hover:text-salone-green-dark">
                {t("signOut")}
              </button>
            </>
          ) : (
            <Link href="/auth" className="hover:text-salone-green-dark">
              {t("signIn")}
            </Link>
          )}
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
