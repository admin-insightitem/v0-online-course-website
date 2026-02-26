"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, ChevronLeft, ChevronRight, Clock, User } from "lucide-react"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courses } from "@/lib/courses"

// 내가 수강한 강좌 목록
const myCourses = [
  { id: "all", title: "전체 강좌" },
  { id: courses[0].id, title: courses[0].title },
  { id: courses[1].id, title: courses[1].title },
  { id: courses[4].id, title: courses[4].title },
]

// Q&A 데이터
const qnaData = [
  {
    id: "q1",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 1. AI 수익화 개론 > 강의 소개 및 로드맵 안내",
    title: "ChatGPT API 키 발급 관련 질문드립니다",
    content: "강의에서 API 키를 발급받는 부분이 나오는데, 현재 OpenAI 사이트가 업데이트되어서 화면이 다른 것 같습니다. 최신 버전에서는 어떻게 발급받아야 하나요?",
    author: "김경민",
    isMyQuestion: true,
    createdAt: "2026.02.25",
    answers: 2,
    lectureOrder: 1,
  },
  {
    id: "q2",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 2. ChatGPT 프롬프트 마스터 > 프롬프트 엔지니어링 기초",
    title: "프롬프트 작성 시 토큰 제한에 대해 궁금합니다",
    content: "GPT-4 모델에서 토큰 제한이 있다고 하셨는데, 긴 문서를 처리할 때는 어떤 방법을 사용하면 좋을까요?",
    author: "이수진",
    isMyQuestion: false,
    createdAt: "2026.02.24",
    answers: 5,
    lectureOrder: 5,
  },
  {
    id: "q3",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 1. AI 수익화 개론 > 수익화 가능한 AI 비즈니스 모델 10가지",
    title: "AI 콘텐츠 자동 생성 시 저작권 문제",
    content: "AI로 생성한 콘텐츠를 상업적으로 사용할 때 저작권 문제가 있을 수 있나요? 법적인 부분이 걱정됩니다.",
    author: "박준혁",
    isMyQuestion: false,
    createdAt: "2026.02.23",
    answers: 3,
    lectureOrder: 3,
  },
  {
    id: "q4",
    courseId: courses[1].id,
    course: courses[1],
    lectureTitle: "Section 1. 주식 투자 기초 > 차트 분석의 기본",
    title: "이동평균선 설정값 관련 질문",
    content: "강의에서 20일, 60일, 120일 이동평균선을 사용하셨는데, 다른 기간으로 설정해도 괜찮을까요?",
    author: "김경민",
    isMyQuestion: true,
    createdAt: "2026.02.22",
    answers: 1,
    lectureOrder: 2,
  },
  {
    id: "q5",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 3. AI 자동화 시스템 구축 > Zapier & Make 자동화 기초",
    title: "Zapier 무료 플랜 제한 관련",
    content: "Zapier 무료 플랜으로도 강의 내용을 따라할 수 있을까요? 유료 플랜이 필요한 기능이 있는지 궁금합니다.",
    author: "최서연",
    isMyQuestion: false,
    createdAt: "2026.02.21",
    answers: 4,
    lectureOrder: 8,
  },
  {
    id: "q6",
    courseId: courses[4].id,
    course: courses[4],
    lectureTitle: "Section 1. 이커머스 기초 > 스마트스토어 입점 가이드",
    title: "스마트스토어 사업자등록 관련 질문",
    content: "개인사업자와 법인사업자 중 어떤 것으로 시작하는 게 좋을까요? 세금 관련해서도 조언 부탁드립니다.",
    author: "정민수",
    isMyQuestion: false,
    createdAt: "2026.02.20",
    answers: 6,
    lectureOrder: 1,
  },
  {
    id: "q7",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 2. ChatGPT 프롬프트 마스터 > 고급 프롬프트 테크닉 10가지",
    title: "Chain of Thought 프롬프팅 예시 요청",
    content: "강의에서 설명하신 Chain of Thought 기법의 실제 활용 예시를 좀 더 알 수 있을까요?",
    author: "한수빈",
    isMyQuestion: false,
    createdAt: "2026.02.19",
    answers: 2,
    lectureOrder: 6,
  },
  {
    id: "q8",
    courseId: courses[1].id,
    course: courses[1],
    lectureTitle: "Section 2. 기술적 분석 > RSI 지표 활용법",
    title: "RSI 과매수/과매도 구간 판단 기준",
    content: "RSI 70 이상이 과매수, 30 이하가 과매도라고 하셨는데, 실제로는 어느 정도까지 기다렸다가 매매해야 할까요?",
    author: "김경민",
    isMyQuestion: true,
    createdAt: "2026.02.18",
    answers: 3,
    lectureOrder: 4,
  },
  {
    id: "q9",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 1. AI 수익화 개론 > AI 시대, 왜 지금 시작해야 하는가",
    title: "AI 분야 취업 전망에 대해 궁금합니다",
    content: "AI 관련 스킬을 배우면 어떤 직종으로 취업할 수 있을까요? 개발자가 아니어도 가능한가요?",
    author: "윤지아",
    isMyQuestion: false,
    createdAt: "2026.02.17",
    answers: 8,
    lectureOrder: 2,
  },
  {
    id: "q10",
    courseId: courses[4].id,
    course: courses[4],
    lectureTitle: "Section 2. 상품 소싱 > 해외 소싱 플랫폼 활용",
    title: "알리바바 소싱 시 주의사항",
    content: "알리바바에서 소싱할 때 사기를 피하려면 어떤 점을 확인해야 할까요? 믿을 수 있는 판매자 찾는 팁이 있나요?",
    author: "이도현",
    isMyQuestion: false,
    createdAt: "2026.02.16",
    answers: 5,
    lectureOrder: 3,
  },
  {
    id: "q11",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 3. AI 자동화 시스템 구축 > AI 콘텐츠 자동 생성 파이프라인",
    title: "자동화 파이프라인 에러 해결 방법",
    content: "Make에서 시나리오를 실행하면 중간에 에러가 발생합니다. 에러 로그를 어떻게 확인하고 해결해야 할까요?",
    author: "김경민",
    isMyQuestion: true,
    createdAt: "2026.02.15",
    answers: 2,
    lectureOrder: 9,
  },
  {
    id: "q12",
    courseId: courses[1].id,
    course: courses[1],
    lectureTitle: "Section 1. 주식 투자 기초 > 주식 시장의 이해",
    title: "미국 주식과 한국 주식 차이점",
    content: "미국 주식 투자를 시작하려고 하는데, 한국 주식과 비교했을 때 어떤 점을 주의해야 할까요?",
    author: "송민재",
    isMyQuestion: false,
    createdAt: "2026.02.14",
    answers: 4,
    lectureOrder: 1,
  },
]

