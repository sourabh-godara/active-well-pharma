'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export interface GuestInfo {
  name: string
  email: string
  phone: string
}

interface GuestContactFormProps {
  value: GuestInfo | null
  onChange: (info: GuestInfo) => void
  hidePersonalInfo?: boolean
}

export function GuestContactForm({ value, onChange, hidePersonalInfo }: GuestContactFormProps) {
  const [name, setName] = useState(value?.name || '')
  const [email, setEmail] = useState(value?.email || '')
  const [phone, setPhone] = useState(value?.phone || '')

  const handleBlur = () => {
    if (name && email && phone) {
      onChange({ name, email, phone })
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4 bg-white">
      {!hidePersonalInfo && <h3 className="text-sm font-semibold text-gray-700">Contact Information</h3>}
      
      <div className="space-y-3">
        {!hidePersonalInfo && (
          <>
            <div>
              <Label htmlFor="guestName">Full Name <span className="text-red-500">*</span></Label>
              <Input 
                id="guestName" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="guestEmail">Email <span className="text-red-500">*</span></Label>
              <Input 
                id="guestEmail" 
                type="email" 
                placeholder="john@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlur}
                required
              />
            </div>
          </>
        )}
        
        <div>
          <Label htmlFor="guestPhone">Phone Number <span className="text-red-500">*</span></Label>
          <div className="flex gap-2">
            <Input 
              id="guestPhone" 
              type="tel" 
              placeholder="9876543210" 
              value={phone} 
              onChange={(e) => {
                setPhone(e.target.value)
              }}
              onBlur={handleBlur}
              required
              maxLength={10}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
