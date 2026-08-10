import { createAdminClient } from '@/lib/supabase/admin'

export interface ValidateCouponResult {
    valid: boolean
    discountPaise: number
    couponId?: string
    couponCode?: string
    discountType?: string
    message?: string
}

export async function validateCouponServer(
    couponId: string,
    userId: string | null,
    subtotalPaise: number
): Promise<ValidateCouponResult> {
    const adminClient = createAdminClient()

    // 1. Fetch coupon
    const { data: coupon, error } = await adminClient
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .single()

    if (error || !coupon) {
        return { valid: false, discountPaise: 0, message: 'Invalid coupon' }
    }

    // 2. Active
    if (!coupon.is_active) {
        return { valid: false, discountPaise: 0, message: 'This coupon is no longer active' }
    }

    // 3. Date range
    const now = new Date()
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
        return { valid: false, discountPaise: 0, message: 'This coupon is not yet valid' }
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return { valid: false, discountPaise: 0, message: 'This coupon has expired' }
    }

    // 4. Global usage limit (Checked authoritatively in RPC, but good to check here too to fail fast)
    if (coupon.usage_limit !== null && coupon.usage_limit !== undefined &&
        coupon.used_count >= coupon.usage_limit) {
        return { valid: false, discountPaise: 0, message: 'This coupon has reached its usage limit' }
    }

    // 5. Minimum order (coupon min order is stored in Rupees)
    const minOrderPaise = Number(coupon.min_order_amount ?? 0) * 100
    if (subtotalPaise < minOrderPaise) {
        return {
            valid: false,
            discountPaise: 0,
            message: `Minimum order of ₹${(minOrderPaise / 100).toLocaleString('en-IN')} required`,
        }
    }

    // 6. Per-user limit check (Checked authoritatively in RPC, fail fast here)
    if (coupon.per_user_limit !== null && coupon.per_user_limit !== undefined) {
        if (!userId) {
            return {
                valid: false,
                discountPaise: 0,
                message: 'Please log in to use this coupon',
            }
        }
        const { data: usage } = await adminClient
            .from('coupon_usages')
            .select('usage_count')
            .eq('coupon_id', coupon.id)
            .eq('user_id', userId)
            .single()

        const userUsed = usage?.usage_count ?? 0
        if (userUsed >= coupon.per_user_limit) {
            return {
                valid: false,
                discountPaise: 0,
                message: `You have already used this coupon ${coupon.per_user_limit} time(s)`,
            }
        }
    }

    // 7. Calculate discount
    let discountPaise = 0
    if (coupon.discount_type === 'percentage') {
        discountPaise = subtotalPaise * (Number(coupon.discount_value) / 100)
        if (coupon.max_discount_amount) {
            const maxDiscountPaise = Number(coupon.max_discount_amount) * 100
            discountPaise = Math.min(discountPaise, maxDiscountPaise)
        }
    } else {
        discountPaise = Number(coupon.discount_value) * 100
    }

    // Ensure we don't discount more than the subtotal and round appropriately
    discountPaise = Math.min(Math.round(discountPaise), subtotalPaise)

    return {
        valid: true,
        discountPaise,
        couponId: coupon.id,
        couponCode: coupon.code,
        discountType: coupon.discount_type,
        message: 'Coupon applied successfully!',
    }
}
