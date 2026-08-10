'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, Package, ShoppingCart, LogOut,
    Users, Megaphone, Presentation, Ticket, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', href: '/admin/products', icon: Package, exact: false },
    { name: 'Banners', href: '/admin/banners', icon: Megaphone, exact: false },
    { name: 'Pop-Ups', href: '/admin/promotions', icon: Presentation, exact: false },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket, exact: false },
    { name: 'Users', href: '/admin/users', icon: Users, exact: false },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, exact: false },
    { name: 'Settings', href: '/admin/settings', icon: Settings, exact: false },
]

// Pure sidebar content — no positioning, no fixed/absolute
export function AdminSidebarContent() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center px-6 border-b">
                <span className="text-base font-bold text-indigo-600 tracking-tight">Dashboard</span>
            </div>

            <ScrollArea className="flex-1 px-3 py-4">
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Main Menu
                </p>
                <nav className="space-y-0.5">
                    {navigation.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-indigo-600' : '')} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </ScrollArea>

            <div className="p-3 border-t">
                <Separator className="mb-3" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </div>
    )
}
