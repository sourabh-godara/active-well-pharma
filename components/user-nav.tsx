
'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { useUser } from '@/app/context/user-context'
import { Button } from './ui/button'

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
                    <Button>
                        Sign out
                    </Button>
                </form>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/auth/login">
                <Button variant="outline">
                    Log in
                </Button>
            </Link>
            <Link href="/auth/signup">
                <Button>
                    Sign up
                </Button>
            </Link>
        </div>
    )
}
