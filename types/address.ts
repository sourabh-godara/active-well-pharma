// ─── Address Types ────────────────────────────────────────────────────────────

export type AddressType = 'Home' | 'Work'

export type Address = {
    id: string
    user_id: string
    name: string
    phone: string
    email?: string | null
    pincode: string
    locality: string
    address_line: string
    city: string
    state: string
    landmark?: string | null
    alt_phone?: string | null
    address_type: AddressType
    is_default: boolean
    created_at: string
    updated_at: string
}

export type AddressFormData = Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>
