'use client'

import { deleteProduct } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProductTable({ products }: { products: any[] }) {
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await deleteProduct(id)
            toast.success('Product deleted')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    return (
        <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Stock
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {product.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${product.price}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {product.stock_quantity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {product.is_active ? (
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                    Inactive
                                </span>
                            )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                                <a
                                    href={`/admin/products/${product.id}/edit`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Edit<span className="sr-only">, {product.name}</span>
                                </a>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete<span className="sr-only">, {product.name}</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
