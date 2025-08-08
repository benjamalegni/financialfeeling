-- Enable required extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- Create table for caching daily picks
create table if not exists public.daily_picks (
  id uuid primary key default gen_random_uuid(),
  pick_date date not null unique,
  symbols text[] not null,
  charts jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.daily_picks enable row level security;

-- Policies (adjust for production security)
drop policy if exists "Allow anon select on daily_picks" on public.daily_picks;
create policy "Allow anon select on daily_picks" on public.daily_picks
  for select
  to anon
  using (true);

drop policy if exists "Allow anon insert on daily_picks" on public.daily_picks;
create policy "Allow anon insert on daily_picks" on public.daily_picks
  for insert
  to anon
  with check (true);

drop policy if exists "Allow anon update on daily_picks" on public.daily_picks;
create policy "Allow anon update on daily_picks" on public.daily_picks
  for update
  to anon
  using (true)
  with check (true); 