const ITEMS_PER_PAGE = 10

export default function QnAPage() {
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [questionFilter, setQuestionFilter] = useState<"all" | "my">("all")
  const [sortBy, setSortBy] = useState<"latest" | "lecture" | "answers">("latest")
  const [currentPage, setCurrentPage] = useState(1)

  // 필터링된 질문 목록
  const filteredQuestions = qnaData
    .filter((q) => {
      // 강좌 필터
      if (selectedCourse !== "all" && q.courseId !== selectedCourse) return false
      // 내 질문 필터
      if (questionFilter === "my" && !q.isMyQuestion) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "lecture":
          return a.lectureOrder - b.lectureOrder
        case "answers":
          return b.answers - a.answers
        default:
          return 0
      }
    })

  // 페이지네이션
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE)
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value)
    setCurrentPage(1)
  }

  const handleFilterChange = (filter: "all" | "my") => {
    setQuestionFilter(filter)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value as "latest" | "lecture" | "answers")
    setCurrentPage(1)
  }

  return (
    <MypageLayout activeMenu="강의별 Q&A">
      <h2 className="text-xl font-bold text-foreground">강의별 Q&A</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        수강 중인 강의의 질문과 답변을 확인하고 참여하세요.
      </p>

      {/* 필터 영역 */}
      <div className="mt-6 space-y-4">
        {/* 강좌 선택 */}
        <div>
          <Select value={selectedCourse} onValueChange={handleCourseChange}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="강좌를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {myCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 전체 질문 / 내 질문 + 정렬 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 전체 질문 | 내 질문 */}
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              onClick={() => handleFilterChange("all")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                questionFilter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              전체 질문
            </button>
            <button
              onClick={() => handleFilterChange("my")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                questionFilter === "my"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              내 질문
            </button>
          </div>

          {/* 정렬 */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="lecture">강의 목차 순</SelectItem>
              <SelectItem value="answers">답변 많은 순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 질문 목록 */}
      <div className="mt-6 space-y-4">
        {paginatedQuestions.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              {questionFilter === "my" ? "작성한 질문이 없습니다." : "등록된 질문이 없습니다."}
            </p>
          </div>
        ) : (
          paginatedQuestions.map((question) => (
            <Link
              key={question.id}
              href={`/courses/${question.courseId}/watch/lecture-1`}
              className="block rounded-lg border border-border bg-card transition-colors hover:border-accent/50"
            >
              <div className="p-5">
                {/* 강좌 & 강의 정보 */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-0.5 font-medium">
                    {question.course.title.length > 30 
                      ? question.course.title.substring(0, 30) + "..." 
                      : question.course.title}
                  </span>
                  <span className="text-muted-foreground/50">|</span>
                  <span>{question.lectureTitle}</span>
                </div>

                {/* 질문 제목 */}
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {question.isMyQuestion && (
                    <span className="mr-2 inline-block rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      내 질문
                    </span>
                  )}
                  {question.title}
                </h3>

                {/* 질문 내용 미리보기 */}
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {question.content}
                </p>

                {/* 메타 정보 */}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{question.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{question.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>답변 {question.answers}개</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className={`h-9 w-9 ${currentPage === page ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 결과 요약 */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        총 {filteredQuestions.length}개의 질문 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
        {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuestions.length)}번째
      </div>
    </MypageLayout>
  )
}
