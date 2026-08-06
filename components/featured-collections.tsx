import { ArrowRight } from 'lucide-react'

const COLLECTIONS = [
  {
    title: 'Skin Care',
    description: 'Glow from within with our plant-based elixirs',
    bg: 'linear-gradient(135deg, #fdf6f2 0%, #fde8e2 100%)',
    textAccent: '#e8614a',
    border: '#fbdcd5',
    href: '#',
  },
  {
    title: 'Hair Care',
    description: 'Strengthen and nourish from root to tip',
    bg: 'linear-gradient(135deg, #f0fdf7 0%, #d8f0e8 100%)',
    textAccent: '#215732',
    border: '#c4e3d9',
    href: '#',
  },
  {
    title: 'Weight Care',
    description: 'Natural metabolism support, every day',
    bg: 'linear-gradient(135deg, #fffcf0 0%, #fef5d4 100%)',
    textAccent: '#b8860b',
    border: '#f9eab2',
    href: '#',
  },
  {
    title: 'Wellness',
    description: 'Inside-out health with daily supplements',
    bg: 'linear-gradient(135deg, #f9f5fd 0%, #ecdff9 100%)',
    textAccent: '#7c3aed',
    border: '#e0cbf2',
    href: '#',
  },
  {
    title: 'Combos',
    description: 'Curated bundles for maximum results',
    bg: 'linear-gradient(135deg, #f2f7ff 0%, #e8f0fe 100%)',
    textAccent: '#2563eb',
    border: '#d0e0fb',
    href: '#',
  },
] as const

export default function FeaturedCollections(): React.JSX.Element {
  return (
    <section
      className="py-24 lg:py-32 bg-surface px-4 sm:px-6 lg:px-8"
      aria-labelledby="collections-heading"
    >
      <div className="container-brand">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <h2
            id="collections-heading"
            className="section-heading font-bold text-foreground mb-4"
          >
            Explore <span className="text-primary">Collections</span>
          </h2>
          <p className="text-muted-foreground text-[1.0625rem] max-w-lg mx-auto leading-relaxed">
            Every collection crafted for a specific need. Discover your perfect routine.
          </p>
        </div>

        {/* Top row: 3 equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 mb-5 lg:mb-6">
          {COLLECTIONS.slice(0, 3).map((col) => (
            <CollectionCard key={col.title} col={col} />
          ))}
        </div>

        {/* Bottom row: 2 wider cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {COLLECTIONS.slice(3).map((col) => (
            <CollectionCard key={col.title} col={col} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface CollectionCardProps {
  col: {
    title: string
    description: string
    bg: string
    textAccent: string
    border: string
    href: string
  }
}

function CollectionCard({ col }: CollectionCardProps): React.JSX.Element {
  return (
    <a
      href={col.href}
      className="group relative flex flex-col justify-end p-8 lg:p-10 rounded-2xl border hover:border-transparent transition-all duration-500 overflow-hidden min-h-[220px] lg:min-h-[280px]"
      style={{ borderColor: col.border, background: col.bg }}
      aria-label={`${col.title} collection — ${col.description}`}
    >
      {/* Decorative gradient overlay on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 100% 100%, ${col.textAccent}15 0%, transparent 50%)`,
        }}
        aria-hidden="true"
      />

      {/* Decorative Typography (replaces emojis) */}
      <div 
        className="absolute -top-4 -right-4 text-[120px] lg:text-[160px] font-extrabold opacity-[0.03] leading-none pointer-events-none group-hover:scale-110 transition-transform duration-700 ease-out"
        style={{ color: col.textAccent }}
        aria-hidden="true"
      >
        {col.title.charAt(0)}
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col items-start w-full">
        <h3
          className="font-bold text-[1.375rem] lg:text-2xl text-foreground mb-2 group-hover:text-opacity-90 transition-colors tracking-tight"
        >
          {col.title}
        </h3>
        <p className="text-[15px] text-foreground/70 leading-relaxed mb-6 max-w-[280px]">{col.description}</p>

        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white shadow-sm hover:shadow-md transition-all duration-300"
          style={{ color: col.textAccent }}
        >
          Explore Collection
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </a>
  )
}
