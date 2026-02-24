import { Truck, ShieldCheck, RefreshCw } from 'lucide-react'

export function TrustBadges() {
    return (
        <div className="grid grid-cols-3 gap-4 my-8">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-center">
                <Truck className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-center">
                <ShieldCheck className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Genuine Product</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-center">
                <RefreshCw className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Easy Returns</span>
            </div>
        </div>
    )
}
