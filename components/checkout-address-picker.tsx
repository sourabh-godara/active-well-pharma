'use client'

import { useState } from 'react'
import { MapPin, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddressForm } from '@/components/address-form'
import type { Address } from '@/types/address'
import Link from 'next/link'

interface CheckoutAddressPickerProps {
    addresses: Address[]
    selected: Address | null
    onSelect: (addr: Address) => void
}

export function CheckoutAddressPicker({ addresses, selected, onSelect }: CheckoutAddressPickerProps) {
    const [showForm, setShowForm] = useState(false)

    const formatAddress = (a: Address) =>
        [a.address_line, a.locality, a.city, a.state, a.pincode]
            .filter(Boolean).join(', ')

    if (addresses.length === 0 && !showForm) {
        return (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center space-y-3">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500">No saved addresses found.</p>
                <Button size="sm" variant="outline" onClick={() => setShowForm(true)} className="gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Address
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Delivery Address
                </h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-xs text-green-600 hover:underline flex items-center gap-0.5"
                    >
                        <Plus className="h-3 w-3" /> Add New
                    </button>
                )}
            </div>

            {/* Add new address inline */}
            {showForm && (
                <div className="rounded-lg border border-gray-200 p-4">
                    <AddressForm
                        onClose={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false)
                            window.location.reload()
                        }}
                    />
                </div>
            )}

            {/* Address list */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
                {addresses.map(addr => {
                    const isSelected = selected?.id === addr.id
                    return (
                        <button
                            key={addr.id}
                            type="button"
                            onClick={() => onSelect(addr)}
                            className={`w-full text-left rounded-lg border-2 px-4 py-3 transition-all ${isSelected
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span className="text-xs font-semibold text-gray-700">{addr.address_type}</span>
                                        {addr.is_default && (
                                            <Badge className="text-[10px] bg-gray-100 text-gray-600 hover:bg-gray-100 font-medium px-1.5 py-0">
                                                Default
                                            </Badge>
                                        )}
                                        <span className="text-xs font-medium text-gray-900">{addr.name}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{formatAddress(addr)}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">📞 {addr.phone}</p>
                                </div>
                                {isSelected && (
                                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {!selected && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                    ⚠ Please select a delivery address to continue.
                </p>
            )}
        </div>
    )
}
