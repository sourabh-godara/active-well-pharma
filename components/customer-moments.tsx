import Link from 'next/link'
import { Instagram, ArrowRight } from 'lucide-react'

export default function CustomerMoments(): React.JSX.Element {
  return (
    <section
      className="py-16 lg:py-24 bg-white px-4 sm:px-6 lg:px-8"
      aria-labelledby="community-heading"
    >
      <div className="container-brand max-w-5xl">
        <div 
          className="relative overflow-hidden rounded-[32px] bg-[#1a4a2e] text-center px-6 py-16 lg:py-24 shadow-2xl shadow-[#1a4a2e]/20"
          style={{
            background: `
              radial-gradient(circle at 0% 0%, #235d39 0%, transparent 50%),
              radial-gradient(circle at 100% 100%, #0d2c1a 0%, transparent 50%),
              #1a4a2e
            `,
          }}
        >
          {/* Subtle texture */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center mb-8 shadow-lg">
              <Instagram className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            
            <h2
              id="community-heading"
              className="font-extrabold text-white mb-4 tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Join Our Community
            </h2>
            
            <p className="text-[1.125rem] text-white/75 leading-relaxed max-w-lg mb-10">
              Share your wellness journey with us. Tag <strong className="text-white">@activewellpharma</strong> to be featured on our official channel.
            </p>

            <Link
              href="https://www.instagram.com/activewellpharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-full bg-white text-primary text-[15px] font-bold hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
              aria-label="Follow ActiveWell Pharma on Instagram"
            >
              Follow on Instagram
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
