const INGREDIENTS = [
  {
    emoji: '🍎',
    name: 'Apple Cider Vinegar',
    benefit: 'Gut Health & Digestion',
    description:
      'Supports healthy digestion, blood sugar balance, and natural detoxification from within. Ethically sourced and naturally fermented.',
    bg: '#fdf6e9',
    tagBg: '#f5d08b',
    tagColor: '#966d21',
  },
  {
    emoji: '🌿',
    name: 'Biotin (Vitamin B7)',
    benefit: 'Hair & Nail Strength',
    description:
      'Essential vitamin that supports keratin production for stronger hair, nails, and healthier skin. Clinically dosed for maximum absorption.',
    bg: '#eaf6ee',
    tagBg: '#a8dbb5',
    tagColor: '#215732',
  },
  {
    emoji: '💧',
    name: 'Marine Collagen',
    benefit: 'Skin Elasticity',
    description:
      'Supports the skin\'s natural collagen matrix for improved firmness, hydration, and a youthful glow. Sustainably harvested.',
    bg: '#eff4fc',
    tagBg: '#a8c5f5',
    tagColor: '#1d4ed8',
  },
  {
    emoji: '🍊',
    name: 'Vitamin C Complex',
    benefit: 'Immunity & Radiance',
    description:
      'Powerful antioxidant supporting immune function, collagen synthesis, and natural skin brightening. Extracted from whole food sources.',
    bg: '#fff5ec',
    tagBg: '#ffc87a',
    tagColor: '#c2410c',
  },
] as const

export default function Ingredients(): React.JSX.Element {
  return (
    <section
      className="py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8"
      aria-labelledby="ingredients-heading"
    >
      <div className="container-brand max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            <h2
              id="ingredients-heading"
              className="section-heading font-bold text-foreground mb-4"
            >
              Star <span className="text-primary">Ingredients</span>
            </h2>
            <p className="text-muted-foreground text-[1.0625rem] leading-relaxed">
              Every ingredient is chosen for efficacy and purity — sourced directly from nature, validated by clinical science.
            </p>
          </div>
        </div>

        {/* 2x2 Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {INGREDIENTS.map((item) => (
            <div
              key={item.name}
              className="relative bg-surface rounded-[24px] p-8 lg:p-12 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden"
              aria-label={`${item.name} — ${item.benefit}`}
            >
              {/* Large background decorative emoji (simulating a cutout) */}
              <div 
                className="absolute -bottom-8 -right-8 text-[160px] opacity-10 rotate-[-15deg] select-none pointer-events-none"
                aria-hidden="true"
              >
                {item.emoji}
              </div>

              {/* Tag */}
              <div className="mb-8 inline-flex">
                <span
                  className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: item.tagBg, color: item.tagColor }}
                >
                  {item.benefit}
                </span>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="font-extrabold text-foreground text-2xl lg:text-3xl mb-3 tracking-tight">
                  {item.name}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[340px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
