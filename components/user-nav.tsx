
'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { useUser } from '@/app/context/user-context'

export function UserNav() {
    const { profile, loading } = useUser();

    if (loading) {
        return <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
    }

    if (profile) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/profile" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <User className="h-6 w-6" />
                    <span className="text-sm font-medium">
                        {profile.full_name || profile.email?.split('@')[0] || 'Account'}
                    </span>
                </Link>
                <form action={logout}>
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
                        Sign out
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-semibold leading-6 text-gray-900">
                Log in
            </Link>
            <Link href="/auth/signup" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign up
            </Link>
        </div>
    )
}
