
import ProductForm from './product-form'

export default function NewProductPage() {
    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
                Add New Product
            </h1>
            <ProductForm />
        </div>
    )
}
