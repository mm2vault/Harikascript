-- HarikaScript shared catalog + profiles
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('script','game','product','community_frame')),
  item_id text not null,
  payload jsonb not null,
  is_deleted boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(item_type, item_id)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  tag text,
  avatar_url text,
  coins integer not null default 0,
  is_premium boolean not null default false,
  role text not null default 'user' check (role in ('user','admin')),
  owned_product_ids jsonb not null default '[]'::jsonb,
  unlocked_script_ids jsonb not null default '[]'::jsonb,
  equipped_frame_id text,
  equipped_avatar_id text,
  equipped_effect_id text,
  equipped_badge_id text,
  completed_tasks jsonb not null default '[]'::jsonb,
  claimed_daily_streak integer not null default 0,
  last_daily_claim text,
  updated_at timestamptz not null default now()
);

alter table public.catalog_items enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "catalog public read" on public.catalog_items;
create policy "catalog public read" on public.catalog_items for select using (true);

drop policy if exists "catalog admin write" on public.catalog_items;
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "catalog admin write" on public.catalog_items for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "profile own read" on public.profiles;
create policy "profile own read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profile own update" on public.profiles;
create policy "profile own update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profile own insert" on public.profiles;
create policy "profile own insert" on public.profiles for insert to authenticated with check (id = auth.uid());

-- After your Google/email account signs in, promote the intended admin:
-- update public.profiles set role='admin' where id = 'YOUR_AUTH_USER_UUID';
