// app/admin/products/page.tsx
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminProducts } from '@/lib/data/admin.data'
import ProductTable from './product-table'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    const products = await getAdminProducts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Add Product
                </Link>
            </div>
            <div className="bg-white shadow sm:rounded-lg">
                <ProductTable products={products} />
            </div>
        </div>
    )
}
