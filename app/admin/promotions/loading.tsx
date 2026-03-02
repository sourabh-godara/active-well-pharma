// app/admin/promotions/loading.tsx
// No 'use client' — pure Server Component

function PromotionRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <div className="h-16 w-20 rounded-md bg-muted animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-muted rounded-full animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="h-6 w-14 bg-muted rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
            </div>
        </div>
    )
}

export default function AdminPromotionsLoading() {
    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto space-y-1">
                    <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-72 bg-muted rounded-full animate-pulse" />
                </div>
            </div>

            <div className="mt-8 space-y-3">
                <div className="h-10 w-36 bg-muted rounded-lg animate-pulse mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <PromotionRowSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
