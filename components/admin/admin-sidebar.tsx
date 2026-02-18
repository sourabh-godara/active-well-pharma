'use client'

import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Users, Megaphone, Presentation } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Banners', href: '/admin/banners', icon: Megaphone },
    { name: 'Pop-Ups', href: '/admin/promotions', icon: Presentation },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-100">
                <span className="text-2xl font-bold text-indigo-600">Dashboard</span>
            </div>
            <nav className="flex flex-1 flex-col mt-4">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">Main Menu</div>
                        <ul role="list" className="-mx-2 space-y-1 mt-2">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            pathname === item.href
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200'
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                'h-6 w-6 shrink-0 transition-colors duration-200'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto">
                        <button
                            type="button"
                            onClick={() => logout()}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-colors duration-200"
                        >
                            <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600 transition-colors duration-200" aria-hidden="true" />
                            Sign out
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
