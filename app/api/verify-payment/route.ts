import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');
import { createAdminClient } from '@/lib/supabase/admin';
import { paymentEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

// ── Route Handler ────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminClient = createAdminClient();

  // --- Parse input ---
  let body: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // --- Signature verification (constant-time) ---
  const expectedHex = crypto
    .createHmac('sha256', paymentEnv.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const sigBuffer = Buffer.from(razorpay_signature, 'hex');
  const expectedBuffer = Buffer.from(expectedHex, 'hex');

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    // Signature mismatch — look up order for logging (best-effort)
    const { data: order } = await adminClient
      .from('orders')
      .select('id')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    await adminClient.from('payment_events').insert({
      order_id: (order?.id as string) ?? null,
      event_type: 'checkout.signature_mismatch',
      raw_payload: { razorpay_order_id, razorpay_payment_id },
      ip_address: request.headers.get('x-forwarded-for'),
    });

    logger.error('Checkout signature mismatch', { razorpay_order_id });
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  // --- Look up internal order ID + total_amount ---
  const { data: order } = await adminClient
    .from('orders')
    .select('id, total_amount')
    .eq('razorpay_order_id', razorpay_order_id)
    .single();

  if (!order) {
    logger.error('Order not found for verification', { razorpay_order_id });
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Derive paise from our own server-computed order total
  const amountPaise = Math.round((order.total_amount as number) * 100);

  // --- Single RPC: confirm payment atomically ---
  const { data: result, error: rpcError } = await adminClient.rpc(
    'confirm_order_payment',
    {
      p_order_id: order.id as string,
      p_razorpay_payment_id: razorpay_payment_id,
      p_razorpay_signature: razorpay_signature,
      p_amount: amountPaise,
      p_method: null,            // not available from checkout handler
      p_verified_via: 'checkout_handler',
    }
  );

  if (rpcError) {
    logger.error('confirm_order_payment RPC failed', {
      orderId: order.id as string,
      error: rpcError.message,
    });

    await adminClient.from('payment_events').insert({
      order_id: order.id,
      event_type: 'checkout.confirmation_error',
      raw_payload: { error: rpcError.message, razorpay_payment_id },
    });

    return NextResponse.json({ error: 'Payment confirmation failed' }, { status: 500 });
  }

  // --- Log the appropriate event ---
  if (result?.won) {
    await adminClient.from('payment_events').insert({
      order_id: order.id,
      event_type: 'checkout.success',
      raw_payload: { razorpay_payment_id, razorpay_order_id },
    });
    logger.info('Payment confirmed via checkout handler', {
      orderId: order.id as string,
      stockOk: result.stock_ok as boolean,
    });
  } else {
    await adminClient.from('payment_events').insert({
      order_id: order.id,
      event_type: 'checkout.already_confirmed',
      raw_payload: {
        razorpay_payment_id,
        razorpay_order_id,
        note: 'webhook confirmed first',
      },
    });
    logger.info('Checkout handler arrived second', { orderId: order.id as string });
  }

  // Either way, return success — the order IS paid
  return NextResponse.json({ success: true, orderId: order.id });
}
