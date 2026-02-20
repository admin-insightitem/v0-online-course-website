import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { WebinarSection } from "@/components/webinar-section"
import { CoursesSection } from "@/components/courses-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { InstructorsSection } from "@/components/instructors-section"
import { CategoriesSection } from "@/components/categories-section"
import { TrustBanner } from "@/components/trust-banner"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main>
      <Header />
      {/* 1. 히어로 - 딥 네이비 */}
      <HeroSection />
      {/* 2. 무료 웨비나 - 화이트 */}
      <WebinarSection />
      {/* 3. 인기 강의 - 연한 그레이 */}
      <CoursesSection />
      {/* 4. 수강생 성과 후기 - 화이트 */}
      <TestimonialsSection />
      {/* 5. 강사진 소개 - 딥 네이비 (시각적 전환점) */}
      <InstructorsSection />
      {/* 6. 카테고리별 강의 - 연한 그레이 */}
      <CategoriesSection />
      {/* 7. 브랜드 가치 / 신뢰 요소 - 화이트 */}
      <TrustBanner />
      {/* 8. 최종 CTA - 딥 네이비 그라데이션 */}
      <CTASection />
      <Footer />
    </main>
  )
}
