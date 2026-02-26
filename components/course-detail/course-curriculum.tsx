"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, PlayCircle, Lock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/courses"

export function CourseCurriculum({ course }: { course: Course }) {
  const [openSections, setOpenSections] = useState<number[]>([0])

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const totalLessons = course.curriculum.reduce((acc, s) => acc + s.lessons.length, 0)

  // Calculate section duration
  const getSectionDuration = (sectionIndex: number) => {
    const section = course.curriculum[sectionIndex]
    let totalMinutes = 0
    section.lessons.forEach(lesson => {
      const parts = lesson.duration.split(":")
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

  // Calculate cumulative lesson count for lecture IDs
  const getSectionLectureNum = (sectionIndex: number) => {
    let count = 0
    for (let i = 0; i < sectionIndex; i++) {
      count += course.curriculum[i].lessons.length
    }
    return count
  }

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold text-foreground lg:text-2xl">
          커리큘럼
        </h2>
        <span className="text-sm text-muted-foreground">
          {course.curriculum.length}개 섹션 &middot; {totalLessons}개 강의 &middot; 총 {course.duration}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {course.curriculum.map((section, sIdx) => {
          const isOpen = openSections.includes(sIdx)
          const sectionLectureNum = getSectionLectureNum(sIdx)
          
          return (
            <div key={section.title} className={sIdx > 0 ? "border-t border-border" : ""}>
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
                <span className="text-xs text-muted-foreground">{section.lessons.length}강 ({getSectionDuration(sIdx)})</span>
              </button>

              {/* Lessons */}
              {isOpen && (
                <ul>
                  {section.lessons.map((lesson, lIdx) => {
                    const lectureId = `lecture-${sectionLectureNum + lIdx + 1}`
                    
                    // Demo: Section 1 shows 4 different states
                    // 1st lesson: preview, 2nd: watched, 3rd: not watched, 4th: locked
                    let isPreview = lesson.isFree
                    let isCompleted = false
                    let isNotWatched = false
                    let isLocked = !lesson.isFree
                    
                    if (sIdx === 0) {
                      isPreview = lIdx === 0
                      isCompleted = lIdx === 1
                      isNotWatched = lIdx === 2
                      isLocked = lIdx === 3
                    }

                    // Determine if clickable
                    const isClickable = isPreview || isCompleted || isNotWatched

                    return (
                      <li
                        key={lesson.title}
                        className={`${lIdx > 0 ? "border-t border-border/50" : ""} bg-card`}
                      >
                        {isClickable ? (
                          <Link
                            href={`/courses/${course.id}/watch/${lectureId}`}
                            className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30"
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                            ) : (
                              <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isCompleted ? "text-muted-foreground" : "text-foreground"}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">
                                  {lesson.duration}
                                </span>
                                {isCompleted && (
                                  <span className="text-xs text-green-500">수강완료</span>
                                )}
                                {isPreview && !isCompleted && (
                                  <Badge variant="secondary" className="text-[10px] text-accent">
                                    미리보기
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 px-5 py-3.5 opacity-60">
                            <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate text-muted-foreground">{lesson.title}</p>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
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
