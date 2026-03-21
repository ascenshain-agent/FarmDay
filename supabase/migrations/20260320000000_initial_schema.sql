-- Migration: initial_schema
-- Creates users and locations tables for Farm Day

create table if not exists public.users (
  id    uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role  text not null default 'visitor' check (role in ('visitor', 'admin'))
);

create table if not exists public.locations (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  description        text,
  address            text,
  latitude           numeric(9,6),
  longitude          numeric(9,6),
  activities         jsonb default '[]',
  hours_of_operation jsonb default '{}',
  contact_info       jsonb default '{}',
  created_by         uuid references public.users(id) on delete set null,
  status             text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at         timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.users    enable row level security;
alter table public.locations enable row level security;

-- Users: only the owner can read/update their own row
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

-- Locations: anyone can read approved locations
create policy "locations_select_approved" on public.locations
  for select using (status = 'approved');

-- Authenticated users can insert (status defaults to 'pending')
create policy "locations_insert_auth" on public.locations
  for insert with check (auth.uid() is not null);

-- Owner or admin can update
create policy "locations_update_owner_or_admin" on public.locations
  for update using (
    auth.uid() = created_by
    or exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );
