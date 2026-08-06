import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

const BUNDLE_ITEMS = [
  'Active Fizz Plus',
  'Active Fizz'
] as const

export default function FeaturedBundle(): React.JSX.Element {
  return (
    <section
      id="bundles"
      className="py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8"
      aria-labelledby="bundle-heading"
    >
      <div className="container-brand">
        <div className="rounded-[24px] border border-border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — visual/image side */}
            <div
              className="relative flex items-center justify-center min-h-[400px] lg:min-h-[540px] p-12"
              style={{
                background: `
                  radial-gradient(ellipse at 70% 30%, #235d39 0%, transparent 60%),
                  radial-gradient(ellipse at 20% 80%, #0d2c1a 0%, transparent 50%),
                  #1a4a2e
                `,
              }}
              aria-hidden="true"
            >
              {/* Bundle visual — stacked product pills */}
              <div className="flex flex-col gap-4 w-full max-w-[280px]">
                {BUNDLE_ITEMS.map((item, i) => (
                  <div
                    key={item}
                    className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 shadow-xl shadow-black/10"
                    style={{ transform: `translateX(${i % 2 === 0 ? '-12px' : '12px'})` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <span className="text-base" aria-hidden="true">🌿</span>
                    </div>
                    <span className="text-[15px] font-semibold text-white tracking-wide line-clamp-1">{item}</span>
                  </div>
                ))}
              </div>

              {/* Discount circle */}
              <div
                className="absolute top-8 right-8 w-20 h-20 rounded-full bg-accent flex flex-col items-center justify-center shadow-2xl shadow-accent/20 hover:scale-110 transition-transform duration-300"
                aria-label="Save 30%"
              >
                <span className="text-white font-extrabold text-xl leading-none">FREE</span>
                <span className="text-white/90 text-xs font-bold tracking-widest leading-none mt-1">Shipping</span>
              </div>
            </div>

            {/* Right — content side */}
            <div className="flex flex-col justify-center p-10 lg:p-16 bg-white">
              {/* Label */}
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-4 h-4 text-accent" aria-hidden="true" />
                <span className="text-[13px] font-bold text-accent tracking-[0.15em] uppercase">
                  Featured Bundle
                </span>
              </div>

              <h2
                id="bundle-heading"
                className="font-extrabold text-foreground mb-4 leading-[1.1] tracking-tight"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                The Complete Wellness Bundle
              </h2>

              <p className="text-muted-foreground text-[1.125rem] leading-relaxed mb-8 max-w-[420px]">
                Our two bestselling formulas combined — detox, collagen, and biotin — for a complete inside-out glow routine. Get Free Shipping on this bundle.
              </p>

              {/* Item list */}
              <ul className="space-y-3.5 mb-10" aria-label="Bundle includes">
                {BUNDLE_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] font-medium text-foreground/80">
                    <div className="w-2 h-2 rounded-full bg-secondary shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Price + CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-auto border-t border-border/60 pt-8">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">₹558</span>
                    <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/30">₹668</span>
                  </div>
                  <p className="text-[13px] text-primary font-bold mt-1 tracking-wide uppercase">Get Free Shipping</p>
                </div>
                <Link href="/shop" className="sm:ml-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-xl px-8 h-14 text-[15px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 gap-2"
                  >
                    Get This Bundle
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
