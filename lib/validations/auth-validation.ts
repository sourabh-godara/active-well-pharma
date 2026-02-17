import { z } from 'zod'

/**
 * Login schema
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Signup schema
 */
export const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
    fullName: z
        .string()
        .min(1, 'Full name is required')
        .max(255, 'Full name is too long')
        .trim(),
})

export type SignupInput = z.infer<typeof signupSchema>
