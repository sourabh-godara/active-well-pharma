import { Resend } from 'resend';
import { paymentEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

const resend = new Resend(paymentEnv.RESEND_API_KEY);

export async function sendPasswordResetSuccessEmail(email: string) {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed</title>
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
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Password Changed Successfully</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                This email confirms that the password for your ActiveWell Pharma account was successfully changed.
              </p>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                If you made this change, you can safely ignore this email and continue using your account.
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #991b1b; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Didn't make this change?</h3>
                    <p style="color: #991b1b; font-size: 15px; line-height: 1.5; margin: 0;">
                      If you did not change your password, please contact our support team immediately to secure your account.
                    </p>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 30px 0 0 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://activewellpharma.com'}/contact-us" style="background-color: #f3f4f6; color: #374151; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Contact Support</a>
                  </td>
                </tr>
              </table>
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
                This is a mandatory security notification regarding your account.
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

    const { data, error } = await resend.emails.send({
      from: 'ActiveWell Pharma <orders@activewellpharma.com>', // Match existing email domain
      to: [email],
      subject: 'Your Password Has Been Changed - ActiveWell Pharma',
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    logger.info('Password reset success email sent', { email, emailId: data?.id });
  } catch (error: any) {
    logger.error('Failed to send password reset success email', { email, error: error.message });
    throw error;
  }
}
