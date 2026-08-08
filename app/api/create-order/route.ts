import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { razorpay } from '@/lib/razorpay';
import { getRateLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

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
}

interface ValidatedItem {
  id: string;
  quantity: number;
  name: string;
  pricePaise: number;
}

interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key_id: string | undefined;
  status: string;
}

// ── Helpers ──────────────────────────────────────────────────

function computeIdempotencyKey(
  userId: string,
  items: ValidatedItem[],
  couponId: string | null | undefined
): string {
  const sortedItems = items
    .map((i) => `${i.id}:${i.quantity}`)
    .sort()
    .join(',');
  const rawKey = `${userId}:${sortedItems}:${couponId ?? 'none'}`;
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

// ── Route Handler ────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminClient = createAdminClient();

  // --- Auth ---
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // --- Rate limit ---
  const limiter = getRateLimiter();
  const limitResult = await limiter.check(`create-order:${user.id}`);
  if (!limitResult.allowed) {
    logger.warn('Rate limit exceeded', { userId: user.id });
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

  const { cartItems, couponId, discountAmount, deliveryAddressId } = body;

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

  // Apply coupon discount (server-side)
  let discountPaise = 0;
  if (discountAmount && discountAmount > 0) {
    discountPaise = Math.round(discountAmount * 100);
  }

  const finalPaise = Math.max(subtotalPaise - discountPaise, 0);
  const totalRupees = finalPaise / 100;

  if (finalPaise > 0 && finalPaise < MIN_ORDER_PAISE) {
    return NextResponse.json(
      { error: 'Minimum order amount is ₹1' },
      { status: 400 }
    );
  }

  // --- Idempotency key ---
  const idempotencyKey = computeIdempotencyKey(user.id, validatedCart, couponId);
  const receipt = `rcpt_${Date.now()}`;

  // --- Attempt insert (ON CONFLICT handled via error code) ---
  const { data: inserted, error: insertError } = await adminClient
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: totalRupees,
      status: 'created',
      currency: 'INR',
      receipt,
      idempotency_key: idempotencyKey,
      ...(couponId ? { coupon_id: couponId } : {}),
      ...(discountPaise > 0 ? { discount_amount: discountPaise / 100 } : {}),
      ...(deliveryAddressId ? { delivery_address_id: deliveryAddressId } : {}),
    })
    .select()
    .single();

  // --- Handle idempotency conflict ---
  if (insertError && insertError.code === UNIQUE_VIOLATION_CODE) {
    return handleIdempotencyConflict(adminClient, idempotencyKey, finalPaise);
  }

  if (insertError || !inserted) {
    logger.error('Failed to create order', { error: insertError?.message });
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  // --- Insert order_items (persisted at creation time) ---
  const orderItemsPayload = validatedCart.map((item) => ({
    order_id: inserted.id as string,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.pricePaise / 100,
  }));

  const { error: itemsError } = await adminClient
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsError) {
    // Rollback: cancel the order
    await adminClient
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', inserted.id);
    logger.error('Failed to insert order_items, order cancelled', {
      orderId: inserted.id as string,
      error: itemsError.message,
    });
    return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 });
  }

  // --- Create Razorpay order ---
  let rzpOrder: { id: string; amount: string | number; currency: string };
  try {
    rzpOrder = await razorpay.orders.create({
      amount: finalPaise,
      currency: 'INR',
      receipt,
      notes: { internal_order_id: inserted.id as string },
    });
  } catch {
    // Rollback: cancel the order
    await adminClient
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', inserted.id);
    logger.error('Razorpay order creation failed, order cancelled', {
      orderId: inserted.id as string,
    });
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 502 });
  }

  // --- Update our order with Razorpay's order ID ---
  await adminClient
    .from('orders')
    .update({ razorpay_order_id: rzpOrder.id })
    .eq('id', inserted.id);

  // --- Log payment event ---
  await adminClient.from('payment_events').insert({
    order_id: inserted.id,
    event_type: 'order.created',
    raw_payload: {
      razorpay_order_id: rzpOrder.id,
      amount_paise: finalPaise,
      item_count: validatedCart.length,
    },
  });

  logger.info('Order created', {
    orderId: inserted.id as string,
    razorpayOrderId: rzpOrder.id,
    amountPaise: finalPaise,
  });

  const response: CreateOrderResponse = {
    orderId: rzpOrder.id,
    amount: finalPaise,
    currency: 'INR',
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    status: 'created',
  };

  return NextResponse.json(response);
}

// ── Idempotency conflict handler ─────────────────────────────

async function handleIdempotencyConflict(
  adminClient: ReturnType<typeof createAdminClient>,
  idempotencyKey: string,
  finalPaise: number
): Promise<NextResponse> {
  const { data: existing } = await adminClient
    .from('orders')
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .eq('status', 'created')
    .single();

  if (!existing) {
    // Conflict row resolved between our insert and this query — ask client to retry
    return NextResponse.json({ error: 'Please try again' }, { status: 409 });
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

    logger.info('Cancelled stale order for idempotency', { orderId: existing.id as string });
    return NextResponse.json({ error: 'Previous order expired. Please try again.' }, { status: 409 });
  }

  // Recent duplicate — return existing order (if it has a Razorpay order ID)
  if (existing.razorpay_order_id) {
    const response: CreateOrderResponse = {
      orderId: existing.razorpay_order_id as string,
      amount: finalPaise,
      currency: (existing.currency as string) ?? 'INR',
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      status: existing.status as string,
    };
    return NextResponse.json(response);
  }

  // Order exists but no Razorpay ID yet (race between creation steps)
  return NextResponse.json({ error: 'Order is being created. Please wait.' }, { status: 409 });
}
