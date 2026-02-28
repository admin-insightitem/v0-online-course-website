"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// 사이드 메뉴
const sideMenu = [
  { label: "자주묻는질문", href: "/support", id: "faq" },
  { label: "공지사항", href: "/support/notice", id: "notice" },
  { label: "개인정보보호방침", href: "/support/privacy", id: "privacy" },
  { label: "이용약관", href: "/support/terms", id: "terms" },
  { label: "환불규정", href: "/support/refund", id: "refund" },
]

// 공지사항 데이터
const noticeData = [
  {
    id: 1,
    category: "기타",
    title: "기타",
    date: "2026.01.28",
  },
  {
    id: 2,
    category: "뉴스",
    title: "뉴스 01",
    date: "2026.01.28",
  },
  {
    id: 3,
    category: "뉴스",
    title: "부자 클래스 신규 강좌 오픈 안내",
    date: "2026.01.25",
  },
  {
    id: 4,
    category: "기타",
    title: "2026년 설 연휴 고객센터 운영 안내",
    date: "2026.01.20",
  },
  {
    id: 5,
    category: "뉴스",
    title: "부자 클래스 앱 업데이트 안내",
    date: "2026.01.15",
  },
]

const categories = [
  { id: "all", label: "전체" },
  { id: "기타", label: "기타" },
  { id: "뉴스", label: "뉴스" },
]

export default function NoticePage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredNotices = activeCategory === "all" 
    ? noticeData 
    : noticeData.filter((notice) => notice.category === activeCategory)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[180px] w-full overflow-hidden bg-gradient-to-r from-primary/90 to-primary">
        <div className="absolute inset-0 bg-[url('/images/support-banner.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-primary-foreground">{"고객센터"}</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-8">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden w-[200px] shrink-0 lg:block">
            <nav className="flex flex-col gap-1">
              {sideMenu.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-2 py-2.5 text-sm transition-colors ${
                    item.id === "notice"
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.id === "notice" && <span className="mr-1">{"📢"}</span>}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Notice Table */}
            <div className="border-t border-border">
              {/* Table Header */}
              <div className="flex items-center border-b border-border bg-muted/30 py-3">
                <div className="flex-1 px-4 text-sm font-medium text-muted-foreground">{"제목"}</div>
                <div className="w-[120px] px-4 text-right text-sm font-medium text-muted-foreground">{"날짜"}</div>
              </div>

              {/* Table Body */}
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center border-b border-border py-4 hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <div className="flex-1 px-4 text-[15px] text-foreground">
                    {notice.title}
                  </div>
                  <div className="w-[120px] px-4 text-right text-sm text-muted-foreground">
                    {notice.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Sidebar */}
            <div className="mt-10 lg:hidden">
              <h3 className="mb-4 font-semibold text-foreground">{"바로가기"}</h3>
              <div className="flex flex-wrap gap-2">
                {sideMenu.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      item.id === "notice"
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
