"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Copy, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MypageLayout } from "@/components/mypage-layout"
import { courses } from "@/lib/courses"

const inProgressCourses = [
  {
    ...courses[0],
    scheduledDate: "3월 5일 (수) PM 7시30분",
    headlineTop: "ChatGPT 실전 활용",
    headlineBottom: "AI로 돈벌기",
    dDay: 9,
    hasPassword: false,
  },
  {
    ...courses[1],
    scheduledDate: "2월 28일 (금) PM 8시",
    headlineTop: "유튜브 알고리즘",
    headlineBottom: "수익화 전략",
    dDay: 5,
    hasPassword: false,
  },
]

const completedCourses = [
  {
    ...courses[2],
    scheduledDate: "1월 20일 (월) PM 7시",
    headlineTop: "퍼포먼스 마케팅",
    headlineBottom: "ROI 극대화",
    dDay: 0,
    hasPassword: false,
  },
  {
    ...courses[4],
    scheduledDate: "12월 15일 (일) PM 2시",
    headlineTop: "스마트스토어",
    headlineBottom: "매출 5천만원",
    dDay: 0,
    hasPassword: false,
  },
]

type TabType = "in-progress" | "completed" | "all"

interface MyCourse {
  id: string
  title: string
  instructor: string
  image: string
  category: string
  scheduledDate: string
  headlineTop: string
  headlineBottom: string
  dDay: number
  hasPassword: boolean
}

function CourseCard({ course, status }: { course: MyCourse; status: "in-progress" | "completed" }) {
  const isCompleted = status === "completed"

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <Link href={`/courses/${course.id}`} className="group relative block aspect-[16/10] w-full overflow-hidden">
        <Image src={course.image} alt={course.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <span className="absolute right-3 top-3 rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
          {isCompleted ? "종료" : "수강중"}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs text-white/70">{course.scheduledDate}</p>
          <p className="mt-1 text-lg font-extrabold leading-tight text-white">{course.headlineTop}</p>
          <p className="text-lg font-extrabold leading-tight text-white">{course.headlineBottom}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium text-white">{course.instructor}</span>
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-3 p-4">
        <Link href={`/courses/${course.id}`} className="hover:underline">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{course.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{course.instructor} | {course.category}</p>
        <div className="flex items-center gap-4 text-xs">
          {!isCompleted ? (
            <>
              <span className="text-muted-foreground">{"강의날까지 "}<strong className="text-foreground">D-{course.dDay}</strong></span>
              <span className="text-muted-foreground">{"비밀번호 "}<strong className="text-foreground">{course.hasPassword ? "있음" : "없음"}</strong></span>
            </>
          ) : (
            <span className="text-muted-foreground">강의 종료</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
            <Copy className="h-3.5 w-3.5" />
            비밀번호 복사
          </Button>
          <Button size="sm" className="flex-1 gap-1.5 bg-accent text-accent-foreground text-xs hover:bg-accent/90">
            <MessageCircle className="h-3.5 w-3.5" />
            채팅방 입장
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<TabType>("in-progress")

  const tabs: { key: TabType; label: string }[] = [
    { key: "in-progress", label: "수강중인 강의" },
    { key: "completed", label: "완료한 강의" },
    { key: "all", label: "전체" },
  ]

  const displayCourses =
    activeTab === "in-progress"
      ? inProgressCourses.map((c) => ({ course: c as MyCourse, status: "in-progress" as const }))
      : activeTab === "completed"
        ? completedCourses.map((c) => ({ course: c as MyCourse, status: "completed" as const }))
        : [
            ...inProgressCourses.map((c) => ({ course: c as MyCourse, status: "in-progress" as const })),
            ...completedCourses.map((c) => ({ course: c as MyCourse, status: "completed" as const })),
          ]

  return (
    <MypageLayout activeMenu="내 강의실">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex-1 pb-3 text-center text-sm font-medium transition-colors sm:flex-none sm:px-8 ${
              activeTab === tab.key ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="mt-6">
        {displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {displayCourses.map(({ course, status }) => (
              <CourseCard key={course.id} course={course} status={status} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[240px] items-center justify-center rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">강의가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:bg-muted">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded border border-foreground bg-card text-sm font-semibold text-foreground">1</button>
        <button className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:bg-muted">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </MypageLayout>
  )
}
