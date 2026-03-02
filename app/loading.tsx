// app/loading.tsx
// No 'use client' — pure Server Component

function ProductCardSkeleton() {
    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-card">
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-4 space-y-2.5">
                <div className="h-3 w-16 bg-muted rounded-full animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                <div className="flex items-center gap-2 pt-1">
                    <div className="h-4 w-14 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-10 bg-muted rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    )
}

export default function HomeLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero skeleton */}
            <div className="w-full h-[420px] sm:h-[520px] bg-muted animate-pulse" />

            {/* Categories row skeleton */}
            <div className="container-brand mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-20 w-28 flex-shrink-0 rounded-2xl bg-muted animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Bestsellers section */}
            <main className="container-brand mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Section heading */}
                <div className="flex items-end justify-between mb-14">
                    <div className="space-y-2">
                        <div className="h-8 w-56 bg-muted rounded-full animate-pulse" />
                        <div className="h-4 w-40 bg-muted rounded-full animate-pulse" />
                    </div>
                    <div className="hidden sm:block h-9 w-24 bg-muted rounded-full animate-pulse" />
                </div>

                {/* Product grid — matches grid-cols-4 from page.tsx */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </main>

            {/* Benefits strip skeleton */}
            <div className="bg-muted/40 py-12">
                <div className="container-brand mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                                <div className="h-4 w-24 bg-muted rounded-full animate-pulse" />
                                <div className="h-3 w-32 bg-muted rounded-full animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
