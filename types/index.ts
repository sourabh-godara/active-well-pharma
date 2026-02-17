
export type Banner = {
    id: string
    title: string
    subtitle: string | null
    cta_text: string | null
    cta_link: string | null
    image_url: string
    order_index: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export type Promotion = {
    id: string
    title: string
    description: string
    image_url?: string | null
    coupon_code?: string | null
    trigger_type: 'on_load' | 'time_delay' | 'exit_intent'
    delay_seconds: number
    is_active: boolean
    show_on_homepage: boolean
    created_at: string
    updated_at: string
}

export type Profile = {
    id: string
    full_name: string | null
    email: string | null
    role: 'user' | 'admin'
    is_blocked: boolean
    created_at: string
    updated_at: string
}

export type Review = {
    id: string
    user_id: string
    product_id: string
    rating: number
    comment: string | null
    created_at: string
    updated_at: string
}

export type ReviewReply = {
    id: string
    review_id: string
    admin_id: string
    reply_text: string
    created_at: string
    updated_at: string
}

export type ReviewWithUserAndReply = {
    id: string
    rating: number
    comment: string | null
    created_at: string
    user: { id: string; full_name: string | null } | null
    reply: {
        reply_text: string
        created_at: string
        admin: { id: string; full_name: string | null } | null
    } | null
}

export type ProductRatingSummary = {
    product_id: string
    average_rating: number
    total_reviews: number
}

export type Product = {
    id: string
    name: string
    price: number
    image_url: string | null
    description: string | null
    stock_quantity: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export type ProductImage = {
    id: string
    product_id: string
    image_url: string
    order_index: number
    created_at: string
    updated_at: string
}

export type ProductBenefit = {
    id: string
    product_id: string
    benefit_text: string
    order_index: number
    created_at: string
    updated_at: string
}

export type ProductWithGallery = Product & {
    gallery: string[]
    images: ProductImage[]
    benefits?: ProductBenefit[]
}
