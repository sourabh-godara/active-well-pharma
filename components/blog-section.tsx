import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'

const ARTICLES = [
  {
    category: 'Skin Health',
    title: 'How Plant Collagen Supports Skin Elasticity as You Age',
    excerpt:
      'Collagen production naturally declines in your 20s. Here\'s how plant-based collagen precursors can help support your skin\'s natural structure without animal derivatives.',
    readTime: '5 min read',
    href: '/blog/plant-collagen-skin-elasticity',
    bg: '#eaf6ee',
    categoryColor: '#215732',
    image: '/blog-1.png',
  },
  {
    category: 'Hair Care',
    title: 'Biotin vs. Collagen: Which Should You Take for Hair Growth?',
    excerpt:
      'Both are popular for hair health — but they work differently. We break down the clinical science so you can choose the right formula for your specific needs.',
    readTime: '4 min read',
    href: '/blog/biotin-vs-collagen-hair-growth',
    bg: '#fde8e2',
    categoryColor: '#e8614a',
    image: '/blog-2.png',
  },
  {
    category: 'Wellness',
    title: 'The Morning Supplement Stack for All-Day Energy and Focus',
    excerpt:
      'Starting your day right doesn\'t have to be complicated. Our nutritionists share the simple daily stack thousands of customers swear by for sustained energy.',
    readTime: '6 min read',
    href: '/blog/morning-supplement-stack',
    bg: '#fef5d4',
    categoryColor: '#b8860b',
    image: '/blog-3.png',
  },
] as const

export default function BlogSection(): React.JSX.Element {
  return (
    <section
      className="py-24 lg:py-32 bg-surface px-4 sm:px-6 lg:px-8"
      aria-labelledby="blog-heading"
    >
      <div className="container-brand">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-xl">
            <h2
              id="blog-heading"
              className="section-heading font-bold text-foreground mb-4"
            >
              Latest <span className="text-primary">Articles</span>
            </h2>
            <p className="text-muted-foreground text-[1.0625rem] leading-relaxed">Evidence-based wellness insights and routines from our experts.</p>
          </div>
          <Link
            href="#"
            className="hidden md:flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-primary/75 transition-colors shrink-0 group pb-1"
            aria-label="View all articles"
          >
            View All Articles
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Articles — horizontal cards */}
        <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto">
          {ARTICLES.map((article) => (
            <article key={article.title}>
              <Link
                href={article.href}
                className="group flex flex-col md:flex-row gap-0 bg-white rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 ease-out border border-border/50"
                aria-label={`Read: ${article.title}`}
              >
                {/* Image (left, md+) */}
                <div
                  className="md:w-[280px] lg:w-[320px] md:shrink-0 h-48 md:h-auto flex items-center justify-center select-none relative overflow-hidden"
                  style={{ backgroundColor: article.bg }}
                  aria-hidden="true"
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10" />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 lg:p-10 flex-1">
                  {/* Category + read time */}
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: article.bg,
                        color: article.categoryColor,
                      }}
                    >
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {article.readTime}
                    </div>
                  </div>

                  <h3 className="font-bold text-foreground text-xl lg:text-2xl leading-snug mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="text-[15px] text-muted-foreground leading-relaxed line-clamp-2 mb-6">
                    {article.excerpt}
                  </p>

                  <div className="inline-flex items-center gap-2 text-[14px] font-bold text-primary mt-auto">
                    Read Article
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Mobile View All link */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-primary/75 transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
