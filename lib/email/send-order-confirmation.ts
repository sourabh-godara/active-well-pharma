import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import { paymentEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

const resend = new Resend(paymentEnv.RESEND_API_KEY);
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendOrderConfirmation(orderId: string) {
  const adminClient = createAdminClient();

  try {
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

    const isGuest = order.user_id === null;
    const recipientEmail = isGuest ? order.guest_email : await getUserEmail(order.user_id);
    const recipientName = isGuest ? order.guest_name : 'Customer';

    if (!recipientEmail) {
      throw new Error('No recipient email found for order');
    }

    const payment = order.payments && order.payments.length > 0 ? order.payments[0] : null;
    const isCod = payment?.method === 'cod';

    const safeName = escapeHtml(recipientName || 'Customer');

    // Construct the email content
    const itemsHtml = (order.order_items || [])
      .map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(item.products?.name || 'Product')}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price_at_purchase}</td>
        </tr>
      `)
      .join('');

    const trackingLink = isGuest
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${order.guest_tracking_token}`
      : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders/${order.id}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmation - ActiveWell Pharma</h2>
        <p>Hi ${safeName},</p>
        <p>Thank you for your order! Your order <strong>#${order.id.split('-')[0]}</strong> has been confirmed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f9fafb; text-align: left;">
              <th style="padding: 8px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 8px; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p><strong>Subtotal:</strong> ₹${order.total_amount - (order.shipping_amount || 0)}</p>
        <p><strong>Shipping:</strong> ₹${order.shipping_amount || 0}</p>
        <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f0fdf4; border-radius: 8px; text-align: center;">
          <h3 style="margin-top: 0; color: #166534;">Track Your Order</h3>
          <p style="color: #15803d; margin-bottom: 20px;">You can view your order status and tracking information by clicking the button below:</p>
          <a href="${trackingLink}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Order Status</a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">If you have any questions, please reply to this email.</p>
      </div>
    `;


    const { data, error } = await resend.emails.send({
      from: 'ActiveWell Pharma <orders@activewellpharma.com>',
      to: [recipientEmail],
      subject: `Order Confirmed: #${order.id.split('-')[0]}`,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    logger.info('Order confirmation email sent', { orderId, emailId: data?.id });

  } catch (error: any) {
    logger.error('Failed to send order confirmation email', { orderId, error: error.message });

    // Log failure to payment_events
    await adminClient.from('payment_events').insert({
      order_id: orderId,
      event_type: 'email.send_failed',
      raw_payload: { error: error.message }
    });
  }
}

async function getUserEmail(userId: string): Promise<string | null> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.getUserById(userId);
  if (error || !data.user) {
    return null;
  }
  return data.user.email || null;
}
