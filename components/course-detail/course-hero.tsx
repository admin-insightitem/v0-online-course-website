import Image from "next/image"
import Link from "next/link"
import { Star, Users, Clock, BookOpen, ChevronRight, Play, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/courses"

export function CourseDetailHero({ course }: { course: Course }) {
  const discount = Math.round(
    (1 - parseInt(course.price.replace(/,/g, "")) / parseInt(course.originalPrice.replace(/,/g, ""))) * 100
  )

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

      <div className="relative mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Left Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-primary-foreground/60">
              <Link href="/" className="transition-colors hover:text-primary-foreground">홈</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/#courses" className="transition-colors hover:text-primary-foreground">전체 클래스</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground/80">{course.category}</span>
            </nav>

            {/* Badge */}
            {course.badge && (
              <Badge className={`${course.badgeColor} mb-4 border-0 text-xs font-bold`}>
                {course.badge}
              </Badge>
            )}

            {/* Title */}
            <h1 className="mb-5 text-2xl font-bold leading-tight text-primary-foreground md:text-3xl lg:text-4xl text-balance">
              {course.title}
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
              {course.description}
            </p>

            {/* Meta info */}
            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/70">
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

          {/* Right - Video Preview Card */}
          <div className="w-full lg:w-[420px] lg:shrink-0">
            <div className="overflow-hidden rounded-2xl bg-card shadow-2xl">
              {/* Video Thumbnail */}
              <div className="relative aspect-video">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105">
                    <Play className="h-7 w-7 fill-current" />
                  </button>
                </div>
                <div className="absolute bottom-3 right-3 rounded-md bg-primary/80 px-2 py-1 text-xs font-medium text-primary-foreground">
                  미리보기
                </div>
              </div>

              {/* Price & CTA */}
              <div className="p-6">
                <div className="mb-4 flex items-end gap-3">
                  <span className="text-3xl font-bold text-foreground">
                    {"\u20A9"}{course.price}
                  </span>
                  <span className="text-base text-muted-foreground line-through">
                    {"\u20A9"}{course.originalPrice}
                  </span>
                  <Badge className="border-0 bg-red-500 text-xs font-bold text-white">
                    {discount}% OFF
                  </Badge>
                </div>

                <Button className="mb-3 h-14 w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90">
                  수강 신청하기
                </Button>
                <Button variant="outline" className="h-12 w-full text-base font-medium">
                  장바구니 담기
                </Button>

                {/* Benefits */}
                <div className="mt-5 space-y-2 border-t border-border pt-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 text-accent" />
                    <span>평생 무제한 수강</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 text-accent" />
                    <span>수료증 발급 가능</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 text-accent" />
                    <span>30일 이내 환불 보장</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
