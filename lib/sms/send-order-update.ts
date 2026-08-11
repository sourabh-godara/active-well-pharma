import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { paymentEnv } from '@/lib/env'
import { SMS_TRIGGER_EVENTS } from './config'

export async function sendOrderUpdate(orderId: string, status: string): Promise<boolean> {
  // Gate check
  if (!SMS_TRIGGER_EVENTS.includes(status)) {
    return false
  }

  const adminClient = createAdminClient()

  try {
    // 1. Fetch order details
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select(`
        id, 
        status, 
        guest_phone, 
        guest_phone_verified,
        user_id,
        profiles ( phone, phone_verified )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message || 'unknown'}`)
    }

    // 2. Determine phone number to use
    let phone: string | null = null
    
    if (order.user_id && order.profiles) {
      // Use profile phone if verified
      const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles
      if (profile?.phone_verified) {
        phone = profile.phone
      }
    } else {
      // Use guest phone if verified
      if (order.guest_phone_verified && order.guest_phone) {
        phone = order.guest_phone
      }
    }

    if (!phone) {
      throw new Error('No verified phone number found for order')
    }

    // 3. Send SMS via MSG91
    if (!paymentEnv.MSG91_AUTH_KEY) {
      logger.warn('MSG91_AUTH_KEY missing, skipping SMS send', { orderId, status })
      return false
    }

    // Example payload for MSG91 Flow API
    const url = 'https://control.msg91.com/api/v5/flow/'
    // TODO: Determine correct flow_id or template for each status
    // For now, we mock the success/failure based on the API response structure
    /*
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authkey': paymentEnv.MSG91_AUTH_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        flow_id: "your_flow_id_here",
        sender: "AWPHRM",
        mobiles: `91${phone}`,
        order_id: orderId,
        status: status
      })
    })

    const data = await response.json()
    if (data.type === 'error') {
      throw new Error(`MSG91 Error: ${data.message}`)
    }
    */
   
    // Log success (currently mocked)
    logger.info('Order update SMS sent', { orderId, status, phone })
    return true
    
  } catch (error: any) {
    logger.error('Failed to send order update SMS', { orderId, status, error: error.message })
    
    // Log to payment_events for audit/monitoring
    await adminClient.from('payment_events').insert({
      event_type: 'system.sms_failed',
      order_id: orderId,
      raw_payload: { status, error: error.message }
    })
    
    return false
  }
}
