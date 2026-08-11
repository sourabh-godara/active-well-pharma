'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

/**
 * Links any existing guest orders to the currently authenticated user
 * based on their verified email address.
 * Call this post-login or post-signup.
 */
export async function linkGuestOrdersToAccount() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const adminClient = createAdminClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email) {
      return { success: false, message: 'No authenticated user with an email found.' }
    }

    // Find orders with guest_email matching user.email where user_id is null
    const { data: orders, error: findError } = await adminClient
      .from('orders')
      .select('id')
      .eq('guest_email', user.email)
      .is('user_id', null)

    if (findError) {
      logger.error('Failed to find guest orders for linking', { error: findError })
      return { success: false, error: 'Failed to find guest orders.' }
    }

    if (!orders || orders.length === 0) {
      return { success: true, linkedCount: 0 }
    }

    // Link them to the user
    const orderIds = orders.map(o => o.id)
    
    const { error: updateError } = await adminClient
      .from('orders')
      .update({ 
        user_id: user.id,
        // Optionally clear guest_tracking_token, but it's fine to leave it active
      })
      .in('id', orderIds)

    if (updateError) {
      logger.error('Failed to link guest orders', { error: updateError, userId: user.id })
      return { success: false, error: 'Failed to link guest orders.' }
    }
    
    // Also update any coupon_usages from guest_email to user_id
    // This requires an RPC or adminClient update.
    await adminClient
      .from('coupon_usages')
      .update({
        user_id: user.id,
      })
      .eq('guest_email', user.email)
      .is('user_id', null)

    logger.info('Linked guest orders to account', { userId: user.id, count: orderIds.length })
    return { success: true, linkedCount: orderIds.length }
  } catch (err: any) {
    logger.error('Unexpected error linking guest orders', { error: err.message })
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
