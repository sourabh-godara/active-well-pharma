import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface StatusSummaryProps {
    shippedCount: number
    totalCount: number
}

export function StatusSummary({ shippedCount, totalCount }: StatusSummaryProps) {
    const completedCount = totalCount - shippedCount
    const shippedPct = totalCount > 0 ? Math.round((shippedCount / totalCount) * 100) : 0
    const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
        <Card className="h-full shadow-none border border-gray-100 rounded-2xl overflow-hidden">
            <CardHeader className="pb-6">
                <CardTitle className="text-sm font-semibold text-gray-900">Status Summary</CardTitle>
                <p className="text-xs text-gray-500">Order fulfillment breakdown</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Shipped */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">Shipped</Badge>
                        </div>
                        <span className="text-sm font-semibold">{shippedCount} <span className="text-muted-foreground font-normal text-xs">({shippedPct}%)</span></span>
                    </div>
                    <Progress value={shippedPct} className="h-2 [&>div]:bg-purple-500" />
                </div>

                {/* Completed */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
                        </div>
                        <span className="text-sm font-semibold">{completedCount} <span className="text-muted-foreground font-normal text-xs">({completedPct}%)</span></span>
                    </div>
                    <Progress value={completedPct} className="h-2 [&>div]:bg-green-500" />
                </div>

                <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                        {totalCount} total orders tracked
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
