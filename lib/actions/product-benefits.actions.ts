'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
    const cookieStore = await cookies()
    return createClient(cookieStore)
}

// Helper to check admin
async function checkAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error('Admin only')
    return user
}

export async function addBenefit(productId: string, benefitText: string) {
    const supabase = await getSupabase()
    const adminSupabase = createAdminClient()

    try {
        await checkAdmin(supabase)

        const text = benefitText.trim()
        if (!text) return { error: 'Benefit text cannot be empty' }
        if (text.length > 120) return { error: 'Benefit text too long (max 120 chars)' }

        // Check limit using admin client
        const { count, error: countError } = await adminSupabase
            .from('product_benefits')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', productId)

        if (countError) throw new Error(countError.message)
        if ((count || 0) >= 6) return { error: 'Maximum 6 benefits allowed' }

        // Get next order index
        const { data: maxOrder } = await adminSupabase
            .from('product_benefits')
            .select('order_index')
            .eq('product_id', productId)
            .order('order_index', { ascending: false })
            .limit(1)
            .single()

        const nextIndex = (maxOrder?.order_index ?? -1) + 1

        const { data, error } = await adminSupabase
            .from('product_benefits')
            .insert({
                product_id: productId,
                benefit_text: text,
                order_index: nextIndex
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath(`/product/${productId}`)
        revalidatePath(`/admin/products/${productId}/edit`)
        return { success: true, benefit: data }

    } catch (error: any) {
        console.error('Add benefit error:', error)
        return { error: error.message || 'Failed to add benefit' }
    }
}

export async function deleteBenefit(benefitId: string, productId: string) {
    const supabase = await getSupabase()
    const adminSupabase = createAdminClient()

    try {
        await checkAdmin(supabase)

        const { error } = await adminSupabase
            .from('product_benefits')
            .delete()
            .eq('id', benefitId)

        if (error) throw error

        revalidatePath(`/product/${productId}`)
        revalidatePath(`/admin/products/${productId}/edit`)
        return { success: true }

    } catch (error: any) {
        console.error('Delete benefit error:', error)
        return { error: error.message || 'Failed to delete benefit' }
    }
}

export async function reorderBenefits(productId: string, items: { id: string, order_index: number }[]) {
    const supabase = await getSupabase()
    const adminSupabase = createAdminClient()

    try {
        await checkAdmin(supabase)

        // 1. Temp Update (avoid unique constraint conflicts during reorder)
        for (const item of items) {
            const { error } = await adminSupabase
                .from('product_benefits')
                .update({ order_index: -100 - item.order_index, updated_at: new Date().toISOString() })
                .eq('id', item.id)
                .eq('product_id', productId)

            if (error) throw error
        }

        // 2. Final Update
        for (const item of items) {
            const { error } = await adminSupabase
                .from('product_benefits')
                .update({ order_index: item.order_index, updated_at: new Date().toISOString() })
                .eq('id', item.id)
                .eq('product_id', productId)

            if (error) throw error
        }

        revalidatePath(`/product/${productId}`)
        revalidatePath(`/admin/products/${productId}/edit`)
        return { success: true }

    } catch (error: any) {
        console.error('Reorder benefits error:', error)
        return { error: error.message || 'Failed to reorder benefits' }
    }
}
