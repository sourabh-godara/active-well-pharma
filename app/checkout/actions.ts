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

import { validateCouponServer } from '@/app/actions/validate-coupon-server'
import { calculateOrderPricing } from '@/lib/pricing'
import { ValidationError } from '@/lib/errors'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');
import { getStoreSettings } from '@/app/actions/admin/settings'

function computeIdempotencyKey(
  userId: string | null,
  guestEmail: string | undefined,
  items: Array<{ id: string; quantity: number }>,
  couponId: string | null | undefined,
  deliveryAddressId: string | null | undefined
): string {
  const sortedItems = items
    .map((i) => `${i.id}:${i.quantity}`)
    .sort()
    .join(',');
  const identity = userId ?? guestEmail ?? 'guest';
  const rawKey = `${identity}:${sortedItems}:${couponId ?? 'none'}:${deliveryAddressId ?? 'none'}`;
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

// ─── Free Order: skip payment when total is ₹0 ───────────────────────────────
export async function placeOrderFree(
    cartItems: Array<{ id: string; quantity: number }>,
    couponId?: string | null,
    deliveryAddressId?: string | null,
    guestInfo?: { name: string, phone: string, email: string },
    guestAddressData?: Record<string, any>
): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const adminClient = createAdminClient()

        const { data: { user } } = await supabase.auth.getUser()
        const userId = user?.id || null

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            throw new ValidationError('Cart is empty')
        }

        if (!userId && !guestInfo?.email) {
            throw new ValidationError('Email is required for guest checkout')
        }

        // Validate delivery address ownership if authenticated
        if (deliveryAddressId && userId) {
            const { data: address } = await adminClient
                .from('addresses')
                .select('user_id')
                .eq('id', deliveryAddressId)
                .single()
            if (!address || address.user_id !== userId) {
                throw new ValidationError('Invalid delivery address')
            }
        }

        // Refetch products and compute subtotal
        const productIds = cartItems.map(item => item.id)
        
        // Fetch authoritative shipping settings securely on the server
        const settings = await getStoreSettings()

        const { data: products } = await adminClient
            .from('products')
            .select('id, name, price, stock_quantity, is_active')
            .in('id', productIds)

        if (!products || products.length !== productIds.length) {
            throw new ValidationError('One or more products not found')
        }

        const productMap = new Map(products.map(p => [p.id as string, p]))
        let subtotalPaise = 0
        const validatedCart = []

        for (const item of cartItems) {
            const product = productMap.get(item.id)
            if (!product || !product.is_active) {
                throw new ValidationError(`Product unavailable`)
            }
            if ((product.stock_quantity as number) < item.quantity) {
                throw new ValidationError(`Insufficient stock for ${product.name}`)
            }
            const pricePaise = Math.round((product.price as number) * 100)
            subtotalPaise += pricePaise * item.quantity
            validatedCart.push({
                id: product.id as string,
                quantity: item.quantity,
                pricePaise
            })
        }

        let pricingResult;
        try {
            const { result } = await calculateOrderPricing({
                subtotalPaise,
                couponId,
                userId,
                settings,
            });
            pricingResult = result;
        } catch (err: any) {
            throw new ValidationError(err.message || 'Pricing error')
        }

        if (pricingResult.total > 0) {
            throw new ValidationError('Order is not completely free')
        }

        // Increment coupon usage before order creation
        if (couponId) {
            const { data: incrementSuccess, error: incrementError } = await adminClient.rpc('increment_coupon_usage_for_user', {
                p_coupon_id: couponId,
                p_user_id: userId,
                p_guest_email: !userId ? guestInfo?.email : null,
            })
            if (incrementError || !incrementSuccess) {
                throw new ValidationError('Coupon usage limit reached')
            }
        }

        // Compute idempotency key
        const idempotencyKey = computeIdempotencyKey(userId, guestInfo?.email, validatedCart, couponId, deliveryAddressId)
        
        // Generate guest tracking token if guest
        const guestTrackingToken = !userId ? crypto.randomBytes(32).toString('hex') : null;

        // --- Address Snapshot ---
        let finalDeliveryAddressId = deliveryAddressId;
        let shippingAddressSnapshot = null;

        const buildSnapshot = (addr: any) => {
            return {
            name: addr.name,
            phone: addr.phone,
            address_line: addr.address_line,
            locality: addr.locality,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            landmark: addr.landmark,
            address_type: addr.address_type
            }
        }

        if (guestAddressData) {
            const { data: newAddr, error: addrErr } = await adminClient.from('addresses').insert({
                ...guestAddressData,
                id: undefined,
                user_id: null,
                is_default: false
            }).select().single();
            
            if (newAddr && !addrErr) {
                finalDeliveryAddressId = newAddr.id;
                shippingAddressSnapshot = buildSnapshot(newAddr);
            }
        } else if (deliveryAddressId) {
            const { data: existingAddr } = await adminClient.from('addresses').select('*').eq('id', deliveryAddressId).single();
            if (existingAddr) {
                shippingAddressSnapshot = buildSnapshot(existingAddr);
            }
        }

        // 1. Create order
        const { data: order, error: orderError } = await adminClient
            .from('orders')
            .insert({
                user_id: userId,
                total_amount: pricingResult.total,
                shipping_amount: pricingResult.shipping,
                status: 'created',
                idempotency_key: idempotencyKey,
                ...(couponId ? { coupon_id: couponId } : {}),
                ...(pricingResult.discount > 0 ? { discount_amount: pricingResult.discount } : {}),
                ...(finalDeliveryAddressId ? { delivery_address_id: finalDeliveryAddressId } : {}),
                ...(shippingAddressSnapshot ? { shipping_address: shippingAddressSnapshot } : {}),
                ...(guestTrackingToken ? { 
                    guest_tracking_token: guestTrackingToken,
                    guest_name: guestInfo?.name,
                    guest_email: guestInfo?.email,
                    guest_phone: guestInfo?.phone
                } : {})
            })
            .select()
            .single()

        if (orderError) {
            if (orderError.code === '23505') {
                const { data: existing } = await adminClient
                    .from('orders')
                    .select('id')
                    .eq('idempotency_key', idempotencyKey)
                    .single()
                
                if (existing) {
                    if (couponId) {
                        await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestInfo?.email : null })
                    }
                    return { success: true, data: { orderId: existing.id } }
                }
            }
            if (couponId) {
                await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestInfo?.email : null })
            }
            throw new DatabaseError(orderError.message, ErrorCode.DATABASE_ERROR)
        }

        // 2. Create order items
        const { error: itemsError } = await adminClient
            .from('order_items')
            .insert(
                validatedCart.map((item) => ({
                    order_id: order.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.pricePaise / 100,
                }))
            )

        if (itemsError) {
            await adminClient.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
            if (couponId) {
                await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestInfo?.email : null })
            }
            throw new DatabaseError(itemsError.message, ErrorCode.DATABASE_ERROR)
        }

        // 3. Atomic stock deduction
        const { error: stockError } = await adminClient.rpc('deduct_stock_for_cart', {
            p_items: validatedCart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        })

        if (stockError) {
            // Stock deduction failed — hard rollback
            await adminClient.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
            if (couponId) {
                await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestInfo?.email : null })
            }
            throw new ValidationError('Items ran out of stock during checkout')
        }

        // Successfully placed free order — mark confirmed
        await adminClient.from('orders').update({ status: 'confirmed' }).eq('id', order.id)

        // Send confirmation email
        const { sendOrderConfirmation } = require('@/lib/email/send-order-confirmation')
        await sendOrderConfirmation(order.id)

        return { success: true, data: { orderId: order.id, guestTrackingToken } }
    } catch (error) {
        return handleError(error)
    }
}
