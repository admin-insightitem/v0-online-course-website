"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, X, Pencil, CheckCircle, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courses } from "@/lib/courses"

// 내가 들은 강의 (구매내역 기반)
const myPurchasedCourses = [
  { course: courses[0], purchaseDate: "2026.02.15", hasReview: true },
  { course: courses[1], purchaseDate: "2026.01.28", hasReview: false },
  { course: courses[4], purchaseDate: "2025.12.20", hasReview: true },
]

// 전체 수강평 (모든 사용자)
const allReviews = [
  {
    id: "all-review-1",
    courseId: courses[0].id,
    course: courses[0],
    authorName: "김민수",
    rating: 5,
    content: "정말 좋은 강의입니다. AI를 처음 접하는 분들에게 강력 추천합니다. 실습 위주라서 바로 적용할 수 있어요!",
    createdAt: "2026.02.24",
    helpful: 24,
  },
  {
    id: "all-review-2",
    courseId: courses[1].id,
    course: courses[1],
    authorName: "이지은",
    rating: 5,
    content: "주식 투자에 대한 막연한 두려움이 있었는데, 이 강의를 듣고 자신감이 생겼습니다. 차트 분석 파트가 특히 좋았어요.",
    createdAt: "2026.02.22",
    helpful: 18,
  },
  {
    id: "all-review-3",
    courseId: courses[2].id,
    course: courses[2],
    authorName: "박준혁",
    rating: 4,
    content: "영어 회화 실력이 확실히 늘었습니다. 원어민 표현들을 많이 배울 수 있어서 좋았어요. 매일 꾸준히 듣는 것이 중요한 것 같습니다.",
    createdAt: "2026.02.20",
    helpful: 15,
  },
  {
    id: "all-review-4",
    courseId: courses[0].id,
    course: courses[0],
    authorName: "최서연",
    rating: 5,
    content: "AI 자동화로 업무 효율이 3배 이상 올랐습니다. 특히 ChatGPT API 활용법이 실무에 바로 적용 가능해서 좋았습니다.",
    createdAt: "2026.02.18",
    helpful: 31,
  },
  {
    id: "all-review-5",
    courseId: courses[3].id,
    course: courses[3],
    authorName: "정현우",
    rating: 4,
    content: "부동산 투자의 기초부터 실전까지 체계적으로 배울 수 있었습니다. 다만 최신 규제 내용이 더 업데이트되면 좋겠어요.",
    createdAt: "2026.02.15",
    helpful: 9,
  },
  {
    id: "all-review-6",
    courseId: courses[4].id,
    course: courses[4],
    authorName: "한소희",
    rating: 5,
    content: "스마트스토어 운영 노하우를 한 번에 배울 수 있어서 좋았습니다. 실제 매출이 올랐어요!",
    createdAt: "2026.02.14",
    helpful: 22,
  },
  {
    id: "all-review-7",
    courseId: courses[0].id,
    course: courses[0],
    authorName: "강동원",
    rating: 5,
    content: "ChatGPT 활용법이 정말 실용적입니다. 업무 시간이 절반으로 줄었어요.",
    createdAt: "2026.02.12",
    helpful: 17,
  },
  {
    id: "all-review-8",
    courseId: courses[1].id,
    course: courses[1],
    authorName: "송지효",
    rating: 4,
    content: "주식 초보자에게 딱 맞는 강의입니다. 기초부터 차근차근 설명해주셔서 이해하기 쉬웠어요.",
    createdAt: "2026.02.10",
    helpful: 14,
  },
  {
    id: "all-review-9",
    courseId: courses[2].id,
    course: courses[2],
    authorName: "유재석",
    rating: 5,
    content: "영어 회화 강의 중 최고입니다. 발음 교정 파트가 특히 도움이 많이 됐어요.",
    createdAt: "2026.02.08",
    helpful: 28,
  },
  {
    id: "all-review-10",
    courseId: courses[3].id,
    course: courses[3],
    authorName: "이광수",
    rating: 4,
    content: "부동산 경매 파트가 인상적이었습니다. 실전 사례가 많아서 좋았어요.",
    createdAt: "2026.02.06",
    helpful: 11,
  },
  {
    id: "all-review-11",
    courseId: courses[4].id,
    course: courses[4],
    authorName: "전소민",
    rating: 5,
    content: "쿠팡 입점 가이드가 정말 상세합니다. 덕분에 첫 달 매출 500만원 달성했어요!",
    createdAt: "2026.02.04",
    helpful: 35,
  },
  {
    id: "all-review-12",
    courseId: courses[0].id,
    course: courses[0],
    authorName: "김종국",
    rating: 5,
    content: "AI 자동화 강의 중 가장 실용적입니다. 바로 업무에 적용할 수 있어서 좋아요.",
    createdAt: "2026.02.02",
    helpful: 19,
  },
  {
    id: "all-review-13",
    courseId: courses[1].id,
    course: courses[1],
    authorName: "하하",
    rating: 4,
    content: "차트 분석 능력이 확실히 향상됐습니다. 다만 실시간 분석 예제가 더 있었으면 좋겠어요.",
    createdAt: "2026.01.30",
    helpful: 8,
  },
  {
    id: "all-review-14",
    courseId: courses[2].id,
    course: courses[2],
    authorName: "양세찬",
    rating: 5,
    content: "원어민 표현 정리가 정말 유용합니다. 매일 듣고 있어요!",
    createdAt: "2026.01.28",
    helpful: 21,
  },
  {
    id: "all-review-15",
    courseId: courses[3].id,
    course: courses[3],
    authorName: "지석진",
    rating: 4,
    content: "부동산 투자 기초를 다지기에 좋은 강의입니다. 초보자에게 추천해요.",
    createdAt: "2026.01.26",
    helpful: 13,
  },
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
  const [activeTab, setActiveTab] = useState<"all-reviews" | "my-reviews" | "write-review">("all-reviews")
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [thankYouMessage, setThankYouMessage] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null)
  const [selectedReview, setSelectedReview] = useState<typeof myReviews[0] | null>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewContent, setReviewContent] = useState("")
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>(["all-review-1"])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"latest" | "rating" | "helpful">("latest")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const itemsPerPage = 10

  // 강좌 목록 추출
  const courseList = Array.from(new Set(allReviews.map((r) => r.course.id))).map(
    (id) => allReviews.find((r) => r.course.id === id)!.course
  )

  // 선택된 강좌의 평균 별점 계산
  const getAverageRating = () => {
    const reviewsForCourse = courseFilter === "all" 
      ? allReviews 
      : allReviews.filter((r) => r.course.id === courseFilter)
    if (reviewsForCourse.length === 0) return 0
    const sum = reviewsForCourse.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviewsForCourse.length).toFixed(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value as "latest" | "rating" | "helpful")
    setCurrentPage(1)
  }

  const handleCourseFilterChange = (value: string) => {
    setCourseFilter(value)
    setRatingFilter("all")
    setCurrentPage(1)
  }

  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value)
    setCurrentPage(1)
  }

  // 필터링 및 정렬된 리뷰
  const filteredReviews = allReviews.filter((r) => {
    const matchesCourse = courseFilter === "all" || r.course.id === courseFilter
    const matchesRating = ratingFilter === "all" || r.rating === parseInt(ratingFilter)
    return matchesCourse && matchesRating
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "rating":
        return b.rating - a.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const handleHelpful = (reviewId: string) => {
    if (helpfulReviews.includes(reviewId)) {
      setHelpfulReviews(helpfulReviews.filter((id) => id !== reviewId))
    } else {
      setHelpfulReviews([...helpfulReviews, reviewId])
    }
  }

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

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage)
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <MypageLayout activeMenu="수강평 목록">
      <h2 className="text-xl font-bold text-foreground">수강평 목록</h2>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("all-reviews")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "all-reviews"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          전체 수강평 ({allReviews.length})
        </button>
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
        {activeTab === "all-reviews" ? (
          // 전체 수강평 목록
          <div className="flex flex-col gap-4">
            {/* 필터 및 정렬 옵션 */}
            <div className="flex items-center justify-between">
              {/* 좌측: 강좌 필터, 별점 필터, 평균 별점 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{"강좌"}</span>
                  <Select value={courseFilter} onValueChange={handleCourseFilterChange}>
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="강좌 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{"전체"}</SelectItem>
                      {courseList.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title.length > 35 ? course.title.substring(0, 35) + "..." : course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{"별점"}</span>
                  <Select value={ratingFilter} onValueChange={handleRatingFilterChange}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="별점" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{"전체"}</SelectItem>
                      <SelectItem value="5">{"5점"}</SelectItem>
                      <SelectItem value="4">{"4점"}</SelectItem>
                      <SelectItem value="3">{"3점"}</SelectItem>
                      <SelectItem value="2">{"2점"}</SelectItem>
                      <SelectItem value="1">{"1점"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-muted-foreground">{"평균"}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{getAverageRating()}</span>
                  <span className="text-muted-foreground">{"("}{filteredReviews.length}{"개)"}</span>
                </div>
              </div>

              {/* 우측: 정렬 옵션 */}
              <div className="flex items-center gap-4">
                {[
                  { value: "latest", label: "최신순" },
                  { value: "helpful", label: "도움이 됨 순" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      sortBy === option.value
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      sortBy === option.value ? "bg-primary" : "bg-muted-foreground/50"
                    }`} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {allReviews.length === 0 ? (
              <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
                <p className="text-muted-foreground">아직 작성된 수강평이 없습니다.</p>
              </div>
            ) : (
              <>
              {paginatedReviews.map((review) => (
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
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">{review.authorName}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      {review.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 gap-1.5 text-xs ${
                          helpfulReviews.includes(review.id)
                            ? "border-accent bg-accent/10 text-accent"
                            : ""
                        }`}
                        onClick={() => handleHelpful(review.id)}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${helpfulReviews.includes(review.id) ? "fill-current" : ""}`} />
                        도움이 됨 {review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              </>
            )}
          </div>
        ) : activeTab === "my-reviews" ? (
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
          // 수��평 작성하기
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
