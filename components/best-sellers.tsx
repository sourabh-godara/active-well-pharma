import { ProductCard } from '@/components/product-card'
import { getProductsWithRating } from '@/lib/data/products.data'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Visual filter chips — no server-side filtering yet

export default async function BestSellers(): Promise<React.JSX.Element> {
  const products = await getProductsWithRating()

  return (
    <section
      id="best-sellers"
      className="py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8"
      aria-labelledby="bestsellers-heading"
    >
      <div className="container-brand">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <h2
              id="bestsellers-heading"
              className="section-heading font-bold text-foreground mb-4"
            >
              Our <span className="text-primary">Bestsellers</span>
            </h2>
            <p className="text-muted-foreground text-[1.0625rem] leading-relaxed">Loved by thousands of happy customers. Plant-based solutions tailored to your body.</p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-primary/75 transition-colors shrink-0 group pb-1"
            aria-label="View all products"
          >
            View All
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-surface/50">
            <p className="text-muted-foreground text-[1.0625rem]">Products are on their way. Check back soon.</p>
          </div>
        )}

        {/* Mobile View All link */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-primary/75 transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
