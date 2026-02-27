'use client'

import { useState, useTransition } from 'react'
import { Plus, Edit2, Trash2, Star } from 'lucide-react'
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">Saved Addresses</h2>
                {!showForm && !editingAddress && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                    >
                        <Plus className="h-4 w-4" /> Add New
                    </button>
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
                            <div className={`bg-card rounded-2xl shadow-card p-5 border-2 transition-colors ${addr.is_default ? 'border-primary' : 'border-transparent'}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-body text-sm font-semibold text-foreground">
                                                {addr.address_type}
                                            </span>
                                            {addr.is_default && (
                                                <Badge className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 hover:bg-primary/10">
                                                    Default
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="font-body text-sm text-foreground font-medium">{addr.name}</p>
                                        <p className="font-body text-sm text-muted-foreground mt-0.5">
                                            {formatAddress(addr)}
                                        </p>
                                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                                            📞 {addr.phone}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {!addr.is_default && (
                                            <Button
                                                variant="ghost" size="sm"
                                                title="Set as default"
                                                onClick={() => handleSetDefault(addr.id)}
                                                disabled={isPending}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-yellow-500"
                                            >
                                                <Star className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost" size="sm"
                                            onClick={() => setEditingAddress(addr)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost" size="sm"
                                            onClick={() => handleDelete(addr.id)}
                                            disabled={isPending}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
