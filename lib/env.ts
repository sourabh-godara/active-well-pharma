/**
 * Payment-critical environment variable validation.
 * Import this module at the top of any payment-related route handler —
 * it validates at module-load time and throws immediately if any
 * required variable is missing or obviously invalid.
 *
 * NOTE: This module is server-only. Never import it in client components.
 */

const REQUIRED_VARS = [
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
] as const;

type PaymentEnv = {
  readonly RAZORPAY_KEY_ID: string;
  readonly RAZORPAY_KEY_SECRET: string;
  readonly RAZORPAY_WEBHOOK_SECRET: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly RESEND_API_KEY: string;
  readonly MSG91_AUTH_KEY?: string; // Optional — COD guest orders disabled if missing
  readonly MSG91_TEMPLATE_ID?: string;
};

function validatePaymentEnv(): PaymentEnv {
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required payment environment variables: ${missing.join(', ')}. ` +
      'Ensure .env.local is populated before starting the server.'
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID!;
  const isTestKey = keyId.startsWith('rzp_test_');
  const isLiveKey = keyId.startsWith('rzp_live_');

  if (!isTestKey && !isLiveKey) {
    // Placeholder value (e.g. YOUR_RAZORPAY_KEY_ID) — warn loudly
    console.warn(
      '[env] RAZORPAY_KEY_ID does not start with "rzp_test_" or "rzp_live_". ' +
      'This looks like a placeholder value — Razorpay API calls will fail.'
    );
  } else if (isLiveKey) {
    console.warn(
      '[env] RAZORPAY_KEY_ID is a LIVE key. Ensure this is intentional.'
    );
  }

  return {
    RAZORPAY_KEY_ID: keyId,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET!,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
    MSG91_TEMPLATE_ID: process.env.MSG91_TEMPLATE_ID,
  };
}

export const paymentEnv: PaymentEnv = validatePaymentEnv();
