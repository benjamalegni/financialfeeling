-- Create table to store AI analysis history per user
create table if not exists public.ai_analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  selected_assets text[] not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

-- Index for faster queries by user and recency
create index if not exists ai_analysis_history_user_created_idx
  on public.ai_analysis_history (user_id, created_at desc);

-- Enable RLS
alter table public.ai_analysis_history enable row level security;

-- Policies: authenticated users can manage only their own rows
drop policy if exists "ai_history_select_own" on public.ai_analysis_history;
create policy "ai_history_select_own" on public.ai_analysis_history
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "ai_history_insert_own" on public.ai_analysis_history;
create policy "ai_history_insert_own" on public.ai_analysis_history
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Updates are not required; but allow if needed
drop policy if exists "ai_history_update_own" on public.ai_analysis_history;
create policy "ai_history_update_own" on public.ai_analysis_history
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id); 