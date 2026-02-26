"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MypageLayout } from "@/components/mypage-layout"
import { courses } from "@/lib/courses"

const inProgressCourses = [
  {
    ...courses[0],
    scheduledDate: "3월 5일 (수) PM 7시30분",
    headlineTop: "ChatGPT 실전 활용",
    headlineBottom: "AI로 돈벌기",
    progress: 35,
    lastWatchedLecture: "3강. 프롬프트 엔지니어링 기초",
    lastWatchedLectureId: "lecture-3",
  },
  {
    ...courses[1],
    scheduledDate: "2월 28일 (금) PM 8시",
    headlineTop: "유튜브 알고리즘",
    headlineBottom: "수익화 전략",
    progress: 68,
    lastWatchedLecture: "7강. 알고리즘 최적화 전략",
    lastWatchedLectureId: "lecture-7",
  },
]

const completedCourses = [
  {
    ...courses[2],
    scheduledDate: "1월 20일 (월) PM 7시",
    headlineTop: "퍼포먼스 마케팅",
    headlineBottom: "ROI 극대화",
    progress: 100,
    lastWatchedLecture: "12강. 마무리 및 Q&A",
    lastWatchedLectureId: "lecture-12",
  },
  {
    ...courses[4],
    scheduledDate: "12월 15일 (일) PM 2시",
    headlineTop: "스마트스토어",
    headlineBottom: "매출 5천만원",
    progress: 100,
    lastWatchedLecture: "10강. 성공 사례 분석",
    lastWatchedLectureId: "lecture-10",
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
  progress: number
  lastWatchedLecture: string
  lastWatchedLectureId: string
}

function CourseCard({ course, status }: { course: MyCourse; status: "in-progress" | "completed" }) {
  const isCompleted = status === "completed"

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <Link href={`/courses/${course.id}`} className="group relative block aspect-[16/10] w-full overflow-hidden">
        <Image src={course.image} alt={course.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <span className="absolute right-3 top-3 rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
          {isCompleted ? "완료" : "수강중"}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs text-white/70">{course.scheduledDate}</p>
          <p className="mt-1 text-lg font-extrabold leading-tight text-white">{course.headlineTop}</p>
          <p className="text-lg font-extrabold leading-tight text-white">{course.headlineBottom}</p>
        </div>
      </Link>
      <div className="flex flex-col gap-3 p-4">
        <Link href={`/courses/${course.id}`} className="hover:underline">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{course.title}</h3>
        </Link>
        
        {/* Progress Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">학습 진도율</span>
            <span className="font-semibold text-foreground">{course.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Continue Watching Button */}
        <Button 
          asChild 
          size="sm" 
          className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href={`/courses/${course.id}/watch/${course.lastWatchedLectureId}`}>
            <Play className="h-4 w-4" />
            마지막으로 시청한 강의 바로 가기
          </Link>
        </Button>
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
