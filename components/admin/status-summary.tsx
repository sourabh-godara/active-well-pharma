
interface StatusSummaryProps {
    pendingCount: number
    totalCount: number
}

export function StatusSummary({ pendingCount, totalCount }: StatusSummaryProps) {
    const percentage = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0

    return (
        <div className="rounded-lg text-black  p-6 shadow h-full flex flex-col justify-between">
            <div>
                <h3 className="text-base font-semibold leading-6">Status Summary</h3>
                <p className=" text-sm mt-1">Pending Orders Ratio</p>
            </div>

            <div className="mt-8">
                <div className="mb-2 flex items-end justify-between">
                    <div>
                        <span className="text-4xl font-bold">{pendingCount}</span>
                        <span className=" ml-2">Pending</span>
                    </div>
                </div>

                <div className="w-full bg-indigo-900 rounded-full h-2.5 dark:bg-gray-700">
                    <div className=" h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="mt-2 text-sm ">{percentage}% of total orders pending processed</p>
            </div>
        </div>
    )
}
