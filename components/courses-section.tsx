"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { courses } from "@/lib/courses"

const tabs = ["전체", "AI / 자동화", "유튜브", "마케팅", "디자인", "커머스", "SNS"]

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState("전체")

  const filtered =
    activeTab === "전체"
      ? courses
      : courses.filter((c) => c.category === activeTab)

  return (
    <section id="courses" className="bg-secondary/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold text-primary">COURSES</span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
              인기 프리미엄 클래스
            </h2>
            <p className="mt-3 text-muted-foreground">
              검증된 전문가들의 실전 노하우를 담은 프리미엄 강의
            </p>
          </div>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            전체 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
          {filtered.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <article>
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index === 0}
                  />
                  {course.badge && (
                    <Badge className={`absolute top-3 left-3 ${course.badgeColor} border-0 text-xs font-bold`}>
                      {course.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="p-5">
                  <p className="mb-1 text-xs font-medium text-primary">{course.category}</p>
                  <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-foreground">
                    {course.title}
                  </h3>

                  <p className="mb-3 text-sm text-muted-foreground">{course.instructor}</p>

                  <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="font-semibold text-foreground">{course.rating}</span>
                      ({course.reviews.toLocaleString()})
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.students.toLocaleString()}명
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 border-t border-border/50 pt-4">
                    <span className="text-lg font-bold text-foreground">
                      {"\u20A9"}{course.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {"\u20A9"}{course.originalPrice}
                    </span>
                    <span className="ml-auto text-xs font-semibold text-red-400">
                      {Math.round(
                        (1 - parseInt(course.price.replace(/,/g, "")) / parseInt(course.originalPrice.replace(/,/g, ""))) * 100
                      )}
                      % OFF
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
