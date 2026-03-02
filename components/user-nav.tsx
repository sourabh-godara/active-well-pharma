// components/user-nav.tsx
'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/context/user-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'

const supabase = createClient()

export function UserNav() {
    const { profile, loading } = useUser()
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) {
        return <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
    }

    if (profile) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/profile" className="hover:text-primary text-foreground/70 flex items-center gap-1">
                    <User className="h-6 w-6" />
                    <span className="text-sm font-medium">
                        {profile.full_name || profile.email?.split('@')[0] || 'Account'}
                    </span>
                </Link>
                {/*  <Button variant="ghost" onClick={handleSignOut}>
                    Sign out
                </Button> */}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/auth/login">
                <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/auth/signup">
                <Button>Sign up</Button>
            </Link>
        </div>
    )
}
