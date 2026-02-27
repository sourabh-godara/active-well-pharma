-- ============================================================
-- Address Management Migration
-- Run in Supabase SQL Editor
-- ============================================================

create table if not exists public.addresses (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,

  -- Form fields
  name         text not null,
  phone        text not null,
  pincode      text not null,
  locality     text not null,
  address_line text not null,
  city         text not null,
  state        text not null,
  landmark     text,
  alt_phone    text,
  address_type text not null default 'Home' check (address_type in ('Home', 'Work')),

  -- Meta
  is_default   boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_addresses_user_id on public.addresses(user_id);

-- RLS
alter table public.addresses enable row level security;

create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- Auto updated_at
create trigger addresses_updated_at
  before update on public.addresses
  for each row execute function public.update_updated_at_column();

-- Also add delivery_address_id to orders table (optional reference)
alter table public.orders
  add column if not exists delivery_address_id uuid references public.addresses(id) on delete set null;
