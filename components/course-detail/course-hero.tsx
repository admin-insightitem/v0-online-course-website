import Image from "next/image"
import Link from "next/link"
import { Star, Users, Clock, BookOpen, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { CourseWithInstructor, CourseSectionWithLectures } from "@/types"

type CourseDetail = CourseWithInstructor & { sections: CourseSectionWithLectures[] }

export function CourseDetailHero({ course }: { course: CourseDetail }) {
  const price = course.price
  const originalPrice = course.original_price ?? price
  const discount = originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0
  const totalLectures = course.sections.reduce((acc, s) => acc + s.lectures.length, 0)

  return (
    <section className="relative bg-primary">
      <div className="absolute inset-0">
        <Image
          src={course.image_url || "/images/placeholder.jpg"}
          alt=""
          fill
          className="object-cover opacity-15"
          priority
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-primary-foreground/60">
          <Link href="/" className="transition-colors hover:text-primary-foreground">홈</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#courses" className="transition-colors hover:text-primary-foreground">전체 클래스</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary-foreground/80">{course.category?.name}</span>
        </nav>

        {/* Badge */}
        {course.badge && (
          <Badge className={`${course.badge_color || ""} mb-4 border-0 text-xs font-bold`}>
            {course.badge}
          </Badge>
        )}

        {/* Title */}
        <h1 className="mb-4 max-w-3xl text-2xl font-bold leading-tight text-primary-foreground md:text-3xl lg:text-4xl text-balance">
          {course.title}
        </h1>

        {/* Description */}
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-lg">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/70">
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-primary-foreground">{course.rating_avg}</span>
            ({course.rating_count.toLocaleString()}개의 수강평)
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {course.student_count.toLocaleString()}명 수강 중
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            총 {course.total_duration || "-"}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {totalLectures}개 강의
          </span>
        </div>

        {/* Mobile price */}
        <div className="mt-8 flex items-center gap-3 lg:hidden">
          <span className="text-2xl font-bold text-primary-foreground">
            {"\u20A9"}{price.toLocaleString()}
          </span>
          {originalPrice > price && (
            <>
              <span className="text-sm text-primary-foreground/50 line-through">
                {"\u20A9"}{originalPrice.toLocaleString()}
              </span>
              <Badge className="border-0 bg-red-500 text-xs font-bold text-white">
                {discount}% OFF
              </Badge>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
