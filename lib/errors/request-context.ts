import { AsyncLocalStorage } from 'async_hooks'

/**
 * Request context interface
 */
interface RequestContext {
    requestId: string
}

/**
 * AsyncLocalStorage for storing request-specific context
 * This allows us to track request IDs across async operations in server actions
 */
export const requestContext = new AsyncLocalStorage<RequestContext>()

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
    return crypto.randomUUID()
}

/**
 * Get the current request ID from context
 * Returns undefined if not in a request context
 */
export function getRequestId(): string | undefined {
    const context = requestContext.getStore()
    return context?.requestId
}

/**
 * Execute a function within a request context with a generated request ID
 * This is useful for wrapping server actions
 */
export async function withRequestId<T>(
    fn: () => Promise<T>
): Promise<T> {
    const requestId = generateRequestId()
    return requestContext.run({ requestId }, fn)
}

/**
 * Execute a function within a request context with a specific request ID
 * Useful when request ID is already available (e.g., from middleware)
 */
export async function withSpecificRequestId<T>(
    requestId: string,
    fn: () => Promise<T>
): Promise<T> {
    return requestContext.run({ requestId }, fn)
}
