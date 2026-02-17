import { AppError, UnknownError } from './errors'
import { ErrorCode } from './error-codes'
import { getRequestId } from './request-context'
import { PostgrestError } from '@supabase/supabase-js'

/**
 * Standard error response format
 */
export interface ErrorResponse {
    success: false
    error: {
        code: string
        message: string
        details?: any
        requestId?: string
        stack?: string
    }
}

/**
 * Success response format (for consistency)
 */
export interface SuccessResponse<T = any> {
    success: true
    data?: T
    message?: string
}

/**
 * Check if code is running in development mode
 */
function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
}

/**
 * Sanitize error based on environment and operational status
 * - Development: Show full error details including stack
 * - Production: Hide sensitive information, only show safe messages
 * - Non-operational errors: Always treated as UNKNOWN_ERROR
 */
export function sanitizeError(error: AppError, requestId?: string): ErrorResponse {
    const isOperational = error.isOperational
    const isDev = isDevelopment()

    // Non-operational errors should never expose details
    if (!isOperational) {
        return {
            success: false,
            error: {
                code: ErrorCode.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred. Please try again later.',
                requestId,
                ...(isDev && { stack: error.stack }),
            },
        }
    }

    // Operational errors - show based on environment
    return {
        success: false,
        error: {
            code: error.code,
            message: error.message,
            details: isDev ? error.details : undefined,
            requestId,
            stack: isDev ? error.stack : undefined,
        },
    }
}

/**
 * Classify unknown errors into appropriate AppError types
 */
function classifyError(error: unknown): AppError {
    // Already an AppError
    if (error instanceof AppError) {
        return error
    }

    // Supabase/Postgrest errors
    if (isPostgrestError(error)) {
        return handlePostgrestError(error)
    }

    // Standard Error objects
    if (error instanceof Error) {
        return new UnknownError(error.message, { originalError: error.name })
    }

    // Unknown error types
    return new UnknownError('An unexpected error occurred')
}

/**
 * Type guard for Postgrest errors
 */
function isPostgrestError(error: any): error is PostgrestError {
    return error && typeof error === 'object' && 'code' in error && 'message' in error
}

/**
 * Handle Supabase/Postgrest specific errors
 */
function handlePostgrestError(error: PostgrestError): AppError {
    const code = error.code
    const message = error.message

    // Map common Postgrest error codes
    if (code === 'PGRST116' || message.includes('not found')) {
        return new AppError(
            'Resource not found',
            ErrorCode.RECORD_NOT_FOUND,
            true,
            { details: error.details, hint: error.hint }
        )
    }

    if (code === '23505' || message.includes('duplicate')) {
        return new AppError(
            'Duplicate entry',
            ErrorCode.DUPLICATE_ENTRY,
            true,
            { details: error.details }
        )
    }

    if (code?.startsWith('23')) {
        return new AppError(
            'Database constraint violation',
            ErrorCode.CONSTRAINT_VIOLATION,
            true,
            { details: error.details, hint: error.hint }
        )
    }

    // Generic database error
    return new AppError(
        'Database operation failed',
        ErrorCode.DATABASE_ERROR,
        true,
        { code, details: error.details }
    )
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

/**
 * Create a success response
 */
export function createSuccessResponse<T = any>(
    data?: T,
    message?: string
): SuccessResponse<T> {
    return {
        success: true,
        data,
        message,
    }
}
