
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { BannerList } from './banner-list'

export default async function BannersPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: banners } = await supabase
        .from('banners')
        .select('*')
        .order('order_index', { ascending: true })

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Banners</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage homepage hero banners. Drag and drop to reorder.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    {/* This button will trigger a modal in client component */}
                    {/* For simplicity in this step, BannerList will handle the "Add" state or we pass it down */}
                </div>
            </div>

            <div className="mt-8 flow-root">
                <BannerList initialBanners={banners || []} />
            </div>
        </div>
    )
}
