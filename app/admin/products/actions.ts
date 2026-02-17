'use server'

import { createClient } from '@/lib/supabase/server'
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

export async function createProduct(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // Extract and validate basic fields
        const rawData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            stock_quantity: parseInt(formData.get('stock_quantity') as string),
            is_active: formData.get('is_active') === 'on',
        }

        // Parse and validate benefits if present
        const benefitsJson = formData.get('benefits') as string
        let benefits: string[] | undefined
        if (benefitsJson) {
            try {
                const parsed = JSON.parse(benefitsJson)
                if (Array.isArray(parsed)) {
                    benefits = parsed
                }
            } catch (e) {
                throw new ValidationError('Invalid benefits format', { field: 'benefits' })
            }
        }

        const validatedData = validateWithSchema(createProductSchema, {
            ...rawData,
            benefits,
        })

        // Handle image upload
        let image_url = ''
        const imageFile = formData.get('image') as File

        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('image-storage')
                .upload(filePath, imageFile)

            if (uploadError) {
                throw new DatabaseError(
                    `Image upload failed: ${uploadError.message}`,
                    ErrorCode.EXTERNAL_SERVICE_ERROR
                )
            }

            const { data: { publicUrl } } = supabase.storage
                .from('image-storage')
                .getPublicUrl(filePath)

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

        if (error) {
            throw new DatabaseError(error.message, ErrorCode.DATABASE_ERROR)
        }

        // Insert benefits if any
        if (validatedData.benefits && validatedData.benefits.length > 0) {
            const benefitsToInsert = validatedData.benefits.map((text, index) => ({
                product_id: data.id,
                benefit_text: text,
                order_index: index
            }))

            const { error: benefitsError } = await supabase
                .from('product_benefits')
                .insert(benefitsToInsert)

            if (benefitsError) {
                // Log but don't fail - product is already created
                console.error('Error inserting benefits:', benefitsError)
            }
        }

        revalidatePath('/admin/products')
        redirect('/admin/products')
    } catch (error) {
        return handleError(error)
    }
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
    try {
        // Validate product ID
        const validatedData = validateWithSchema(deleteProductSchema, { id: productId })

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // 1. Get product to find image URL
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('image_url')
            .eq('id', validatedData.id)
            .single()

        if (fetchError) {
            throw new DatabaseError(
                'Product not found',
                ErrorCode.RECORD_NOT_FOUND
            )
        }

        // 2. Delete product (Row)
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', validatedData.id)

        if (deleteError) {
            throw new DatabaseError(deleteError.message, ErrorCode.DATABASE_ERROR)
        }

        // 3. Delete image from Storage if exists
        if (product?.image_url) {
            const pathParts = product.image_url.split('/image-storage/')
            if (pathParts.length > 1) {
                const filePath = pathParts[1]
                await supabase.storage.from('image-storage').remove([filePath])
            }
        }

        revalidatePath('/admin/products')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}

export async function updateProduct(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // Extract and validate basic fields
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

        const updates: any = {
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            stock_quantity: validatedData.stock_quantity,
            is_active: validatedData.is_active,
            updated_at: new Date().toISOString(),
        }

        // Handle image upload if new image provided
        const imageFile = formData.get('image') as File
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('image-storage')
                .upload(filePath, imageFile)

            if (uploadError) {
                throw new DatabaseError(
                    `Image upload failed: ${uploadError.message}`,
                    ErrorCode.EXTERNAL_SERVICE_ERROR
                )
            }

            const { data: { publicUrl } } = supabase.storage
                .from('image-storage')
                .getPublicUrl(filePath)

            updates.image_url = publicUrl
        }

        // Update product
        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)

        if (error) {
            throw new DatabaseError(error.message, ErrorCode.DATABASE_ERROR)
        }

        revalidatePath('/admin/products')
        revalidatePath(`/admin/products/${id}/edit`)
        revalidatePath(`/product/${id}`)

        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}
