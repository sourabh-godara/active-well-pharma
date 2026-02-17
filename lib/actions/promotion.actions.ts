
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/lib/auth/check-admin'

const STORAGE_BUCKET = 'image-storage'
const STORAGE_PATH_PREFIX = 'promotions'

interface ActionState {
    error: string
    success: boolean
}

export async function createPromotion(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const { supabase } = await checkAdmin()

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const coupon_code = formData.get('coupon_code') as string
        const trigger_type = formData.get('trigger_type') as string
        const delay_seconds = parseInt(formData.get('delay_seconds') as string || '0')
        const is_active = formData.get('is_active') === 'on'
        const show_on_homepage = formData.get('show_on_homepage') === 'on'
        const imageFile = formData.get('image') as File

        if (is_active) {
            await supabase
                .from('promotions')
                .update({ is_active: false })
                .neq('id', 'placeholder')
        }

        let image_url = null
        const promoId = crypto.randomUUID()

        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = `${STORAGE_PATH_PREFIX}/${promoId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, imageFile)

            if (uploadError) {
                return { error: `Image upload failed: ${uploadError.message}`, success: false }
            }

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath)

            image_url = publicUrl
        }

        const { error } = await supabase.from('promotions').insert({
            id: promoId,
            title,
            description,
            coupon_code,
            trigger_type,
            delay_seconds,
            is_active,
            show_on_homepage,
            image_url
        })

        if (error) {
            return { error: error.message, success: false }
        }

        revalidatePath('/admin/promotions')
        revalidatePath('/')
        return { success: true, error: '' }
    } catch (e: any) {
        return { error: e.message, success: false }
    }
}

export async function updatePromotion(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const { supabase } = await checkAdmin()

        const id = formData.get('id') as string
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const coupon_code = formData.get('coupon_code') as string
        const trigger_type = formData.get('trigger_type') as string
        const delay_seconds = parseInt(formData.get('delay_seconds') as string || '0')
        const is_active = formData.get('is_active') === 'on'
        const show_on_homepage = formData.get('show_on_homepage') === 'on'
        const imageFile = formData.get('image') as File

        if (is_active) {
            await supabase
                .from('promotions')
                .update({ is_active: false })
                .neq('id', id)
        }

        const updates: any = {
            title,
            description,
            coupon_code,
            trigger_type,
            delay_seconds,
            is_active,
            show_on_homepage,
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

        const { error } = await supabase.from('promotions').update(updates).eq('id', id)

        if (error) {
            return { error: error.message, success: false }
        }

        revalidatePath('/admin/promotions')
        revalidatePath('/')
        return { success: true, error: '' }
    } catch (e: any) {
        return { error: e.message, success: false }
    }
}

export async function deletePromotion(id: string) {
    const { supabase } = await checkAdmin()

    const { data: promo } = await supabase.from('promotions').select('image_url').eq('id', id).single()

    const { error } = await supabase.from('promotions').delete().eq('id', id)
    if (error) throw new Error(error.message)

    if (promo?.image_url) {
        const parts = promo.image_url.split(`/${STORAGE_BUCKET}/`)
        if (parts.length > 1) {
            const relativePath = parts[1]
            await supabase.storage.from(STORAGE_BUCKET).remove([relativePath])
        }
    }

    revalidatePath('/admin/promotions')
    revalidatePath('/')
}

export async function togglePromotionStatus(id: string, isActive: boolean) {
    const { supabase } = await checkAdmin()

    if (isActive) {
        await supabase
            .from('promotions')
            .update({ is_active: false })
            .neq('id', id)
    }

    const { error } = await supabase.from('promotions').update({ is_active: isActive }).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/admin/promotions')
    revalidatePath('/')
}

export async function getActivePromotion() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check if user has seen it
    const { data: { user } } = await supabase.auth.getUser()

    const { data: promo } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .single()

    if (!promo) return null

    if (user) {
        const { data: seen } = await supabase
            .from('user_promotions')
            .select('id')
            .eq('user_id', user.id)
            .eq('promotion_id', promo.id)
            .single()

        if (seen) return null
    }

    return promo
}

export async function markPromotionAsSeen(promotionId: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.from('user_promotions').upsert({
            user_id: user.id,
            promotion_id: promotionId,
            seen_at: new Date().toISOString()
        }, { onConflict: 'user_id, promotion_id' })
    }
}
