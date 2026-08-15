'use client'

import { deleteProduct } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ChevronDown, Columns, Pencil, Trash2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'

// Adjust type if needed based on the actual returned type from getAdminProducts
type ProductType = {
    id: string
    name: string
    price: number
    image_url: string | null
    stock_quantity: number
    description: string | null
    is_active: boolean
}

export default function ProductTable({ products }: { products: ProductType[] }) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

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

    // Filter products based on search and status
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'All' 
                              || (statusFilter === 'Active' && product.is_active) 
                              || (statusFilter === 'Inactive' && !product.is_active)
        return matchesSearch && matchesStatus
    })

    return (
        <div className="flex flex-col w-full">
            {/* ── Table Top Bar ── */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-b border-gray-100 gap-4 bg-white rounded-t-2xl">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                    {/* Status Filter */}
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </div>
                </div>
                {/* Columns / View Options (Mock) */}
                <button className="hidden sm:flex items-center justify-center p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                    <Columns className="h-4 w-4" />
                </button>
            </div>

            {/* ── Table Container ── */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-100 bg-white">
                    <thead>
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                PRODUCT
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                PRICE
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                STOCK
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                STATUS
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                ACTIONS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => {
                            const stockPercentage = Math.min(100, Math.max(0, (product.stock_quantity / 200) * 100))
                            
                            return (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    {/* Product */}
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 flex-shrink-0 relative rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                                                {product.image_url ? (
                                                    <Image 
                                                        src={product.image_url} 
                                                        alt={product.name} 
                                                        fill 
                                                        className="object-contain p-1"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400">No Img</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-500 max-w-[200px] sm:max-w-[300px] truncate mt-0.5">
                                                    {product.description || 'No description provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <p className="text-sm font-bold text-gray-900">₹{product.price}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">MRP</p>
                                    </td>

                                    {/* Stock */}
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <p className="text-sm font-bold text-gray-900">{product.stock_quantity}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {product.stock_quantity > 0 ? 'In stock' : 'Out of stock'}
                                        </p>
                                        {/* Progress Bar */}
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden flex">
                                            <div 
                                                className={`h-full rounded-full ${product.stock_quantity > 20 ? 'bg-emerald-500' : product.stock_quantity > 0 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                style={{ width: `${product.stock_quantity > 0 ? Math.max(10, stockPercentage) : 0}%` }}
                                            />
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {product.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                                title="Options"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No products found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Table Footer (Pagination) ── */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-t border-gray-100 bg-white rounded-b-2xl gap-4">
                <p className="text-sm text-gray-500">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products
                </p>
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
                        1
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <div className="ml-2 relative">
                        <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option>10 / page</option>
                            <option>20 / page</option>
                            <option>50 / page</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
