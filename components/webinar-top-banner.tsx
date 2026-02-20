"use client"

import { useState } from "react"
import { X, Radio } from "lucide-react"

interface Webinar {
  title: string
  date: string
  spotsLeft: number
  href: string
}

// null이면 웨비나 없음 → 배너 숨김
const activeWebinar: Webinar | null = {
  title: "2026년 AI 수익화 트렌드 완전 분석",
  date: "3월 5일 (목) 20:00",
  spotsLeft: 23,
  href: "#webinar-register",
}

export function WebinarTopBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (!activeWebinar || dismissed) return null

  return (
    <div className="relative z-[60] bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-sm lg:px-8">
        <Radio className="h-3.5 w-3.5 shrink-0 animate-pulse" />
        <p className="text-center leading-relaxed">
          <span className="font-semibold">무료 LIVE</span>
          <span className="mx-1.5 hidden sm:inline text-primary-foreground/60">|</span>
          <span className="hidden sm:inline">{activeWebinar.title}</span>
          <span className="mx-1.5 text-primary-foreground/60">|</span>
          <span>{activeWebinar.date}</span>
          <span className="mx-1.5 text-primary-foreground/60">|</span>
          <span>
            잔여 <strong>{activeWebinar.spotsLeft}</strong>석
          </span>
          <a
            href={activeWebinar.href}
            className="ml-2 inline-flex items-center rounded-md bg-primary-foreground/15 px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-primary-foreground/25"
          >
            지금 신청
          </a>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-primary-foreground/60 transition-colors hover:text-primary-foreground lg:right-8"
          aria-label="배너 닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
