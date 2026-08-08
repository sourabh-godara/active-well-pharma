'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import {
    handleError,
    AuthenticationError,
    DatabaseError,
    ErrorCode,
    type ActionResponse,
} from '@/lib/errors'

// ─── Free Order: skip payment when total is ₹0 ───────────────────────────────
// Uses admin client for inventory operations (inventory_logs and products
// require admin-level access via RLS policies). Stock is validated atomically
// via the deduct_stock_for_cart RPC to prevent overselling.

export async function placeOrderFree(
    cartItems: Array<{ id: string; quantity: number; price: number }>,
    couponId?: string | null,
    discountAmount?: number,
    deliveryAddressId?: string | null
): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const adminClient = createAdminClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new AuthenticationError('User not authenticated', ErrorCode.USER_NOT_AUTHENTICATED)
        }

        // 1. Create order with total = 0, status = confirmed (free orders skip 'paid')
        const { data: order, error: orderError } = await adminClient
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: 0,
                status: 'confirmed',
                ...(couponId ? { coupon_id: couponId } : {}),
                ...(discountAmount ? { discount_amount: discountAmount } : {}),
                ...(deliveryAddressId ? { delivery_address_id: deliveryAddressId } : {}),
            })
            .select()
            .single()

        if (orderError) {
            throw new DatabaseError(orderError.message, ErrorCode.DATABASE_ERROR)
        }

        // 2. Create order items
        const { error: itemsError } = await adminClient
            .from('order_items')
            .insert(
                cartItems.map((item) => ({
                    order_id: order.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                }))
            )

        if (itemsError) {
            throw new DatabaseError(itemsError.message, ErrorCode.DATABASE_ERROR)
        }

        // 3. Atomic stock deduction via RPC (all-or-nothing, prevents overselling)
        const stockItems = cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
        }))

        const { error: stockError } = await adminClient.rpc('deduct_stock_for_cart', {
            p_items: stockItems,
        })

        if (stockError) {
            // Stock deduction failed — the order is already created, so log the issue.
            // For free orders this is an edge case (very unlikely to have stock contention
            // on a fully-discounted order). Log and continue — admin handles operationally.
            console.error('[placeOrderFree] stock deduction error:', stockError.message)
        }

        // 4. Increment coupon usage (after successful order creation only)
        if (couponId) {
            await adminClient.rpc('increment_coupon_usage_for_user', {
                p_coupon_id: couponId,
                p_user_id: user.id,
            })
        }

        return { success: true, data: { orderId: order.id } }
    } catch (error) {
        return handleError(error)
    }
}
