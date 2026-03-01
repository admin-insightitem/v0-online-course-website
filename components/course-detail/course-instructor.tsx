import Image from "next/image"
import { Award, Star, Users, BookOpen, MessageCircle } from "lucide-react"
import type { Course } from "@/lib/courses"

export function CourseInstructor({ course }: { course: Course }) {
  return (
    <section id="detail-teacher" className="scroll-mt-32 py-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Award className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground lg:text-2xl">
          강사 소개
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 lg:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-card shadow-lg">
              <Image
                src={course.instructorImage}
                alt={course.instructor}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground lg:text-2xl">{course.instructor}</h3>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                  <Award className="h-3.5 w-3.5 text-accent-foreground" />
                </div>
              </div>
              <p className="mb-4 text-base font-medium text-accent">{course.instructorTitle}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span>평점 {course.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>수강생 {course.students.toLocaleString()}명</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>강의 {course.lectures}개</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>후기 {course.reviews.toLocaleString()}개</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="p-6 lg:p-8">
          <h4 className="mb-3 text-base font-bold text-foreground">강사 소개</h4>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {course.instructorBio}
          </p>
        </div>
      </div>
    </section>
  )
}
