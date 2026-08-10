'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { AddressFormData, Address } from '@/types/address'

async function getSupabase() {
    const cookieStore = await cookies()
    return createClient(cookieStore)
}

// ─── Fetch user's addresses ───────────────────────────────────────────────────

export async function getAddresses(): Promise<Address[]> {
    const supabase = await getSupabase()
    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[getAddresses]', error)
        return []
    }
    return data ?? []
}

// ─── Save new address ─────────────────────────────────────────────────────────

export async function saveAddress(formData: AddressFormData): Promise<{ success: boolean; address?: Address; error?: string }> {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Guest mode: insert address via adminClient
        const { createAdminClient } = await import('@/lib/supabase/admin')
        const adminClient = createAdminClient()
        
        const { data, error } = await adminClient.from('addresses').insert({
            ...formData,
            user_id: null,
            is_default: false
        }).select().single()

        if (error) return { success: false, error: error.message }
        return { success: true, address: data as Address }
    }

    // Authenticated flow
    if (formData.is_default) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
    }

    const { data, error } = await supabase.from('addresses').insert({
        ...formData,
        user_id: user.id,
    }).select().single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/profile')
    return { success: true, address: data as Address }
}

// ─── Update existing address ──────────────────────────────────────────────────

export async function updateAddress(
    id: string,
    formData: Partial<AddressFormData>
): Promise<{ success: boolean; address?: Address; error?: string }> {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    if (formData.is_default) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
    }

    const { data, error } = await supabase
        .from('addresses')
        .update(formData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/profile')
    return { success: true, address: data as Address }
}

// ─── Delete address ───────────────────────────────────────────────────────────

export async function deleteAddress(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/profile')
    return { success: true }
}

// ─── Set default address ──────────────────────────────────────────────────────

export async function setDefaultAddress(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    // Clear all defaults first
    await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)

    const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/profile')
    return { success: true }
}
