"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, PlayCircle, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { CourseWithInstructor, CourseSectionWithLectures } from "@/types"

type CourseDetail = CourseWithInstructor & { sections: CourseSectionWithLectures[] }

export function CourseCurriculum({ course }: { course: CourseDetail }) {
  const [openSections, setOpenSections] = useState<number[]>([0])

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const totalLectures = course.sections.reduce((acc, s) => acc + s.lectures.length, 0)

  const getSectionDuration = (sectionIndex: number) => {
    const section = course.sections[sectionIndex]
    let totalMinutes = 0
    section.lectures.forEach(lecture => {
      if (!lecture.duration) return
      const parts = lecture.duration.split(":")
      if (parts.length === 2) {
        totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1])
      } else if (parts.length === 1) {
        totalMinutes += parseInt(parts[0])
      }
    })
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
  }

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold text-foreground lg:text-2xl">
          커리큘럼
        </h2>
        <span className="text-sm text-muted-foreground">
          {course.sections.length}개 섹션 &middot; {totalLectures}개 강의 &middot; 총 {course.total_duration || "-"}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {course.sections.map((section, sIdx) => {
          const isOpen = openSections.includes(sIdx)

          return (
            <div key={section.id} className={sIdx > 0 ? "border-t border-border" : ""}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(sIdx)}
                className="flex w-full items-center justify-between bg-secondary/30 px-5 py-4 text-left transition-colors hover:bg-secondary/50"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                  <span className="text-[15px] font-semibold text-foreground">{section.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{section.lectures.length}강 ({getSectionDuration(sIdx)})</span>
              </button>

              {/* Lectures */}
              {isOpen && (
                <ul>
                  {section.lectures.map((lecture, lIdx) => {
                    const isPreview = lecture.is_free
                    const isClickable = isPreview

                    return (
                      <li
                        key={lecture.id}
                        className={`${lIdx > 0 ? "border-t border-border/50" : ""} bg-card`}
                      >
                        {isClickable ? (
                          <Link
                            href={`/courses/${course.id}/watch/${lecture.id}`}
                            className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30"
                          >
                            <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate text-foreground">
                                {lecture.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">
                                  {lecture.duration || "-"}
                                </span>
                                <Badge variant="secondary" className="text-[10px] text-accent">
                                  미리보기
                                </Badge>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 px-5 py-3.5 opacity-60">
                            <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate text-muted-foreground">{lecture.title}</p>
                              <span className="text-xs text-muted-foreground">{lecture.duration || "-"}</span>
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
