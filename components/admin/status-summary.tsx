import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface StatusSummaryProps {
    pendingCount: number
    totalCount: number
}

export function StatusSummary({ pendingCount, totalCount }: StatusSummaryProps) {
    const completedCount = totalCount - pendingCount
    const pendingPct = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0
    const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Status Summary</CardTitle>
                <p className="text-xs text-muted-foreground">Order fulfillment breakdown</p>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* Pending */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">Pending</Badge>
                        </div>
                        <span className="text-sm font-semibold">{pendingCount} <span className="text-muted-foreground font-normal text-xs">({pendingPct}%)</span></span>
                    </div>
                    <Progress value={pendingPct} className="h-2" />
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
