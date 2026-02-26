import { notFound } from 'next/navigation'
import { getProductWithGallery } from '@/lib/data/products.data'
import ProductForm from '@/components/admin/product-form'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getProductWithGallery(id)

    if (!product) notFound()

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="mt-1 text-sm text-gray-500">{product.name}</p>
            </div>
            <ProductForm product={product} />
        </div>
    )
}
