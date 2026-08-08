'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, AlertTriangle, Download } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useEffect } from 'react'

export function OrderFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [debouncedSearch] = useDebounce(search, 300)

    const handleFilterChange = useCallback((name: string, value: string | string[] | null) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value === null || (Array.isArray(value) && value.length === 0) || value === '') {
            params.delete(name)
        } else if (Array.isArray(value)) {
            params.delete(name)
            value.forEach(v => params.append(name, v))
        } else {
            params.set(name, value)
        }
        
        params.set('page', '1') // Reset pagination on filter change
        router.push(`?${params.toString()}`)
    }, [searchParams, router])

    useEffect(() => {
        if (debouncedSearch !== (searchParams.get('search') || '')) {
            handleFilterChange('search', debouncedSearch)
        }
    }, [debouncedSearch, handleFilterChange, searchParams])

    const needsAttention = searchParams.get('needs_attention') === 'true'
    
    const handleExport = () => {
        const query = searchParams.toString()
        window.location.href = `/api/admin/orders/export${query ? `?${query}` : ''}`
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by order ID, email, name..."
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-colors"
                />
            </div>
            
            <div className="flex gap-2">
                <select
                    className="border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                    value={searchParams.get('status') || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="created">Created</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                </select>

                <button
                    onClick={() => handleFilterChange('needs_attention', needsAttention ? null : 'true')}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${needsAttention ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                >
                    <AlertTriangle className={`h-4 w-4 ${needsAttention ? 'text-amber-600' : 'text-slate-400'}`} />
                    Needs Attention
                </button>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-2 border border-slate-300 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <Download className="h-4 w-4 text-slate-500" />
                    Export
                </button>
            </div>
        </div>
    )
}
