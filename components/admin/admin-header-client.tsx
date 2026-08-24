'use client'

import { Bell, LogOut, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminHeaderClientProps {
    fullName: string
    initials: string
}

export function AdminHeaderClient({ fullName, initials }: AdminHeaderClientProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
                    Good to see you, <span className="text-indigo-600">{fullName}</span>
                </h1>
            </div>

            <div className="flex items-center gap-2">

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2.5 px-2 h-auto py-1">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-indigo-50 text-indigo-600 text-sm font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex sm:flex-col sm:items-start sm:gap-0.5 text-left">
                                <span className="text-sm font-semibold text-gray-900 leading-none">{fullName}</span>
                                <span className="text-xs font-medium text-gray-500 leading-none">Administrator</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                            Signed in as
                        </DropdownMenuLabel>
                        <DropdownMenuLabel className="pt-0">{fullName}</DropdownMenuLabel>


                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
