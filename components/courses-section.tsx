"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const tabs = ["전체", "AI / 자동화", "유튜브", "마케팅", "디자인", "커머스", "SNS"]

const courses = [
  {
    title: "ChatGPT & AI 자동화로 월 1,000만원 수익 만들기",
    instructor: "김도현",
    credential: "전 네이버 AI 연구원",
    image: "/images/course-ai.jpg",
    category: "AI / 자동화",
    rating: 4.9,
    reviews: 1247,
    students: 8340,
    duration: "12시간 30분",
    price: "149,000",
    originalPrice: "299,000",
    badge: "BEST",
  },
  {
    title: "유튜브 수익화 완벽 가이드: 0에서 월 500만원까지",
    instructor: "박서연",
    credential: "구독자 120만 크리에이터",
    image: "/images/course-youtube.jpg",
    category: "유튜브",
    rating: 4.8,
    reviews: 983,
    students: 6210,
    duration: "15시간 45분",
    price: "129,000",
    originalPrice: "259,000",
    badge: "NEW",
  },
  {
    title: "퍼포먼스 마케팅 마스터클래스: ROI 500% 달성 전략",
    instructor: "이준혁",
    credential: "전 카카오 마케팅 리드",
    image: "/images/course-marketing.jpg",
    category: "마케팅",
    rating: 4.9,
    reviews: 756,
    students: 4530,
    duration: "10시간 20분",
    price: "169,000",
    originalPrice: "339,000",
    badge: "HOT",
  },
  {
    title: "프리미어 프로 & 포토샵: 1인 크리에이터 완성 패키지",
    instructor: "최예진",
    credential: "10년차 디자인 디렉터",
    image: "/images/course-design.jpg",
    category: "디자인",
    rating: 4.7,
    reviews: 621,
    students: 3870,
    duration: "18시간 10분",
    price: "139,000",
    originalPrice: "279,000",
    badge: null,
  },
  {
    title: "스마트스토어 + 쿠팡: 월매출 5,000만원 실전 로드맵",
    instructor: "정민수",
    credential: "연매출 10억 셀러",
    image: "/images/course-commerce.jpg",
    category: "커머스",
    rating: 4.8,
    reviews: 892,
    students: 5120,
    duration: "14시간 50분",
    price: "159,000",
    originalPrice: "319,000",
    badge: "BEST",
  },
  {
    title: "인스타그램 & 틱톡: SNS 수익화 완전 정복",
    instructor: "한수빈",
    credential: "팔로워 80만 인플루언서",
    image: "/images/course-sns.jpg",
    category: "SNS",
    rating: 4.6,
    reviews: 534,
    students: 2980,
    duration: "9시간 40분",
    price: "119,000",
    originalPrice: "239,000",
    badge: "NEW",
  },
]

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState("전체")

  const filtered =
    activeTab === "전체"
      ? courses
      : courses.filter((c) => c.category === activeTab)

  return (
    <section id="courses" className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.15em] text-accent">
              PREMIUM COURSES
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              전문가가 검증한 프리미엄 강의
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              실전 경험과 노하우를 갖춘 전문가들의 체계적인 커리큘럼
            </p>
          </div>
          <Button variant="outline" className="border-border text-base text-foreground hover:bg-card">
            전체 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 rounded-sm px-5 py-2.5 text-[15px] font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
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
              className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {course.badge && (
                  <span className={`absolute top-3 left-3 rounded-sm px-2.5 py-1 text-xs font-bold ${
                    course.badge === "BEST" ? "bg-foreground text-background" :
                    course.badge === "NEW" ? "bg-accent text-accent-foreground" :
                    "bg-foreground text-background"
                  }`}>
                    {course.badge}
                  </span>
                )}
              </div>

              <div className="p-6">
                <p className="mb-1 text-sm font-semibold text-accent">{course.category}</p>
                <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-foreground">
                  {course.title}
                </h3>

                <div className="mb-4">
                  <p className="text-[15px] font-medium text-foreground">{course.instructor}</p>
                  <p className="text-sm text-muted-foreground">{course.credential}</p>
                </div>

                <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">{course.rating}</span>
                    ({course.reviews.toLocaleString()})
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students.toLocaleString()}명
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3 border-t border-border pt-5">
                  <span className="text-xl font-bold text-foreground">
                    {"\u20A9"}{course.price}
                  </span>
                  <span className="text-base text-muted-foreground line-through">
                    {"\u20A9"}{course.originalPrice}
                  </span>
                  <span className="ml-auto rounded-sm bg-accent/10 px-2 py-0.5 text-sm font-bold text-accent">
                    {Math.round(
                      (1 - parseInt(course.price.replace(/,/g, "")) / parseInt(course.originalPrice.replace(/,/g, ""))) * 100
                    )}% OFF
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
