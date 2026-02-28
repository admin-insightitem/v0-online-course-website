"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { faqData, faqCategories, topFaqIds } from "@/lib/faq-data"

// 사이드 메뉴
const sideMenu = [
  { label: "자주묻는질문", href: "/support", active: true },
  { label: "공지사항", href: "/support/notice" },
  { label: "개인정보보호방침", href: "/support/privacy" },
  { label: "이용약관", href: "/support/terms" },
  { label: "환불규정", href: "/support/refund" },
]

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"all" | "top5">("all")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // FAQ 필터링
  const filteredFaq = activeTab === "top5" 
    ? faqData.filter((faq) => topFaqIds.includes(faq.id))
    : faqData

  const handleFaqToggle = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

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
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">{"📋"}</span>
              <h2 className="text-lg font-bold text-foreground">{"자주묻는질문"}</h2>
            </div>
            <nav className="flex flex-col gap-1">
              {sideMenu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-2 py-2.5 text-sm transition-colors ${
                    item.active
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {"전체"}
              </button>
              <button
                onClick={() => setActiveTab("top5")}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                  activeTab === "top5"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {"top 5"}
              </button>
            </div>

            {/* FAQ List */}
            <div className="border-t border-border">
              {filteredFaq.map((faq) => (
                <div
                  key={faq.id}
                  className="border-b border-border"
                >
                  <button
                    onClick={() => handleFaqToggle(faq.id)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-[15px] font-medium text-foreground">
                      {faq.question}
                    </span>
                    {expandedFaq === faq.id ? (
                      <Minus className="h-5 w-5 shrink-0 text-accent" />
                    ) : (
                      <Plus className="h-5 w-5 shrink-0 text-accent" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="pb-5">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Sidebar */}
            <div className="mt-10 lg:hidden">
              <h3 className="mb-4 font-semibold text-foreground">{"바로가기"}</h3>
              <div className="flex flex-wrap gap-2">
                {sideMenu.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      item.active
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
