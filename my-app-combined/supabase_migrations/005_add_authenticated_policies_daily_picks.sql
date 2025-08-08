-- Add policies for authenticated role on daily_picks
-- This complements existing anon policies so both unauthenticated and authenticated clients can use the shared cache.

drop policy if exists "Allow authenticated select on daily_picks" on public.daily_picks;
create policy "Allow authenticated select on daily_picks" on public.daily_picks
  for select
  to authenticated
  using (true);

drop policy if exists "Allow authenticated insert on daily_picks" on public.daily_picks;
create policy "Allow authenticated insert on daily_picks" on public.daily_picks
  for insert
  to authenticated
  with check (true);

drop policy if exists "Allow authenticated update on daily_picks" on public.daily_picks;
create policy "Allow authenticated update on daily_picks" on public.daily_picks
  for update
  to authenticated
  using (true)
  with check (true); 