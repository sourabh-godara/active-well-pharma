'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export async function updatePhone(formData: FormData) {
    const phone = formData.get('phone') as string

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        return { success: false, error: 'Invalid Indian mobile number.' }
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated.' }

    const adminClient = createAdminClient()
    const { error } = await adminClient.from('profiles').update({
        phone,
        phone_verified: false
    }).eq('id', user.id)

    if (error) {
        return { success: false, error: 'Failed to update phone number.' }
    }

    return { success: true }
}

export async function updatePassword(formData: FormData) {
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' }
    }
    if (newPassword !== confirmPassword) {
        return { success: false, error: 'Passwords do not match.' }
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    
    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function deleteAccount() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return { success: false, error: 'Not authenticated.' }
    }

    const adminClient = createAdminClient()

    // Disconnect user from orders
    const { error: ordersError } = await adminClient
        .from('orders')
        .update({ user_id: null })
        .eq('user_id', user.id)

    if (ordersError) {
        return { success: false, error: 'Failed to safely disconnect order history.' }
    }

    // Disconnect user from addresses
    const { error: addressesError } = await adminClient
        .from('addresses')
        .update({ user_id: null })
        .eq('user_id', user.id)

    if (addressesError) {
        return { success: false, error: 'Failed to safely disconnect address history.' }
    }

    // Delete auth user via Admin API
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
        return { success: false, error: 'Failed to delete user account.' }
    }

    // Sign out to clear cookies
    await supabase.auth.signOut()

    return { success: true }
}
