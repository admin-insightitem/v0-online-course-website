"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react"
import { MypageLayout } from "@/components/mypage-layout"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
    content: "강의 중간에 나온 API 호출 예시에서 에러가 발생하는데, 해결 방법이 있을까요?",
    author: "김수현",
    authorImage: "/images/instructor-1.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.25",
    likes: 5,
    lectureOrder: 1,
    replies: [
      {
        id: "r1",
        author: "김도현 (강사)",
        authorImage: "/images/instructor-1.jpg",
        date: "2026.02.25",
        content: "네, API 키 설정이 제대로 되어있는지 확인해주세요. 환경변수에 OPENAI_API_KEY가 설정되어 있어야 합니다.",
        isInstructor: true,
      },
    ],
  },
  {
    id: "q2",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 2. ChatGPT 프롬프트 마스터 > 프롬프트 엔지니어링 기초",
    content: "GPT-4 모델에서 토큰 제한이 있다고 하셨는데, 긴 문서를 처리할 때는 어떤 방법을 사용하면 좋을까요?",
    author: "이수진",
    authorImage: "/images/instructor-2.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.24",
    likes: 3,
    lectureOrder: 5,
    replies: [
      {
        id: "r2",
        author: "김도현 (강사)",
        authorImage: "/images/instructor-1.jpg",
        date: "2026.02.24",
        content: "긴 문서는 청킹(chunking) 기법을 사용하시면 됩니다. 문서를 작은 단위로 나누어 처리하는 방법이에요.",
        isInstructor: true,
      },
      {
        id: "r3",
        author: "박민수",
        authorImage: "/images/instructor-3.jpg",
        date: "2026.02.24",
        content: "저도 같은 문제가 있었는데, LangChain을 사용하니까 해결됐어요!",
        isInstructor: false,
      },
    ],
  },
  {
    id: "q3",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 1. AI 수익화 개론 > 수익화 가능한 AI 비즈니스 모델 10가지",
    content: "AI로 생성한 콘텐츠를 상업적으로 사용할 때 저작권 문제가 있을 수 있나요? 법적인 부분이 걱정됩니다.",
    author: "박준혁",
    authorImage: "/images/instructor-3.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.23",
    likes: 8,
    lectureOrder: 3,
    replies: [],
  },
  {
    id: "q4",
    courseId: courses[1].id,
    course: courses[1],
    lectureTitle: "Section 1. 주식 투자 기초 > 차트 분석의 기본",
    content: "강의에서 20일, 60일, 120일 이동평균선을 사용하셨는데, 다른 기간으로 설정해도 괜찮을까요?",
    author: "김경민",
    authorImage: "/images/instructor-1.jpg",
    isMyQuestion: true,
    createdAt: "2026.02.22",
    likes: 2,
    lectureOrder: 2,
    replies: [
      {
        id: "r4",
        author: "이재원 (강사)",
        authorImage: "/images/instructor-2.jpg",
        date: "2026.02.22",
        content: "네, 본인의 투자 스타일에 맞게 조정하셔도 됩니다. 단기 투자자는 5일, 10일선을 더 많이 참고해요.",
        isInstructor: true,
      },
    ],
  },
  {
    id: "q5",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 3. AI 자동화 시스템 구축 > Zapier & Make 자동화 기초",
    content: "Zapier 무료 플랜으로도 강의 내용을 따라할 수 있을까요? 유료 플랜이 필요한 기능이 있는지 궁금합니다.",
    author: "최서연",
    authorImage: "/images/instructor-3.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.21",
    likes: 4,
    lectureOrder: 8,
    replies: [],
  },
  {
    id: "q6",
    courseId: courses[4].id,
    course: courses[4],
    lectureTitle: "Section 1. 이커머스 기초 > 스마트스토어 입점 가이드",
    content: "개인사업자와 법인사업자 중 어떤 것으로 시작하는 게 좋을까요? 세금 관련해서도 조언 부탁드립니다.",
    author: "정민수",
    authorImage: "/images/instructor-1.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.20",
    likes: 6,
    lectureOrder: 1,
    replies: [],
  },
  {
    id: "q7",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 2. ChatGPT 프롬프트 마스터 > 고급 프롬프트 테크닉 10가지",
    content: "강의에서 설명하신 Chain of Thought 기법의 실제 활용 예시를 좀 더 알 수 있을까요?",
    author: "한수빈",
    authorImage: "/images/instructor-2.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.19",
    likes: 2,
    lectureOrder: 6,
    replies: [],
  },
  {
    id: "q8",
    courseId: courses[1].id,
    course: courses[1],
    lectureTitle: "Section 2. 기술적 분석 > RSI 지표 활용법",
    content: "RSI 70 이상이 과매수, 30 이하가 과매도라고 하셨는데, 실제로는 어느 정도까지 기다렸다가 매매해야 할까요?",
    author: "김경민",
    authorImage: "/images/instructor-1.jpg",
    isMyQuestion: true,
    createdAt: "2026.02.18",
    likes: 3,
    lectureOrder: 4,
    replies: [],
  },
  {
    id: "q9",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 1. AI 수익화 개론 > AI 시대, 왜 지금 시작해야 하는가",
    content: "AI 관련 스킬을 배우면 어떤 직종으로 취업할 수 있을까요? 개발자가 아니어도 가능한가요?",
    author: "윤지아",
    authorImage: "/images/instructor-3.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.17",
    likes: 8,
    lectureOrder: 2,
    replies: [],
  },
  {
    id: "q10",
    courseId: courses[4].id,
    course: courses[4],
    lectureTitle: "Section 2. 상품 소싱 > 해외 소싱 플랫폼 활용",
    content: "알리바바에서 소싱할 때 사기를 피하려면 어떤 점을 확인해야 할까요? 믿을 수 있는 판매자 찾는 팁이 있나요?",
    author: "이도현",
    authorImage: "/images/instructor-2.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.16",
    likes: 5,
    lectureOrder: 3,
    replies: [],
  },
  {
    id: "q11",
    courseId: courses[0].id,
    course: courses[0],
    lectureTitle: "Section 3. AI 자동화 시스템 구축 > AI 콘텐츠 자동 생성 파이프라인",
    content: "Make에서 시나리오를 실행하면 중간에 에러가 발생합니다. 에러 로그를 어떻게 확인하고 해결해야 할까요?",
    author: "김���민",
    authorImage: "/images/instructor-1.jpg",
    isMyQuestion: true,
    createdAt: "2026.02.15",
    likes: 2,
    lectureOrder: 9,
    replies: [],
  },
  {
    id: "q12",
    courseId: courses[1].id,
    course: courses[1],
    lectureTitle: "Section 1. 주식 투자 기초 > 주식 시장의 이해",
    content: "미국 주식 투자를 시작하려고 하는데, 한국 주식과 비교했을 때 어떤 점을 주의해야 할까요?",
    author: "송민재",
    authorImage: "/images/instructor-3.jpg",
    isMyQuestion: false,
    createdAt: "2026.02.14",
    likes: 4,
    lectureOrder: 1,
    replies: [],
  },
]

