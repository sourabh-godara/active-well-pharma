import { validateCouponServer, type ValidateCouponResult } from '@/app/actions/validate-coupon-server'

export interface PricingResult {
    subtotal: number; // in rupees
    discount: number; // in rupees
    shipping: number; // in rupees
    total: number;    // in rupees
}

export interface OrderPricingOptions {
    subtotalPaise: number;
    couponId?: string | null;
    userId: string | null;
    settings: { shipping_charge: number; free_shipping_threshold: number };
}

/**
 * Authoritatively calculates the pricing for an order.
 * All returned values are in numeric Rupees.
 */
export async function calculateOrderPricing({
    subtotalPaise,
    couponId,
    userId,
    settings,
}: OrderPricingOptions): Promise<{ result: PricingResult; couponResult?: ValidateCouponResult }> {
    let discountPaise = 0;
    let couponValidation: ValidateCouponResult | undefined;

    // Explicitly call existing coupon validation logic
    if (couponId) {
        couponValidation = await validateCouponServer(couponId, userId, subtotalPaise);
        if (couponValidation.valid) {
            discountPaise = couponValidation.discountPaise;
        } else {
            throw new Error(couponValidation.message || 'Invalid coupon');
        }
    }

    const discountedSubtotalPaise = Math.max(0, subtotalPaise - discountPaise);
    const discountedSubtotalRupees = discountedSubtotalPaise / 100;

    // Evaluate free shipping eligibility against the discounted subtotal
    let shippingRupees = settings.shipping_charge;
    if (discountedSubtotalRupees >= settings.free_shipping_threshold) {
        shippingRupees = 0;
    }

    const shippingPaise = Math.round(shippingRupees * 100);
    const totalPaise = discountedSubtotalPaise + shippingPaise;

    return {
        result: {
            subtotal: subtotalPaise / 100,
            discount: discountPaise / 100,
            shipping: shippingPaise / 100,
            total: totalPaise / 100,
        },
        couponResult: couponValidation,
    };
}
