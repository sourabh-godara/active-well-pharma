
import ProductForm from './product-form'

export default function NewProductPage() {
    return (
        <div className="mx-auto w-screen">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-2">
                Add New Product
            </h1>
            <div className="mb-8">
                <p className="mt-1 text-sm text-gray-500">Fill in the details below to add a new product.</p>
            </div>
            <ProductForm />
        </div>
    )
}
