
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    subtext?: string
}

export function StatsCard({ title, value, icon: Icon, change, changeType = 'neutral', subtext }: StatsCardProps) {
    return (
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
                <div>
                    <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
                    <dd className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{value}</dd>
                </div>
                <div className="rounded-md bg-indigo-50 p-3">
                    <Icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
            </div>
            {(change || subtext) && (
                <div className="mt-4 flex items-baseline text-sm">
                    {change && (
                        <span
                            className={cn(
                                changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-500',
                                'font-semibold'
                            )}
                        >
                            {change}
                        </span>
                    )}
                    {subtext && <span className="ml-2 text-gray-500">{subtext}</span>}
                </div>
            )}
        </div>
    )
}
