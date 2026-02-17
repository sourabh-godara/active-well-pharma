'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import {
    handleError,
    AuthenticationError,
    ErrorCode,
    validateWithSchema,
    type ActionResponse,
} from '@/lib/errors'
import { loginSchema, signupSchema } from '@/lib/validations/auth-validation'

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

export async function logout(): Promise<ActionResponse> {
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
