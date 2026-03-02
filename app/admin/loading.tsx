// app/admin/loading.tsx
// No 'use client' — pure Server Component
// Renders inside app/admin/layout.tsx — sidebar + header are NOT included here

function StatCardSkeleton() {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-muted rounded-full animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="h-7 w-28 bg-muted rounded-full animate-pulse" />
            <div className="h-3 w-36 bg-muted rounded-full animate-pulse" />
        </div>
    )
}

export default function AdminDashboardLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page title */}
            <div className="space-y-1">
                <div className="h-7 w-32 bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-48 bg-muted rounded-full animate-pulse" />
            </div>

            {/* 4 stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Chart + status summary — matches grid-cols-3 */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="h-4 w-36 bg-muted rounded-full animate-pulse mb-6" />
                    <div className="h-56 w-full bg-muted rounded-xl animate-pulse" />
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
                    <div className="h-4 w-28 bg-muted rounded-full animate-pulse" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                            <div className="h-5 w-10 bg-muted rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent orders table skeleton */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <div className="h-4 w-28 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="divide-y divide-gray-100">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4">
                            <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                            <div className="h-3 w-28 bg-muted rounded-full animate-pulse flex-1" />
                            <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                            <div className="h-3 w-16 bg-muted rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
