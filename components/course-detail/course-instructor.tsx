import Image from "next/image"
import { Award } from "lucide-react"
import type { CourseWithInstructor, CourseSectionWithLectures } from "@/types"

type CourseDetail = CourseWithInstructor & { sections: CourseSectionWithLectures[] }

export function CourseInstructor({ course }: { course: CourseDetail }) {
  const instructor = course.instructor
  if (!instructor) return null

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-xl font-bold text-foreground lg:text-2xl">
        강사 소개
      </h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image
              src={instructor.avatar_url || "/images/default-avatar.jpg"}
              alt={instructor.nickname || instructor.name || "강사"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{instructor.nickname || instructor.name}</h3>
              <Award className="h-4 w-4 text-accent" />
            </div>
            <p className="mb-3 text-sm font-medium text-accent">{instructor.instructor_title}</p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {instructor.instructor_bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
