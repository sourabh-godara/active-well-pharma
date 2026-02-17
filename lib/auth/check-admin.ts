import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Profile } from '@/types'

export type AdminCheckResult = {
    user: {
        id: string
        email: string | null
    }
    profile: Profile
    supabase: ReturnType<typeof createClient>
}

/**
 * Server-side utility to verify admin access
 * Throws error if user is not authenticated or not an admin
 * @returns Admin user data, profile, and supabase client
 */
export async function checkAdmin(): Promise<AdminCheckResult> {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error('checkAdmin: Authentication failed', authError)
        throw new Error('Unauthorized: Authentication required')
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError) {
        console.error('checkAdmin: Profile fetch failed', profileError)
        throw new Error('Unauthorized: Profile not found')
    }

    if (profile.role !== 'admin') {
        console.warn(`checkAdmin: Access denied for user ${user.id} with role ${profile.role}`)
        throw new Error('Unauthorized: Admin access required')
    }

    return {
        user: {
            id: user.id,
            email: user.email ?? null
        },
        profile,
        supabase
    }
}
