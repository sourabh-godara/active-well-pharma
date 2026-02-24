import { Check } from 'lucide-react'
import { ProductBenefit } from '@/types'

interface ProductBenefitsProps {
    benefits: ProductBenefit[]
}

export function ProductBenefits({ benefits }: ProductBenefitsProps) {
    if (!benefits || benefits.length === 0) return null

    return (
        <div className="mt-6">
            <ul role="list" className="space-y-3">
                {benefits.map((benefit) => (
                    <li key={benefit.id} className="flex items-start gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 mt-0.5 shrink-0">
                            <Check className="h-3 w-3 text-green-600" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-gray-600">{benefit.benefit_text}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
