import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { HeroSection } from '@/features/hero'
import { QualityLabelSection } from '@/features/quality-label'
import { HowItWorksSection } from '@/features/how-it-works'
import { ReviewsSection } from '@/features/reviews'
import { FAQSection } from '@/features/faq'
import { LeadFinderSection } from '@/features/lead-finder'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <QualityLabelSection />
        <HowItWorksSection />
        <ReviewsSection />
        <LeadFinderSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
