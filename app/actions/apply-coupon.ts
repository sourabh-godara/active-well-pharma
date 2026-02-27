'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { ApplyCouponResult } from '@/types/coupon'

// ─── applyCoupon (with per-user limit check) ─────────────────────────────────

export async function applyCoupon(
    code: string,
    cartTotal: number
): Promise<ApplyCouponResult> {
    if (!code.trim()) {
        return { valid: false, message: 'Please enter a coupon code' }
    }

    const supabase = createAdminClient()

    // 1. Fetch coupon
    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', code.trim())
        .single()

    if (error || !coupon) {
        return { valid: false, message: 'Enter Valid Coupon Code' }
    }

    // 2. Active
    if (!coupon.is_active) {
        return { valid: false, message: 'This coupon is no longer active' }
    }

    // 3. Date range
    const now = new Date()
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
        return { valid: false, message: 'This coupon is not yet valid' }
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return { valid: false, message: 'This coupon has expired' }
    }

    // 4. Global usage limit
    if (coupon.usage_limit !== null && coupon.usage_limit !== undefined &&
        coupon.used_count >= coupon.usage_limit) {
        return { valid: false, message: 'This coupon has reached its usage limit' }
    }

    // 5. Minimum order
    const minOrder = Number(coupon.min_order_amount ?? 0)
    if (cartTotal < minOrder) {
        return {
            valid: false,
            message: `Minimum order of ₹${minOrder.toLocaleString('en-IN')} required`,
        }
    }

    // 6. Per-user limit check (only if user is logged in and per_user_limit set)
    if (coupon.per_user_limit !== null && coupon.per_user_limit !== undefined) {
        try {
            const cookieStore = await cookies()
            const sessionClient = createClient(cookieStore)
            const { data: { user } } = await sessionClient.auth.getUser()

            if (user) {
                const { data: usage } = await supabase
                    .from('coupon_usages')
                    .select('usage_count')
                    .eq('coupon_id', coupon.id)
                    .eq('user_id', user.id)
                    .single()

                const userUsed = usage?.usage_count ?? 0
                if (userUsed >= coupon.per_user_limit) {
                    return {
                        valid: false,
                        message: `You have already used this coupon ${coupon.per_user_limit} time(s)`,
                    }
                }
            }
        } catch {
            // Not logged in — skip per-user check; checkout will enforce it
        }
    }

    // 7. Calculate discount server-side
    let discount: number
    if (coupon.discount_type === 'percentage') {
        discount = cartTotal * (Number(coupon.discount_value) / 100)
        if (coupon.max_discount_amount) {
            discount = Math.min(discount, Number(coupon.max_discount_amount))
        }
    } else {
        discount = Number(coupon.discount_value)
    }

    discount = Math.min(Math.round(discount * 100) / 100, cartTotal)

    return {
        valid: true,
        discount,
        finalTotal: Math.round((cartTotal - discount) * 100) / 100,
        couponId: coupon.id,
        couponCode: coupon.code.toUpperCase(),
        discountType: coupon.discount_type,
        message: 'Coupon applied successfully!',
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
