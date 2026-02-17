import { handleError, ErrorResponse, SuccessResponse } from './error-handler'

/**
 * Type for server action responses
 */
export type ActionResponse<T = any> = ErrorResponse | SuccessResponse<T>

/**
 * Wrapper for async server actions to automatically handle errors
 * Usage: export const myAction = withErrorHandler(async (data) => { ... })
 */
export function withErrorHandler<TArgs extends any[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult | ErrorResponse> {
    return async (...args: TArgs): Promise<TResult | ErrorResponse> => {
        try {
            return await fn(...args)
        } catch (error) {
            return handleError(error)
        }
    }
}

/**
 * Wrapper specifically for form actions (with prevState parameter)
 * Usage: export const myFormAction = withFormErrorHandler(async (prevState, formData) => { ... })
 */
export function withFormErrorHandler<TResult>(
    fn: (prevState: any, formData: FormData) => Promise<TResult>
): (prevState: any, formData: FormData) => Promise<TResult | ErrorResponse> {
    return async (prevState: any, formData: FormData): Promise<TResult | ErrorResponse> => {
        try {
            return await fn(prevState, formData)
        } catch (error) {
            return handleError(error)
        }
    }
}
