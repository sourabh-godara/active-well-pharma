'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies, headers } from 'next/headers'
import {
    handleError,
    AuthenticationError,
    ErrorCode,
    validateWithSchema,
    createSuccessResponse,
    type ActionResponse,
} from '@/lib/errors'
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth-validation'
import { createRateLimiter } from '@/lib/rate-limit'
import { AppError } from '@/lib/errors'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPasswordResetEmail } from '@/lib/email/send-password-reset'
import { sendPasswordResetSuccessEmail } from '@/lib/email/send-password-reset-success'
import { logger } from '@/lib/logger'

export async function login(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        // Extract and validate input
        const rawData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }

        const validatedData = validateWithSchema(loginSchema, rawData)

        // Attempt login
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password,
        })

        if (error) {
            throw new AuthenticationError(
                'Invalid login credentials',
                ErrorCode.INVALID_CREDENTIALS
            )
        }

        // Success - revalidate and redirect
        revalidatePath('/', 'layout')
        redirect('/')
    } catch (error) {
        return handleError(error)
    }
}

export async function signup(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        // Extract and validate input
        const rawData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            fullName: formData.get('fullName') as string,
        }

        const validatedData = validateWithSchema(signupSchema, rawData)

        // Attempt signup
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
            options: {
                data: {
                    full_name: validatedData.fullName,
                },
            },
        })

        if (error) {
            throw new AuthenticationError(
                error.message,
                ErrorCode.AUTHENTICATION_ERROR
            )
        }

        // Success - revalidate and redirect
        revalidatePath('/', 'layout')
        redirect('/')
    } catch (error) {
        return handleError(error)
    }
}

export async function logout(formData?: FormData): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.signOut()

        if (error) {
            throw new AuthenticationError(
                'Failed to sign out',
                ErrorCode.AUTHENTICATION_ERROR
            )
        }

        revalidatePath('/', 'layout')
        redirect('/auth/login')
    } catch (error) {
        return handleError(error)
    }
}

// ── Password Reset ───────────────────────────────────────────

const FORGOT_PASSWORD_MAX_REQUESTS = 3;
const FORGOT_PASSWORD_WINDOW_MS = 15 * 60 * 1_000; // 15 minutes
const forgotPasswordLimiter = createRateLimiter(FORGOT_PASSWORD_MAX_REQUESTS, FORGOT_PASSWORD_WINDOW_MS);

export async function forgotPassword(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
    try {
        // Extract and validate input
        const rawData = {
            email: formData.get('email') as string,
        }

        const validatedData = validateWithSchema(forgotPasswordSchema, rawData)
        const normalizedEmail = validatedData.email.toLowerCase()

        // Rate limit by IP and email to prevent abuse
        const reqHeaders = await headers()
        const ip = reqHeaders.get('x-forwarded-for') ?? 'unknown'
        
        const ipLimitResult = await forgotPasswordLimiter.check(`forgot-password:ip:${ip}`)
        const emailLimitResult = await forgotPasswordLimiter.check(`forgot-password:email:${normalizedEmail}`)
        
        if (!ipLimitResult.allowed || !emailLimitResult.allowed) {
            throw new AppError(
                'Too many reset attempts. Please try again later.',
                ErrorCode.RATE_LIMIT_EXCEEDED,
            )
        }

        // Send reset email via Custom Email Template (Resend)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
        const adminClient = createAdminClient()

        // 1. Generate the reset link using the admin API
        const { data, error } = await adminClient.auth.admin.generateLink({
            type: 'recovery',
            email: normalizedEmail,
            options: {
                redirectTo: `${appUrl}/auth/callback?next=/auth/reset-password`,
            }
        })

        // 2. Send the professional email
        if (!error && data?.properties?.action_link) {
            await sendPasswordResetEmail(normalizedEmail, data.properties.action_link)
        } else if (error) {
            // Log but do not throw to avoid email enumeration
            logger.error('Failed to generate reset link', { email: normalizedEmail, error: error.message })
        }

        // Always return success — never reveal whether the email exists
        return createSuccessResponse(
            undefined,
            'If an account with that email exists, you will receive a password reset link shortly.',
        )
    } catch (error) {
        return handleError(error)
    }
}

export async function resetPassword(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
    try {
        const rawData = {
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }
        
        const validatedData = validateWithSchema(resetPasswordSchema, rawData)
        
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // Ensure user has an active session from the callback route
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user || !user.email) {
            throw new AuthenticationError('Session expired. Please request a new reset link.', ErrorCode.AUTHENTICATION_ERROR)
        }

        // Atomically update password and send notification
        const { error: updateError } = await supabase.auth.updateUser({
            password: validatedData.password,
        })
        
        if (updateError) {
            throw new AuthenticationError(updateError.message, ErrorCode.AUTHENTICATION_ERROR)
        }

        await sendPasswordResetSuccessEmail(user.email)
        await supabase.auth.signOut()

        return createSuccessResponse(undefined, 'Password reset successfully.')
    } catch (error) {
        return handleError(error)
    }
}
