'use client'

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface PerformanceChartProps {
    data: { name: string; value: number }[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
    return (
        <Card className="h-full shadow-none border border-gray-100 rounded-2xl overflow-hidden">
            <CardHeader className="pb-6 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-sm font-semibold text-gray-900">Revenue Overview</CardTitle>
                    <CardDescription className="text-gray-500">Revenue trend over the last 7 days</CardDescription>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 bg-white">
                    Last 7 days
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
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
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                                <Area type="monotone" dataKey="value" stroke="#22c55e"
                                    strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
