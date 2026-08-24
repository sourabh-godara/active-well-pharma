'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateGuestContact(orderId: string, updates: { guest_email?: string, guest_phone?: string, guest_name?: string }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const adminClient = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Admin Check
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Admin only' }
  }

  const { error } = await adminClient
    .from('orders')
    .update({
      ...(updates.guest_email ? { guest_email: updates.guest_email } : {}),
      ...(updates.guest_phone ? { guest_phone: updates.guest_phone } : {}),
      ...(updates.guest_name ? { guest_name: updates.guest_name } : {}),
    })
    .eq('id', orderId)
    .is('user_id', null) // Ensure we only update guest orders

  if (error) {
    return { success: false, error: 'Failed to update order contact info' }
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)

  return { success: true }
}
