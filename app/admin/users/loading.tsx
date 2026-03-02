// app/admin/users/loading.tsx
// No 'use client' — pure Server Component

export default function AdminUsersLoading() {
    return (
        <div>
            {/* Heading */}
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto space-y-1">
                    <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-56 bg-muted rounded-full animate-pulse" />
                </div>
            </div>

            <div className="mt-8 flow-root space-y-4">
                {/* Search + filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="h-9 w-full max-w-sm bg-muted rounded-md animate-pulse" />
                    <div className="flex gap-3">
                        <div className="h-9 w-28 bg-muted rounded-md animate-pulse" />
                        <div className="h-9 w-28 bg-muted rounded-md animate-pulse" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                                    <th key={h} scope="col" className="px-3 py-3.5 text-left">
                                        <div className="h-3 w-14 bg-muted rounded-full animate-pulse" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted animate-pulse flex-shrink-0" />
                                            <div className="space-y-1.5">
                                                <div className="h-3 w-28 bg-muted rounded-full animate-pulse" />
                                                <div className="h-3 w-36 bg-muted rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="flex gap-2">
                                            <div className="h-7 w-16 bg-muted rounded-md animate-pulse" />
                                            <div className="h-7 w-16 bg-muted rounded-md animate-pulse" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
