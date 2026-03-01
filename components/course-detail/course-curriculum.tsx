"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, PlayCircle, Lock, CheckCircle, BookOpen, Clock } from "lucide-react"
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
    <section id="detail-curriculum" className="scroll-mt-32 py-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground lg:text-2xl">
            커리큘럼
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {course.curriculum.length}개 섹션 · {totalLessons}개 강의 · 총 {course.duration}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{totalLessons}개 강의</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{course.duration}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
          <PlayCircle className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-accent">미리보기 가능</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        {course.curriculum.map((section, sIdx) => {
          const isOpen = openSections.includes(sIdx)
          const sectionLectureNum = getSectionLectureNum(sIdx)
          
          return (
            <div key={section.title} className={sIdx > 0 ? "border-t border-border" : ""}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(sIdx)}
                className="flex w-full items-center justify-between bg-gradient-to-r from-secondary/50 to-secondary/30 px-6 py-5 text-left transition-colors hover:from-secondary/70 hover:to-secondary/50"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                  </div>
                  <div>
                    <span className="text-base font-semibold text-foreground">{section.title}</span>
                    <p className="mt-0.5 text-xs text-muted-foreground">{section.lessons.length}개 강의 · {getSectionDuration(sIdx)}</p>
                  </div>
                </div>
              </button>

              {/* Lessons */}
              {isOpen && (
                <ul className="divide-y divide-border/50">
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
                      <li key={lesson.title} className="bg-card">
                        {isClickable ? (
                          <Link
                            href={`/courses/${course.id}/watch/${lectureId}`}
                            className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/30"
                          >
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isCompleted ? "bg-green-100 text-green-600" : "bg-accent/10 text-accent"}`}>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <PlayCircle className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${isCompleted ? "text-muted-foreground" : "text-foreground"}`}>
                                  {lesson.title}
                                </p>
                                {isPreview && !isCompleted && (
                                  <Badge className="border-0 bg-accent/10 text-[10px] font-semibold text-accent">
                                    미리보기
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                {isCompleted && (
                                  <span className="text-xs font-medium text-green-600">수강완료</span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-4 px-6 py-4 opacity-50">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                              <Lock className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-muted-foreground">{lesson.title}</p>
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
