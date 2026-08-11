'use client'

import React, { useState, useCallback, useId } from 'react'
import { MapPin, Plus, CheckCircle2, Home, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddressForm } from '@/components/address-form'
import type { Address } from '@/types/address'

interface CheckoutAddressPickerProps {
    addresses: Address[]
    selected: Address | null
    onSelect: (addr: Address) => void
    onAddressAdded: (addr: Address, guestEmail?: string, replacedId?: string) => void
    onEditAddress?: (addr: Address) => void
    onAddressesChanged?: () => void
    isGuestCheckout?: boolean
}

const formatAddress = (a: Address) =>
    [a.address_line, a.locality, a.city, a.state, a.pincode]
        .filter(Boolean).join(', ')

interface AddressCardProps {
    addr: Address
    isSelected: boolean
    onSelect: (addr: Address) => void
    onEditAddress?: (addr: Address) => void
}

const AddressCard = React.memo(function AddressCard({ addr, isSelected, onSelect, onEditAddress }: AddressCardProps) {
    return (
        <div
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onSelect(addr)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(addr)
                }
            }}
            className={`w-full text-left rounded-lg border-2 px-4 py-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${isSelected
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
        >
            <div className="flex items-start gap-3">
                {isSelected ? (
                    <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-green-700 shrink-0 mt-0.5" />
                ) : (
                    <div aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {addr.address_type === 'Home' ? (
                            <Home aria-hidden="true" className="h-4 w-4 text-gray-500" />
                        ) : (
                            <Briefcase aria-hidden="true" className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm font-bold text-gray-900">{addr.name}</span>
                        {addr.is_default && (
                            <Badge className="text-[10px] bg-green-100 text-green-800 hover:bg-green-100 font-bold px-1.5 py-0 border-transparent shadow-none">
                                Default
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-sm truncate">{formatAddress(addr)}</p>
                    <p className="text-xs text-gray-600 mt-0.5 font-medium">{addr.phone}</p>
                </div>
                {onEditAddress && (
                    <Button
                        type="button"
                        variant="link"
                        className="text-xs font-semibold text-green-700 h-auto p-0"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEditAddress(addr)
                        }}
                    >
                        Edit
                    </Button>
                )}
            </div>
        </div>
    )
})

export function CheckoutAddressPicker({ addresses, selected, onSelect, onAddressAdded, onEditAddress, onAddressesChanged, isGuestCheckout }: CheckoutAddressPickerProps) {
    const [editingAddress, setEditingAddress] = useState<Address | null | undefined>(undefined) // undefined = hidden, null = adding new, Address = editing
    const radioGroupId = useId()

    const handleSuccess = useCallback((newAddr?: Address, guestEmail?: string, replacedId?: string) => {
        setEditingAddress(undefined)
        if (newAddr) {
            if (replacedId) {
                // Was an edit
                onAddressAdded(newAddr, guestEmail, replacedId)
            } else {
                onAddressAdded(newAddr, guestEmail)
            }
            onSelect(newAddr)
        } else {
            if (onAddressesChanged) {
                onAddressesChanged()
            } else {
                window.location.reload()
            }
        }
    }, [onAddressAdded, onSelect, onAddressesChanged])

    if (addresses.length === 0 && editingAddress === undefined) {
        return (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center space-y-3">
                <MapPin aria-hidden="true" className="h-8 w-8 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500">No saved addresses found.</p>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingAddress(null)} className="gap-1">
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" /> Add Address
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Add/Edit address inline */}
            {editingAddress !== undefined && (
                <div className="rounded-lg p-4">
                    <AddressForm
                        key={editingAddress ? editingAddress.id : 'new'}
                        existing={editingAddress || undefined}
                        isGuestCheckout={isGuestCheckout}
                        onClose={() => setEditingAddress(undefined)}
                        onSuccess={handleSuccess}
                    />
                </div>
            )}

            {/* Address list */}
            <div
                id={radioGroupId}
                role="radiogroup"
                aria-label="Delivery address"
                className="space-y-2 max-h-72 overflow-y-auto"
            >
                {addresses.map(addr => (
                    <AddressCard
                        key={addr.id}
                        addr={addr}
                        isSelected={selected?.id === addr.id}
                        onSelect={onSelect}
                        onEditAddress={onEditAddress || setEditingAddress}
                    />
                ))}
            </div>

            {editingAddress === undefined && (
                <>
                    <div className="flex items-center gap-4 py-1">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-xs text-gray-400 uppercase font-medium tracking-wide">or</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setEditingAddress(null)}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed border-gray-200 text-sm font-bold text-gray-600 hover:border-green-600 hover:text-green-700 transition-colors bg-gray-50 hover:bg-green-50/30"
                    >
                        <Plus aria-hidden="true" className="h-4 w-4" /> Add a new address
                    </button>
                </>
            )}

            {!selected && editingAddress === undefined && (
                <p role="alert" className="text-xs font-medium text-amber-600 flex items-center gap-1">
                    ⚠ Please select a delivery address to continue.
                </p>
            )}
        </div>
    )
}
