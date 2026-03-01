"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TabItem {
  id: string
  label: string
}

const tabs: TabItem[] = [
  { id: "detail-intro", label: "클래스 소개" },
  { id: "detail-curriculum", label: "커리큘럼" },
  { id: "detail-teacher", label: "강사 소개" },
  { id: "detail-review", label: "수강 후기" },
  { id: "detail-refund", label: "환불 정책" },
]

export function CourseTabsNav() {
  const [activeTab, setActiveTab] = useState("detail-intro")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if tabs should be sticky
      const tabsElement = document.getElementById("course-tabs-container")
      if (tabsElement) {
        const rect = tabsElement.getBoundingClientRect()
        setIsSticky(rect.top <= 64)
      }

      // Find which section is currently in view
      for (const tab of tabs) {
        const section = document.getElementById(tab.id)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveTab(tab.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      const headerOffset = 120
      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div id="course-tabs-container" className="relative">
      <nav
        className={cn(
          "border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-200",
          isSticky && "fixed left-0 right-0 top-16 z-40 shadow-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="scrollbar-hide flex gap-1 overflow-x-auto py-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "relative whitespace-nowrap px-5 py-4 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
      {/* Spacer when sticky */}
      {isSticky && <div className="h-[57px]" />}
    </div>
  )
}
