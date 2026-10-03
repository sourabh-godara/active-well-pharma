import { ComingSoonCard } from '@/components/coming-soon-card'
import { Sparkles } from 'lucide-react'

// ── Hardcoded upcoming products — no database ────────────────────────────────
const UPCOMING_PRODUCTS = [
  {
    name: 'Active Glow Collagen Booster',
    category: 'Skin Care',
    description:
      'Plant-based collagen peptides with Vitamin C & Hyaluronic Acid for youthful, radiant skin from within.',
    expectedPrice: 899,
    imagePlaceholder: '/coming_soon_product_01.png',
  },
  {
    name: 'Active Apple Cider Vineger',
    category: 'Wellness',
    description:
      'Effective fat burner and gut-friendly supplement.',
    expectedPrice: 749,
    imagePlaceholder: '/coming_soon_product_02.png',
  },
] as const

export default function ComingSoonProducts(): React.JSX.Element {
  return (
    <section
      id="coming-soon"
      className="py-24 lg:py-32 bg-surface px-4 sm:px-6 lg:px-8"
      aria-labelledby="coming-soon-heading"
    >
      <div className="container-brand">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 mb-6">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-primary tracking-wide uppercase">
              Launching Soon
            </span>
          </div>
          <h2
            id="coming-soon-heading"
            className="section-heading font-bold text-foreground mb-4"
          >
            What&apos;s <span className="text-primary">Next</span>
          </h2>
          <p className="text-muted-foreground text-[1.0625rem] max-w-lg mx-auto leading-relaxed">
            Exciting new additions to our plant-based wellness range. Be the first to know when they drop.
          </p>
        </div>

        {/* Cards — centred 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-2xl mx-auto">
          {UPCOMING_PRODUCTS.map((product) => (
            <ComingSoonCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
