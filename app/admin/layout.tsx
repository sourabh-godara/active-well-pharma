
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import type { Metadata } from 'next'
import { AdminHeader } from '@/components/admin/admin-header'

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Manage your store',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <div className="hidden border-r border-gray-200 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <AdminSidebar />
            </div>

            <div className="flex flex-1 flex-col lg:pl-72">
                <AdminHeader />
                <main className="flex-1 py-8">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    )
}
