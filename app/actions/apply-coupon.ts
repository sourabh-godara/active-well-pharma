'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { ApplyCouponResult, CouponDiscountType } from '@/types/coupon'

import { validateCouponServer } from './validate-coupon-server'

export async function applyCoupon(
    code: string,
    cartTotal: number
): Promise<ApplyCouponResult> {
    if (!code.trim()) {
        return { valid: false, message: 'Please enter a coupon code' }
    }

    const supabase = createAdminClient()

    // 1. Fetch coupon by code
    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('id')
        .ilike('code', code.trim())
        .single()

    if (error || !coupon) {
        return { valid: false, message: 'Enter Valid Coupon Code' }
    }

    // 2. Get user if logged in
    let userId = ''
    try {
        const cookieStore = await cookies()
        const sessionClient = createClient(cookieStore)
        const { data: { user } } = await sessionClient.auth.getUser()
        if (user) {
            userId = user.id
        }
    } catch {
        // Not logged in — skip strict user check (checkout will enforce it)
    }

    // 3. Call single source of truth
    const result = await validateCouponServer(coupon.id, userId, Math.round(cartTotal * 100))

    if (!result.valid) {
        return { valid: false, message: result.message || 'Invalid coupon' }
    }

    const discountRupees = result.discountPaise / 100

    return {
        valid: true,
        discount: discountRupees,
        finalTotal: Math.round((cartTotal - discountRupees) * 100) / 100,
        couponId: result.couponId as string,
        couponCode: (result.couponCode as string).toUpperCase(),
        discountType: result.discountType as CouponDiscountType,
        message: result.message || 'Coupon applied successfully!',
    }
}

// ─── Admin Actions ────────────────────────────────────────────────────────────

export async function createCoupon(formData: FormData) {
    const supabase = createAdminClient()

    const raw = Object.fromEntries(formData)

    const payload: Record<string, unknown> = {
        code: (raw.code as string).trim().toUpperCase(),
        discount_type: raw.discount_type as string,
        discount_value: Number(raw.discount_value),
        min_order_amount: raw.min_order_amount ? Number(raw.min_order_amount) : 0,
        max_discount_amount: raw.max_discount_amount ? Number(raw.max_discount_amount) : null,
        usage_limit: raw.usage_limit ? Number(raw.usage_limit) : null,
        per_user_limit: raw.per_user_limit ? Number(raw.per_user_limit) : null,
        starts_at: raw.starts_at ? new Date(raw.starts_at as string).toISOString() : null,
        expires_at: raw.expires_at ? new Date(raw.expires_at as string).toISOString() : null,
        is_active: raw.is_active === 'on' || raw.is_active === 'true',
    }

    const { error } = await supabase.from('coupons').insert(payload)
    if (error) return { success: false, error: error.message }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function toggleCoupon(id: string, isActive: boolean) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('coupons')
        .update({ is_active: !isActive })
        .eq('id', id)

    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function deleteCoupon(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/coupons')
    return { success: true }
}
