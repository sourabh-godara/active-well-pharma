
import Link from 'next/link'
import { Bell, Search, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function AdminHeader() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Fetch user profile for name if available, otherwise fallback
    let fullName = 'Admin User'
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()
        if (profile?.full_name) {
            fullName = profile.full_name
        }
    }

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1 items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Good Morning, {fullName}</h1>
                </div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <div className="flex items-center gap-x-4">
                        <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile Dropdown Mock */}
                        <div className="relative flex items-center gap-x-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <User className="h-5 w-5" />
                            </div>
                            <span className="hidden lg:flex lg:items-center">
                                <span className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                                    {fullName}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
