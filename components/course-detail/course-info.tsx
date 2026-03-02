import { CheckCircle, Target, AlertCircle } from "lucide-react"
import type { CourseWithInstructor, CourseSectionWithLectures } from "@/types"

type CourseDetail = CourseWithInstructor & { sections: CourseSectionWithLectures[] }

export function CourseInfo({ course }: { course: CourseDetail }) {
  return (
    <div className="space-y-10">
      {/* Highlights */}
      {course.highlights.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-bold text-foreground lg:text-2xl">
            이 강의에서 배우는 것
          </h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <ul className="grid gap-3 md:grid-cols-2">
              {course.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-[15px] leading-relaxed text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Target Audience */}
      {course.target_audience.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-bold text-foreground lg:text-2xl">
            이런 분께 추천합니다
          </h2>
          <ul className="space-y-3">
            {course.target_audience.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-[15px] leading-relaxed text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Requirements */}
      {course.requirements.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-bold text-foreground lg:text-2xl">
            수강 전 준비사항
          </h2>
          <ul className="space-y-3">
            {course.requirements.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-[15px] leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
