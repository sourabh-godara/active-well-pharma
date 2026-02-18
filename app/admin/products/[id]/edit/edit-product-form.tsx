'use client'

import { updateProduct } from '../../actions'
import { useFormStatus } from 'react-dom'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { ProductWithGallery } from '@/types'
import { ProductGalleryManager } from '@/components/admin/product-gallery-manager'
import { KeyBenefitsManager } from '@/components/admin/key-benefits-manager'
import Image from 'next/image'
import { type ActionResponse } from '@/lib/errors'

const initialState: ActionResponse = {
    success: true,
    message: 'INITIAL_STATE'
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
        >
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    )
}

export default function EditProductForm({ product }: { product: ProductWithGallery }) {
    const [state, formAction] = useActionState(updateProduct, initialState)

    useEffect(() => {
        if (state === initialState) return

        if (!state.success) {
            toast.error(state.error.message)
        } else if (state.success) {
            toast.success('Product updated successfully')
        }
    }, [state])

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Product Details</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Update product information and primary image.
                    </p>
                </div>

                <form action={formAction} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <input type="hidden" name="id" value={product.id} />
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Product Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        defaultValue={product.name}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                    Description
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        defaultValue={product.description || ''}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                    Price
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        step="0.01"
                                        defaultValue={product.price}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="stock_quantity" className="block text-sm font-medium leading-6 text-gray-900">
                                    Stock Quantity
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        id="stock_quantity"
                                        defaultValue={product.stock_quantity}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                                    Primary Image (Optional: Keep empty to retain existing)
                                </label>
                                {product.image_url && (
                                    <div className="mt-2 relative h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                                        <Image src={product.image_url} alt="Current" fill className="object-cover" />
                                    </div>
                                )}
                                <div className="mt-2">
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <div className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="is_active"
                                            name="is_active"
                                            type="checkbox"
                                            defaultChecked={product.is_active}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="is_active" className="font-medium text-gray-900">
                                            Active Status
                                        </label>
                                        <p className="text-gray-500">Visible in the store.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <SubmitButton />
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Image Gallery</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Manage additional product images. Max 5 images.
                    </p>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <ProductGalleryManager productId={product.id} initialImages={product.images || []} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Key Benefits</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Add up to 6 key benefits used on the product details page.
                    </p>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <KeyBenefitsManager productId={product.id} initialBenefits={product.benefits || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
