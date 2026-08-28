import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { getServerLocale } from "@/lib/i18n/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fambul Hub — Opportunities & skills for Sierra Leonean youth",
  description:
    "Verified jobs, internships, scholarships, and grants for Sierra Leonean youth, plus a free profile to show your skills. Free to use, free to post, free to build.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1EB53A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getServerLocale();

  return (
    <html lang={locale === "kri" ? "kri" : "en"}>
      <body className="flex min-h-screen flex-col font-sans">
        <LanguageProvider initialLocale={locale}>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
