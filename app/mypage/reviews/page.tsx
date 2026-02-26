"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, X, Pencil, CheckCircle } from "lucide-react"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { courses } from "@/lib/courses"

// 내가 들은 강의 (구매내역 기반)
const myPurchasedCourses = [
  { course: courses[0], purchaseDate: "2026.02.15", hasReview: true },
  { course: courses[1], purchaseDate: "2026.01.28", hasReview: false },
  { course: courses[4], purchaseDate: "2025.12.20", hasReview: true },
]

// 내가 작성한 수강평
const myReviews = [
  {
    id: "review-1",
    courseId: courses[0].id,
    course: courses[0],
    rating: 5,
    content: "AI에 대해 전혀 몰랐는데, 이 강의 덕분에 3개월 만에 월 300만원 부수입을 만들 수 있었습니다. 특히 자동화 파이프라인 구축 파트가 정말 실용적이었어요. 강사님의 설명이 매우 친절하고 따라하기 쉽게 구성되어 있어서 초보자도 충분히 따라할 수 있습니다.",
    createdAt: "2026.02.20",
    helpful: 12,
  },
  {
    id: "review-2",
    courseId: courses[4].id,
    course: courses[4],
    rating: 4,
    content: "스마트스토어와 쿠팡 운영에 필요한 모든 것을 배울 수 있었습니다. 소싱 강의가 특히 좋았고, 실제로 적용해서 매출을 올릴 수 있었어요. 다만 고급 마케팅 전략이 좀 더 있었으면 좋겠습니다.",
    createdAt: "2026.01.05",
    helpful: 8,
  },
]

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"my-reviews" | "write-review">("my-reviews")
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [thankYouMessage, setThankYouMessage] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null)
  const [selectedReview, setSelectedReview] = useState<typeof myReviews[0] | null>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewContent, setReviewContent] = useState("")

  const handleOpenWriteModal = (course: typeof courses[0]) => {
    setSelectedCourse(course)
    setRating(0)
    setHoverRating(0)
    setReviewContent("")
    setIsWriteModalOpen(true)
  }

  const handleOpenEditModal = (review: typeof myReviews[0]) => {
    setSelectedReview(review)
    setSelectedCourse(review.course)
    setRating(review.rating)
    setHoverRating(0)
    setReviewContent(review.content)
    setIsEditModalOpen(true)
  }

  const handleSubmitReview = () => {
    if (rating === 0 || reviewContent.trim() === "") return
    setIsWriteModalOpen(false)
    setThankYouMessage("수강평을 남겨주셔서 감사합니다.")
    setShowThankYouModal(true)
  }

  const handleUpdateReview = () => {
    if (rating === 0 || reviewContent.trim() === "") return
    setIsEditModalOpen(false)
    setThankYouMessage("수강평이 수정되었습니다.")
    setShowThankYouModal(true)
  }

  // 수강평 작성이 가능한 강의 (아직 리뷰를 작성하지 않은 강의)
  const coursesWithoutReview = myPurchasedCourses.filter((item) => !item.hasReview)

  return (
    <MypageLayout activeMenu="수강평 목록">
      <h2 className="text-xl font-bold text-foreground">수강평 목록</h2>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("my-reviews")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "my-reviews"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          내가 작성한 수강평 ({myReviews.length})
        </button>
        <button
          onClick={() => setActiveTab("write-review")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "write-review"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          수강평 작성하기 ({coursesWithoutReview.length})
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "my-reviews" ? (
          // 내가 작성한 수강평 목록
          <div className="flex flex-col gap-4">
            {myReviews.length === 0 ? (
              <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
                <p className="text-muted-foreground">작성한 수강평이 없습니다.</p>
                <Button
                  onClick={() => setActiveTab("write-review")}
                  className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  수강평 작성하기
                </Button>
              </div>
            ) : (
              myReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-border bg-card"
                >
                  {/* Course Info */}
                  <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:gap-5">
                    <Link
                      href={`/courses/${review.course.id}`}
                      className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md sm:w-36"
                    >
                      <Image
                        src={review.course.image}
                        alt={review.course.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-1">
                      <Link
                        href={`/courses/${review.course.id}`}
                        className="text-sm font-semibold leading-snug text-foreground hover:underline sm:text-base"
                      >
                        {review.course.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {review.course.instructor} | {review.course.category}
                      </p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-foreground">{review.rating}.0</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      {review.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {review.helpful}명에게 도움이 됨
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => handleOpenEditModal(review)}
                      >
                        <Pencil className="h-3 w-3" />
                        수정
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // 수강평 작성하기
          <div className="flex flex-col gap-4">
            {coursesWithoutReview.length === 0 ? (
              <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
                <p className="text-muted-foreground">모든 강의에 수강평을 작성하셨습니다.</p>
                <Button
                  onClick={() => setActiveTab("my-reviews")}
                  variant="outline"
                  className="mt-4"
                >
                  내 수강평 보기
                </Button>
              </div>
            ) : (
              coursesWithoutReview.map((item) => (
                <div
                  key={item.course.id}
                  className="rounded-lg border border-border bg-card"
                >
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
                    <Link
                      href={`/courses/${item.course.id}`}
                      className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md sm:w-36"
                    >
                      <Image
                        src={item.course.image}
                        alt={item.course.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-1">
                      <Link
                        href={`/courses/${item.course.id}`}
                        className="text-sm font-semibold leading-snug text-foreground hover:underline sm:text-base"
                      >
                        {item.course.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.course.instructor} | {item.course.category}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        구매일: {item.purchaseDate}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenWriteModal(item.course)}
                      className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      수강평 작성
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">수강평 작성</h3>
              <button 
                onClick={() => setIsWriteModalOpen(false)}
                className="rounded-full p-1 hover:bg-secondary"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="mt-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">이 강의는 어땠나요?</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`h-8 w-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {rating === 1 && "별로예요"}
                    {rating === 2 && "그저 그래요"}
                    {rating === 3 && "보통이에요"}
                    {rating === 4 && "좋아요"}
                    {rating === 5 && "최고예요!"}
                  </p>
                )}
              </div>

              {/* Review Content */}
              <div className="mt-6">
                <Textarea
                  placeholder="수강 후기를 작성해주세요..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || !reviewContent.trim()}
                className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                수강평 등록
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {isEditModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">수강평 수정</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 hover:bg-secondary"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="mt-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">이 강의는 어땠나요?</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`h-8 w-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {rating === 1 && "별로예요"}
                    {rating === 2 && "그저 그래요"}
                    {rating === 3 && "보통이에요"}
                    {rating === 4 && "좋아요"}
                    {rating === 5 && "최고예요!"}
                  </p>
                )}
              </div>

              {/* Review Content */}
              <div className="mt-6">
                <Textarea
                  placeholder="수강 후기를 작성해주세요..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleUpdateReview}
                disabled={rating === 0 || !reviewContent.trim()}
                className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                수정 완료
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 text-center shadow-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">감사합니다!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {thankYouMessage}<br />
              앞으로 더 좋은 지식을 전달하도록 노력하겠습니다.
            </p>
            <Button
              onClick={() => setShowThankYouModal(false)}
              className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </MypageLayout>
  )
}
