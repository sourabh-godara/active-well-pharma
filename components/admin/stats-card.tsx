import { ArrowUpRight, LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trendText?: string
    iconClassName?: string
}

export function StatsCard({ title, value, icon: Icon, description, trendText, iconClassName }: StatsCardProps) {
    return (
        <Card className="shadow-none border border-gray-100 rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", iconClassName || "bg-gray-50 text-gray-600")}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{title}</span>
                </div>
                <div>
                    <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
                    <div className="mt-2 flex items-center h-4">
                        {trendText ? (
                            <div className="flex items-center text-xs font-medium text-green-600">
                                {trendText}
                                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                            </div>
                        ) : description ? (
                            <div className="text-xs text-gray-500">{description}</div>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
