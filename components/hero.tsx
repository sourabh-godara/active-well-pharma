import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TRUST_BADGES = [
  '100% Plant-Based',
  'Clinically Tested',
  'FSSAI Certified',
] as const

const STARS = Array.from({ length: 5 })

export default function Hero(): React.JSX.Element {
  return (
    <section
      className="relative overflow-hidden bg-[#1a4a2e]"
      style={{
        background: `
          radial-gradient(ellipse at 78% 15%, #235d39 0%, transparent 52%),
          radial-gradient(ellipse at 18% 88%, #0d2c1a 0%, transparent 48%),
          radial-gradient(ellipse at 50% 50%, #1c5232 0%, transparent 80%),
          #1a4a2e
        `,
        minHeight: '65vh',
      }}
      aria-label="Hero — ActiveWell Pharma"
    >
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
        aria-hidden="true"
      />

      <div className="container-brand relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ── Text side ── */}
        <div className="flex-1 text-center lg:text-left max-w-[580px] mx-auto lg:mx-0 flex flex-col items-center lg:items-start">

          <h1 className="font-extrabold text-white leading-[1.08] tracking-[-0.04em] mb-6 max-w-[500px]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)' }}
          >
            Plant-Powered.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #7dd3a4 0%, #a8ebc3 50%, #6fcf97 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Beautifully Effective.
            </span>
          </h1>

          <p className="text-[1.125rem] leading-relaxed text-white/75 max-w-[460px] mb-10 font-normal">
            Clinically-inspired supplements formulated with nature's finest. For radiant skin, stronger hair, and everyday wellness.
          </p>

          {/* Unified Conversion Block */}
          <div className="flex flex-col items-center lg:items-start w-full gap-5">
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 h-14 text-[15px] font-semibold bg-white text-primary hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-black/10"
                >
                  Shop Bestsellers
                </Button>
              </Link>
              <Link href={'/shop'}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full px-8 h-14 text-[15px] font-semibold border-white/20 text-white bg-transparent hover:bg-white/5 hover:border-white/30 transition-all duration-300"
                >
                  View Products
                </Button>
              </Link>
            </div>

            {/* Trust Line & Badges */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <div className="flex gap-0.5" aria-label="5 star rating" role="img">
                  {STARS.map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-white/70 font-medium">
                  Trusted by thousands of customers
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
                    <span className="text-[13px] text-white/60 font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Image side ── */}
        <div className="flex-1 relative flex items-center justify-center w-full mt-8 lg:mt-0">
          <div
            className="relative w-full scale-110 lg:scale-125 translate-y-4 lg:translate-y-8"
            style={{
              height: 'clamp(320px, 50vh, 550px)',
            }}
          >
            <Image
              src="/hero02.png"
              alt="ActiveWell Pharma — premium plant-based wellness products"
              fill
              className="object-contain object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              sizes="(max-width: 1023px) 90vw, 50vw"
              priority
              style={{
                filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.4)) drop-shadow(0 15px 20px rgba(0,0,0,0.2))',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
