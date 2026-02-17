import { notFound } from 'next/navigation'
import { getProductWithGallery } from '@/lib/data/products.data'
import EditProductForm from './edit-product-form'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    // Use getProductWithGallery to get images too
    const product = await getProductWithGallery(id)

    if (!product) {
        notFound()
    }

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Edit Product
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {product.name}
                </p>
            </div>

            <EditProductForm product={product} />
        </div>
    )
}
