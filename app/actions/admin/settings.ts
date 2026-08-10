'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidateTag } from 'next/cache'
import { ActionResponse, handleError, ErrorCode, AuthenticationError } from '@/lib/errors'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export interface StoreSettings {
    shipping_charge: number
    free_shipping_threshold: number
}

// Cached fetch for storefront display (cart/checkout UI)
export async function getStoreSettings(): Promise<StoreSettings> {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
        .from('store_settings')
        .select('shipping_charge, free_shipping_threshold')
        .eq('id', 1)
        .single()

    if (error || !data) {
        // Fallback default if not yet initialized
        return {
            shipping_charge: 49.00,
            free_shipping_threshold: 499.00
        }
    }
    
    return data
}

// Update settings (Admin only)
export async function updateStoreSettings(settings: StoreSettings): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new AuthenticationError('You must be logged in')
        }

        // Validate numbers
        if (settings.shipping_charge < 0 || settings.free_shipping_threshold < 0) {
            throw new Error('Values cannot be negative')
        }

        const adminClient = createAdminClient()
        
        const { error } = await adminClient
            .from('store_settings')
            .upsert({
                id: 1,
                shipping_charge: settings.shipping_charge,
                free_shipping_threshold: settings.free_shipping_threshold,
                updated_at: new Date().toISOString()
            })

        if (error) throw error

        revalidateTag('store_settings')
        return { success: true }
    } catch (error) {
        return handleError(error, 'Failed to update store settings', ErrorCode.UPDATE_FAILED)
    }
}
