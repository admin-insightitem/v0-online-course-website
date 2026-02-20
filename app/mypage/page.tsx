"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BookOpen,
  Bell,
  PlayCircle,
  BookMarked,
  MonitorPlay,
  Ticket,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { courses } from "@/lib/courses"

const sideMenu = [
  { icon: BookOpen, label: "내 강의실", href: "/mypage", active: true },
  { icon: Bell, label: "오픈알림", href: "/mypage" },
  { icon: PlayCircle, label: "무료강의", href: "/mypage" },
  { icon: BookMarked, label: "전자책", href: "/mypage" },
  { icon: MonitorPlay, label: "VOD 강의", href: "/mypage" },
  { icon: Ticket, label: "쿠폰목록", href: "/mypage" },
  { icon: Heart, label: "위시리스트", href: "/mypage" },
  { icon: CreditCard, label: "주문결제내역", href: "/mypage" },
  { icon: Settings, label: "회원정보관리", href: "/mypage" },
  { icon: LogOut, label: "로그아웃", href: "/" },
]

const inProgressCourses = [
  {
    ...courses[0],
    progress: 45,
    lastAccessed: "2026.02.18",
    currentLesson: "고급 프롬프트 테크닉 10가지",
  },
  {
    ...courses[1],
    progress: 22,
    lastAccessed: "2026.02.15",
    currentLesson: "유튜브 알고리즘 작동 원리",
  },
]

const completedCourses = [
  {
    ...courses[2],
    progress: 100,
    completedDate: "2026.01.30",
    certificate: true,
  },
  {
    ...courses[4],
    progress: 100,
    completedDate: "2025.12.15",
    certificate: true,
  },
]

type TabType = "in-progress" | "completed" | "all"

function CourseCard({
  course,
  status,
}: {
  course: (typeof inProgressCourses)[0] | (typeof completedCourses)[0]
  status: "in-progress" | "completed"
}) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex gap-4 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md sm:gap-5"
    >
      <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-md sm:h-28 sm:w-44">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
        />
        {status === "completed" && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/70">
            <CheckCircle className="h-8 w-8 text-primary-foreground" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <span className="text-xs font-medium text-accent">{course.category}</span>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
            {course.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{course.instructor}</p>
        </div>
        <div className="mt-2">
          {status === "in-progress" ? (
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {"currentLesson" in course && course.currentLesson}
                </span>
                <span className="font-medium text-foreground">
                  {course.progress}%
                </span>
              </div>
              <Progress value={course.progress} className="mt-1.5 h-1.5" />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {"lastAccessed" in course && `최근 수강: ${course.lastAccessed}`}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {"completedDate" in course && (
                <span className="text-xs text-muted-foreground">
                  완료일: {course.completedDate}
                </span>
              )}
              {"certificate" in course && course.certificate && (
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  수료증 발급
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<TabType>("in-progress")

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "in-progress", label: "수강중인 강의", count: inProgressCourses.length },
    { key: "completed", label: "완료한 강의", count: completedCourses.length },
    { key: "all", label: "전체", count: inProgressCourses.length + completedCourses.length },
  ]

  const displayCourses =
    activeTab === "in-progress"
      ? inProgressCourses.map((c) => ({ course: c, status: "in-progress" as const }))
      : activeTab === "completed"
        ? completedCourses.map((c) => ({ course: c, status: "completed" as const }))
        : [
            ...inProgressCourses.map((c) => ({ course: c, status: "in-progress" as const })),
            ...completedCourses.map((c) => ({ course: c, status: "completed" as const })),
          ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="logged-in" />

      {/* Banner */}
      <section className="bg-primary px-4 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-primary-foreground lg:text-3xl">
            마이페이지
          </h1>
        </div>
      </section>

      {/* Profile */}
      <section className="border-b border-border bg-card px-4 py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border lg:h-20 lg:w-20">
            <Image
              src="/images/avatar-user.jpg"
              alt="프로필 사진"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground lg:text-xl">김경민</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                수강중인 강의{" "}
                <strong className="text-foreground">{inProgressCourses.length}</strong>
              </span>
              <span>
                완료한 강의{" "}
                <strong className="text-foreground">{completedCourses.length}</strong>
              </span>
              <span>
                쿠폰 <strong className="text-foreground">3</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 px-4 py-8 lg:py-10">
        <div className="mx-auto flex max-w-7xl gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden w-48 shrink-0 lg:block">
            <nav className="flex flex-col gap-0.5">
              {sideMenu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
              <BookOpen className="h-5 w-5 text-accent" />
              내 강의실
            </div>

            {/* Tabs */}
            <div className="mt-5 flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 pb-3 text-sm font-medium transition-colors sm:px-6 ${
                    activeTab === tab.key
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1 text-xs">({tab.count})</span>
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </button>
              ))}
            </div>

            {/* Course List */}
            <div className="mt-6 flex flex-col gap-4">
              {displayCourses.length > 0 ? (
                displayCourses.map(({ course, status }) => (
                  <CourseCard key={course.id} course={course} status={status} />
                ))
              ) : (
                <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">강의가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
