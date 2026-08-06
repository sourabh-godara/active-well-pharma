import Hero from '@/components/hero'
import { PromotionModal } from '@/components/promotion-modal'
import NavbarMobile from '@/components/navbar-mobile'
import { TrustStrip } from '@/components/trust-strip'
import Categories from '@/components/categories'
import BestSellers from '@/components/best-sellers'
import FeaturedCollections from '@/components/featured-collections'
import FeaturedBundle from '@/components/featured-bundle'
import Benefits from '@/components/benefits'
import HowItWorks from '@/components/how-it-works'
import ScienceCertifications from '@/components/science-certifications'
import Ingredients from '@/components/ingredients'
import Testimonials from '@/components/testimonials'
import CustomerMoments from '@/components/customer-moments'
import BlogSection from '@/components/blog-section'
import Footer from '@/components/footer'
import { getActivePromotion } from '@/lib/actions/promotion.actions'

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata = {
  title: 'ActiveWell Pharma — Premium Plant-Based Wellness',
  description:
    'Shop clinically-inspired, 100% plant-based supplements for radiant skin, healthy hair, and total wellness. FSSAI approved, GMP certified. Free shipping above ₹599.',
}

export default async function Home(): Promise<React.JSX.Element> {
  const activePromotion = await getActivePromotion()

  return (
    <div className="min-h-screen bg-background">
      {/* Promotion modal (server-fetched, client-rendered) */}
      <PromotionModal promotion={activePromotion} />


      <Hero />


      <TrustStrip />


      <Categories />

      {/* Async server component — fetches own data */}
      <BestSellers />

      {/*      <FeaturedCollections /> */}


      <FeaturedBundle />


      <Benefits />


      <HowItWorks />


      <ScienceCertifications />

      <Ingredients />

      <Testimonials />

      <CustomerMoments />

      <BlogSection />

      <Footer />

      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  )
}
