// app/product/[id]/page.tsx
// ✅ No cookies() · No createClient() · No getUser() → fully Static (○)
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
    getProductWithGallery,
    getProductsWithRating,
    getProducts,
} from '@/lib/data/products.data'
import { getProductReviews, getCachedProductRating } from '@/lib/actions/reviews'
import { StarRating } from '@/components/reviews/star-rating'
import { ImageGallery } from '@/components/product/image-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { ProductCard } from '@/components/product-card'
import { ReviewGate } from './review-gate'
import { ReviewListClient } from '@/components/reviews/review-list-client'

// ── Static generation ─────────────────────────────────────────────────────────
export const revalidate = 120
export const dynamicParams = true  // products added after build still resolve

export async function generateStaticParams(): Promise<{ id: string }[]> {
    const products = await getProducts()
    return products.map((p) => ({ id: p.id }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const product = await getProductWithGallery(id)
    if (!product) return { title: 'Product Not Found | ActiveWell Pharma' }
    return {
        title: `${product.name} | ActiveWell Pharma`,
        description: product.description ?? undefined,
    }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await getProductWithGallery(id)
    if (!product) notFound()

    // All three reads are unstable_cache / React cache — no fresh DB hits when warm
    const [reviews, ratingData, allProducts] = await Promise.all([
        getProductReviews(id),
        getCachedProductRating(id),
        getProductsWithRating(),
    ])

    const { average_rating, total_reviews } = ratingData
    const relatedProducts = allProducts
        .filter((p) => p.id !== id)
        .slice(0, 4)

    return (
        <div className="min-h-screen bg-background">
            <div className="container-brand px-4 sm:px-6 lg:px-8 py-12">

                {/* ── Main 2-col grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                    <ImageGallery images={product.gallery} productName={product.name} />
                    <ProductInfo
                        product={product}
                        averageRating={average_rating}
                        totalReviews={total_reviews}
                    />
                </div>

                {/* ── Description ── */}
                <section className="mt-16 border-t border-border pt-10">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4">
                        Description
                    </h3>
                    <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed">
                        <p>{product.description ?? 'No description available.'}</p>
                    </div>
                </section>

                {/* ── Ratings & Reviews ── */}
                <section className="mt-20 border-t border-border pt-10">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-8">
                        Reviews
                    </h3>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">

                        {/* Left — rating summary + review form */}
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="font-display text-5xl font-bold text-foreground">
                                    {average_rating}
                                </span>
                                <div>
                                    <StarRating rating={average_rating} readOnly size="lg" />
                                    <p className="font-body text-sm text-muted-foreground mt-1">
                                        {total_reviews} reviews
                                    </p>
                                </div>
                            </div>

                            {/*
                             * ReviewGate is 'use client' — reads auth from UserContext.
                             * No cookies() in this Server Component → page stays Static.
                             */}
                            <ReviewGate productId={id} />
                        </div>

                        {/* Right — review list with client-side auth for edit/delete/reply */}
                        <div className="mt-8 lg:col-span-8 lg:mt-0">
                            <ReviewListClient
                                productId={id}
                                initialReviews={reviews}
                            />
                        </div>
                    </div>
                </section>

                {/* ── You May Also Like ── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8">
                            You May <span className="text-gradient-fresh">Also Like</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

