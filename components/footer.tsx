import { Instagram, Facebook, Twitter, Youtube, MapPin, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/activewellpharma/', icon: Instagram },
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Youtube', href: '#', icon: Youtube },
] as const

const FOOTER_COLS = [
  {
    heading: 'About',
    links: [{ name: 'Our Story', url: '/about' }, { name: 'Blog', url: '/blog/plant-collagen-skin-elasticity' }],
  },
  {
    heading: 'Support',
    links: [{ name: 'FAQs', url: '/faqs' }, { name: 'Shipping & Returns', url: '/shipping-delivery-policy' }, { name: 'Track Order', url: '/orders' }, { name: 'Contact Us', url: '/contact-us' }],
  },
  {
    heading: 'Policies',
    links: [{ name: 'Privacy Policy', url: '/privacy-policy' }, { name: 'Terms of Service', url: '/terms-and-conditions' }, { name: 'Refund & Cancellation Policy', url: '/refund-cancellation-policy' }, { name: 'Shipping Policy', url: '/shipping-delivery-policy' }],
  },
] as const

const PAYMENT_METHODS = ['UPI', 'Visa', 'Mastercard', 'Razorpay', 'COD'] as const

const TRUST_BADGES = [
  { label: 'FSSAI', sublabel: 'Approved' },
  { label: 'ISO', sublabel: 'Certified' },
  { label: 'Made in', sublabel: 'India 🇮🇳' },
] as const

export default function Footer(): React.JSX.Element {
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: '#0f2318' }}
      aria-label="Site footer"
    >
      {/* ── Newsletter — split layout ── */}
      <div className="border-b border-white/10">
        <div className="container-brand px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 rounded-[32px] border border-white/10 bg-white/5 p-10 lg:p-14 shadow-2xl shadow-black/10">
            {/* Left */}
            <div className="max-w-md">
              <p className="text-[11px] font-extrabold text-secondary tracking-widest uppercase mb-3">
                Newsletter
              </p>
              <h2 className="font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight tracking-tight">
                Get 15% Off Your First Order
              </h2>
              <p className="text-[15px] text-white/60 leading-relaxed">
                Exclusive deals, new launches, and evidence-based wellness insights delivered straight to your inbox.
              </p>
            </div>

            {/* Right — form */}
            <div className="w-full lg:w-auto lg:min-w-[420px]">
              <div className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-[15px] focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300"
                  aria-label="Email address for newsletter"
                />
                <Button
                  size="default"
                  className="shrink-0 px-8 py-4 h-auto rounded-xl bg-secondary text-white font-bold text-[15px] hover:bg-secondary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-[12px] text-white/40 mt-3 font-medium">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer links ── */}
      <div className="container-brand px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pr-8">
            <Link
              href="/"
              className="inline-block font-extrabold text-2xl text-white mb-5 tracking-tight"
              aria-label="ActiveWell Pharma — Home"
            >
              <Image
                src={'/logo-invert.png'}
                width={200}
                height={70}
                alt='Logo'
              />
            </Link>
            <p className="text-[15px] text-white/60 leading-relaxed mb-8 max-w-[280px]">
              Premium plant-based wellness, crafted for everyday life. Clean, effective, and backed by science.
            </p>

            {/* Social links (12px margin via gap-3) */}
            <div className="flex items-center gap-3" aria-label="Follow us on social media">
              {SOCIAL_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow on ${item.name}`}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  <item.icon className="w-4 h-4 text-white/80" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[13px] font-extrabold text-white mb-6 tracking-widest uppercase opacity-90">{col.heading}</h3>
              <ul className="flex flex-col space-y-3" aria-label={`${col.heading} links`}>
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="text-[15px] text-white/60 hover:text-white transition-colors duration-200 font-medium leading-loose"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Trust badges row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pb-12 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center px-4 py-3 rounded-xl border border-white/10 bg-white/5 min-w-[80px]"
                aria-label={`${badge.label} ${badge.sublabel}`}
              >
                <span className="text-[13px] font-extrabold text-white tracking-wide leading-none mb-1">
                  {badge.label}
                </span>
                <span className="text-[11px] text-white/50 font-medium leading-none">{badge.sublabel}</span>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="px-4 py-2 text-[12px] font-bold text-white/60 bg-white/5 rounded-lg leading-none"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Address */}
          <address className="not-italic flex items-start gap-2.5 text-[14px] text-white/50 font-medium max-w-sm">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white/30" aria-hidden="true" />
            <span>
              Saili Kullian, Near Kabir Mandir, Pathankot, Punjab 145001, India
            </span>
          </address>

          {/* Copyright + contact */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <a
              href="mailto:info@activewellpharma.com"
              className="flex items-center gap-2 text-[14px] font-bold text-white/60 hover:text-white transition-colors duration-200"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              info@activewellpharma.com
            </a>
            <p className="text-[13px] text-white/40 font-medium">
              © {new Date().getFullYear()} ActiveWell Pharma. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
