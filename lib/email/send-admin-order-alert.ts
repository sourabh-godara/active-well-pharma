import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import { paymentEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

const resend = new Resend(paymentEnv.RESEND_API_KEY);

const ADMIN_EMAIL = 'activewellpharma@gmail.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Escapes HTML special characters to prevent injection in email templates.
 * All user-controlled strings MUST pass through this before interpolation.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sends a detailed order alert email to the admin whenever a new order
 * is confirmed. Includes all order details plus links to download the
 * invoice and shipping label PDFs.
 */
export async function sendAdminOrderAlert(orderId: string): Promise<void> {
  const adminClient = createAdminClient();

  try {
    // Fetch order with items, payment, and address info
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select(`
        *,
        payments (*),
        order_items (
          quantity,
          price_at_purchase,
          products (
            name
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to fetch order: ${orderError?.message}`);
    }

    // Resolve customer info
    const isGuest = order.user_id === null;
    let customerName = 'Guest';
    let customerEmail = order.guest_email || '';
    let customerPhone = order.guest_phone || '';

    if (!isGuest && order.user_id) {
      const { data: profile } = await adminClient
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', order.user_id)
        .single();

      if (profile) {
        customerName = profile.full_name || 'Registered User';
        customerEmail = profile.email || customerEmail;
        customerPhone = profile.phone || customerPhone;
      }

      // Fallback to auth email if profile email is missing
      if (!customerEmail) {
        const { data: authUser } = await adminClient.auth.admin.getUserById(order.user_id);
        customerEmail = authUser?.user?.email || '';
      }
    } else {
      customerName = order.guest_name || 'Guest';
    }

    // Address snapshot
    const addr = order.shipping_address || {};
    const addressLines = [
      addr.address_line,
      addr.locality,
      [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
    ].filter(Boolean);

    // Payment info
    const payment = Array.isArray(order.payments) && order.payments.length > 0
      ? order.payments[0]
      : null;
    const paymentMethod = payment?.method || (order.total_amount === 0 ? 'Free Order' : 'Unknown');

    // Format amounts
    const subtotal = order.total_amount - (order.shipping_amount || 0) + (order.discount_amount || 0);
    const discount = order.discount_amount || 0;
    const shipping = order.shipping_amount || 0;
    const total = order.total_amount;
    const shortId = orderId.slice(0, 8).toUpperCase();

    // Order date
    const orderDate = new Date(order.created_at).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });

    // ── Escape all user-controlled values before HTML interpolation ──
    const safeCustomerName = escapeHtml(customerName);
    const safeCustomerEmail = escapeHtml(customerEmail || 'N/A');
    const safeCustomerPhone = escapeHtml(customerPhone || 'N/A');
    const safePaymentMethod = escapeHtml(paymentMethod);
    const safeAddrName = escapeHtml(addr.name || customerName);
    const safeAddrLandmark = addr.landmark ? escapeHtml(addr.landmark) : '';
    const safeAddrPhone = escapeHtml(addr.phone || customerPhone || '');
    const safeAddressLines = addressLines.map((line: string) => escapeHtml(line));

    // Build items table rows (product names are user/admin-controlled)
    const itemsHtml = (order.order_items || [])
      .map((item: { products?: { name?: string }; quantity: number; price_at_purchase: number }) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
            ${escapeHtml(item.products?.name || 'Product')}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b; text-align: right;">
            ₹${Number(item.price_at_purchase).toFixed(2)}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b; text-align: right;">
            ₹${(item.quantity * Number(item.price_at_purchase)).toFixed(2)}
          </td>
        </tr>
      `)
      .join('');

    // Download links (admin-authenticated routes)
    const invoiceUrl = `${APP_URL}/api/admin/orders/${orderId}/pdf-invoice`;
    const labelUrl = `${APP_URL}/api/admin/orders/${orderId}/pdf-label`;
    const adminOrderUrl = `${APP_URL}/admin/orders`;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #ffffff;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 600;">🛒 New Order Received</h1>
          <p style="margin: 6px 0 0; font-size: 14px; color: #bfdbfe;">Order #${shortId} • ${orderDate}</p>
        </div>

        <div style="padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">

          <!-- Quick Actions -->
          <div style="margin-bottom: 24px; text-align: center;">
            <a href="${invoiceUrl}" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; margin-right: 8px;">📄 Download Invoice</a>
            <a href="${labelUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; margin-right: 8px;">📦 Download Shipping Label</a>
            <a href="${adminOrderUrl}" style="display: inline-block; background-color: #6b7280; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">🔗 View in Dashboard</a>
          </div>

          <!-- Customer Details -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b; width: 120px;">Name</td>
                <td style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 600;">${safeCustomerName}${isGuest ? ' <span style="color: #f59e0b; font-size: 11px; font-weight: normal;">(Guest)</span>' : ''}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Email</td>
                <td style="padding: 4px 0; font-size: 14px; color: #1e293b;">${safeCustomerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Phone</td>
                <td style="padding: 4px 0; font-size: 14px; color: #1e293b;">${safeCustomerPhone}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Payment</td>
                <td style="padding: 4px 0; font-size: 14px; color: #1e293b; text-transform: capitalize;">${safePaymentMethod}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          ${safeAddressLines.length > 0 ? `
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h3>
            <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.6;">
              <strong>${safeAddrName}</strong><br/>
              ${safeAddressLines.join('<br/>')}
              ${safeAddrLandmark ? `<br/>Landmark: ${safeAddrLandmark}` : ''}
              ${safeAddrPhone ? `<br/>📞 ${safeAddrPhone}` : ''}
            </p>
          </div>
          ` : ''}

          <!-- Order Items -->
          <h3 style="margin: 0 0 12px; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1;">Item</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1;">Qty</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1;">Unit Price</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="border-top: 2px solid #e2e8f0; padding-top: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #64748b; text-align: right; width: 70%;">Subtotal</td>
                <td style="padding: 4px 0; font-size: 14px; color: #1e293b; text-align: right; font-weight: 500;">₹${subtotal.toFixed(2)}</td>
              </tr>
              ${discount > 0 ? `
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #64748b; text-align: right;">Discount</td>
                <td style="padding: 4px 0; font-size: 14px; color: #16a34a; text-align: right; font-weight: 500;">- ₹${discount.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #64748b; text-align: right;">Shipping</td>
                <td style="padding: 4px 0; font-size: 14px; color: #1e293b; text-align: right; font-weight: 500;">₹${shipping.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0 0; font-size: 18px; color: #1e293b; text-align: right; font-weight: 700; border-top: 2px solid #1e293b;">Total</td>
                <td style="padding: 8px 0 0; font-size: 18px; color: #1e293b; text-align: right; font-weight: 700; border-top: 2px solid #1e293b;">₹${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Footer -->
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">This is an automated alert from ActiveWell Pharma order system.</p>
          </div>

        </div>
      </div>
    `;

    // Sanitize subject line — strip HTML and control characters
    const safeSubjectName = customerName.replace(/[<>&"'\r\n]/g, '');

    const { error } = await resend.emails.send({
      from: 'ActiveWell Pharma <orders@activewellpharma.com>',
      to: [ADMIN_EMAIL],
      subject: `🛒 New Order #${shortId} — ₹${total.toFixed(2)} from ${safeSubjectName}`,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    logger.info('Admin order alert email sent', { orderId, adminEmail: ADMIN_EMAIL });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Failed to send admin order alert email', { orderId, error: errorMessage });

    // Log failure to payment_events (non-blocking, best-effort)
    await adminClient.from('payment_events').insert({
      order_id: orderId,
      event_type: 'email.admin_alert_failed',
      raw_payload: { error: errorMessage },
    });
  }
}
