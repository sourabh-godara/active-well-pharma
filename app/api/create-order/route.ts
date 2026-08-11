import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { validateCouponServer } from '@/app/actions/validate-coupon-server';
import { calculateOrderPricing } from '@/lib/pricing';
import { razorpay } from '@/lib/razorpay';
import { getRateLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { getStoreSettings } from '@/app/actions/admin/settings';
// ── Constants ────────────────────────────────────────────────

const ABANDONMENT_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes
const MIN_ORDER_PAISE = 100; // ₹1
const UNIQUE_VIOLATION_CODE = '23505';

// ── Types ────────────────────────────────────────────────────

interface CartItem {
  id: string;
  quantity: number;
}

interface CreateOrderRequest {
  cartItems: CartItem[];
  couponId?: string | null;
  discountAmount?: number;
  deliveryAddressId?: string | null;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  guestAddressData?: Record<string, any>;
}

interface ValidatedItem {
  id: string;
  quantity: number;
  name: string;
  pricePaise: number;
}

export interface CreateOrderResponse {
  orderId?: string; // The Supabase UUID (internal)
  razorpayOrderId?: string; // The Razorpay order ID (starts with order_)
  amount?: number;
  currency?: string;
  key_id?: string;
  status?: string;
  error?: string;
  code?: string;
  items?: Array<{ name: string; requested: number; available: number }>;
  guestTrackingToken?: string;
}

// ── Helpers ──────────────────────────────────────────────────

function computeIdempotencyKey(
  userId: string | null,
  guestEmail: string | undefined,
  items: ValidatedItem[],
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

// ── Route Handler ────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminClient = createAdminClient();

  // --- Auth ---
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  // --- Rate limit ---
  const limiter = getRateLimiter();
  const rateLimitKey = userId ? `create-order:${userId}` : `create-order:ip:${request.headers.get('x-forwarded-for') ?? 'unknown'}`;
  const limitResult = await limiter.check(rateLimitKey);
  if (!limitResult.allowed) {
    logger.warn('Rate limit exceeded', { userId: rateLimitKey });
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.', retryAfterMs: limitResult.retryAfterMs },
      { status: 429 }
    );
  }

  // --- Parse + validate input ---
  let body: CreateOrderRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { cartItems, couponId, discountAmount, deliveryAddressId, guestEmail, guestName, guestPhone, guestAddressData } = body;

  if (!userId) {
    if (!guestEmail) {
      return NextResponse.json({ error: 'Email is required for guest checkout' }, { status: 400 });
    }
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  // Validate each item has id (string) and quantity (positive integer)
  for (const item of cartItems) {
    if (typeof item.id !== 'string' || !item.id) {
      return NextResponse.json({ error: 'Invalid cart item: missing id' }, { status: 400 });
    }
    if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return NextResponse.json({ error: 'Invalid cart item: quantity must be a positive integer' }, { status: 400 });
    }
  }

  // --- Server-side price computation ---
  const productIds = cartItems.map((i) => i.id);

  // Fetch authoritative shipping settings securely on the server
  const settings = await getStoreSettings();

  const { data: products, error: productsError } = await adminClient
    .from('products')
    .select('id, name, price, stock_quantity, is_active')
    .in('id', productIds);

  if (productsError || !products) {
    logger.error('Failed to fetch products', { error: productsError?.message });
    return NextResponse.json({ error: 'Failed to load product data' }, { status: 500 });
  }

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products not found' }, { status: 400 });
  }

  // Build lookup map — O(1) per item
  const productMap = new Map(products.map((p) => [p.id as string, p]));

  // --- Validate products + soft stock check + compute total in paise ---
  const outOfStock: Array<{ name: string; requested: number; available: number }> = [];
  const validatedCart: ValidatedItem[] = [];

  for (const item of cartItems) {
    const product = productMap.get(item.id);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: `Product "${product?.name ?? item.id}" is unavailable` },
        { status: 400 }
      );
    }

    // Per-item paise conversion before summing (avoids floating-point drift)
    const pricePaise = Math.round((product.price as number) * 100);

    if ((product.stock_quantity as number) < item.quantity) {
      outOfStock.push({
        name: product.name as string,
        requested: item.quantity,
        available: product.stock_quantity as number,
      });
    }

    validatedCart.push({
      id: product.id as string,
      quantity: item.quantity,
      name: product.name as string,
      pricePaise,
    });
  }

  if (outOfStock.length > 0) {
    return NextResponse.json(
      { error: 'Some items are out of stock', code: 'INSUFFICIENT_STOCK', items: outOfStock },
      { status: 409 }
    );
  }

  // --- Compute totals in paise ---
  const subtotalPaise = validatedCart.reduce(
    (sum, item) => sum + item.pricePaise * item.quantity,
    0
  );

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
    return NextResponse.json({ error: err.message || 'Pricing error' }, { status: 400 });
  }

  // Strict mismatch check: If client claims a discount but provided no coupon, or the amount doesn't match our math exactly.
  // (Client provides discountAmount in rupees, so we compare directly since pricingResult.discount is in rupees).
  const clientDiscountRupees = discountAmount ? discountAmount : 0;
  if (clientDiscountRupees !== pricingResult.discount) {
    logger.warn('Discount mismatch', { client: clientDiscountRupees, server: pricingResult.discount });
    return NextResponse.json({ error: 'Discount calculation mismatch. Please refresh and try again.' }, { status: 400 });
  }

  const finalPaise = Math.round(pricingResult.total * 100);

  if (finalPaise > 0 && finalPaise < MIN_ORDER_PAISE) {
    return NextResponse.json(
      { error: 'Minimum order amount is ₹1' },
      { status: 400 }
    );
  }

  // Handle free order routing constraint (must be hit from placeOrderFree action)
  if (finalPaise === 0) {
    return NextResponse.json(
      { error: 'Order is fully discounted. Please use the free order checkout method.' },
      { status: 400 }
    );
  }

  // Increment coupon usage via RPC (Atomic check-and-increment)
  if (couponId) {
    const { data: incrementSuccess, error: incrementError } = await adminClient.rpc('increment_coupon_usage_for_user', {
      p_coupon_id: couponId,
      p_user_id: userId,
      p_guest_email: !userId ? guestEmail : null
    });

    if (incrementError || !incrementSuccess) {
      return NextResponse.json({ error: 'Coupon usage limit reached or coupon invalid.' }, { status: 400 });
    }
  }

  // Generate Idempotency Key
  const idempotencyKey = computeIdempotencyKey(userId, guestEmail, validatedCart, couponId, deliveryAddressId);

  // Determine if we should auto-link to an existing account based on guest email
  let resolvedUserId = userId;
  if (!resolvedUserId && guestEmail) {
    const { data: existingUserId } = await adminClient.rpc('get_user_id_by_email', { p_email: guestEmail.toLowerCase() });
    if (existingUserId) {
      resolvedUserId = existingUserId;
    }
  }

  // Generate guest tracking token if not strictly logged in
  // We still need a tracking token even if auto-linked, because the user isn't authenticated in this session
  const guestTrackingToken = !userId ? crypto.randomBytes(32).toString('hex') : null;

  // --- Create Razorpay Order ---
  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: finalPaise,
      currency: 'INR',
      receipt: idempotencyKey.substring(0, 40), // receipt max length is 40
      payment_capture: true,
    });
  } catch (error) {
    if (couponId) {
      await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestEmail : null });
    }
    logger.error('Razorpay order creation failed', { error });
    return NextResponse.json({ error: 'Failed to initialize payment gateway' }, { status: 502 });
  }

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
        id: undefined, // remove temp client ID
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

  // --- Database Transactions ---

  // 1. Insert Order (with idempotency check via unique constraint)
  const { data: order, error: orderError } = await adminClient
    .from('orders')
    .insert({
      user_id: resolvedUserId,
      total_amount: pricingResult.total,
      shipping_amount: pricingResult.shipping,
      status: 'created',
      razorpay_order_id: razorpayOrder?.id,
      idempotency_key: idempotencyKey,
      ...(couponId ? { coupon_id: couponId } : {}),
      ...(pricingResult.discount > 0 ? { discount_amount: pricingResult.discount } : {}),
      ...(finalDeliveryAddressId ? { delivery_address_id: finalDeliveryAddressId } : {}),
      ...(shippingAddressSnapshot ? { shipping_address: shippingAddressSnapshot } : {}),
      ...(guestTrackingToken ? { 
        guest_tracking_token: guestTrackingToken,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        guest_phone_verified: true
      } : {})
    })
    .select('id, status, guest_tracking_token')
    .single();

  if (orderError) {
    if (orderError.code === UNIQUE_VIOLATION_CODE) {
      // Revert the usage we just incremented (the conflict row already incremented it previously)
      if (couponId) {
        await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestEmail : null });
      }
      return handleIdempotencyConflict(adminClient, idempotencyKey);
    }
    
    // Any other error — revert usage and fail
    if (couponId) {
      await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestEmail : null });
    }
    logger.error('Database error inserting order', { error: orderError.message });
    return NextResponse.json({ error: 'Failed to create order in database' }, { status: 500 });
  }

  // 2. Insert Order Items (Bulk)
  const orderItems = validatedCart.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.pricePaise / 100, // Store in rupees
  }));

  const { error: itemsError } = await adminClient
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    // Soft-delete / cancel the order since it failed to build completely
    await adminClient.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    if (couponId) {
      await adminClient.rpc('decrement_coupon_usage_for_user', { p_coupon_id: couponId, p_user_id: userId, p_guest_email: !userId ? guestEmail : null });
    }
    logger.error('Failed to insert order items', { error: itemsError.message, orderId: order.id });
    return NextResponse.json({ error: 'Failed to finalize order' }, { status: 500 });
  }



  // --- Success Response ---
  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder?.id,
    amount: finalPaise,
    currency: 'INR',
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    status: order.status,
    guestTrackingToken: order.guest_tracking_token,
  });
}

