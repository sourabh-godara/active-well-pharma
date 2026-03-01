// app/admin/promotions/page.tsx
import { getAdminPromotions } from '@/lib/data/admin.data'
import { PromotionList } from './promotion-list'

export const dynamic = 'force-dynamic'

export default async function PromotionsPage() {
    const promotions = await getAdminPromotions()

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
                <PromotionList initialPromotions={promotions} />
            </div>
        </div>
    )
}
