
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Navbar } from '@/components/navbar'
import { getProductWithGallery } from '@/lib/data/products.data'
import { getProductReviews, getCachedProductRating } from '@/lib/actions/reviews'
import { ReviewList } from '@/components/reviews/review-list'
import { ReviewForm } from '@/components/reviews/review-form'
import { StarRating } from '@/components/reviews/star-rating'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { ImageGallery } from '@/components/product/image-gallery'
import { ProductBenefits } from '@/components/product/product-benefits'

export const revalidate = 120 // Revalidate every 120 seconds

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

    // Check if user is admin
    let isAdmin = false
    let isBlocked = false
    let existingReview = null

    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role, is_blocked').eq('id', user.id).single()
        isAdmin = profile?.role === 'admin'
        isBlocked = !!profile?.is_blocked

        // Check for existing review by this user
        // We can do this here or let the ReviewForm handle it/pass it down.
        // It's better to pass it to ReviewForm to switch to "Edit" mode.
        // But getProductReviews returns list. We can check if any belongs to user.
        // Or fetch specifically.
        // Let's rely on the list for simplicity in checking existence, OR fetch it.
        // Fetching it is safer.
        const { data: review } = await supabase.from('reviews').select('*').eq('user_id', user.id).eq('product_id', id).single()
        if (review) existingReview = review
    }

    const reviews = await getProductReviews(id)
    const { average_rating, total_reviews } = await getCachedProductRating(id)

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                    {/* Product Image */}
                    {/* Product Gallery */}
                    <div className="w-full">
                        <ImageGallery images={product.gallery} productName={product.name} />
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-3xl tracking-tight text-gray-900">₹{product.price}</p>
                            <div className="flex items-center space-x-2">
                                <StarRating rating={average_rating} readOnly size="md" />
                                <span className="text-sm text-gray-500">{total_reviews} reviews</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-gray-700">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.stock_quantity > 0 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                    {product.stock_quantity} available
                                </span>
                            </div>
                        </div>

                        <ProductBenefits benefits={product.benefits || []} />

                        <div className="mt-10 flex">
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t border-gray-200 pt-16">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>

                    <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
                        <div className="lg:col-span-4">
                            {/* Rating Summary Breakdown could go here */}
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="text-5xl font-bold text-gray-900">{average_rating}</div>
                                <div>
                                    <StarRating rating={average_rating} readOnly size="lg" />
                                    <p className="text-sm text-gray-500 mt-1">{total_reviews} reviews</p>
                                </div>
                            </div>

                            {!user ? (
                                <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                                    Please <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">sign in</a> to write a review.
                                </div>
                            ) : isAdmin ? (
                                <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-700">
                                    Admins cannot write reviews, but can reply to them.
                                </div>
                            ) : isBlocked ? (
                                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                    Your account is temporarily restricted from posting reviews.
                                </div>
                            ) : (
                                !existingReview && (
                                    <ReviewForm productId={id} />
                                )
                            )}

                            {existingReview && (
                                <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
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
                </div>
            </div>
        </div>
    )
}