// ── Idempotency conflict handler ─────────────────────────────

async function handleIdempotencyConflict(
  adminClient: ReturnType<typeof createAdminClient>,
  idempotencyKey: string
): Promise<NextResponse> {
  const { data: existing } = await adminClient
    .from('orders')
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .single();

  if (!existing) {
    // Conflict row resolved between our insert and this query — ask client to retry
    return NextResponse.json({ error: 'Please try again' }, { status: 409 });
  }

  if (existing.status !== 'created') {
    // Order already paid/cancelled. Return it so client can handle it (e.g., clear cart if paid)
    return NextResponse.json({
      orderId: existing.id,
      razorpayOrderId: existing.razorpay_order_id,
      amount: Math.round((existing.total_amount as number) * 100),
      currency: 'INR',
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      status: existing.status,
      guestTrackingToken: existing.guest_tracking_token,
    });
  }

  // Check if stale (abandoned > 30 min)
  const ageMs = Date.now() - new Date(existing.created_at as string).getTime();
  if (ageMs > ABANDONMENT_THRESHOLD_MS) {
    // Cancel the stale order → frees the partial unique index slot
    await adminClient
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', existing.id)
      .eq('status', 'created');

    if (existing.coupon_id) {
      await adminClient.rpc('decrement_coupon_usage_for_user', {
        p_coupon_id: existing.coupon_id as string,
        p_user_id: existing.user_id as string | null,
        p_guest_email: existing.guest_email as string | null,
      });
    }

    logger.info('Cancelled stale order for idempotency', { orderId: existing.id as string });
    return NextResponse.json({ error: 'Previous order expired. Please try again.' }, { status: 409 });
  }

  // Return the existing order for payment
  return NextResponse.json({
    orderId: existing.id,
    razorpayOrderId: existing.razorpay_order_id,
    amount: Math.round((existing.total_amount as number) * 100),
    currency: 'INR',
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    status: existing.status,
    guestTrackingToken: existing.guest_tracking_token,
  });
}
