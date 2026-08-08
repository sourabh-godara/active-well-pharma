/**
 * Structured logging module for payment flows.
 *
 * In production, replace this with a proper structured logger (e.g. Pino)
 * that supports log levels, JSON output, and sampling. This is a minimal
 * implementation for observability beyond the payment_events table.
 *
 * NOTE: Never log full request/response bodies that might contain a
 * signature or secret in plaintext — payment_events.raw_payload is
 * the one sanctioned place for raw Razorpay payloads.
 */

type LogLevel = 'info' | 'warn' | 'error';

const LOG_PREFIX = '[payment]';

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${LOG_PREFIX} ${level.toUpperCase()} ${message}${metaStr}`;
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>): void {
    console.info(formatMessage('info', message, meta));
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(formatMessage('warn', message, meta));
  },

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(formatMessage('error', message, meta));
  },
} as const;
