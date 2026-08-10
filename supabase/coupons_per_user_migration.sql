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
returns boolean language plpgsql security definer as $$
declare
  v_usage_limit int;
  v_per_user_limit int;
  v_used_count int;
  v_user_usage_count int;
begin
  -- Lock the row and read limits
  select usage_limit, per_user_limit, used_count
    into v_usage_limit, v_per_user_limit, v_used_count
    from public.coupons
    where id = p_coupon_id for update;

  if not found then
    return false;
  end if;

  -- Check global limit
  if v_usage_limit is not null and v_used_count >= v_usage_limit then
    return false;
  end if;

  -- Check per-user limit
  if v_per_user_limit is not null then
    select usage_count into v_user_usage_count
      from public.coupon_usages
      where coupon_id = p_coupon_id and user_id = p_user_id for update;
      
    if found and v_user_usage_count >= v_per_user_limit then
      return false;
    end if;
  end if;

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

  return true;
end;
$$;

-- 6. RPC: decrement per-user usage (for rollback)
create or replace function public.decrement_coupon_usage_for_user(
  p_coupon_id uuid,
  p_user_id   uuid
)
returns void language plpgsql security definer as $$
begin
  -- Lock the row to match the locking discipline
  perform id from public.coupons where id = p_coupon_id for update;
  perform id from public.coupon_usages where coupon_id = p_coupon_id and user_id = p_user_id for update;

  -- Decrement global used_count safely
  update public.coupons
    set used_count = greatest(used_count - 1, 0)
    where id = p_coupon_id;

  -- Decrement per-user usage safely
  update public.coupon_usages
    set usage_count = greatest(usage_count - 1, 0),
        updated_at = now()
    where coupon_id = p_coupon_id and user_id = p_user_id;
end;
$$;
