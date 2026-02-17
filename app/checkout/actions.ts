'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { razorpay } from '@/lib/razorpay'
import { redirect } from 'next/navigation'
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
            amount: Math.round(amount * 100), // amount in lowest denomination (paise)
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
    totalAmount: number
): Promise<ActionResponse> {
    try {
        // Verify payment signature
        const crypto = require('crypto')
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(orderId + '|' + paymentId)
            .digest('hex')

        if (generated_signature !== signature) {
            throw new DatabaseError(
                'Payment verification failed',
                ErrorCode.PAYMENT_ERROR
            )
        }

        // Payment is valid, create order in DB
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new AuthenticationError(
                'User not authenticated',
                ErrorCode.USER_NOT_AUTHENTICATED
            )
        }

        // 1. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: totalAmount,
                status: 'confirmed'
            })
            .select()
            .single()

        if (orderError) {
            throw new DatabaseError(orderError.message, ErrorCode.DATABASE_ERROR)
        }

        // 2. Create Order Items
        const orderItemsData = cartItems.map((item: any) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData)

        if (itemsError) {
            throw new DatabaseError(itemsError.message, ErrorCode.DATABASE_ERROR)
        }

        // 3. Deduct Stock & Log Inventory
        for (const item of cartItems) {
            // Log inventory change
            await supabase.from('inventory_logs').insert({
                product_id: item.id,
                change_type: 'order_deduction',
                quantity_changed: -item.quantity
            })

            // Update stock quantity
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

        return { success: true, data: { orderId: order.id } }
    } catch (error) {
        return handleError(error)
    }
}
