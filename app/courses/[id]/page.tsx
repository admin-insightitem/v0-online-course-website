import { notFound } from "next/navigation"
import { getCourseById } from "@/lib/actions/courses"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CourseDetailHero } from "@/components/course-detail/course-hero"
import { CourseInfo } from "@/components/course-detail/course-info"
import { CourseCurriculum } from "@/components/course-detail/course-curriculum"
import { CourseInstructor } from "@/components/course-detail/course-instructor"
import { CourseReviews } from "@/components/course-detail/course-reviews"
import { CourseSidebar } from "@/components/course-detail/course-sidebar"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getCourseById(id)
  if (!result.success) return { title: "강의를 찾을 수 없습니다" }
  return {
    title: `${result.data.title} | RichClass`,
    description: result.data.description,
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getCourseById(id)
  if (!result.success) notFound()

  const course = result.data

  return (
    <>
      <Header />
      <main>
        <CourseDetailHero course={course} />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative flex flex-col gap-10 py-10 lg:flex-row lg:py-16">
            {/* Main content */}
            <div className="min-w-0 flex-1">
              <CourseInfo course={course} />
              <CourseCurriculum course={course} />
              <CourseInstructor course={course} />
              <CourseReviews course={course} />
            </div>
            {/* Sidebar */}
            <div className="w-full lg:w-[380px] lg:shrink-0">
              <CourseSidebar course={course} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
