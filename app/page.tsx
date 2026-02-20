import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Ticker } from "@/components/ticker"
import { TrustBanner } from "@/components/trust-banner"
import { CategoriesSection } from "@/components/categories-section"
import { CoursesSection } from "@/components/courses-section"
import { InstructorsSection } from "@/components/instructors-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WebinarSection } from "@/components/webinar-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <Ticker />
      <TrustBanner />
      <CategoriesSection />
      <CoursesSection />
      <InstructorsSection />
      <TestimonialsSection />
      <WebinarSection />
      <CTASection />
      <Footer />
    </main>
  )
}
