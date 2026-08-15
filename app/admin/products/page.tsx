// app/admin/products/page.tsx
import Link from 'next/link'
import { Plus, ShoppingBag, Package, CheckCircle2, Tag } from 'lucide-react'
import { getAdminProducts } from '@/lib/data/admin.data'
import ProductTable from './product-table'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    const products = await getAdminProducts()

    const totalProducts = products.length
    const totalStock = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0)
    const activeProducts = products.filter(p => p.is_active).length
    const outOfStock = products.filter(p => p.stock_quantity === 0).length

    const activePercentage = totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your products, stock and availability.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-x-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Add Product
                </Link>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Total Products */}
                <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-xl">
                        <ShoppingBag className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-0.5">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{totalProducts}</p>
                        <p className="text-xs text-gray-400 mt-1.5">Active products</p>
                    </div>
                </div>

                {/* Total Stock */}
                <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-xl">
                        <Package className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-0.5">Total Stock</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{totalStock}</p>
                        <p className="text-xs text-gray-400 mt-1.5">Units in inventory</p>
                    </div>
                </div>

                {/* Active Products */}
                <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-0.5">Active Products</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{activeProducts}</p>
                        <p className="text-xs text-gray-400 mt-1.5">{activePercentage}% of total</p>
                    </div>
                </div>

                {/* Out of Stock */}
                <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-orange-50 rounded-xl">
                        <Tag className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-0.5">Out of Stock</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{outOfStock}</p>
                        <p className="text-xs text-gray-400 mt-1.5">Products</p>
                    </div>
                </div>
            </div>

            {/* ── Table Area ── */}
            <div className="bg-white shadow-sm border border-gray-100 sm:rounded-2xl overflow-hidden">
                <ProductTable products={products} />
            </div>
        </div>
    )
}