const ITEMS_PER_PAGE = 10

export default function QnAPage() {
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [questionFilter, setQuestionFilter] = useState<"all" | "my">("all")
  const [sortBy, setSortBy] = useState<"latest" | "lecture" | "replies">("latest")
  const [currentPage, setCurrentPage] = useState(1)
  // 첫 번째 질문은 답글이 열린 상태로 시작
  const [expandedReplies, setExpandedReplies] = useState<string[]>(["q1"])
  // 첫 번째 질문은 답글 입력창이 열린 상태로 시작
  const [replyInputOpen, setReplyInputOpen] = useState<string[]>(["q1"])
  const [replyText, setReplyText] = useState("")

  const toggleReplies = (questionId: string) => {
    setExpandedReplies((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
  }

  const toggleReplyInput = (questionId: string) => {
    setReplyInputOpen((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
    // 답글 입력창을 열 때 답글 목록도 함께 열기
    if (!expandedReplies.includes(questionId)) {
      setExpandedReplies((prev) => [...prev, questionId])
    }
  }

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
        case "replies":
          return b.replies.length - a.replies.length
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
    setSortBy(value as "latest" | "lecture" | "replies")
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
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">강좌명 :</span>
          <Select value={selectedCourse} onValueChange={handleCourseChange}>
            <SelectTrigger className="w-full max-w-2xl">
              <SelectValue placeholder="강좌를 선택하세요" />
            </SelectTrigger>
            <SelectContent className="max-w-2xl">
              {myCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 정렬 옵션 + 전체 질문 / 내 질문 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 정렬 옵션 - 왼쪽 정렬 */}
          <div className="flex items-center gap-4">
            {[
              { value: "latest", label: "최신순" },
              { value: "lecture", label: "강의 목차 순" },
              { value: "replies", label: "답변 많은 순" },
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

          {/* 전체 질문 | 내 질문 - 우측 정렬 */}
          <div className="inline-flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                questionFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              전체 질문
            </button>
            <button
              onClick={() => handleFilterChange("my")}
              className={`px-4 py-2 text-sm font-medium transition-all border-l border-border ${
                questionFilter === "my"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              내 질문
            </button>
          </div>
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
            <div
              key={question.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              {/* 강좌 & 강의 정보 */}
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-2 py-0.5 font-medium">
                  {question.course.title.length > 30 
                    ? question.course.title.substring(0, 30) + "..." 
                    : question.course.title}
                </span>
                <span className="text-muted-foreground/50">|</span>
                <span>{question.lectureTitle}</span>
              </div>

              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={question.authorImage} />
                  <AvatarFallback>{question.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{question.author}</span>
                    {question.isMyQuestion && (
                      <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">
                        내 질문
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{question.createdAt}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground">{question.content}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {question.likes}
                    </button>
                    <button 
                      onClick={() => toggleReplies(question.id)}
                      className={`flex items-center gap-1 text-xs hover:text-foreground ${
                        expandedReplies.includes(question.id) ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      답글 {question.replies.length}
                      {question.replies.length > 0 && (
                        expandedReplies.includes(question.id) 
                          ? <ChevronUp className="h-3.5 w-3.5" />
                          : <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-4 h-7 px-3 text-xs"
                      onClick={() => toggleReplyInput(question.id)}
                    >
                      답글 등록
                    </Button>
                  </div>

                  {/* 답글 입력창 및 답글 목록 */}
                  {expandedReplies.includes(question.id) && (
                    <div className="mt-4 space-y-4 border-l-2 border-border pl-4">
                      {/* 답글 입력창 */}
                      {replyInputOpen.includes(question.id) && (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="답글을 입력하세요..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[80px] text-sm"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyInputOpen((prev) => prev.filter((id) => id !== question.id))
                                setReplyText("")
                              }}
                            >
                              취소
                            </Button>
                            <Button size="sm">등록</Button>
                          </div>
                        </div>
                      )}

                      {/* 기존 답글 목록 */}
                      {question.replies.length > 0 && (
                        <div className="space-y-3">
                          {question.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={reply.authorImage} />
                                <AvatarFallback>{reply.author[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-foreground">{reply.author}</span>
                                  {reply.isInstructor && (
                                    <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">
                                      강사
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">{reply.date}</span>
                                </div>
                                <p className="mt-1 text-sm text-foreground">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
