import { WebinarTopBanner } from "@/components/webinar-top-banner"
import { Header } from "@/components/header"

import { CoursesSection } from "@/components/courses-section"
import { InstructorsSection } from "@/components/instructors-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main>
      <WebinarTopBanner />
      <Header />
      <CoursesSection />
      <InstructorsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
