// ─── Coupon Types ────────────────────────────────────────────────────────────

export type CouponDiscountType = 'percentage' | 'fixed'

export type Coupon = {
    id: string
    code: string
    discount_type: CouponDiscountType
    discount_value: number
    min_order_amount: number
    max_discount_amount?: number | null
    usage_limit?: number | null
    used_count: number
    starts_at?: string | null
    expires_at?: string | null
    is_active: boolean
    created_at?: string
    updated_at?: string
}

// ─── Server Action Return Types ───────────────────────────────────────────────

export type ApplyCouponSuccess = {
    valid: true
    discount: number
    finalTotal: number
    couponId: string
    couponCode: string
    discountType: CouponDiscountType
    message: string
}

export type ApplyCouponFailure = {
    valid: false
    message: string
}

export type ApplyCouponResult = ApplyCouponSuccess | ApplyCouponFailure
