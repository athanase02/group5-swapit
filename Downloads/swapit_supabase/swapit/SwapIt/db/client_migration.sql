-- Migration to align DB with client-side expectations
-- Adds convenience columns and an orders table used by the frontend

-- Add profile columns used by client
alter table if exists profiles
  add column if not exists full_name text;

alter table if exists profiles
  add column if not exists email text;

-- Add convenience columns to items so client code can use simple names
alter table if exists items
  add column if not exists category text;

alter table if exists items
  add column if not exists price numeric;

alter table if exists items
  add column if not exists location text;

-- Create orders table used by client checkout
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  items jsonb not null,
  pickup_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS and add simple policies for orders so authenticated users can insert/select
alter table if exists orders enable row level security;

create policy if not exists "insert orders (auth)" on orders
  for insert with check (auth.uid() = user_id);

create policy if not exists "select own orders" on orders
  for select using (auth.uid() = user_id);

-- Note: If you use RLS extensively, review and adjust policies for your security model.
