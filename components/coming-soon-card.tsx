'use client'

import Image from 'next/image'
import { Clock } from 'lucide-react'

interface ComingSoonProduct {
  name: string
  category: string
  description: string
  imagePlaceholder: string
}

interface ComingSoonCardProps {
  product: ComingSoonProduct
}

export function ComingSoonCard({ product }: ComingSoonCardProps): React.JSX.Element {
  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-border/40 hover:border-primary/20 transition-all duration-500 overflow-hidden"
      style={{
        boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.02)',
      }}
      aria-label={`${product.name} — Coming Soon`}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.08)',
        }}
        aria-hidden="true"
      />

      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f7f5] rounded-t-2xl z-10">
        <Image
          src={product.imagePlaceholder}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-col flex-1 p-5 lg:p-6 z-10 bg-white rounded-b-2xl">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
            {product.category}
          </p>
        </div>

        <h3 className="font-semibold text-foreground text-base leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="flex-1" />

        <button
          disabled
          className="flex items-center justify-center gap-2 w-full rounded-xl h-11 text-[14px] font-semibold bg-muted text-muted-foreground cursor-not-allowed opacity-70"
        >
          <Clock className="w-4 h-4" aria-hidden="true" />
          Coming Soon
        </button>
      </div>
    </div>
  )
}

