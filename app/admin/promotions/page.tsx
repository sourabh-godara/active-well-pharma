
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { PromotionList } from './promotion-list'

export default async function PromotionsPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: promotions } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Promotions</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage promotional popups. Only one active promotion allowed.
                    </p>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <PromotionList initialPromotions={promotions || []} />
            </div>
        </div>
    )
}
