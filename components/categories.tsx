import { Sparkles, Leaf, Heart, Sun, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    icon: Sparkles,
    title: 'Skin Care',
    description: 'Glow-boosting formulas for radiant, healthy skin',
    tileBg: '#fde8e2',
    iconColor: '#e8614a',
    href: '#',
  },
  {
    icon: Leaf,
    title: 'Hair Care',
    description: 'Plant-powered strength from root to tip',
    tileBg: '#d8f0e8',
    iconColor: '#215732',
    href: '#',
  },
  {
    icon: Heart,
    title: 'Wellness',
    description: 'Inside-out health with daily supplements',
    tileBg: '#ecdff9',
    iconColor: '#7c3aed',
    href: '#',
  },
  {
    icon: Sun,
    title: 'Weight Care',
    description: 'Natural metabolism support, daily balance',
    tileBg: '#fef5d4',
    iconColor: '#b8860b',
    href: '#',
  },
] as const

export default function Categories(): React.JSX.Element {
  return (
    <section
      id="categories"
      className="py-16 lg:py-24 bg-surface px-4 sm:px-6 lg:px-8"
      aria-labelledby="categories-heading"
    >
      <div className="container-brand">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            id="categories-heading"
            className="section-heading font-bold text-foreground mb-4"
          >
            Shop by <span className="text-primary">Concern</span>
          </h2>
          <p className="text-muted-foreground text-[1.0625rem] max-w-md mx-auto leading-relaxed">
            Find the perfect plant-based solution for your unique needs
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              className="group flex flex-col sm:flex-row items-start sm:items-center lg:items-start gap-5 lg:gap-6 p-6 lg:p-8 bg-white rounded-[20px] border border-border/40 hover:border-primary/10 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 ease-out"
              aria-label={`${cat.title} — ${cat.description}`}
            >
              {/* Icon tile */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                style={{ backgroundColor: cat.tileBg }}
              >
                <cat.icon
                  className="w-7 h-7"
                  style={{ color: cat.iconColor }}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1.5 text-base tracking-tight">{cat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{cat.description}</p>
                {/* Arrow */}
                <ArrowRight
                  className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors duration-200"
                  aria-hidden="true"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
