# Fambul Hub

**Real opportunities. Real skills. Free for every young Sierra Leonean.**

Fambul Hub is a free web platform for Sierra Leonean youth — secondary
students, university students, out-of-school youth, and unemployed
graduates. It solves one specific, painful problem: there's no single
trusted place to find real jobs, internships, scholarships, and grants,
and scam listings make the ones that circulate on social media risky to
trust. Fambul Hub adds a lightweight verification layer (organizations
and individuals must be approved before they can post) and gives every
user a free profile/portfolio page to show what they can actually do.

It is, and is meant to stay, **free to run, free to use, and free to build
on** — the code is open, and the whole stack runs on free tiers.

## How it's built, and why

- **Next.js (App Router) + TypeScript** — server-rendered by default, so
  pages are fast and light even on 2G/3G.
- **Tailwind CSS** — no separate design system to ship, small CSS output.
- **Supabase** (Postgres + Auth) — free tier, no server to run yourself.
- **Deploys to Vercel's free tier.**
- **No external fonts, no heavy images, no client-side framework beyond
  Next.js itself** — this was a deliberate choice: data is expensive in
  Sierra Leone, so pages stay small and mostly server-rendered. Filtering
  the opportunity board even works via a plain HTML form (no JavaScript
  required) so it degrades gracefully on very low-end phones/browsers.
- **English + Krio** language toggle, stored in a cookie so both the
  server-rendered and client-rendered parts of a page agree on language
  without a flash of the wrong text.
  > Note: the Krio translations in `src/lib/i18n/translations.ts` are a
  > best-effort starting point, not written by a native speaker — please
  > have a native Krio speaker review/correct them before a real launch.

## Trust & safety model

To fight scam listings without needing full-time moderation staff:

1. Anyone can create an account and browse/apply to opportunities for free.
2. To **post** an opportunity, a user must first request "verified poster"
   status from their profile page.
3. An **admin** manually approves or rejects that request (`/admin`).
4. Even once verified, every new or edited listing goes back to
   `pending` status and needs admin approval before it's publicly visible.
5. Row Level Security (RLS) policies in `supabase/schema.sql` enforce all
   of this at the database level — a user cannot grant themselves admin
   or verified-poster status, and cannot self-approve a listing, even by
   calling the API directly.

## Getting started (local development)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a free Supabase project** at https://supabase.com (the free
   tier is enough to run this).

3. **Run the schema.** In your Supabase project, open the SQL Editor and
   run the contents of `supabase/schema.sql`. This creates the
   `profiles` and `opportunities` tables, the security policies, and the
   trigger that auto-creates a profile when someone signs up.

4. **Copy the environment file** and fill in your project's values (find
   them under Project Settings → API):
   ```bash
   cp .env.example .env.local
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.

6. **Make yourself an admin.** Sign up once through the app, then in the
   Supabase SQL Editor run:
   ```sql
   update public.profiles set role = 'admin'
     where id = (select id from auth.users where email = 'you@example.com');
   ```
   You'll now see an "Admin" link in the header to approve poster
   requests and listings.

## Deploying for free

1. Push this repo to GitHub (already done if you're reading this there).
2. Create a free account at https://vercel.com and import the repo.
3. Add the two environment variables from `.env.example` in the Vercel
   project settings (Settings → Environment Variables).
4. Deploy. Vercel's free tier and Supabase's free tier are both enough to
   run Fambul Hub at a small-to-medium scale with no ongoing cost.

## Project structure

```
src/
  app/                 Pages (App Router)
    opportunities/     Browse, view, and post opportunities
    profile/           Edit profile, request verified-poster status
    admin/             Approve posters and listings
    auth/              Sign in / sign up
  components/          UI building blocks
  lib/
    supabase/          Browser + server Supabase clients
    i18n/               English/Krio translations + locale plumbing
    types.ts            Shared TypeScript types
supabase/
  schema.sql            Full database schema, RLS policies, triggers
```

## Roadmap ideas (not built yet)

- Skills/portfolio richer than the current bio + skill tags (e.g.
  uploaded work samples, endorsements).
- Free micro-courses or mentorship matching.
- Offline/PWA caching of the opportunity board for spotty connections.
- SMS/USSD front-end for feature phones, using the same Supabase backend.
- More local languages (Mende, Temne) alongside English and Krio.

## License

Open source — free for anyone to use, learn from, and build on. Add a
license file (e.g. MIT) that matches how open you want contributions
and reuse to be.
