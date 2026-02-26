import { Check } from 'lucide-react'
import { ProductBenefit } from '@/types'

interface ProductBenefitsProps {
    benefits: ProductBenefit[]
}

export function ProductBenefits({ benefits }: ProductBenefitsProps) {
    if (!benefits || benefits.length === 0) return null

    return (
        <ul role="list" className="space-y-2.5">
            {benefits.map((benefit) => (
                <li key={benefit.id} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-3 w-3 text-green-600 stroke-3" aria-hidden />
                    </span>
                    <span className="font-body text-sm text-foreground/80 leading-snug">
                        {benefit.benefit_text}
                    </span>
                </li>
            ))}
        </ul>
    )
}
