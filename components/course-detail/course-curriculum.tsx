"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, PlayCircle, Lock, Clock } from "lucide-react"
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

  // Generate lecture ID from section and lesson index
  const getLectureId = (sectionIndex: number, lessonIndex: number) => {
    return `section-${sectionIndex + 1}-lecture-${lessonIndex + 1}`
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
          return (
            <div key={section.title} className={sIdx > 0 ? "border-t border-border" : ""}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(sIdx)}
                className="flex w-full items-center justify-between bg-secondary/50 px-5 py-4 text-left transition-colors hover:bg-secondary"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                  <span className="text-[15px] font-semibold text-foreground">{section.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{section.lessons.length}개 강의</span>
              </button>

              {/* Lessons */}
              {isOpen && (
                <ul>
                  {section.lessons.map((lesson, lIdx) => {
                    const lectureId = getLectureId(sIdx, lIdx)
                    const lessonContent = (
                      <>
                        <div className="flex items-center gap-3">
                          {lesson.isFree ? (
                            <PlayCircle className="h-4 w-4 shrink-0 text-accent" />
                          ) : (
                            <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                          )}
                          <span className="text-sm text-foreground">{lesson.title}</span>
                          {lesson.isFree && (
                            <Badge variant="secondary" className="text-[10px] font-semibold text-accent">
                              미리보기
                            </Badge>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </span>
                      </>
                    )

                    return (
                      <li
                        key={lesson.title}
                        className={`${lIdx > 0 ? "border-t border-border/50" : ""} bg-card`}
                      >
                        {lesson.isFree ? (
                          <Link
                            href={`/courses/${course.id}/watch/${lectureId}`}
                            className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-secondary/30"
                          >
                            {lessonContent}
                          </Link>
                        ) : (
                          <div className="flex items-center justify-between px-5 py-3.5">
                            {lessonContent}
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
