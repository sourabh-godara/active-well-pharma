import 'server-only'
import { getRequestId } from './request-context'
import { AppError } from './errors'
import {
    ErrorResponse,
    SuccessResponse,
    sanitizeError as baseSanitizeError,
    classifyError,
    createSuccessResponse,
} from './error-handler.base'

// Re-export types and base functions
export type { ErrorResponse, SuccessResponse }
export { createSuccessResponse }

/**
 * Sanitize error (server version with request context support)
 */
export function sanitizeError(error: AppError, requestId?: string): ErrorResponse {
    return baseSanitizeError(error, requestId)
}

/**
 * Main error handler - converts any error into a standardized ErrorResponse
 * This is the primary function to use in server actions
 */
export function handleError(error: unknown, requestId?: string): ErrorResponse {
    // Get request ID from context if not provided
    const finalRequestId = requestId || getRequestId()

    // Classify the error
    const appError = classifyError(error)

    // Log the error
    logError(appError, finalRequestId)

    // Sanitize and return
    return sanitizeError(appError, finalRequestId)
}

/**
 * Log error with proper formatting and request ID
 * In production, this would integrate with a logging service
 */
export function logError(error: unknown, requestId?: string): void {
    const timestamp = new Date().toISOString()
    const reqId = requestId || getRequestId() || 'unknown'

    if (error instanceof AppError) {
        console.error(
            `[${timestamp}] [${reqId}] ${error.name}: ${error.message}`,
            {
                code: error.code,
                statusCode: error.statusCode,
                isOperational: error.isOperational,
                details: error.details,
                stack: error.stack,
            }
        )
    } else if (error instanceof Error) {
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
