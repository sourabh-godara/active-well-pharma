
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProductWithGallery, getProductsWithRating } from '@/lib/data/products.data'
import { getProductReviews, getCachedProductRating } from '@/lib/actions/reviews'
import { ReviewList } from '@/components/reviews/review-list'
import { ReviewForm } from '@/components/reviews/review-form'
import { StarRating } from '@/components/reviews/star-rating'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { ImageGallery } from '@/components/product/image-gallery'
import { ProductInfo } from '@/components/product/product-info'
import { ProductTabs } from '@/components/product/product-tabs'
import { ProductCard } from '@/components/product-card'

export const revalidate = 120

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const product = await getProductWithGallery(id)

    if (!product) {
        return { title: 'Product Not Found | ActiveWell Pharma' }
    }

    return {
        title: `${product.name} | ActiveWell Pharma`,
        description: product.description ?? undefined,
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await getProductWithGallery(id)

    if (!product) {
        notFound()
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    let isAdmin = false
    let isBlocked = false
    let existingReview = null

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_blocked')
            .eq('id', user.id)
            .single()
        isAdmin = profile?.role === 'admin'
        isBlocked = !!profile?.is_blocked

        const { data: review } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', id)
            .single()
        if (review) existingReview = review
    }

    const reviews = await getProductReviews(id)
    const { average_rating, total_reviews } = await getCachedProductRating(id)

    // "You May Also Like" — fetch latest products excluding this one
    const allProducts = await getProductsWithRating()
    const relatedProducts = allProducts
        .filter((p) => p.id !== id)
        .slice(0, 4)

    return (
        <div className="min-h-screen bg-background">
            <div className="container-brand px-4 sm:px-6 lg:px-8 py-12">

                {/* ── Main 2-col grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

                    {/* Left — Image Gallery */}
                    <ImageGallery images={product.gallery} productName={product.name} />

                    {/* Right — Product Info */}
                    <ProductInfo
                        product={product}
                        averageRating={average_rating}
                        totalReviews={total_reviews}
                    />
                </div>

                {/* ── Tabs (Description / Ingredients / Reviews) ── */}
                <ProductTabs
                    description={product.description}
                    ingredients={null}
                >
                    <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
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

                            {!user ? (
                                <div className="rounded-xl bg-muted p-4 text-sm font-body text-muted-foreground">
                                    Please{' '}
                                    <a href="/auth/login" className="font-medium text-primary hover:underline">
                                        sign in
                                    </a>{' '}
                                    to write a review.
                                </div>
                            ) : isAdmin ? (
                                <div className="rounded-xl bg-yellow-50 p-4 text-sm font-body text-yellow-700">
                                    Admins cannot write reviews, but can reply to them.
                                </div>
                            ) : isBlocked ? (
                                <div className="rounded-xl bg-red-50 p-4 text-sm font-body text-red-700">
                                    Your account is temporarily restricted from posting reviews.
                                </div>
                            ) : (
                                !existingReview && <ReviewForm productId={id} />
                            )}

                            {existingReview && (
                                <div className="rounded-xl bg-green-50 p-4 text-sm font-body text-green-700">
                                    You have already reviewed this product.
                                </div>
                            )}
                        </div>

                        <div className="mt-8 lg:col-span-8 lg:mt-0">
                            <ReviewList
                                productId={id}
                                initialReviews={reviews}
                                currentUserId={user?.id}
                                isAdmin={isAdmin}
                            />
                        </div>
                    </div>
                </ProductTabs>

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
