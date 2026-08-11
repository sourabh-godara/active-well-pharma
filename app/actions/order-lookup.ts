'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'

export async function lookupGuestOrder(orderId: string, email: string) {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') ?? 'unknown'
  const adminClient = createAdminClient()

  // Simple validation
  if (!orderId || !email) {
    await adminClient.from('payment_events').insert({
      event_type: 'security.order_lookup_failed',
      ip_address: ip,
      raw_payload: { reason: 'missing_fields', provided_order: orderId, provided_email: email }
    })
    return { error: 'Please provide both order ID and email.' }
  }

  // Try to match UUID exactly if it's 36 chars, else use `like` query for start
  let query = adminClient
    .from('orders')
    .select('id, guest_tracking_token')
    .eq('guest_email', email.trim().toLowerCase())
    .is('user_id', null) // only guest orders can be looked up this way
    
  if (orderId.length === 36) {
    query = query.eq('id', orderId.trim())
  } else {
    // If they provided the first segment 'xxxx', match 'xxxx-%'
    query = query.like('id', `${orderId.trim()}%`)
  }

  const { data: order, error } = await query.maybeSingle()

  if (error || !order) {
    await adminClient.from('payment_events').insert({
      event_type: 'security.order_lookup_failed',
      ip_address: ip,
      raw_payload: { reason: 'not_found', provided_order: orderId, provided_email: email }
    })
    return { error: 'No guest order found matching that ID and email combination.' }
  }

  if (!order.guest_tracking_token) {
    await adminClient.from('payment_events').insert({
      event_type: 'security.order_lookup_failed',
      ip_address: ip,
      order_id: order.id,
      raw_payload: { reason: 'no_tracking_token', provided_order: orderId, provided_email: email }
    })
    return { error: 'This order does not have a tracking link available.' }
  }

  // Success
  await adminClient.from('payment_events').insert({
    event_type: 'security.order_lookup_success',
    ip_address: ip,
    order_id: order.id,
    raw_payload: { provided_order: orderId, provided_email: email }
  })

  return { trackingToken: order.guest_tracking_token }
}
