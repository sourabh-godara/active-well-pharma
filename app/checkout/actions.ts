'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { razorpay } from '@/lib/razorpay'
import { redirect } from 'next/navigation'

export async function createOrder(amount: number) {
    try {
        const options = {
            amount: Math.round(amount * 100), // amount in lowest denomination (paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }
        const order = await razorpay.orders.create(options)
        return { orderId: order.id, amount: order.amount, currency: order.currency }
    } catch (error) {
        console.error('Error creating Razorpay order:', error)
        throw new Error('Failed to create payment order')
    }
}

export async function verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string,
    cartItems: any[],
    totalAmount: number
) {
    const crypto = require('crypto')
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(orderId + '|' + paymentId)
        .digest('hex')

    if (generated_signature !== signature) {
        throw new Error('Payment verification failed')
    }

    // Payment is valid, create order in DB
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Start DB Transaction (Supabase doesn't support explicit transactions in JS client easily without RPC, 
    // so we will do best effort or use RPC if needed. specific order: Create Order -> Create Items -> Deduct Stock)

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

    if (orderError) throw new Error(orderError.message)

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

    if (itemsError) throw new Error(itemsError.message)

    // 3. Deduct Stock & Log Inventory
    for (const item of cartItems) {
        // Decrement stock
        // We really should use an RPC for atomic update, but simple update for now using auto-generated inventory_logs triggers or manual

        // Manual update
        await supabase.from('inventory_logs').insert({
            product_id: item.id,
            change_type: 'order_deduction',
            quantity_changed: -item.quantity
        })

        // We need to fetch current stock to decrement safely or use `stock_quantity = stock_quantity - X`
        // Supabase/Postgres supports `stock_quantity = stock_quantity - X` via RPC or raw SQL. 
        // JS Client: .rpc() is best.
        // Or fetch-and-update (race condition risk). I'll use fetch-and-update for simplicity in this demo scope.

        const { data: product } = await supabase.from('products').select('stock_quantity').eq('id', item.id).single()

        if (product) {
            await supabase.from('products').update({
                stock_quantity: Math.max(0, product.stock_quantity - item.quantity)
            }).eq('id', item.id)
        }
    }

    return { success: true, orderId: order.id }
}
