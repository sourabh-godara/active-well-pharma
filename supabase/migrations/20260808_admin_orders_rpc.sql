-- Migration: Admin Orders Needs Attention RPC
-- Purpose: Safely fetches IDs of orders that need manual admin intervention without exposing payment_events to PostgREST auto-views.

CREATE OR REPLACE FUNCTION public.get_needs_attention_order_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER -- Bypasses RLS so it can query payment_events internally
AS $$
  SELECT DISTINCT o.id
  FROM public.orders o
  LEFT JOIN public.payment_events pe ON o.id = pe.order_id
  WHERE 
    -- Condition 1: Failed or anomalous events exist
    pe.event_type IN (
      'stock.oversold',
      'stock.deduction_error',
      'checkout.signature_mismatch',
      'checkout.confirmation_error',
      'webhook.signature_invalid'
    )
    OR
    -- Condition 2: Order is stuck in 'created' state for more than 30 minutes
    (o.status = 'created' AND o.created_at < (now() - interval '30 minutes'));
$$;

-- Ensure it's not executable by public/anon by default
REVOKE EXECUTE ON FUNCTION public.get_needs_attention_order_ids() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_needs_attention_order_ids() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_needs_attention_order_ids() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_needs_attention_order_ids() TO service_role;
