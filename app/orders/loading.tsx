// app/orders/loading.tsx
// No 'use client' — pure Server Component

function OrderCardSkeleton() {
    return (
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
            {/* Order header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-2">
                    <div className="h-3 w-48 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-32 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
                </div>
            </div>
            {/* Order items */}
            <div className="mt-4 space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="h-16 w-16 rounded-lg bg-muted animate-pulse flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 w-3/4 bg-muted rounded-full animate-pulse" />
                            <div className="h-3 w-1/2 bg-muted rounded-full animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function OrdersLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page heading */}
                <div className="h-8 w-36 bg-muted rounded-full animate-pulse mb-8" />

                {/* Order cards */}
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <OrderCardSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    )
}
