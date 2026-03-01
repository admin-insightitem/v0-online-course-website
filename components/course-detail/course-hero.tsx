import Image from "next/image"
import Link from "next/link"
import { Star, Users, Clock, BookOpen, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/courses"

export function CourseDetailHero({ course }: { course: Course }) {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <Image
          src={course.image}
          alt=""
          fill
          className="object-cover opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-primary-foreground/60">
          <Link href="/" className="transition-colors hover:text-primary-foreground">홈</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#courses" className="transition-colors hover:text-primary-foreground">전체 클래스</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary-foreground/80">{course.category}</span>
        </nav>

        {/* Badge */}
        {course.badge && (
          <Badge className={`${course.badgeColor} mb-3 border-0 text-xs font-bold`}>
            {course.badge}
          </Badge>
        )}

        {/* Title */}
        <h1 className="mb-4 max-w-3xl text-2xl font-bold leading-tight text-primary-foreground md:text-3xl lg:text-4xl text-balance">
          {course.title}
        </h1>

        {/* Description */}
        <p className="mb-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/70">
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-primary-foreground">{course.rating}</span>
            ({course.reviews.toLocaleString()}개의 수강평)
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {course.students.toLocaleString()}명 수강 중
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            총 {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {course.lectures}개 강의
          </span>
        </div>

        {/* Instructor Mini */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary-foreground/20">
            <Image
              src={course.instructorImage}
              alt={course.instructor}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-foreground">{course.instructor}</p>
            <p className="text-xs text-primary-foreground/60">{course.instructorTitle}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
