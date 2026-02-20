import Image from "next/image"
import { Award } from "lucide-react"
import type { Course } from "@/lib/courses"

export function CourseInstructor({ course }: { course: Course }) {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-xl font-bold text-foreground lg:text-2xl">
        강사 소개
      </h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image
              src={course.instructorImage}
              alt={course.instructor}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{course.instructor}</h3>
              <Award className="h-4 w-4 text-accent" />
            </div>
            <p className="mb-3 text-sm font-medium text-accent">{course.instructorTitle}</p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {course.instructorBio}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
