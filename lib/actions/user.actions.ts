
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create a service role client for admin operations (delete user from auth)
const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface GetUsersParams {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string // 'active' | 'blocked'
}

export async function getUsers({ page = 1, limit = 10, search = '', role = '', status = '' }: GetUsersParams) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: [], total: 0, error: 'Unauthorized' }

    // Verify admin role
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentUserProfile?.role !== 'admin') {
        return { data: [], total: 0, error: 'Unauthorized' }
    }

    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (role && role !== 'all') {
        query = query.eq('role', role)
    }

    if (status && status !== 'all') {
        if (status === 'blocked') {
            query = query.eq('is_blocked', true)
        } else if (status === 'active') {
            query = query.eq('is_blocked', false)
        }
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        return { data: [], total: 0, error: error.message }
    }

    return { data, total: count || 0, error: null }
}

export async function toggleUserBlock(userId: string, isBlocked: boolean) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    if (user.id === userId) {
        throw new Error('Cannot block yourself')
    }

    // Update profile
    const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isBlocked, is_blocked: isBlocked }) // Assuming is_active might be used elsewhere, but mainly is_blocked
        .eq('id', userId)

    // Note: We used 'is_blocked' in schema. 
    // If we want to strictly follow the schema we just set is_blocked.
    // Let's just update is_blocked as per schema update.
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_blocked: isBlocked })
        .eq('id', userId)

    if (updateError) throw new Error(updateError.message)

    revalidatePath('/admin/users')
}

export async function toggleUserRole(userId: string, newRole: 'user' | 'admin') {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    if (user.id === userId) {
        // Prevent demoting yourself if you are the only admin? 
        // For now just allow it but warn in UI? Or block it.
        // "Cannot remove last remaining admin" - this logic is complex to check atomically.
        // Simplest: Don't allow changing your own role.
        throw new Error('Cannot change your own role')
    }

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    if (user.id === userId) {
        throw new Error('Cannot delete yourself')
    }

    // Delete from Auth (requires service role)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/users')
}
