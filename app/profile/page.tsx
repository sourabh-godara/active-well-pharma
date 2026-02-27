import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAddresses } from '@/app/actions/address'
import ProfileClient from './profile-client'

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const addresses = await getAddresses()

    return <ProfileClient profile={profile} addresses={addresses} />
}
