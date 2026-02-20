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
  Copy,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
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
      {/* Thumbnail with overlay */}
      <Link href={`/courses/${course.id}`} className="group relative block aspect-[16/10] w-full overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Dark overlay with text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        {/* Badge */}
        <span className="absolute right-3 top-3 rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
          {isCompleted ? "종료" : "수강중"}
        </span>

        {/* Overlay text */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs text-white/70">{course.scheduledDate}</p>
          <p className="mt-1 text-lg font-extrabold leading-tight text-white">{course.headlineTop}</p>
          <p className="text-lg font-extrabold leading-tight text-white">{course.headlineBottom}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {course.instructor}
            </span>
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title */}
        <Link href={`/courses/${course.id}`} className="hover:underline">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{course.title}</h3>
        </Link>

        {/* Instructor / Category */}
        <p className="text-xs text-muted-foreground">
          {course.instructor} | {course.category}
        </p>

        {/* D-day & Password */}
        <div className="flex items-center gap-4 text-xs">
          {!isCompleted ? (
            <>
              <span className="text-muted-foreground">
                {"강의날까지 "}
                <strong className="text-foreground">D-{course.dDay}</strong>
              </span>
              <span className="text-muted-foreground">
                {"비밀번호 "}
                <strong className="text-foreground">{course.hasPassword ? "있음" : "없음"}</strong>
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">강의 종료</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs"
          >
            <Copy className="h-3.5 w-3.5" />
            비밀번호 복사
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 bg-accent text-accent-foreground text-xs hover:bg-accent/90"
          >
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

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "in-progress", label: "수강중인 강의", count: inProgressCourses.length },
    { key: "completed", label: "완료한 강의", count: completedCourses.length },
    { key: "all", label: "전체", count: inProgressCourses.length + completedCourses.length },
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
          <aside className="hidden w-44 shrink-0 lg:block">
            <nav className="flex flex-col">
              {sideMenu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2.5 border-l-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? "border-accent bg-transparent text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.active && <item.icon className="h-4 w-4 text-accent" />}
                  {!item.active && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 pb-3 text-center text-sm font-medium transition-colors sm:flex-none sm:px-8 ${
                    activeTab === tab.key
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
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
              <button className="flex h-8 w-8 items-center justify-center rounded border border-foreground bg-card text-sm font-semibold text-foreground">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
