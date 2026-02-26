import { Metadata } from 'next'
import { ProductCard } from '@/components/product-card'
import { getProductsWithRating } from '@/lib/data/products.data'
import Footer from '@/components/footer'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Shop | ActiveWell Pharma',
    description: 'Browse all products from ActiveWell Pharma',
}

export const revalidate = 60

export default async function ShopPage() {
    const products = await getProductsWithRating()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-gradient-fresh text-primary-foreground">
                <div className="container-brand px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <p className="font-body text-sm font-medium uppercase tracking-widest opacity-80 mb-2">
                        ActiveWell Pharma
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                        Our Products
                    </h1>
                    <p className="font-body text-base opacity-80 max-w-xl">
                        Discover our full range of wellness products, trusted by 10 lakh+ happy customers.
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <main className="container-brand px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {products && products.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <p className="font-body text-sm text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{products.length}</span> products
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                            <ShoppingBag className="w-9 h-9 text-muted-foreground" />
                        </div>
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                            No products found
                        </h2>
                        <p className="font-body text-muted-foreground max-w-sm">
                            We&apos;re working on adding products to our store. Check back soon!
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
