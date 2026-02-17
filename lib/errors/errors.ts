import { ErrorCode, ErrorStatusMap } from './error-codes'

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
    public readonly code: ErrorCode
    public readonly statusCode: number
    public readonly isOperational: boolean
    public readonly details?: any

    constructor(
        message: string,
        code: ErrorCode,
        isOperational: boolean = true,
        details?: any
    ) {
        super(message)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this, this.constructor)

        this.code = code
        this.statusCode = ErrorStatusMap[code]
        this.isOperational = isOperational
        this.details = details
        this.name = this.constructor.name
    }
}

/**
 * Validation error - for input validation failures
 */
export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, ErrorCode.VALIDATION_ERROR, true, details)
    }
}

/**
 * Database error - for database operation failures
 */
export class DatabaseError extends AppError {
    constructor(message: string, code: ErrorCode = ErrorCode.DATABASE_ERROR, details?: any) {
        super(message, code, true, details)
    }
}

/**
 * Authentication error - for authentication failures
 */
export class AuthenticationError extends AppError {
    constructor(
        message: string = 'Authentication failed',
        code: ErrorCode = ErrorCode.AUTHENTICATION_ERROR,
        details?: any
    ) {
        super(message, code, true, details)
    }
}

/**
 * Authorization error - for authorization/permission failures
 */
export class AuthorizationError extends AppError {
    constructor(
        message: string = 'Insufficient permissions',
        code: ErrorCode = ErrorCode.AUTHORIZATION_ERROR,
        details?: any
    ) {
        super(message, code, true, details)
    }
}

/**
 * Not found error - for resource not found scenarios
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', details?: any) {
        super(message, ErrorCode.RESOURCE_NOT_FOUND, true, details)
    }
}

/**
 * Unknown error - for unexpected/unhandled errors
 * These are non-operational by default
 */
export class UnknownError extends AppError {
    constructor(message: string = 'An unexpected error occurred', details?: any) {
        super(message, ErrorCode.UNKNOWN_ERROR, false, details)
    }
}
