import { z } from 'zod'
import { AppError, ValidationError } from './errors'
import { ErrorCode } from './error-codes'

/**
 * Transform Zod validation errors into ValidationError
 */
export function handleZodError(error: z.ZodError): ValidationError {
    // Format Zod errors into a readable structure
    const formattedErrors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
    }))

    // Create a user-friendly message
    const firstError = formattedErrors[0]
    const message = firstError
        ? `${firstError.field}: ${firstError.message}`
        : 'Validation failed'

    return new ValidationError(message, {
        errors: formattedErrors,
        count: formattedErrors.length,
    })
}

/**
 * Validate data against a Zod schema and throw ValidationError if invalid
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated and parsed data
 * @throws ValidationError if validation fails
 */
export function validateWithSchema<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): T {
    try {
        return schema.parse(data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw handleZodError(error)
        }
        throw error
    }
}

/**
 * Safely validate data and return a result object instead of throwing
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag and either data or error
 */
export function safeValidateWithSchema<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
    try {
        const validData = schema.parse(data)
        return { success: true, data: validData }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: handleZodError(error) }
        }
        return {
            success: false,
            error: new ValidationError('Unexpected validation error'),
        }
    }
}
