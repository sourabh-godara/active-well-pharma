'use client'

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface PerformanceChartProps {
    data: { name: string; value: number }[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Revenue Overview</CardTitle>
                <CardDescription>Revenue trend over the last 7 data points</CardDescription>
            </CardHeader>
            <CardContent>
                {!data || data.length === 0 ? (
                    <div className="flex h-64 items-center justify-center text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">No revenue data yet</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Data will appear as orders come in</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
                                <YAxis axisLine={false} tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
                                        fontSize: '12px'
                                    }}
                                    formatter={(v) => v !== undefined ? [`₹${Number(v).toFixed(2)}`, 'Revenue'] : ['—', 'Revenue']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#4f46e5"
                                    strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
