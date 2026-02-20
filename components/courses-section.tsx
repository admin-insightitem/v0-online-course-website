"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tabs = ["전체", "AI / 자동화", "유튜브", "마케팅", "디자인", "커머스", "SNS"]

const courses = [
  {
    title: "ChatGPT & AI 자동화로 월 1,000만원 수익 만들기",
    instructor: "김도현",
    image: "/images/course-ai.jpg",
    category: "AI / 자동화",
    rating: 4.9,
    reviews: 1247,
    students: 8340,
    duration: "12시간 30분",
    price: "149,000",
    originalPrice: "299,000",
    badge: "BEST",
    badgeColor: "bg-red-500 text-white",
  },
  {
    title: "유튜브 수익화 완벽 가이드: 0에서 월 500만원까지",
    instructor: "박서연",
    image: "/images/course-youtube.jpg",
    category: "유튜브",
    rating: 4.8,
    reviews: 983,
    students: 6210,
    duration: "15시간 45분",
    price: "129,000",
    originalPrice: "259,000",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
  },
  {
    title: "퍼포먼스 마케팅 마스터클래스: ROI 500% 달성 전략",
    instructor: "이준혁",
    image: "/images/course-marketing.jpg",
    category: "마케팅",
    rating: 4.9,
    reviews: 756,
    students: 4530,
    duration: "10시간 20분",
    price: "169,000",
    originalPrice: "339,000",
    badge: "HOT",
    badgeColor: "bg-orange-500 text-white",
  },
  {
    title: "프리미어 프로 & 포토샵: 1인 크리에이터 완성 패키지",
    instructor: "최예진",
    image: "/images/course-design.jpg",
    category: "디자인",
    rating: 4.7,
    reviews: 621,
    students: 3870,
    duration: "18시간 10분",
    price: "139,000",
    originalPrice: "279,000",
    badge: null,
    badgeColor: "",
  },
  {
    title: "스마트스토어 + 쿠팡: 월매출 5,000만원 실전 로드맵",
    instructor: "정민수",
    image: "/images/course-commerce.jpg",
    category: "커머스",
    rating: 4.8,
    reviews: 892,
    students: 5120,
    duration: "14시간 50분",
    price: "159,000",
    originalPrice: "319,000",
    badge: "BEST",
    badgeColor: "bg-red-500 text-white",
  },
  {
    title: "인스타그램 & 틱톡: SNS 수익화 완전 정복",
    instructor: "한수빈",
    image: "/images/course-sns.jpg",
    category: "SNS",
    rating: 4.6,
    reviews: 534,
    students: 2980,
    duration: "9시간 40분",
    price: "119,000",
    originalPrice: "239,000",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
  },
]

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
          {filtered.map((course) => (
            <article
              key={course.title}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                    {"\\"}
                    {course.price}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {"\\"}
                    {course.originalPrice}
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
          ))}
        </div>
      </div>
    </section>
  )
}
