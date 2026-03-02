// app/admin/banners/loading.tsx
// No 'use client' — pure Server Component

function BannerRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <div className="h-5 w-5 bg-muted rounded animate-pulse flex-shrink-0" />
            <div className="h-16 w-24 rounded-md bg-muted animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-56 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
            </div>
        </div>
    )
}

export default function AdminBannersLoading() {
    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto space-y-1">
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-64 bg-muted rounded-full animate-pulse" />
                </div>
            </div>

            <div className="mt-8 space-y-3">
                <div className="h-10 w-32 bg-muted rounded-lg animate-pulse mb-4" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <BannerRowSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
