import { ShoppingCart, Repeat2, Smile } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: ShoppingCart,
    title: 'Choose Your Routine',
    description:
      'Browse our curated range of plant-based formulas or take our holistic wellness quiz to find what your body needs most.',
  },
  {
    number: '02',
    icon: Repeat2,
    title: 'Stay Consistent',
    description:
      'Integrate into your daily ritual. True wellness takes time  most customers feel a noticeable difference within 4–6 weeks.',
  },
  {
    number: '03',
    icon: Smile,
    title: 'Feel the Difference',
    description:
      'Experience healthier skin, stronger hair, and improved energy naturally. Join thousands who have made the switch.',
  },
] as const

export default function HowItWorks(): React.JSX.Element {
  return (
    <section
      className="py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-brand">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <h2
            id="how-it-works-heading"
            className="section-heading font-bold text-foreground mb-4"
          >
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-[1.0625rem] max-w-md mx-auto leading-relaxed">
            Three simple steps to a healthier, more radiant you
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 max-w-5xl mx-auto">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden md:block absolute top-[3.75rem] left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
            aria-hidden="true"
          />

          {STEPS.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center px-4">
              {/* Number + icon circle */}
              <div className="relative mb-8 group">
                <div className="w-24 h-24 rounded-[1.5rem] bg-surface flex items-center justify-center border border-border/50 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-500 ease-out">
                  <step.icon className="w-10 h-10 text-primary" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <span className="text-[11px] font-extrabold text-primary-foreground tracking-wide">{step.number}</span>
                </div>
              </div>

              <h3 className="font-bold text-foreground text-xl mb-3 tracking-tight">{step.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[260px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
