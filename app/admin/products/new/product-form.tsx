'use client'

import { createProduct } from '../actions'
import { useFormStatus } from 'react-dom'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { KeyBenefitsManager } from '@/components/admin/key-benefits-manager'
import { ProductBenefit } from '@/types'

const initialState = {
    error: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
        >
            {pending ? 'Creating...' : 'Create Product'}
        </button>
    )
}

export default function ProductForm() {
    const [state, formAction] = useActionState(createProduct, initialState)
    const [benefits, setBenefits] = useState<ProductBenefit[]>([])

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form action={formAction} className="space-y-6 bg-white p-8 rounded-lg shadow">
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Product Name
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                </label>
                <div className="mt-2">
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                        Price
                    </label>
                    <div className="mt-2">
                        <input
                            type="number"
                            name="price"
                            id="price"
                            step="0.01"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="stock_quantity" className="block text-sm font-medium leading-6 text-gray-900">
                        Stock Quantity
                    </label>
                    <div className="mt-2">
                        <input
                            type="number"
                            name="stock_quantity"
                            id="stock_quantity"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                    Product Image
                </label>
                <div className="mt-2">
                    <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                    <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        defaultChecked
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

            <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Key Benefits (Optional)
                </label>
                <KeyBenefitsManager onChange={(val) => setBenefits(val)} />
                <input type="hidden" name="benefits" value={JSON.stringify(benefits.map(b => b.benefit_text))} />
            </div>

            <div>
                <SubmitButton />
            </div>
        </form>
    )
}
