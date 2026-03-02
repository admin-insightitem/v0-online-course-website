"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { CourseWithInstructor, Category } from "@/types"

interface CoursesSectionProps {
  courses: CourseWithInstructor[]
  categories: Pick<Category, "id" | "name" | "slug">[]
}

function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR")
}

export function CoursesSection({ courses, categories }: CoursesSectionProps) {
  const [activeTab, setActiveTab] = useState("전체")

  const tabs = ["전체", ...categories.map((c) => c.name)]

  const filtered =
    activeTab === "전체"
      ? courses
      : courses.filter((c) => c.category.name === activeTab)

  return (
    <section id="courses" className="bg-secondary/30 pt-8 pb-20 lg:pt-12 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
              인기 프리미엄 클래스
            </h2>
            <p className="mt-3 text-muted-foreground">
              검증된 전문가들의 실전 노하우를 담은 프리미엄 강의
            </p>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, index) => {
            const discountPercent =
              course.original_price && course.original_price > course.price
                ? Math.round((1 - course.price / course.original_price) * 100)
                : 0

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <article>
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={course.image_url || "/images/course-placeholder.jpg"}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={index === 0}
                    />
                    {course.badge && (
                      <Badge className={`absolute top-3 left-3 ${course.badge_color || "bg-red-500 text-white"} border-0 text-xs font-bold`}>
                        {course.badge}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="p-5">
                    <p className="mb-1 text-xs font-medium text-primary">{course.category.name}</p>
                    <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-foreground">
                      {course.title}
                    </h3>

                    <p className="mb-3 text-sm text-muted-foreground">
                      {course.instructor.nickname || course.instructor.name}
                    </p>

                    <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="font-semibold text-foreground">
                          {Number(course.rating_avg).toFixed(1)}
                        </span>
                        ({course.rating_count.toLocaleString()})
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.student_count.toLocaleString()}명
                      </span>
                      {course.total_duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {course.total_duration}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 border-t border-border/50 pt-4">
                      <span className="text-lg font-bold text-foreground">
                        {"\u20A9"}{formatPrice(course.price)}
                      </span>
                      {course.original_price && course.original_price > course.price && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {"\u20A9"}{formatPrice(course.original_price)}
                          </span>
                          <span className="ml-auto text-xs font-semibold text-red-400">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
