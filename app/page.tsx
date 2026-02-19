import Hero from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { getActivePromotion } from '@/lib/actions/promotion.actions'
import { PromotionModal } from '@/components/promotion-modal'
import NavbarMobile from '@/components/navbar-mobile'
import { getProductsWithRating } from '@/lib/data/products.data'
import { getBanners } from '@/lib/data/banners.data'
import Categories from '@/components/categories'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const products = await getProductsWithRating()

  const banners = await getBanners()

  const activePromotion = await getActivePromotion()

  return (
    <div className="min-h-screen bg-gray-50">
      <PromotionModal promotion={activePromotion} />
      <Hero />
      <Categories />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Our Products</h1>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found. Admin needs to add products.</p>
          </div>
        )}
      </main>

    </div>
  )
}
