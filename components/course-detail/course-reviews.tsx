import { Star, ThumbsUp } from "lucide-react"
import type { Course } from "@/lib/courses"

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

export function CourseReviews({ course }: { course: Course }) {
  return (
    <section className="mt-10 pb-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold text-foreground lg:text-2xl">
          수강평
        </h2>
        <span className="text-sm text-muted-foreground">
          총 {course.reviews.toLocaleString()}개
        </span>
      </div>

      {/* Rating summary */}
      <div className="mb-8 flex items-center gap-6 rounded-xl border border-border bg-card p-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-foreground">{course.rating}</p>
          <StarRating rating={Math.round(course.rating)} />
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count =
              star === 5
                ? Math.round(course.reviews * 0.72)
                : star === 4
                ? Math.round(course.reviews * 0.2)
                : star === 3
                ? Math.round(course.reviews * 0.05)
                : star === 2
                ? Math.round(course.reviews * 0.02)
                : Math.round(course.reviews * 0.01)
            const pct = Math.round((count / course.reviews) * 100)
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

      {/* Review list */}
      <div className="space-y-6">
        {course.reviewList.map((review) => (
          <article key={review.name + review.date} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="mb-3 text-[15px] leading-relaxed text-foreground">
              {review.content}
            </p>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <ThumbsUp className="h-3.5 w-3.5" />
              도움이 됐어요 ({review.helpful})
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
