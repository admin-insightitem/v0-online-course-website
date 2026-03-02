import { notFound } from "next/navigation"
import { getCourseById, courses } from "@/lib/courses"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CourseDetailHero } from "@/components/course-detail/course-hero"
import { CourseInfo } from "@/components/course-detail/course-info"
import { CourseCurriculum } from "@/components/course-detail/course-curriculum"
import { CourseInstructor } from "@/components/course-detail/course-instructor"
import { CourseReviews } from "@/components/course-detail/course-reviews"
import { CourseSidebar } from "@/components/course-detail/course-sidebar"

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
