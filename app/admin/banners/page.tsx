// app/admin/banners/page.tsx
import { getAdminBanners } from '@/lib/data/admin.data'
import { BannerList } from './banner-list'

export const dynamic = 'force-dynamic'

export default async function BannersPage() {
    const banners = await getAdminBanners()

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Banners</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage homepage hero banners. Drag and drop to reorder.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none" />
            </div>
            <div className="mt-8 flow-root">
                <BannerList initialBanners={banners} />
            </div>
        </div>
    )
}
