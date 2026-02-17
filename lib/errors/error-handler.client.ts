/**
 * Client-safe error logging utility
 * This file can be imported by client components
 */

/**
 * Log error with proper formatting (client-safe version)
 * Does not use request context since async_hooks is not available in client
 */
export function logError(error: unknown, requestId?: string): void {
    const timestamp = new Date().toISOString()
    const reqId = requestId || 'client'

    if (error instanceof Error) {
        console.error(
            `[${timestamp}] [${reqId}] ${error.name}: ${error.message}`,
            {
                stack: error.stack,
            }
        )
    } else {
        console.error(
            `[${timestamp}] [${reqId}] Unknown error:`,
            error
        )
    }
}
