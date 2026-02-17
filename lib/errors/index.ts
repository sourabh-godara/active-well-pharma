/**
 * Centralized error handling module
 * 
 * This module provides a production-ready error handling system with:
 * - Custom error classes for different error types
 * - Structured error codes
 * - Environment-aware error sanitization
 * - Request ID tracking for debugging
 * - Operational error guards
 * - Zod validation integration
 * 
 * NOTE: This file exports server-only utilities that use Node.js APIs.
 * For client components, import from './error-handler.client' instead.
 */

// Error classes
export {
    AppError,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    UnknownError,
} from './errors'

// Error codes
export { ErrorCode, ErrorStatusMap } from './error-codes'

// Error handler (SERVER-ONLY)
// These use request context which depends on async_hooks
export {
    handleError,
    sanitizeError,
    createSuccessResponse,
    type ErrorResponse,
    type SuccessResponse,
} from './error-handler'

// Server-only error logging that includes request context
export { logError } from './error-handler'

// Request context
export {
    generateRequestId,
    getRequestId,
    withRequestId,
    withSpecificRequestId,
    requestContext,
} from './request-context'

// Validation utilities
export {
    handleZodError,
    validateWithSchema,
    safeValidateWithSchema,
} from './validation-utils'

// Async wrappers
export {
    withErrorHandler,
    withFormErrorHandler,
    type ActionResponse,
} from './async-wrapper'
