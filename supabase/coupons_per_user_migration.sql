-- ============================================================
-- Coupon System Extension: Per-User Limits
-- Run AFTER coupons_migration.sql
-- ============================================================

-- 1. Add per_user_limit column to coupons
alter table public.coupons
  add column if not exists per_user_limit integer;

-- 2. Create coupon_usages table (per-user tracking)
create table if not exists public.coupon_usages (
  id           uuid primary key default gen_random_uuid(),
  coupon_id    uuid not null references public.coupons(id) on delete cascade,
  user_id      uuid not null,
  usage_count  integer default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (coupon_id, user_id)
);

create index if not exists idx_coupon_usages_coupon_user
  on public.coupon_usages(coupon_id, user_id);

-- 3. RLS on coupon_usages
alter table public.coupon_usages enable row level security;
-- All access via service role / admin client only

-- 4. Trigger: auto updated_at on coupon_usages
create trigger coupon_usages_updated_at
  before update on public.coupon_usages
  for each row execute function public.update_updated_at_column();

-- 5. RPC: increment per-user usage (upsert pattern, atomic)
create or replace function public.increment_coupon_usage_for_user(
  p_coupon_id uuid,
  p_user_id   uuid
)
returns void language plpgsql security definer as $$
begin
  -- Increment global used_count
  update public.coupons
    set used_count = used_count + 1
    where id = p_coupon_id;

  -- Upsert per-user usage row
  insert into public.coupon_usages (coupon_id, user_id, usage_count)
    values (p_coupon_id, p_user_id, 1)
    on conflict (coupon_id, user_id)
    do update set
      usage_count = public.coupon_usages.usage_count + 1,
      updated_at  = now();
end;
$$;
