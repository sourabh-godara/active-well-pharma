export default function ShopLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-gradient-fresh">
                <div className="container-brand px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="h-3 w-36 bg-white/30 rounded-full mb-3 animate-pulse" />
                    <div className="h-10 w-56 bg-white/40 rounded-full mb-4 animate-pulse" />
                    <div className="h-4 w-80 bg-white/25 rounded-full animate-pulse" />
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <main className="container-brand px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* Count line skeleton */}
                <div className="h-4 w-32 bg-muted rounded-full mb-10 animate-pulse" />

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    )
}

function ProductCardSkeleton() {
    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-card">
            {/* Image */}
            <div className="aspect-square bg-muted animate-pulse" />

            {/* Info */}
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
