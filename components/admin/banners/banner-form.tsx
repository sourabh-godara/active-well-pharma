
'use client'

import { createBanner, updateBanner } from '@/lib/actions/banner.actions'
import { Banner } from '@/types'
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

interface BannerFormProps {
    banner?: Banner
    closeModal?: () => void
}

export default function BannerForm({ banner, closeModal }: BannerFormProps) {
    // Determine action: update or create
    const action = banner ? updateBanner : createBanner
    const [state, formAction] = useActionState<ActionState, FormData>(action, initialState)
    const [previewUrl, setPreviewUrl] = useState<string | null>(banner?.image_url || null)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(banner ? 'Banner updated successfully' : 'Banner created successfully')
            if (closeModal) closeModal()
        }
    }, [state, banner, closeModal])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    return (
        <form action={formAction} className="space-y-4">
            {banner && <input type="hidden" name="id" value={banner.id} />}

            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    defaultValue={banner?.title}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                    type="text"
                    name="subtitle"
                    defaultValue={banner?.subtitle || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">CTA Text</label>
                    <input
                        type="text"
                        name="cta_text"
                        defaultValue={banner?.cta_text || ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">CTA Link</label>
                    <input
                        type="text"
                        name="cta_link"
                        defaultValue={banner?.cta_link || ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Banner Image</label>
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
                        required={!banner} // Required only on create
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>
            </div>

            <div className="flex items-center">
                <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    defaultChecked={banner ? banner.is_active : true}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                </label>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                >
                    {banner ? 'Update' : 'Create'}
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
