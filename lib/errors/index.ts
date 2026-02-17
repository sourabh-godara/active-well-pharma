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

// Error handler
export {
    handleError,
    logError,
    sanitizeError,
    createSuccessResponse,
    type ErrorResponse,
    type SuccessResponse,
} from './error-handler'

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
