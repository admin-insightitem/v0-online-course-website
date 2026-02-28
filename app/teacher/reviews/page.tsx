"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react"
import { TeacherLayout } from "@/components/teacher-layout"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { courses } from "@/lib/courses"

// 강사의 강좌 (김도현 강사의 강좌만 필터)
const instructorCourses = courses.filter(c => c.instructor === "김도현")

// 강사의 강좌에 대한 수강평
const courseReviews = [
  {
    id: "review-1",
    courseId: instructorCourses[0]?.id || "chatgpt-ai-automation",
    course: instructorCourses[0] || courses[0],
    authorName: "김민수",
    rating: 5,
    content: "정말 좋은 강의입니다. AI를 처음 접하는 분들에게 강력 추천합니다. 실습 위주라서 바로 적용할 수 있어요!",
    createdAt: "2026.02.24",
    helpful: 24,
  },
  {
    id: "review-2",
    courseId: instructorCourses[0]?.id || "chatgpt-ai-automation",
    course: instructorCourses[0] || courses[0],
    authorName: "최서연",
    rating: 5,
    content: "AI 자동화로 업무 효율이 3배 이상 올랐습니다. 특히 ChatGPT API 활용법이 실무에 바로 적용 가능해서 좋았습니다.",
    createdAt: "2026.02.18",
    helpful: 31,
  },
  {
    id: "review-3",
    courseId: instructorCourses[0]?.id || "chatgpt-ai-automation",
    course: instructorCourses[0] || courses[0],
    authorName: "강동원",
    rating: 5,
    content: "ChatGPT 활용법이 정말 실용적입니다. 업무 시간이 절반으로 줄었어요.",
    createdAt: "2026.02.12",
    helpful: 17,
  },
  {
    id: "review-4",
    courseId: instructorCourses[0]?.id || "chatgpt-ai-automation",
    course: instructorCourses[0] || courses[0],
    authorName: "김종국",
    rating: 5,
    content: "AI 자동화 강의 중 가장 실용적입니다. 바로 업무에 적용할 수 있어서 좋아요.",
    createdAt: "2026.02.02",
    helpful: 19,
  },
  {
    id: "review-5",
    courseId: instructorCourses[0]?.id || "chatgpt-ai-automation",
    course: instructorCourses[0] || courses[0],
    authorName: "박준혁",
    rating: 4,
    content: "전반적으로 좋은 강의입니다. 다만 고급 내용이 조금 더 있었으면 좋겠어요.",
    createdAt: "2026.01.28",
    helpful: 8,
  },
  {
    id: "review-6",
    courseId: instructorCourses[0]?.id || "chatgpt-ai-automation",
    course: instructorCourses[0] || courses[0],
    authorName: "이지은",
    rating: 4,
    content: "초보자에게 적합한 강의입니다. 기초부터 차근차근 설명해주셔서 이해하기 쉬웠어요.",
    createdAt: "2026.01.20",
    helpful: 12,
  },
  {
    id: "review-7",
    courseId: instructorCourses[0]?.id || "chatgpt-ai-automation",
    course: instructorCourses[0] || courses[0],
    authorName: "한소희",
    rating: 5,
    content: "강의 구성이 체계적이고 실습 예제가 풍부해서 좋았습니다. 완강 후 실제 프로젝트에 바로 적용했어요!",
    createdAt: "2026.01.15",
    helpful: 15,
  },
]

export default function TeacherReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "helpful">("latest")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])
  const itemsPerPage = 10

  // 강좌 목록 추출
  const courseList = Array.from(new Set(courseReviews.map((r) => r.course.id))).map(
    (id) => courseReviews.find((r) => r.course.id === id)!.course
  )

  // 선택된 강좌의 평균 별점 계산
  const getAverageRating = () => {
    const reviewsForCourse = courseFilter === "all" 
      ? courseReviews 
      : courseReviews.filter((r) => r.course.id === courseFilter)
    if (reviewsForCourse.length === 0) return "0.0"
    const sum = reviewsForCourse.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviewsForCourse.length).toFixed(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value as "latest" | "oldest" | "helpful")
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
  const filteredReviews = courseReviews.filter((r) => {
    const matchesCourse = courseFilter === "all" || r.course.id === courseFilter
    const matchesRating = ratingFilter === "all" || r.rating === parseInt(ratingFilter)
    return matchesCourse && matchesRating
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{"수강평 관리"}</h2>
          <p className="text-muted-foreground">{"내 강좌에 등록된 수강평을 확인합니다."}</p>
        </div>

        {/* Reviews Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              {"수강평 목록"}
            </CardTitle>
            <CardDescription>
              {"총 "}{courseReviews.length}{"개의 수강평"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 필터 및 정렬 옵션 */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              {/* 좌측: 강좌 필터, 별점 필터, 평균 별점 */}
              <div className="flex flex-wrap items-center gap-4">
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
                  { value: "oldest", label: "등록순" },
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

            {/* Reviews List */}
            {courseReviews.length === 0 ? (
              <div className="rounded-lg border border-border bg-muted/30 px-6 py-12 text-center">
                <p className="text-muted-foreground">{"아직 등록된 수강평이 없습니다."}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
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
                          {"도움이 됨 "}{review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  )
}
