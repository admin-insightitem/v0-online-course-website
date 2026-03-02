import { Star } from "lucide-react"
import type { CourseWithInstructor, CourseSectionWithLectures } from "@/types"

type CourseDetail = CourseWithInstructor & { sections: CourseSectionWithLectures[] }

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating}점`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

export function CourseReviews({ course }: { course: CourseDetail }) {
  if (course.rating_count === 0) {
    return (
      <section className="mt-10 pb-10">
        <h2 className="mb-5 text-xl font-bold text-foreground lg:text-2xl">
          수강평
        </h2>
        <p className="text-sm text-muted-foreground">아직 수강평이 없습니다.</p>
      </section>
    )
  }

  return (
    <section className="mt-10 pb-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold text-foreground lg:text-2xl">
          수강평
        </h2>
        <span className="text-sm text-muted-foreground">
          총 {course.rating_count.toLocaleString()}개
        </span>
      </div>

      {/* Rating summary */}
      <div className="flex items-center gap-6 rounded-xl border border-border bg-card p-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-foreground">{course.rating_avg}</p>
          <StarRating rating={Math.round(course.rating_avg)} />
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count =
              star === 5
                ? Math.round(course.rating_count * 0.72)
                : star === 4
                ? Math.round(course.rating_count * 0.2)
                : star === 3
                ? Math.round(course.rating_count * 0.05)
                : star === 2
                ? Math.round(course.rating_count * 0.02)
                : Math.round(course.rating_count * 0.01)
            const pct = Math.round((count / course.rating_count) * 100)
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-8 text-right text-xs text-muted-foreground">{star}점</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
