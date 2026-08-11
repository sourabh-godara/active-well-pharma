'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

export async function updateOrderStatus(orderId: string, status: string, oldStatus?: string) {
    const supabaseAdmin = createAdminClient()
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Get current user to log who made the change
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Update order status
    const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (updateError) {
        throw new Error(updateError.message)
    }

    // 2. Log manual transition to payment_events
    if (user) {
        await supabaseAdmin.from('payment_events').insert({
            order_id: orderId,
            event_type: 'admin.status_change',
            raw_payload: {
                from: oldStatus || 'unknown',
                to: status,
                admin_user_id: user.id
            }
        })
    }

    // 3. Trigger SMS (sendOrderUpdate internally checks if status is in config)
    const { sendOrderUpdate } = require('@/lib/sms/send-order-update')
    await sendOrderUpdate(orderId, status)

    revalidatePath('/admin/orders')
}

export async function getOrderDetails(orderId: string) {
    const supabaseAdmin = createAdminClient()

    // Ensure user is an admin before fetching (defense in depth)
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error("Unauthorized")
    
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error("Forbidden")

    const [paymentsRes, eventsRes] = await Promise.all([
        supabaseAdmin
            .from('payments')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false }),
        supabaseAdmin
            .from('payment_events')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: true })
    ])

    if (paymentsRes.error) logger.error('Failed to fetch payments', { error: paymentsRes.error })
    if (eventsRes.error) logger.error('Failed to fetch payment_events', { error: eventsRes.error })

    return {
        payments: paymentsRes.data || [],
        paymentEvents: eventsRes.data || []
    }
}
