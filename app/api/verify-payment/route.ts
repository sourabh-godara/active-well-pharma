import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');
import { createAdminClient } from '@/lib/supabase/admin';
import { paymentEnv } from '@/lib/env';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: paymentEnv.RAZORPAY_KEY_ID,
  key_secret: paymentEnv.RAZORPAY_KEY_SECRET,
});

// ── Route Handler ────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminClient = createAdminClient();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // --- Auth Check (ID-5) ---
  const { data: { user } } = await supabase.auth.getUser();

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

  // --- Look up internal order ID + Authorization Check ---
  const { data: order } = await adminClient
    .from('orders')
    .select('id, user_id, total_amount')
    .eq('razorpay_order_id', razorpay_order_id)
    .single();

  if (!order) {
    logger.error('Order not found for verification', { razorpay_order_id });
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.user_id !== null && order.user_id !== user?.id) {
    logger.error('Unauthorized order access attempt', { razorpay_order_id, userId: user?.id, orderUserId: order.user_id });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // --- Fetch Payment from Razorpay (ID-2) ---
  let fetchedPayment;
  try {
    fetchedPayment = await razorpay.payments.fetch(razorpay_payment_id);
  } catch (error) {
    logger.error('Failed to fetch payment from Razorpay', { error, razorpay_payment_id });
    return NextResponse.json({ error: 'Failed to verify payment status with Razorpay. Please retry.' }, { status: 502 });
  }

  if (fetchedPayment.status !== 'captured') {
    logger.warn('Payment not captured', { status: fetchedPayment.status, razorpay_payment_id });
    return NextResponse.json({ error: 'Payment is not fully captured. Please contact support.' }, { status: 400 });
  }

  // --- Single RPC: confirm payment atomically ---
  const { data: result, error: rpcError } = await adminClient.rpc(
    'confirm_order_payment',
    {
      p_order_id: order.id as string,
      p_razorpay_payment_id: razorpay_payment_id,
      p_razorpay_signature: razorpay_signature,
      p_amount: fetchedPayment.amount,
      p_status: fetchedPayment.status,
      p_method: fetchedPayment.method ?? null,
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

  // --- Handle RPC Results ---
  if (result?.amount_mismatch) {
    logger.error('Payment amount mismatch', { orderId: order.id as string });
    return NextResponse.json({ error: 'Payment amount mismatch. The order has been flagged for review.' }, { status: 400 });
  }

  if (result?.won) {
    if (!result.stock_ok) {
      await adminClient
        .from('orders')
        .update({
          status: 'cancelled',
          notes: { refund_required: true, reason: 'stock_oversold' }
        })
        .eq('id', order.id);

      await adminClient.from('payment_events').insert({
        order_id: order.id,
        event_type: 'checkout.stock_conflict',
        raw_payload: { razorpay_payment_id, razorpay_order_id, failures: result.stock_failures },
      });

      logger.warn('Payment confirmed but stock oversold, flagged for refund', {
        orderId: order.id as string,
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        message: 'Payment received, confirming stock',
      });
    }

    // Success event is already logged by the RPC now, no need to duplicate
    logger.info('Payment confirmed via checkout handler', {
      orderId: order.id as string,
      stockOk: true,
    });

    // Send order confirmation email + admin alert
    const { sendOrderConfirmation } = require('@/lib/email/send-order-confirmation');
    const { sendAdminOrderAlert } = require('@/lib/email/send-admin-order-alert');
    await Promise.all([
      sendOrderConfirmation(order.id),
      sendAdminOrderAlert(order.id),
    ]);

    // Trigger SMS for 'confirmed' state
    const { sendOrderUpdate } = require('@/lib/sms/send-order-update');
    await sendOrderUpdate(order.id, 'confirmed');
  } else {
    // If not won, either webhook beat us to it, or it was already confirmed
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

  // Either way, return success — the order IS paid (if it was won or already paid)
  return NextResponse.json({ success: true, orderId: order.id });
}
