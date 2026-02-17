
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/lib/auth/check-admin'

const STORAGE_BUCKET = 'image-storage'
const STORAGE_PATH_PREFIX = 'banners'

interface ActionState {
    error: string
    success: boolean
}

export async function createBanner(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const { supabase } = await checkAdmin()

        const title = formData.get('title') as string
        const subtitle = formData.get('subtitle') as string
        const cta_text = formData.get('cta_text') as string
        const cta_link = formData.get('cta_link') as string
        const imageFile = formData.get('image') as File
        const is_active = formData.get('is_active') === 'on'

        if (!imageFile || imageFile.size === 0) {
            return { error: 'Image is required', success: false }
        }

        const bannerId = crypto.randomUUID()
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${STORAGE_PATH_PREFIX}/${bannerId}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, imageFile)

        if (uploadError) {
            return { error: `Image upload failed: ${uploadError.message}`, success: false }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath)

        const { data: maxOrder } = await supabase
            .from('banners')
            .select('order_index')
            .order('order_index', { ascending: false })
            .limit(1)
            .single()

        const nextOrderIndex = (maxOrder?.order_index ?? 0) + 1

        const { error: insertError } = await supabase.from('banners').insert({
            id: bannerId,
            title,
            subtitle,
            cta_text,
            cta_link,
            image_url: publicUrl,
            order_index: nextOrderIndex,
            is_active
        })

        if (insertError) {
            await supabase.storage.from(STORAGE_BUCKET).remove([filePath])
            return { error: `Failed to create banner: ${insertError.message}`, success: false }
        }

        revalidatePath('/')
        revalidatePath('/admin/banners')
        return { success: true, error: '' }
    } catch (e: any) {
        return { error: e.message, success: false }
    }
}

export async function updateBanner(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const { supabase } = await checkAdmin()

        const id = formData.get('id') as string
        const title = formData.get('title') as string
        const subtitle = formData.get('subtitle') as string
        const cta_text = formData.get('cta_text') as string
        const cta_link = formData.get('cta_link') as string
        const imageFile = formData.get('image') as File
        const is_active = formData.get('is_active') === 'on'

        const updates: any = {
            title,
            subtitle,
            cta_text,
            cta_link,
            is_active,
            updated_at: new Date().toISOString()
        }

        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = `${STORAGE_PATH_PREFIX}/${id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, imageFile)

            if (uploadError) {
                return { error: `Image upload failed: ${uploadError.message}`, success: false }
            }

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath)

            updates.image_url = publicUrl
        }

        const { error } = await supabase.from('banners').update(updates).eq('id', id)

        if (error) {
            return { error: error.message, success: false }
        }

        revalidatePath('/')
        revalidatePath('/admin/banners')
        return { success: true, error: '' }
    } catch (e: any) {
        return { error: e.message, success: false }
    }
}

export async function deleteBanner(id: string) {
    const { supabase } = await checkAdmin()

    const { data: banner } = await supabase.from('banners').select('image_url').eq('id', id).single()

    const { error } = await supabase.from('banners').delete().eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    if (banner?.image_url) {
        const parts = banner.image_url.split(`/${STORAGE_BUCKET}/`)
        if (parts.length > 1) {
            const relativePath = parts[1]
            await supabase.storage.from(STORAGE_BUCKET).remove([relativePath])
        }
    }

    revalidatePath('/')
    revalidatePath('/admin/banners')
}

export async function toggleBannerStatus(id: string, isActive: boolean) {
    const { supabase } = await checkAdmin()

    const { error } = await supabase.from('banners').update({ is_active: isActive }).eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/')
    revalidatePath('/admin/banners')
}

export async function reorderBanners(items: { id: string, order_index: number }[]) {
    const { supabase } = await checkAdmin()

    const updates = items.map(item =>
        supabase.from('banners').update({ order_index: item.order_index }).eq('id', item.id)
    )

    await Promise.all(updates)

    revalidatePath('/')
    revalidatePath('/admin/banners')
}
