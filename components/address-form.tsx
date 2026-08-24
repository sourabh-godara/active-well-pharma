'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, MapPin } from 'lucide-react'
import { saveAddress, updateAddress } from '@/app/actions/address'
import type { Address, AddressFormData } from '@/types/address'
import { toast } from 'sonner'

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
]

interface AddressFormProps {
    onClose: () => void
    onSuccess: (address?: Address, guestEmail?: string, replacedAddressId?: string) => void
    existing?: Address | null
    isGuestCheckout?: boolean
    hideHeader?: boolean
}

const defaultForm: AddressFormData & { email?: string } = {
    name: '', phone: '', email: '', pincode: '', locality: '',
    address_line: '', city: '', state: '',
    landmark: '', alt_phone: '',
    address_type: 'Home', is_default: false,
}

export function AddressForm({ onClose, onSuccess, existing, isGuestCheckout, hideHeader }: AddressFormProps) {
    const [form, setForm] = useState<AddressFormData & { email?: string }>(
        existing
            ? {
                name: existing.name, phone: existing.phone, email: '', pincode: existing.pincode,
                locality: existing.locality, address_line: existing.address_line,
                city: existing.city, state: existing.state,
                landmark: existing.landmark ?? '', alt_phone: existing.alt_phone ?? '',
                address_type: existing.address_type, is_default: existing.is_default,
            }
            : defaultForm
    )
    const [isPending, startTransition] = useTransition()

    const set = (key: keyof (AddressFormData & { email?: string }), val: string | boolean) =>
        setForm(prev => ({ ...prev, [key]: val }))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            // For guests, keep email in the address data so it persists in DB.
            // For authenticated users, strip it — their email lives in profiles.
            const { email, ...addressOnly } = form;
            const addressData = isGuestCheckout ? { ...addressOnly, email: email || null } : addressOnly;

            if (isGuestCheckout) {
                // Guests save to DB at checkout time now, not here.
                // We return a mock successful result with a temporary ID.
                const tempId = existing?.id || crypto.randomUUID();
                toast.success(existing ? 'Address updated!' : 'Address saved!')
                onSuccess({ ...addressData, id: tempId, user_id: null } as unknown as Address, email, existing ? existing.id : undefined)
                return;
            }

            const result = existing
                ? await updateAddress(existing.id, addressData)
                : await saveAddress(addressData)

            if (result.success) {
                toast.success(existing ? 'Address updated!' : 'Address saved!')
                onSuccess(result.address, email, existing ? existing.id : undefined)
            } else {
                toast.error(result.error ?? 'Failed to save address')
            }
        })
    }

    const inputCls = 'h-10 text-sm border-gray-200'

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!hideHeader && (
                <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">
                    {existing ? 'Edit Address' : 'Add a New Address'}
                </h3>
            )}



            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <Label className="text-xs text-muted-foreground">Full Name <span className="text-red-500">*</span></Label>
                    <Input required value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="Name" className={`${inputCls} mt-1`} />
                </div>
                {isGuestCheckout && (
                    <div>
                        <Label className="text-xs text-muted-foreground">Email <span className="text-red-500">*</span></Label>
                        <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                            placeholder="Email Address" className={`${inputCls} mt-1`} />
                    </div>
                )}
                <div className={isGuestCheckout ? 'md:col-span-2' : ''}>
                    <Label className="text-xs text-muted-foreground">Phone Number <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2 mt-1">
                        <Input required value={form.phone}
                            onChange={e => set('phone', e.target.value)}
                            placeholder="10-digit mobile number" maxLength={10}
                            pattern="[0-9]{10}" className={`${inputCls} flex-1`} />
                    </div>
                </div>
            </div>

            {/* Row 2: Pincode + Locality */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="text-xs text-muted-foreground">Pincode</Label>
                    <Input required value={form.pincode} onChange={e => set('pincode', e.target.value)}
                        placeholder="Pincode" maxLength={6} pattern="[0-9]{6}" className={`${inputCls} mt-1`} />
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Locality</Label>
                    <Input required value={form.locality} onChange={e => set('locality', e.target.value)}
                        placeholder="Locality" className={`${inputCls} mt-1`} />
                </div>
            </div>

            {/* Address line */}
            <div>
                <Label className="text-xs text-muted-foreground">Address (Area and Street)</Label>
                <textarea required value={form.address_line}
                    onChange={e => set('address_line', e.target.value)}
                    placeholder="Address (Area and Street)"
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
            </div>

            {/* Row 3: City + State */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="text-xs text-muted-foreground">City/District/Town</Label>
                    <Input required value={form.city} onChange={e => set('city', e.target.value)}
                        placeholder="City/District/Town" className={`${inputCls} mt-1`} />
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">State</Label>
                    <select required value={form.state} onChange={e => set('state', e.target.value)}
                        className="mt-1 h-10 w-full rounded-md border border-gray-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="">--Select State--</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Row 4: Landmark + Alt phone */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="text-xs text-muted-foreground">Landmark (Optional)</Label>
                    <Input value={form.landmark ?? ''} onChange={e => set('landmark', e.target.value)}
                        placeholder="Landmark (Optional)" className={`${inputCls} mt-1`} />
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Alternate Phone (Optional)</Label>
                    <Input value={form.alt_phone ?? ''} onChange={e => set('alt_phone', e.target.value)}
                        placeholder="Alternate Phone (Optional)" className={`${inputCls} mt-1`} />
                </div>
            </div>

            {/* Address type */}
            <div>
                <Label className="text-xs text-muted-foreground block mb-2">Address Type</Label>
                <div className="flex gap-6">
                    {(['Home', 'Work'] as const).map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="radio" name="address_type" value={type}
                                checked={form.address_type === type}
                                onChange={() => set('address_type', type)}
                                className="accent-green-600" />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            {/* Default toggle */}
            <div className="flex items-center gap-3">
                <Switch id="is_default" checked={form.is_default}
                    onCheckedChange={v => set('is_default', v)} />
                <Label htmlFor="is_default" className="text-sm cursor-pointer">Set as default address</Label>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 font-semibold uppercase tracking-wide h-11">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SAVE'}
                </Button>
                <button type="button" onClick={onClose}
                    className="text-green-600 hover:text-green-800 font-semibold uppercase tracking-wide text-sm px-4">
                    CANCEL
                </button>
            </div>
        </form>
    )
}
