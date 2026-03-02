import { Header } from "@/components/header"
import { CoursesSection } from "@/components/courses-section"
import { Footer } from "@/components/footer"
import { getCourses, getCategories } from "@/lib/actions/courses"

export const metadata = {
  title: "전체 클래스 | RichClass",
  description: "검증된 전문가들의 실전 노하우를 담은 프리미엄 강의를 만나보세요.",
}

export default async function CoursesPage() {
  const [coursesResult, categoriesResult] = await Promise.all([
    getCourses({ limit: 50 }),
    getCategories(),
  ])

  const courses = coursesResult.success ? coursesResult.data.courses : []
  const categories = categoriesResult.success ? categoriesResult.data : []

  return (
    <main>
      <Header />
      <CoursesSection courses={courses} categories={categories} />
      <Footer />
    </main>
  )
}
