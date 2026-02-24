import Hero from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { getActivePromotion } from '@/lib/actions/promotion.actions'
import { PromotionModal } from '@/components/promotion-modal'
import NavbarMobile from '@/components/navbar-mobile'
import { getProductsWithRating } from '@/lib/data/products.data'
import { getBanners } from '@/lib/data/banners.data'
import Categories from '@/components/categories'
import Testimonials from '@/components/testimonials'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Benefits from '@/components/benefits'

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

      <main className="section-padding container-brand  mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Our <span className="text-gradient-fresh">Bestsellers</span>
            </h2>
            <p className="font-body text-muted-foreground">
              Loved by 10 lakh+ happy customers
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex rounded-full font-body">
            View All →
          </Button>
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
      <Benefits />

      <Testimonials />
      <Footer />

    </div>
  )
}
