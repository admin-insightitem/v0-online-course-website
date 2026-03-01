import { notFound } from "next/navigation"
import { getCourseById, courses } from "@/lib/courses"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CourseDetailHero } from "@/components/course-detail/course-hero"
import { CourseTabsNav } from "@/components/course-detail/course-tabs-nav"
import { CourseIntro } from "@/components/course-detail/course-intro"
import { CourseCurriculum } from "@/components/course-detail/course-curriculum"
import { CourseInstructor } from "@/components/course-detail/course-instructor"
import { CourseReviews } from "@/components/course-detail/course-reviews"
import { CourseRefund } from "@/components/course-detail/course-refund"
import { CourseMobileCTA } from "@/components/course-detail/course-mobile-cta"
import { BackToTop } from "@/components/course-detail/back-to-top"

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = getCourseById(id)
  if (!course) return { title: "강의를 찾을 수 없습니다" }
  return {
    title: `${course.title} | RichClass`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = getCourseById(id)
  if (!course) notFound()

  return (
    <>
      <Header variant="logged-in" />
      <main>
        <CourseDetailHero course={course} />
        <CourseTabsNav />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <CourseIntro course={course} />
          <div className="border-t border-border" />
          <CourseCurriculum course={course} />
          <div className="border-t border-border" />
          <CourseInstructor course={course} />
          <div className="border-t border-border" />
          <CourseReviews course={course} />
          <div className="border-t border-border" />
          <CourseRefund />
          {/* Spacer for mobile CTA */}
          <div className="h-24 lg:hidden" />
        </div>
        <CourseMobileCTA course={course} />
        <BackToTop />
      </main>
      <Footer />
    </>
  )
}
