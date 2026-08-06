import { Shield, Truck, Star, Award, Lock } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Star,
    label: '10,000+ Customers',
    sublabel: 'Average ★ 4.8/5 rating',
  },
  {
    icon: Shield,
    label: 'FSSAI Approved',
    sublabel: 'Certified safe & tested',
  },
  {
    icon: Award,
    label: 'GMP Certified',
    sublabel: 'Highest quality standards',
  },
  {
    icon: Truck,
    label: 'Free Shipping',
    sublabel: 'On order above ₹500',
  },
  {
    icon: Lock,
    label: 'Secure Checkout',
    sublabel: '100% encrypted & safe',
  },
] as const

export function TrustStrip(): React.JSX.Element {
  return (
    <section
      className="border-b border-border bg-white"
      aria-label="Trust and certification indicators"
    >
      <div className="container-brand px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6 lg:py-8 overflow-x-auto scrollbar-none gap-8 lg:gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.label} className="flex items-center gap-6 shrink-0">
              {/* Divider between items (hidden on first) */}
              {i > 0 && (
                <div className="hidden lg:block w-px h-10 bg-border/60 shrink-0" aria-hidden="true" />
              )}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[14px] font-bold text-foreground leading-snug">{item.label}</p>
                  <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">{item.sublabel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
