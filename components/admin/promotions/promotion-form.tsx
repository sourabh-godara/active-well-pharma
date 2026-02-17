
'use client'

import { createPromotion, updatePromotion } from '@/lib/actions/promotion.actions'
import { Promotion } from '@/types'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ActionState {
    error: string
    success: boolean
}

const initialState: ActionState = {
    error: '',
    success: false
}

interface PromotionFormProps {
    promotion?: Promotion
    closeModal?: () => void
}

export default function PromotionForm({ promotion, closeModal }: PromotionFormProps) {
    // Determine action: update or create
    const action = promotion ? updatePromotion : createPromotion
    const [state, formAction] = useActionState<ActionState, FormData>(action, initialState)
    const [previewUrl, setPreviewUrl] = useState<string | null>(promotion?.image_url || null)

    // Default trigger type options
    const triggerTypes = [
        { value: 'on_load', label: 'On Page Load' },
        { value: 'time_delay', label: 'Time Delay' },
        { value: 'exit_intent', label: 'Exit Intent (Desktop)' }
    ]

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(promotion ? 'Promotion updated successfully' : 'Promotion created successfully')
            if (closeModal) closeModal()
        }
    }, [state, promotion, closeModal])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    return (
        <form action={formAction} className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
            {promotion && <input type="hidden" name="id" value={promotion.id} />}

            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    defaultValue={promotion?.title}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    defaultValue={promotion?.description}
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                    type="text"
                    name="coupon_code"
                    defaultValue={promotion?.coupon_code || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trigger Type</label>
                    <select
                        name="trigger_type"
                        defaultValue={promotion?.trigger_type || 'on_load'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    >
                        {triggerTypes.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Delay (Seconds)</label>
                    <input
                        type="number"
                        name="delay_seconds"
                        defaultValue={promotion?.delay_seconds || 0}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Promotion Image</label>
                <div className="mt-2 flex items-center gap-x-3">
                    {previewUrl && (
                        <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-gray-200">
                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    )}
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center">
                    <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        defaultChecked={promotion ? promotion.is_active : false}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Active (Will deactivate others)
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        id="show_on_homepage"
                        name="show_on_homepage"
                        type="checkbox"
                        defaultChecked={promotion ? promotion.show_on_homepage : true}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="show_on_homepage" className="ml-2 block text-sm text-gray-900">
                        Show on Homepage
                    </label>
                </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                >
                    {promotion ? 'Update' : 'Create'}
                </button>
                <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
