import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Profile } from '@/types'

export type GetUserOptions = {
    includeProfile?: boolean
}

export type GetUserResult = {
    user: {
        id: string
        email: string | null
        created_at: string
    } | null
    profile?: Profile | null
    error?: string
}

/**
 * Server-side utility to get authenticated user
 * @param options - Configuration options
 * @returns User data with optional profile
 */
export async function getUser(options: GetUserOptions = {}): Promise<GetUserResult> {
    const { includeProfile = false } = options

    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { user: null, error: authError?.message || 'Not authenticated' }
        }

        const userData = {
            id: user.id,
            email: user.email ?? null,
            created_at: user.created_at
        }

        if (!includeProfile) {
            return { user: userData }
        }

        // Fetch profile if requested
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('getUser: Profile fetch error', profileError)
            return {
                user: userData,
                profile: null,
                error: profileError.message
            }
        }

        return { user: userData, profile }
    } catch (err: any) {
        console.error('getUser: Unexpected error', err)
        return {
            user: null,
            error: err.message || 'Failed to get user'
        }
    }
}
