'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { razorpay } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import {
    handleError,
    AuthenticationError,
    DatabaseError,
    ErrorCode,
    type ActionResponse,
} from '@/lib/errors'

export async function createOrder(amount: number): Promise<ActionResponse> {
    try {
        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }
        const order = await razorpay.orders.create(options)
        return {
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            }
        }
    } catch (error) {
        return handleError(
            new DatabaseError(
                'Failed to create payment order',
                ErrorCode.PAYMENT_ERROR
            )
        )
    }
}

export async function verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string,
    cartItems: any[],
    totalAmount: number,
    couponId?: string | null,
    discountAmount?: number,
    deliveryAddressId?: string | null
): Promise<ActionResponse> {
    try {
        // 1. Verify payment signature
        const crypto = require('crypto')
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(orderId + '|' + paymentId)
            .digest('hex')

        if (generated_signature !== signature) {
            throw new DatabaseError('Payment verification failed', ErrorCode.PAYMENT_ERROR)
        }

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new AuthenticationError('User not authenticated', ErrorCode.USER_NOT_AUTHENTICATED)
        }

        // 2. Create order in DB — include coupon + address fields if provided
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: totalAmount,
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

        // 3. Create order items
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
                cartItems.map((item: any) => ({
                    order_id: order.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                }))
            )

        if (itemsError) {
            throw new DatabaseError(itemsError.message, ErrorCode.DATABASE_ERROR)
        }

        // 4. Deduct stock & log inventory
        for (const item of cartItems) {
            await supabase.from('inventory_logs').insert({
                product_id: item.id,
                change_type: 'order_deduction',
                quantity_changed: -item.quantity,
            })

            const { data: product } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', item.id)
                .single()

            if (product) {
                await supabase.from('products').update({
                    stock_quantity: Math.max(0, product.stock_quantity - item.quantity)
                }).eq('id', item.id)
            }
        }

        // 5. Increment coupon usage (after successful order creation only)
        if (couponId) {
            const adminClient = createAdminClient()
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

// ─── Free Order: skip payment when total is ₹0 ───────────────────────────────

export async function placeOrderFree(
    cartItems: any[],
    couponId?: string | null,
    discountAmount?: number,
    deliveryAddressId?: string | null
): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new AuthenticationError('User not authenticated', ErrorCode.USER_NOT_AUTHENTICATED)
        }

        // 1. Create order with total = 0
        const { data: order, error: orderError } = await supabase
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
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
                cartItems.map((item: any) => ({
                    order_id: order.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                }))
            )

        if (itemsError) {
            throw new DatabaseError(itemsError.message, ErrorCode.DATABASE_ERROR)
        }

        // 3. Deduct stock & log inventory
        for (const item of cartItems) {
            await supabase.from('inventory_logs').insert({
                product_id: item.id,
                change_type: 'order_deduction',
                quantity_changed: -item.quantity,
            })

            const { data: product } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', item.id)
                .single()

            if (product) {
                await supabase.from('products').update({
                    stock_quantity: Math.max(0, product.stock_quantity - item.quantity)
                }).eq('id', item.id)
            }
        }

        // 4. Increment coupon usage
        if (couponId) {
            const adminClient = createAdminClient()
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
