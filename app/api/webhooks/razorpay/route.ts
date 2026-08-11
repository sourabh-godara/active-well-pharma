import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');
import { createAdminClient } from '@/lib/supabase/admin';
import { paymentEnv } from '@/lib/env';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

// ── Constants ────────────────────────────────────────────────

const UNIQUE_VIOLATION_CODE = '23505';

// ── Route Handler ────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminClient = createAdminClient();
  const ipAddress = request.headers.get('x-forwarded-for');

  // --- Read raw body BEFORE parsing (signature needs exact bytes) ---
  const rawBody = await request.text();
  const webhookSignature = request.headers.get('x-razorpay-signature') ?? '';

  // --- Verify webhook signature (constant-time) ---
  const expectedHex = crypto
    .createHmac('sha256', paymentEnv.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  const sigBuffer = Buffer.from(webhookSignature, 'hex');
  const expectedBuffer = Buffer.from(expectedHex, 'hex');

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    // Signature failures are always logged (no dedup concern)
    await adminClient.from('payment_events').insert({
      event_type: 'webhook.signature_invalid',
      raw_payload: { body_preview: rawBody.slice(0, 500) },
      ip_address: ipAddress,
    });

    logger.error('Webhook signature invalid', { ip: ipAddress });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // --- Parse payload (signature already verified against raw bytes) ---
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const eventType = payload.event as string | undefined;
  const payloadObj = payload.payload as Record<string, unknown> | undefined;
  const paymentWrapper = payloadObj?.payment as Record<string, unknown> | undefined;
  const paymentEntity = paymentWrapper?.entity as Record<string, unknown> | undefined;

  // Build a dedup key from event type + payment ID
  const razorpayEventId: string | null = paymentEntity?.id
    ? `${eventType ?? 'unknown'}_${paymentEntity.id as string}`
    : null;

  // --- Resolve internal order ID (shared across all branches) ---
  const razorpayOrderId = paymentEntity?.order_id as string | null;
  let internalOrderId: string | null = null;

  if (razorpayOrderId) {
    const { data: order } = await adminClient
      .from('orders')
      .select('id')
      .eq('razorpay_order_id', razorpayOrderId)
      .single();

    if (!order) {
      await logEvent(adminClient, {
        order_id: null,
        event_type: 'webhook.order_not_found',
        razorpay_event_id: razorpayEventId,
        raw_payload: payload,
        ip_address: ipAddress,
      });
      logger.warn('Webhook received for unknown order', { razorpayOrderId });
      return NextResponse.json({ status: 'ok' });
    }

    internalOrderId = order.id as string;
  }

  // --- Handle by event type ---

  if (eventType === 'payment.captured' && internalOrderId && paymentEntity) {
    await handlePaymentCaptured(
      adminClient,
      internalOrderId,
      paymentEntity,
      razorpayEventId,
      payload,
      ipAddress
    );
  } else if (eventType === 'payment.failed' && internalOrderId) {
    await handlePaymentFailed(
      adminClient,
      internalOrderId,
      razorpayEventId,
      payload,
      ipAddress
    );
  } else if (eventType === 'refund.processed' && paymentEntity) {
    await handleRefundProcessed(
      adminClient,
      internalOrderId,
      paymentEntity,
      razorpayEventId,
      payload,
      ipAddress
    );
  } else {
    // Unknown event — acknowledge, log for visibility
    await logEvent(adminClient, {
      order_id: internalOrderId,
      event_type: `webhook.unhandled.${eventType ?? 'unknown'}`,
      razorpay_event_id: razorpayEventId,
      raw_payload: payload,
      ip_address: ipAddress,
    });
  }

  return NextResponse.json({ status: 'ok' });
}

// ── Event Handlers ───────────────────────────────────────────

