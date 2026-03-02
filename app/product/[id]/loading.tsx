// app/product/[id]/loading.tsx
// No 'use client' — pure Server Component

export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container-brand px-4 sm:px-6 lg:px-8 py-12">

                {/* ── Main 2-col grid — matches page.tsx grid-cols-1 lg:grid-cols-2 ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

                    {/* Left — Image gallery skeleton */}
                    <div className="space-y-3">
                        <div className="aspect-square w-full rounded-2xl bg-muted animate-pulse" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-16 w-16 rounded-lg bg-muted animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Right — Product info skeleton */}
                    <div className="space-y-5">
                        <div className="h-4 w-24 bg-muted rounded-full animate-pulse" />
                        <div className="h-8 w-3/4 bg-muted rounded-full animate-pulse" />
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-28 bg-muted rounded-full animate-pulse" />
                            <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
                        </div>
                        <div className="h-7 w-24 bg-muted rounded-full animate-pulse" />
                        <div className="space-y-2 pt-2">
                            <div className="h-3 w-full bg-muted rounded-full animate-pulse" />
                            <div className="h-3 w-5/6 bg-muted rounded-full animate-pulse" />
                            <div className="h-3 w-4/6 bg-muted rounded-full animate-pulse" />
                        </div>
                        {/* Benefits list */}
                        <div className="space-y-2 pt-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
                                    <div className="h-3 w-40 bg-muted rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                        {/* Add to cart button */}
                        <div className="h-12 w-full rounded-xl bg-muted animate-pulse mt-4" />
                    </div>
                </div>

                {/* ── Tabs skeleton ── */}
                <div className="mt-14">
                    <div className="flex gap-6 border-b border-border">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-5 w-24 bg-muted rounded-full animate-pulse mb-3" />
                        ))}
                    </div>

                    {/* Reviews section — matches lg:grid-cols-12 layout */}
                    <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
                        {/* Rating summary — col-span-4 */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 bg-muted rounded-full animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 w-28 bg-muted rounded-full animate-pulse" />
                                    <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div className="h-28 w-full rounded-xl bg-muted animate-pulse" />
                        </div>

                        {/* Review list — col-span-8 */}
                        <div className="mt-8 lg:col-span-8 lg:mt-0 space-y-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                                        <div className="space-y-1">
                                            <div className="h-3 w-24 bg-muted rounded-full animate-pulse" />
                                            <div className="h-3 w-16 bg-muted rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-muted rounded-full animate-pulse" />
                                    <div className="h-3 w-4/5 bg-muted rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Related products skeleton — matches grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ── */}
                <div className="mt-20">
                    <div className="h-7 w-48 bg-muted rounded-full animate-pulse mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card">
                                <div className="aspect-square bg-muted animate-pulse" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 w-3/4 bg-muted rounded-full animate-pulse" />
                                    <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
