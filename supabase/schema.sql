-- Fambul Hub database schema.
-- Run this once in your Supabase project's SQL editor (Project -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per user, created automatically when they sign up.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  bio text not null default '',
  skills text[] not null default '{}',
  location text not null default '',
  phone text not null default '',
  organization text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  poster_status text not null default 'none'
    check (poster_status in ('none', 'pending', 'verified', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can view profiles (it's a portfolio, meant to be shown to employers).
create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Users can only ever update their own row.
create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever someone signs up via Supabase Auth.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Prevent users from granting themselves admin or verified-poster status.
-- Only an existing admin may change `role` or `poster_status` on someone
-- else's row (the app's /admin approval screen runs as that admin).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.poster_status is distinct from old.poster_status)
     and not public.is_admin(auth.uid()) then
    new.role := old.role;
    new.poster_status := old.poster_status;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_privileges_trigger on public.profiles;
create trigger guard_profile_privileges_trigger
  before update on public.profiles
  for each row execute procedure public.guard_profile_privileges();

-- ---------------------------------------------------------------------------
-- opportunities: jobs, internships, scholarships, grants.
-- ---------------------------------------------------------------------------
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  type text not null check (type in ('job', 'internship', 'scholarship', 'grant')),
  organization text not null,
  description text not null,
  location text not null default 'Remote / Nationwide',
  deadline date,
  apply_info text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.opportunities enable row level security;

create index if not exists opportunities_status_idx on public.opportunities (status);
create index if not exists opportunities_type_idx on public.opportunities (type);

-- Everyone can see approved listings; posters can also see their own
-- pending/rejected ones; admins can see everything.
create policy "approved opportunities are publicly readable"
  on public.opportunities for select
  using (
    status = 'approved'
    or poster_id = auth.uid()
    or public.is_admin(auth.uid())
  );

-- Only verified posters may create a listing, and only as themselves.
create policy "verified posters can create opportunities"
  on public.opportunities for insert
  with check (
    poster_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and poster_status = 'verified'
    )
  );

-- Posters can edit their own listing; admins can edit any (to approve/reject).
create policy "owners and admins can update opportunities"
  on public.opportunities for update
  using (poster_id = auth.uid() or public.is_admin(auth.uid()));

create policy "owners and admins can delete opportunities"
  on public.opportunities for delete
  using (poster_id = auth.uid() or public.is_admin(auth.uid()));

-- New listings always start pending, and editing your own listing sends it
-- back to pending review — only an admin can move status to approved.
create or replace function public.guard_opportunity_status()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.status := 'pending';
    return new;
  end if;

  if not public.is_admin(auth.uid()) then
    if new.status is distinct from old.status then
      new.status := old.status;
    end if;
    if new.title is distinct from old.title
       or new.description is distinct from old.description
       or new.apply_info is distinct from old.apply_info
       or new.deadline is distinct from old.deadline
       or new.location is distinct from old.location then
      new.status := 'pending';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists guard_opportunity_status_trigger on public.opportunities;
create trigger guard_opportunity_status_trigger
  before insert or update on public.opportunities
  for each row execute procedure public.guard_opportunity_status();

-- ---------------------------------------------------------------------------
-- First admin: after you sign up through the app once, run this manually
-- (replace the email) so you can approve posters and listings from /admin.
-- ---------------------------------------------------------------------------
-- update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
