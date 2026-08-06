import { CheckCircle2, Star } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Priya S.',
    initials: 'PS',
    location: 'Mumbai, MH',
    rating: 5,
    date: 'June 2026',
    product: 'Active Fizz',
    text: 'My immunity has never felt this strong. After three weeks, I noticed a real difference in my energy. The formula feels so clean and it\'s become a non-negotiable part of my morning.',
  },
  {
    name: 'Ananya R.',
    initials: 'AR',
    location: 'Bangalore, KA',
    rating: 5,
    date: 'May 2026',
    product: 'Active Fizz Plus',
    text: 'I love that it\'s completely plant-based. My energy levels feel more sustained and I feel less prone to seasonal illnesses. Will definitely be reordering next month.',
  },
  {
    name: 'Meera K.',
    initials: 'MK',
    location: 'Delhi, DL',
    rating: 5,
    date: 'July 2026',
    product: 'Active Fizz Plus',
    text: 'Started this after struggling with immunity for two years. Within a month my energy levels looked healthier and I felt stronger. Incredible results.',
  },
] as const

const AVATAR_COLORS = [
  { bg: '#d8f0e8', text: '#215732' },
  { bg: '#ecdff9', text: '#7c3aed' },
  { bg: '#fde8e2', text: '#e8614a' },
] as const

export default function Testimonials(): React.JSX.Element {
  return (
    <section
      className="py-24 lg:py-32 bg-surface px-4 sm:px-6 lg:px-8"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-brand">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2
            id="testimonials-heading"
            className="section-heading font-bold text-foreground mb-4"
          >
            Real People,{' '}
            <span className="text-primary">Real Results</span>
          </h2>
          <p className="text-muted-foreground text-[1.0625rem] max-w-md mx-auto leading-relaxed">
            Thousands of customers share their journey to healthier skin, hair, and everyday wellness.
          </p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, i) => (
            <article
              key={review.name}
              className="testimonial-card bg-white rounded-3xl p-8 lg:p-10 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
              aria-label={`Review by ${review.name}`}
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-6" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 mb-8">
                <p className="text-[17px] leading-relaxed text-[#333333] font-medium tracking-tight">
                  &ldquo;{review.text}&rdquo;
                </p>
              </blockquote>

              {/* Reviewer Meta */}
              <div className="flex items-center gap-4 mt-auto">
                {/* Initials avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    backgroundColor: AVATAR_COLORS[i].bg,
                    color: AVATAR_COLORS[i].text,
                  }}
                  aria-hidden="true"
                >
                  {review.initials}
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="font-bold text-foreground text-[15px] leading-none">{review.name}</p>
                    <CheckCircle2
                      className="w-4 h-4 text-secondary shrink-0"
                      aria-label="Verified buyer"
                    />
                  </div>
                  <p className="text-[13px] text-muted-foreground">
                    {review.product}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
