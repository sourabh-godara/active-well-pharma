import { AdminSidebarContent } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { MobileSidebarTrigger } from '@/components/admin/mobile-sidebar-trigger'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Manage your store',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen mx-auto w-full bg-[#F8F9FA]">

            {/* ── Desktop fixed sidebar ─────────────────────────── */}
            {/* Fixed, 256px (w-64) wide, full height, z-50 */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col border-r border-gray-100 bg-white">
                <AdminSidebarContent />
            </div>

            {/* ── Main area (offset right of sidebar on desktop) ── */}
            <div className="lg:pl-64 flex flex-col min-h-screen">

                {/* Sticky top header */}
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 sm:px-6">
                    {/* Mobile hamburger — hidden on desktop */}
                    <MobileSidebarTrigger />
                    {/* Greeting + bell + avatar */}
                    <div className="flex flex-1 items-center">
                        <AdminHeader />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

            </div>
        </div>
    )
}
