-- ============================================================
-- Coupon Code System Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create coupons table
create table public.coupons (
  id uuid primary key default gen_random_uuid(),

  code text unique not null,

  discount_type text not null check (
    discount_type in ('percentage', 'fixed')
  ),

  discount_value numeric(10,2) not null,

  min_order_amount numeric(10,2) default 0,

  max_discount_amount numeric(10,2),

  usage_limit integer,
  used_count integer default 0,

  starts_at timestamptz,
  expires_at timestamptz,

  is_active boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Index for fast code lookups
create index idx_coupons_code on coupons(code);

-- 3. Add coupon_id to orders table (nullable — not every order uses a coupon)
alter table public.orders
  add column if not exists coupon_id uuid references public.coupons(id) on delete set null,
  add column if not exists discount_amount numeric(10,2) default 0;

-- 4. RLS: admins can manage, everyone can read active coupons (needed for validation via service role)
alter table public.coupons enable row level security;

-- Allow service-role (server actions) full access — handled via admin client
-- Public: no direct reads (all validation goes through server actions)

-- 5. Trigger: auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger coupons_updated_at
  before update on public.coupons
  for each row execute function public.update_updated_at_column();

-- 6. RPC: safely increment used_count after order placement
create or replace function public.increment_coupon_usage(coupon_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.coupons
  set used_count = used_count + 1
  where id = coupon_id;
end;
$$;


-- ============================================================
-- Sample coupons to test with
-- ============================================================
insert into public.coupons (code, discount_type, discount_value, min_order_amount, usage_limit, is_active)
values
  ('WELCOME10', 'percentage', 10, 500, 100, true),
  ('FLAT200',   'fixed',      200, 1000, 50, true),
  ('SAVE15',    'percentage', 15, 2000, NULL, true);