async function handlePaymentCaptured(
  adminClient: SupabaseClient,
  orderId: string,
  paymentEntity: Record<string, unknown>,
  razorpayEventId: string | null,
  payload: Record<string, unknown>,
  ipAddress: string | null
): Promise<void> {
  const { data: result, error: rpcError } = await adminClient.rpc(
    'confirm_order_payment',
    {
      p_order_id: orderId,
      p_razorpay_payment_id: paymentEntity.id as string,
      p_razorpay_signature: '',
      p_amount: paymentEntity.amount as number,
      p_status: (paymentEntity.status as string) ?? 'captured',
      p_method: (paymentEntity.method as string) ?? null,
      p_verified_via: 'webhook',
    }
  );

  let finalEventType = 'webhook.already_confirmed';
  if (rpcError) {
    finalEventType = 'webhook.confirmation_error';
  } else if (result?.amount_mismatch) {
    // The RPC handled marking it failed internally, we just acknowledge receipt
    finalEventType = 'webhook.payment.amount_mismatch';
  } else if (result?.won) {
    finalEventType = 'webhook.payment.captured';
  }

  await logEvent(adminClient, {
    order_id: orderId,
    event_type: finalEventType,
    razorpay_event_id: razorpayEventId,
    raw_payload: rpcError
      ? { ...payload, rpc_error: rpcError.message }
      : payload,
    ip_address: ipAddress,
  });

  if (rpcError) {
    logger.error('Webhook confirm_order_payment RPC failed', {
      orderId,
      error: rpcError.message,
    });
  } else if (result?.amount_mismatch) {
    logger.warn('Webhook payment captured but amount mismatched', {
      orderId,
      paymentId: paymentEntity.id,
    });
  } else {
    logger.info(`Webhook payment.captured — ${result?.won ? 'won' : 'already confirmed'}`, {
      orderId,
      stockOk: result?.stock_ok as boolean,
    });
    
    if (result?.won && result?.stock_ok !== false) {
      // Send order confirmation email
      const { sendOrderConfirmation } = require('@/lib/email/send-order-confirmation');
      await sendOrderConfirmation(orderId);
      
      // Trigger SMS for 'confirmed' state
      const { sendOrderUpdate } = require('@/lib/sms/send-order-update');
      await sendOrderUpdate(orderId, 'confirmed');
    }
  }
}

async function handlePaymentFailed(
  adminClient: SupabaseClient,
  orderId: string,
  razorpayEventId: string | null,
  payload: Record<string, unknown>,
  ipAddress: string | null
): Promise<void> {
  // Only fail if still 'created'
  await adminClient
    .from('orders')
    .update({ status: 'failed' })
    .eq('id', orderId)
    .eq('status', 'created');

  await logEvent(adminClient, {
    order_id: orderId,
    event_type: 'webhook.payment.failed',
    razorpay_event_id: razorpayEventId,
    raw_payload: payload,
    ip_address: ipAddress,
  });

  logger.info('Webhook payment.failed', { orderId });
}

async function handleRefundProcessed(
  adminClient: SupabaseClient,
  orderId: string | null,
  paymentEntity: Record<string, unknown>,
  razorpayEventId: string | null,
  payload: Record<string, unknown>,
  ipAddress: string | null
): Promise<void> {
  await adminClient
    .from('payments')
    .update({ status: 'refunded' })
    .eq('razorpay_payment_id', paymentEntity.id as string);

  await logEvent(adminClient, {
    order_id: orderId,
    event_type: 'webhook.refund.processed',
    razorpay_event_id: razorpayEventId,
    raw_payload: payload,
    ip_address: ipAddress,
  });

  logger.info('Webhook refund.processed', {
    paymentId: paymentEntity.id as string,
  });
}

// ── Event Logging (with 23505 dedup) ─────────────────────────

/**
 * Insert a payment_events row. If it hits the razorpay_event_id unique
 * constraint (23505), silently ignore — a concurrent delivery already
 * logged it. The RPC's atomic status gate prevents double-confirmation
 * regardless, so this only prevents duplicate audit rows.
 */
async function logEvent(
  adminClient: SupabaseClient,
  event: {
    order_id: string | null;
    event_type: string;
    razorpay_event_id: string | null;
    raw_payload: unknown;
    ip_address: string | null;
  }
): Promise<void> {
  const { error } = await adminClient.from('payment_events').insert(event);

  if (error && error.code !== UNIQUE_VIOLATION_CODE) {
    // Non-dedup error — log to stderr (can't write to payment_events since it just failed)
    logger.error('Failed to log payment_event', {
      eventType: event.event_type,
      error: error.message,
    });
  }
}
