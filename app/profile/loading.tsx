// app/profile/loading.tsx
// No 'use client' — pure Server Component

export default function ProfileLoading() {
    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-background">
            <main className="container-brand section-padding px-4 sm:px-6 lg:px-8 py-12">

                {/* ── Header card — matches gradient header in profile-client.tsx ── */}
                <div className="bg-muted rounded-3xl p-8 mb-10 flex flex-col sm:flex-row items-center gap-6 animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-muted-foreground/20 flex-shrink-0" />
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="h-6 w-40 bg-muted-foreground/20 rounded-full mx-auto sm:mx-0" />
                        <div className="h-3 w-32 bg-muted-foreground/20 rounded-full mx-auto sm:mx-0" />
                        <div className="h-3 w-48 bg-muted-foreground/20 rounded-full mx-auto sm:mx-0" />
                    </div>
                    <div className="sm:ml-auto flex gap-3">
                        <div className="h-9 w-28 bg-muted-foreground/20 rounded-full" />
                        <div className="h-9 w-20 bg-muted-foreground/20 rounded-full" />
                    </div>
                </div>

                {/* ── Body — matches grid grid-cols-1 lg:grid-cols-4 gap-8 ── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar nav — col-span-1 */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-2xl p-4 space-y-2">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="h-11 w-full rounded-xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Content panel — col-span-3 */}
                    <div className="lg:col-span-3">
                        <div className="bg-card rounded-2xl shadow-card p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-5 w-40 bg-muted rounded-full animate-pulse" />
                                <div className="h-8 w-16 bg-muted rounded-full animate-pulse" />
                            </div>
                            {/* Fields — matches grid-cols-1 sm:grid-cols-2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                                        <div className="h-4 w-36 bg-muted rounded-full animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
