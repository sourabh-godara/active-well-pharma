// app/admin/orders/loading.tsx
// No 'use client' — pure Server Component

export default function AdminOrdersLoading() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto space-y-1">
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-64 bg-muted rounded-full animate-pulse" />
                </div>
            </div>

            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <th key={i} scope="col" className="px-3 py-3.5 text-left">
                                            <div className="h-3 w-16 bg-muted rounded-full animate-pulse" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">
                                            <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="space-y-1.5">
                                                <div className="h-3 w-28 bg-muted rounded-full animate-pulse" />
                                                <div className="h-3 w-36 bg-muted rounded-full animate-pulse" />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <div className="h-3 w-24 bg-muted rounded-full animate-pulse" />
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <div className="h-3 w-16 bg-muted rounded-full animate-pulse" />
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <div className="h-7 w-24 bg-muted rounded-md animate-pulse" />
                                        </td>
                                        <td className="py-4 pl-3 pr-4 sm:pr-0">
                                            <div className="h-3 w-12 bg-muted rounded-full animate-pulse ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
