'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
    handleError,
    DatabaseError,
    ValidationError,
    ErrorCode,
    validateWithSchema,
    type ActionResponse,
} from '@/lib/errors'
import {
    createProductSchema,
    updateProductSchema,
    deleteProductSchema,
} from '@/lib/validations/product-validation'

// ─── Helper: upload gallery images ─────────────────────────────────────────

async function uploadGalleryImages(
    supabase: ReturnType<typeof createClient>,
    productId: string,
    files: File[]
) {
    const validFiles = files.filter(f => f.size > 0 && f.type.startsWith('image/'))
    if (validFiles.length === 0) return

    for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        if (file.size > 5 * 1024 * 1024) continue // skip files > 5MB

        const fileExt = file.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `products/${productId}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file)

        if (uploadError) {
            console.error('Gallery upload failed:', uploadError)
            continue
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath)

        const { data: maxOrder } = await supabase
            .from('product_images')
            .select('order_index')
            .eq('product_id', productId)
            .order('order_index', { ascending: false })
            .limit(1)
            .single()

        await supabase.from('product_images').insert({
            product_id: productId,
            image_url: publicUrl,
            order_index: (maxOrder?.order_index ?? -1) + 1,
        })
    }
}

// ─── createProduct ─────────────────────────────────────────────────────────

export async function createProduct(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const adminSupabase = createAdminClient()

        // Extract and validate basic fields
        const rawData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            stock_quantity: parseInt(formData.get('stock_quantity') as string),
            is_active: formData.get('is_active') === 'on',
        }

        // Parse benefits
        const benefitsJson = formData.get('benefits') as string
        let benefits: string[] | undefined
        if (benefitsJson) {
            try {
                const parsed = JSON.parse(benefitsJson)
                if (Array.isArray(parsed)) {
                    benefits = parsed.map((b: string) => b.trim()).filter(Boolean).slice(0, 6)
                }
            } catch {
                throw new ValidationError('Invalid benefits format', { field: 'benefits' })
            }
        }

        const validatedData = validateWithSchema(createProductSchema, { ...rawData, benefits })

        // Upload primary image
        let image_url = ''
        const imageFile = formData.get('image') as File
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('image-storage')
                .upload(fileName, imageFile)

            if (uploadError) {
                throw new DatabaseError(`Image upload failed: ${uploadError.message}`, ErrorCode.EXTERNAL_SERVICE_ERROR)
            }

            const { data: { publicUrl } } = supabase.storage
                .from('image-storage')
                .getPublicUrl(fileName)

            image_url = publicUrl
        }

        // Insert product
        const { data, error } = await supabase.from('products').insert({
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            stock_quantity: validatedData.stock_quantity,
            image_url,
            is_active: validatedData.is_active,
        })
            .select()
            .single()

        if (error) throw new DatabaseError(error.message, ErrorCode.DATABASE_ERROR)

        // Insert benefits via admin client (bypass RLS)
        if (validatedData.benefits && validatedData.benefits.length > 0) {
            const { error: bErr } = await adminSupabase.from('product_benefits').insert(
                validatedData.benefits.map((text, i) => ({
                    product_id: data.id,
                    benefit_text: text,
                    order_index: i,
                }))
            )
            if (bErr) console.error('Error inserting benefits:', bErr)
        }

        // Upload gallery images
        const galleryFiles = formData.getAll('gallery_images') as File[]
        const validGallery = galleryFiles.filter(f => f.size > 0)
        if (validGallery.length > 0) {
            await uploadGalleryImages(supabase, data.id, validGallery.slice(0, 5))
        }

        revalidatePath('/admin/products')
        redirect('/admin/products')
    } catch (error) {
        return handleError(error)
    }
}

// ─── deleteProduct ─────────────────────────────────────────────────────────

export async function deleteProduct(productId: string): Promise<ActionResponse> {
    try {
        const validatedData = validateWithSchema(deleteProductSchema, { id: productId })

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('image_url')
            .eq('id', validatedData.id)
            .single()

        if (fetchError) throw new DatabaseError('Product not found', ErrorCode.RECORD_NOT_FOUND)

        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', validatedData.id)

        if (deleteError) throw new DatabaseError(deleteError.message, ErrorCode.DATABASE_ERROR)

        if (product?.image_url) {
            const pathParts = product.image_url.split('/image-storage/')
            if (pathParts.length > 1) {
                await supabase.storage.from('image-storage').remove([pathParts[1]])
            }
        }

        revalidatePath('/admin/products')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}

// ─── updateProduct ─────────────────────────────────────────────────────────

export async function updateProduct(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const adminSupabase = createAdminClient()

        const id = formData.get('id') as string

        const rawData = {
            id,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            stock_quantity: parseInt(formData.get('stock_quantity') as string),
            is_active: formData.get('is_active') === 'on',
        }

        const validatedData = validateWithSchema(updateProductSchema, rawData)

        // Parse benefits
        const benefitsJson = formData.get('benefits') as string
        let newBenefits: string[] = []
        if (benefitsJson) {
            try {
                const parsed = JSON.parse(benefitsJson)
                if (Array.isArray(parsed)) {
                    newBenefits = parsed.map((b: string) => b.trim()).filter(Boolean).slice(0, 6)
                }
            } catch {
                // ignore, benefits optional
            }
        }

        const updates: Record<string, any> = {
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            stock_quantity: validatedData.stock_quantity,
            is_active: validatedData.is_active,
            updated_at: new Date().toISOString(),
        }

        // Handle primary image upload
        const imageFile = formData.get('image') as File
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('image-storage')
                .upload(fileName, imageFile)

            if (uploadError) {
                throw new DatabaseError(`Image upload failed: ${uploadError.message}`, ErrorCode.EXTERNAL_SERVICE_ERROR)
            }

            const { data: { publicUrl } } = supabase.storage
                .from('image-storage')
                .getPublicUrl(fileName)

            updates.image_url = publicUrl
        }

        // Update product
        const { error } = await supabase.from('products').update(updates).eq('id', id)
        if (error) throw new DatabaseError(error.message, ErrorCode.DATABASE_ERROR)

        // Sync benefits: delete all then re-insert (simplest correct approach)
        await adminSupabase.from('product_benefits').delete().eq('product_id', id)
        if (newBenefits.length > 0) {
            const { error: bErr } = await adminSupabase.from('product_benefits').insert(
                newBenefits.map((text, i) => ({
                    product_id: id,
                    benefit_text: text,
                    order_index: i,
                }))
            )
            if (bErr) console.error('Error syncing benefits:', bErr)
        }

        // Upload new gallery images
        const galleryFiles = formData.getAll('gallery_images') as File[]
        const validGallery = galleryFiles.filter(f => f.size > 0)
        if (validGallery.length > 0) {
            await uploadGalleryImages(supabase, id, validGallery.slice(0, 5))
        }

        revalidatePath('/admin/products')
        revalidatePath(`/admin/products/${id}/edit`)
        revalidatePath(`/product/${id}`)

        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}
