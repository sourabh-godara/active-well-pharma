
'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts'

interface PerformanceChartProps {
    data: { name: string; value: number }[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center rounded-lg bg-white p-6 shadow">
                <p className="text-gray-500">No data available for chart</p>
            </div>
        )
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-base font-semibold leading-6 text-gray-900">Performance Line Chart</h3>
            <p className="mb-6 text-sm text-gray-500">Revenue trend over time</p>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#4f46e5"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
