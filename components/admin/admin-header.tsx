import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { AdminHeaderClient } from './admin-header-client'

export async function AdminHeader() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    let fullName = 'Admin'
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()
        if (profile?.full_name) fullName = profile.full_name
    }

    const initials = fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return <AdminHeaderClient fullName={fullName} initials={initials} />
}
