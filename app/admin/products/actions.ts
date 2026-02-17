'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(prevState: any, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock_quantity = parseInt(formData.get('stock_quantity') as string)
    const imageFile = formData.get('image') as File
    const is_active = formData.get('is_active') === 'on'

    let image_url = ''

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('image-storage')
            .upload(filePath, imageFile)

        if (uploadError) {
            return { error: `Image upload failed: ${uploadError.message}` }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('image-storage')
            .getPublicUrl(filePath)

        image_url = publicUrl
    }

    const { data, error } = await supabase.from('products').insert({
        name,
        description,
        price,
        stock_quantity,
        image_url,
        is_active,
    })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    // Insert benefits if any
    const benefitsJson = formData.get('benefits') as string
    if (benefitsJson) {
        try {
            const benefitTexts = JSON.parse(benefitsJson) as string[]
            if (Array.isArray(benefitTexts) && benefitTexts.length > 0) {
                const benefitsToInsert = benefitTexts.map((text, index) => ({
                    product_id: data.id,
                    benefit_text: text,
                    order_index: index
                }))

                const { error: benefitsError } = await supabase
                    .from('product_benefits')
                    .insert(benefitsToInsert)

                if (benefitsError) {
                    console.error('Error inserting benefits:', benefitsError)
                    // We don't fail the whole request, but we could log it
                }
            }
        } catch (e) {
            console.error('Error parsing benefits JSON:', e)
        }
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}

export async function deleteProduct(productId: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 1. Get product to find image URL
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', productId)
        .single()

    if (fetchError) {
        throw new Error(fetchError.message)
    }

    // 2. Delete product (Row)
    const { error: deleteError } = await supabase.from('products').delete().eq('id', productId)

    if (deleteError) {
        throw new Error(deleteError.message)
    }

    // 3. Delete image from Storage if exists
    if (product?.image_url) {
        const url = new URL(product.image_url)
        // Extract path: endpoint/storage/v1/object/public/bucket/path
        // A simple way is to take the last segment if we know structure, 
        // or split by bucket name 'product-images/'
        const pathParts = product.image_url.split('/image-storage/')
        if (pathParts.length > 1) {
            const filePath = pathParts[1]
            await supabase.storage.from('image-storage').remove([filePath])
        }
    }

    revalidatePath('/admin/products')
}

export async function updateProduct(prevState: any, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock_quantity = parseInt(formData.get('stock_quantity') as string)
    const imageFile = formData.get('image') as File
    const is_active = formData.get('is_active') === 'on'

    const updates: any = {
        name,
        description,
        price,
        stock_quantity,
        is_active,
        updated_at: new Date().toISOString(),
    }

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('image-storage')
            .upload(filePath, imageFile)

        if (uploadError) {
            return { error: `Image upload failed: ${uploadError.message}` }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('image-storage')
            .getPublicUrl(filePath)

        updates.image_url = publicUrl
    }

    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}/edit`)
    revalidatePath(`/product/${id}`)

    return { success: true, error: '' }
}
