import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import type { Course } from "@/lib/courses"

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4"
  return (
    <div className="flex gap-0.5" aria-label={`${rating}점`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${iconSize} ${i <= rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

export function CourseReviews({ course }: { course: Course }) {
  return (
    <section id="detail-review" className="scroll-mt-32 py-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground lg:text-2xl">
            수강 후기
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            총 {course.reviews.toLocaleString()}개의 수강평
          </p>
        </div>
      </div>

      {/* Rating summary */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col items-center gap-6 p-8 md:flex-row md:items-start">
          {/* Overall Rating */}
          <div className="flex flex-col items-center text-center md:min-w-[140px]">
            <p className="text-5xl font-bold text-foreground">{course.rating}</p>
            <StarRating rating={Math.round(course.rating)} size="md" />
            <p className="mt-2 text-sm text-muted-foreground">{course.reviews.toLocaleString()}개 리뷰</p>
          </div>

          {/* Rating Breakdown */}
          <div className="w-full flex-1 space-y-2">
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
                <div key={star} className="flex items-center gap-3">
                  <div className="flex w-16 items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-sm font-medium text-foreground">{star}</span>
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm text-muted-foreground">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {course.reviewList.map((review) => (
          <article key={review.name + review.date} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-base font-bold text-foreground">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{review.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mb-4 text-[15px] leading-relaxed text-foreground">
              {review.content}
            </p>
            <button className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground">
              <ThumbsUp className="h-3.5 w-3.5" />
              도움이 됐어요 ({review.helpful})
            </button>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="rounded-xl border border-border bg-card px-8 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:shadow-sm">
          후기 더보기
        </button>
      </div>
    </section>
  )
}
