// app/admin/products/loading.tsx
// No 'use client' — pure Server Component

export default function AdminProductsLoading() {
    return (
        <div className="space-y-6">
            {/* Heading + button row */}
            <div className="flex items-center justify-between">
                <div className="h-7 w-24 bg-muted rounded-full animate-pulse" />
                <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
            </div>

            {/* Table */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b flex gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-3 w-16 bg-muted rounded-full animate-pulse" />
                    ))}
                </div>
                <div className="divide-y divide-gray-100">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-6 px-6 py-4">
                            <div className="h-12 w-12 rounded-lg bg-muted animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 w-36 bg-muted rounded-full animate-pulse" />
                                <div className="h-3 w-24 bg-muted rounded-full animate-pulse" />
                            </div>
                            <div className="h-3 w-14 bg-muted rounded-full animate-pulse" />
                            <div className="h-3 w-10 bg-muted rounded-full animate-pulse" />
                            <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-7 w-14 bg-muted rounded-md animate-pulse" />
                                <div className="h-7 w-14 bg-muted rounded-md animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
