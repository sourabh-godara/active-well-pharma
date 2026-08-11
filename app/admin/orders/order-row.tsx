'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatus, getOrderDetails } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ChevronDown, MapPin, Package, AlertTriangle, CreditCard, Activity, CheckCircle, XCircle, Info, RotateCcw, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<string, string> = {
    created: 'bg-slate-100 text-slate-700 border-slate-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-sky-50 text-sky-700 border-sky-200',
    confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function OrderRow({ order, isNeedsAttention }: { order: any, isNeedsAttention?: boolean }) {
    const [status, setStatus] = useState(order.status)
    const [loading, startTransition] = useTransition()
    const [expanded, setExpanded] = useState(false)
    const [auditData, setAuditData] = useState<{ payments: any[], paymentEvents: any[] } | null>(null)
    const [loadingAudit, setLoadingAudit] = useState(false)
    const router = useRouter()

    const handleStatusChange = (newStatus: string) => {
        const oldStatus = status
        setStatus(newStatus)
        startTransition(async () => {
            try {
                await updateOrderStatus(order.id, newStatus, oldStatus)
                toast.success('Status updated')
                
                // If currently expanded, refresh audit data to show the log
                if (expanded) {
                    const data = await getOrderDetails(order.id)
                    setAuditData(data)
                }

                router.refresh()
            } catch {
                toast.error('Failed to update status')
                setStatus(oldStatus)
            }
        })
    }

    const toggleExpand = async () => {
        if (!expanded && !auditData) {
            setLoadingAudit(true)
            try {
                const data = await getOrderDetails(order.id)
                setAuditData(data)
            } catch (err) {
                toast.error('Failed to load audit details')
            } finally {
                setLoadingAudit(false)
            }
        }
        setExpanded(v => !v)
    }

    const addr = order.shipping_address || order.delivery_address
    const items: any[] = order.order_items ?? []

    const formatAddr = (a: any) => {
        if (!a) return null
        return [a.name, a.address_line, a.locality, a.city, a.state, a.pincode]
            .filter(Boolean).join(', ')
    }

    const getEventIcon = (type: string) => {
        if (type.includes('success') || type.includes('captured')) return <CheckCircle className="h-4 w-4 text-emerald-500" />
        if (type.includes('signature') || type.includes('failed') || type.includes('error')) return <XCircle className="h-4 w-4 text-rose-500" />
        if (type.includes('stock')) return <AlertTriangle className="h-4 w-4 text-amber-500" />
        if (type.includes('already_confirmed') || type.includes('admin')) return <Info className="h-4 w-4 text-slate-500" />
        return <Activity className="h-4 w-4 text-slate-400" />
    }

    return (
        <>
            {/* Main row */}
            <tr className={`transition-colors group ${isNeedsAttention ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-slate-50'}`}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-mono font-medium text-slate-500 sm:pl-6">
                    <div className="flex items-center gap-2">
                        {isNeedsAttention && (
                            <span title="Needs Attention"><AlertTriangle className="h-4 w-4 text-amber-500" /></span>
                        )}
                        #{order.id.slice(0, 8)}
                    </div>
                </td>
                <td className="px-3 py-4 text-sm">
                    <p className="font-semibold text-slate-900">{order.profiles?.full_name || addr?.name || 'Unknown'}</p>
                    {order.profiles?.email && (
                        <p className="text-xs text-slate-500">{order.profiles.email}</p>
                    )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(order.created_at).toLocaleTimeString('en-IN', {
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="font-semibold text-slate-900">
                        ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </div>
                    {order.shipping_amount > 0 && (
                        <div className="text-[10px] text-slate-500">
                            Includes ₹{Number(order.shipping_amount).toLocaleString('en-IN')} shipping
                        </div>
                    )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <Badge variant="outline" className={`capitalize shadow-sm ${STATUS_STYLES[status] ?? 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                        {status === 'created' ? 'abandoned' : status}
                    </Badge>
                </td>
                <td className="py-4 pl-3 pr-4 text-right sm:pr-6">
                    <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    className="inline-flex items-center justify-center rounded-full h-8 w-8 text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition-colors" 
                                    disabled={loading}
                                    title="Change Status"
                                >
                                    {loading ? <RotateCcw className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white">
                                <DropdownMenuLabel className="text-xs text-slate-500 uppercase">Change Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {['created', 'pending', 'paid', 'confirmed', 'failed', 'shipped', 'delivered', 'cancelled'].map(s => (
                                    <DropdownMenuItem 
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        disabled={status === s}
                                        className="capitalize cursor-pointer text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[s]?.split(' ')[0] || 'bg-slate-200'}`} />
                                            {s === 'created' ? 'abandoned' : s}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                            onClick={toggleExpand}
                            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        >
                            Details
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Expanded detail row */}
            {expanded && (
                <tr className="bg-slate-50/50 border-t border-slate-100 shadow-[inset_0_4px_6px_-4px_rgba(0,0,0,0.05)]">
                    <td colSpan={6} className="px-4 pb-6 pt-5 sm:px-6">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            
                            {/* Left Column: Summary & Items */}
                            <div className="xl:col-span-1 space-y-6">
                                {/* Order Summary Header */}
                                <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                        <Info className="h-4 w-4 text-emerald-500" /> Order Summary
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span className="text-slate-500">Internal ID</span>
                                            <span className="font-mono text-xs">{order.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span className="text-slate-500">Razorpay Order ID</span>
                                            <span className="font-mono text-xs">{order.razorpay_order_id || '—'}</span>
                                        </div>
                                        <div className="pt-2">
                                            <p className="font-semibold text-slate-900 mb-1">Customer Info</p>
                                            <p className="text-slate-600">{order.profiles?.full_name || 'Unknown'}</p>
                                            <p className="text-slate-500 text-xs">{order.profiles?.email}</p>
                                        </div>
                                        {addr && (
                                            <div className="pt-2">
                                                <p className="font-semibold text-slate-900 mb-1">Shipping Address</p>
                                                <p className="text-slate-600 text-xs leading-relaxed">{formatAddr(addr)}</p>
                                                <p className="text-slate-500 text-xs mt-1">📞 {addr.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items Card */}
                                <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Package className="h-4 w-4 text-emerald-500" /> Line Items
                                        </h4>
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                                            {items.length} {items.length === 1 ? 'item' : 'items'}
                                        </Badge>
                                    </div>
                                    {items.length > 0 ? (
                                        <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {items.map((item: any) => (
                                                <li key={item.id} className="flex flex-col gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                                                    <div className="flex items-center gap-3">
                                                        {item.product?.image_url ? (
                                                            <img src={item.product.image_url} alt={item.product?.name} className="h-10 w-10 rounded-md object-cover border border-slate-200/60 bg-white" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200/60"><Package className="h-4 w-4 text-slate-400" /></div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 truncate">{item.product?.name ?? 'Unknown product'}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-slate-800">₹{(item.quantity * item.price_at_purchase).toLocaleString('en-IN')}</p>
                                                            <p className="text-[10px] text-slate-500">@ ₹{item.price_at_purchase}/ea</p>
                                                        </div>
                                                    </div>
                                                    {/* Price discrepancy warning */}
                                                    {item.product && item.price_at_purchase !== item.product.price && (
                                                        <div className="mt-1 flex items-start gap-1.5 text-[11px] text-amber-600 bg-amber-50 p-1.5 rounded border border-amber-100">
                                                            <Info className="h-3.5 w-3.5 shrink-0" />
                                                            <p>Purchased at ₹{item.price_at_purchase}. Current catalog price is ₹{item.product.price}.</p>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-24 text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                            <Package className="h-6 w-6 mb-2 opacity-20" />
                                            <p className="text-xs font-medium">No items</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Payments & Audit Timeline */}
                            <div className="xl:col-span-2 space-y-6">
                                
                                {/* Payment Record */}
                                <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                        <CreditCard className="h-4 w-4 text-emerald-500" /> Payment Record
                                    </h4>
                                    
                                    {loadingAudit ? (
                                        <div className="flex items-center justify-center h-20">
                                            <RotateCcw className="h-5 w-5 text-slate-400 animate-spin" />
                                        </div>
                                    ) : auditData?.payments.length ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead>
                                                    <tr className="text-left text-xs font-semibold text-slate-500">
                                                        <th className="pb-3 pr-3">Payment ID</th>
                                                        <th className="pb-3 px-3">Amount</th>
                                                        <th className="pb-3 px-3">Method</th>
                                                        <th className="pb-3 px-3">Status</th>
                                                        <th className="pb-3 pl-3">Verified Via</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-sm">
                                                    {auditData.payments.map((p, i) => (
                                                        <tr key={p.id || i}>
                                                            <td className="py-3 pr-3 font-mono text-xs text-slate-700">{p.razorpay_payment_id}</td>
                                                            <td className="py-3 px-3">{(p.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: p.currency })}</td>
                                                            <td className="py-3 px-3 uppercase text-xs text-slate-600">{p.method || '—'}</td>
                                                            <td className="py-3 px-3">
                                                                <Badge variant="outline" className="text-[10px] capitalize bg-slate-50">
                                                                    {p.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-3 pl-3 font-medium text-xs text-slate-500">{p.verified_via}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-24 text-slate-500 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                            <p className="text-sm font-medium">Awaiting payment confirmation</p>
                                        </div>
                                    )}
                                </div>

                                {/* Audit Timeline */}
                                <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                        <Activity className="h-4 w-4 text-emerald-500" /> Audit Timeline
                                    </h4>

                                    {loadingAudit ? (
                                        <div className="flex items-center justify-center h-40">
                                            <RotateCcw className="h-5 w-5 text-slate-400 animate-spin" />
                                        </div>
                                    ) : auditData?.paymentEvents.length ? (
                                        <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
                                            {auditData.paymentEvents.map((evt, i) => (
                                                <div key={evt.id || i} className="relative pl-6">
                                                    <div className="absolute -left-[9px] top-1 bg-white p-0.5 rounded-full border border-slate-200 shadow-sm">
                                                        {getEventIcon(evt.event_type)}
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                                                        <p className="text-sm font-semibold text-slate-900 break-all">{evt.event_type}</p>
                                                        <span className="text-xs text-slate-500 shrink-0">
                                                            {new Date(evt.created_at).toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                    
                                                    {evt.ip_address && (
                                                        <p className="text-[10px] text-slate-400 font-mono mb-2">IP: {evt.ip_address}</p>
                                                    )}

                                                    {evt.raw_payload && (
                                                        <details className="mt-2 group text-xs">
                                                            <summary className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium list-none flex items-center gap-1 select-none">
                                                                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:-rotate-180" />
                                                                View Payload
                                                            </summary>
                                                            <div className="mt-2 p-3 bg-slate-900 rounded-lg overflow-x-auto border border-slate-800 shadow-inner">
                                                                <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
                                                                    {JSON.stringify(evt.raw_payload, null, 2)}
                                                                </pre>
                                                            </div>
                                                        </details>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-32 text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                            <Activity className="h-6 w-6 mb-2 opacity-20" />
                                            <p className="text-xs font-medium">No audit events recorded yet</p>
                                        </div>
                                    )}
                                </div>
                                
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}
