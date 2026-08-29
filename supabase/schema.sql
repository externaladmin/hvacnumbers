-- Run this once in the Supabase SQL editor for the hvacnumbers project.

create extension if not exists "pgcrypto";

create table if not exists job_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  site_address text,
  supply_static numeric not null,
  return_static numeric not null,
  filter_drop numeric not null,
  coil_drop numeric not null,
  esp_result numeric not null,
  result_interpretation text not null
);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  source text,
  beehiiv_synced boolean not null default false
);

alter table job_records enable row level security;
alter table subscribers enable row level security;

-- The app writes to these tables using the anon key from a server-side
-- Next.js route handler (never directly from the browser), so inserts are
-- allowed for the anon role but reads are not exposed publicly.
create policy "Allow inserts from server" on job_records
  for insert to anon
  with check (true);

create policy "Allow upserts from server" on subscribers
  for insert to anon
  with check (true);

create policy "Allow updates from server" on subscribers
  for update to anon
  using (true)
  with check (true);
