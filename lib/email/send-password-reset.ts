import { Resend } from 'resend';
import { paymentEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

const resend = new Resend(paymentEnv.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0; background-color: #052e16;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">ActiveWell Pharma</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                We received a request to reset your password for your ActiveWell Pharma account. To create a new password, click the button below.
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="${resetLink}" style="background-color: #16a34a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Reset My Password</a>
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                If you did not request this change, you can safely ignore this email. Your password will remain the same.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0; word-break: break-all;">
                If you're having trouble clicking the button, copy and paste this URL into your web browser:<br>
                <a href="${resetLink}" style="color: #16a34a; text-decoration: underline;">${resetLink}</a>
              </p>
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center" style="padding: 0 20px;">
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">
                &copy; ${new Date().getFullYear()} ActiveWell Pharma. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
                You are receiving this email because a password reset was requested for your account.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Note: ensure your Resend domain is verified to send from support@ or orders@
    const { data, error } = await resend.emails.send({
      from: 'ActiveWell Pharma <orders@activewellpharma.com>', // Using orders@ to match the order confirmation domain
      to: [email],
      subject: 'Reset Your Password - ActiveWell Pharma',
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    logger.info('Password reset email sent', { email, emailId: data?.id });
  } catch (error: any) {
    logger.error('Failed to send password reset email', { email, error: error.message });
    throw error;
  }
}
