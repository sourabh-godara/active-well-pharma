'use client'

import { useState, useTransition } from 'react'
import { Plus, Edit2, Trash2, Star, Home, MoreVertical, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddressForm } from '@/components/address-form'
import { deleteAddress, setDefaultAddress } from '@/app/actions/address'
import type { Address } from '@/types/address'
import { toast } from 'sonner'

interface AddressesSectionProps {
    initialAddresses: Address[]
}

export function AddressesSection({ initialAddresses }: AddressesSectionProps) {
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
    const [showForm, setShowForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSuccess = () => {
        setShowForm(false)
        setEditingAddress(null)
        // Refresh by reloading - server will provide fresh data on next mount
        window.location.reload()
    }

    const handleDelete = (id: string) => {
        if (!confirm('Delete this address?')) return
        startTransition(async () => {
            const result = await deleteAddress(id)
            if (result.success) {
                setAddresses(prev => prev.filter(a => a.id !== id))
                toast.success('Address deleted')
            } else {
                toast.error(result.error ?? 'Failed to delete')
            }
        })
    }

    const handleSetDefault = (id: string) => {
        startTransition(async () => {
            const result = await setDefaultAddress(id)
            if (result.success) {
                setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })))
                toast.success('Default address updated')
            } else {
                toast.error(result.error ?? 'Failed to update')
            }
        })
    }

    const formatAddress = (a: Address) =>
        [a.address_line, a.locality, a.city, a.state, a.pincode]
            .filter(Boolean).join(', ')

    return (
        <div className="space-y-4">
            {/* Header / Add Button Row */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <MapPin className="w-3.5 h-3.5 text-green-700" />
                        </div>
                        Address
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 ml-8">Manage your default address for deliveries</p>
                </div>
                {!showForm && !editingAddress && (
                    <Button
                        variant="outline"
                        onClick={() => setShowForm(true)}
                        className="text-sm text-green-700 font-medium hover:text-green-50 flex items-center gap-1.5 border-green-200 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" /> Add New Address
                    </Button>
                )}
            </div>

            {/* Add form */}
            {showForm && (
                <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
                    <AddressForm
                        onClose={() => setShowForm(false)}
                        onSuccess={handleSuccess}
                    />
                </div>
            )}

            {/* Address cards */}
            {addresses.length === 0 && !showForm ? (
                <div className="bg-card rounded-2xl shadow-card p-8 text-center text-muted-foreground text-sm">
                    No saved addresses yet.{' '}
                    <button onClick={() => setShowForm(true)} className="text-primary font-medium hover:underline">
                        Add one →
                    </button>
                </div>
            ) : (
                addresses.map(addr => (
                    <div key={addr.id}>
                        {editingAddress?.id === addr.id ? (
                            <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
                                <AddressForm
                                    existing={addr}
                                    onClose={() => setEditingAddress(null)}
                                    onSuccess={handleSuccess}
                                />
                            </div>
                        ) : (
                            <div className={`rounded-2xl p-5 border transition-colors flex items-start gap-4 ${addr.is_default ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-100 shadow-sm'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${addr.is_default ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <Home className={`w-5 h-5 ${addr.is_default ? 'text-green-700' : 'text-gray-500'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {addr.is_default && (
                                            <Badge className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0 hover:bg-green-100 border-none shadow-none">
                                                Default
                                            </Badge>
                                        )}
                                        {!addr.is_default && (
                                            <Badge className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0 hover:bg-gray-100 border-none shadow-none">
                                                {addr.address_type}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="font-bold text-sm text-gray-900 mt-1">{addr.name}</p>
                                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                                        {formatAddress(addr)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Phone: {addr.phone}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-4">
                                    <Button
                                        variant="outline" size="sm"
                                        onClick={() => setEditingAddress(addr)}
                                        className="h-8 rounded-full text-xs font-medium border-gray-200 text-gray-700 gap-1.5"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" /> Edit
                                    </Button>
                                    <div className="relative group">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 rounded-full border border-transparent hover:border-gray-200">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                                            {!addr.is_default && (
                                                <button onClick={() => handleSetDefault(addr.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-gray-700">
                                                    Set as Default
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(addr.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded-lg text-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}
