"use client"

import { useState, use } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronDown, ChevronUp, PlayCircle, CheckCircle, Lock, Clock, Download, FileText, Code, MessageSquare, ThumbsUp, Send, ArrowLeft, Star, X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { getCourseById } from "@/lib/courses"

// Mock data for lecture materials
const lectureMaterials = {
  pdf: { name: "강의 노트.pdf", size: "2.4 MB" },
  source: { name: "소스코드.zip", size: "1.8 MB" },
}

// Mock Q&A data
const mockQuestions = [
  {
    id: 1,
    author: "김수현",
    authorImage: "/images/instructor-1.jpg",
    date: "2026.02.25",
    content: "강의 중간에 나온 API 호출 예시에서 에러가 발생하는데, 해결 방법이 있을까요?",
    likes: 5,
    isMyQuestion: false,
    replies: [
      {
        id: 1,
        author: "김도현 (강사)",
        authorImage: "/images/instructor-1.jpg",
        date: "2026.02.25",
        content: "네, API 키 설정이 제대로 되어있는지 확인해주세요. 환경변수에 OPENAI_API_KEY가 설정되어 있어야 합니다.",
        isInstructor: true,
        isMyReply: false,
        likes: 3,
      },
    ],
  },
  {
    id: 2,
    author: "이지은",
    authorImage: "/images/instructor-2.jpg",
    date: "2026.02.24",
    content: "프롬프트 템플릿 파일은 어디서 다운로드 받을 수 있나요?",
    likes: 3,
    isMyQuestion: true,
    replies: [
      {
        id: 2,
        author: "김도현 (강사)",
        authorImage: "/images/instructor-1.jpg",
        date: "2026.02.24",
        content: "강의자료 탭에서 다운로드 가능합니다. PDF 파일에 템플릿이 포함되어 있어요.",
        isInstructor: true,
        isMyReply: true,
        likes: 5,
      },
      {
        id: 3,
        author: "박민수",
        authorImage: "/images/instructor-3.jpg",
        date: "2026.02.24",
        content: "저도 같은 질문 있었는데, 강의자료에서 찾았습니다!",
        isInstructor: false,
        isMyReply: true,
        likes: 2,
      },
    ],
  },
]

export default function WatchPage({ params }: { params: Promise<{ id: string; lectureId: string }> }) {
  const { id, lectureId } = use(params)
  const course = getCourseById(id)
  
  const [openSections, setOpenSections] = useState<number[]>([0, 1, 2, 3])
  const [activeTab, setActiveTab] = useState<"materials" | "qna" | null>("materials")
  const [newQuestion, setNewQuestion] = useState("")
  const [questions, setQuestions] = useState(mockQuestions)
  const [qnaFilter, setQnaFilter] = useState<"all" | "my">("all")
  
  // Q&A 토글 및 수정 상태
  const [expandedReplies, setExpandedReplies] = useState<number[]>([1, 2])
  const [replyInputOpen, setReplyInputOpen] = useState<number[]>([1])
  const [replyText, setReplyText] = useState("")
  const [editingReplyId, setEditingReplyId] = useState<number | null>(3)
  const [editReplyText, setEditReplyText] = useState("저도 같은 질문 있었는데, 강의자료에서 찾았습니다!")
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)
  const [editQuestionText, setEditQuestionText] = useState("")
  
  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHoverRating, setReviewHoverRating] = useState(0)
  const [reviewContent, setReviewContent] = useState("")
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  
  // Like state
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})

  const toggleLike = (itemId: string, originalLikes: number) => {
    const isCurrentlyLiked = likedItems.has(itemId)
    const newLikedItems = new Set(likedItems)
    const currentCount = likeCounts[itemId] ?? originalLikes

    if (isCurrentlyLiked) {
      newLikedItems.delete(itemId)
      setLikeCounts({ ...likeCounts, [itemId]: currentCount - 1 })
    } else {
      newLikedItems.add(itemId)
      setLikeCounts({ ...likeCounts, [itemId]: currentCount + 1 })
    }
    setLikedItems(newLikedItems)
  }

  const getLikeCount = (itemId: string, originalLikes: number) => {
    return likeCounts[itemId] ?? originalLikes
  }

  const isLiked = (itemId: string) => likedItems.has(itemId)

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">강의를 찾을 수 없습니다.</p>
      </div>
    )
  }

  // Find current lecture info
  let currentLectureIndex = 0
  let currentSectionIndex = 0
  let lectureCounter = 0
  let currentLesson = course.curriculum[0]?.lessons[0]

  for (let sIdx = 0; sIdx < course.curriculum.length; sIdx++) {
    for (let lIdx = 0; lIdx < course.curriculum[sIdx].lessons.length; lIdx++) {
      lectureCounter++
      if (`lecture-${lectureCounter}` === lectureId) {
        currentSectionIndex = sIdx
        currentLectureIndex = lIdx
        currentLesson = course.curriculum[sIdx].lessons[lIdx]
        break
      }
    }
  }

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const toggleReplies = (questionId: number) => {
    setExpandedReplies((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
  }

  const toggleReplyInput = (questionId: number) => {
    setReplyInputOpen((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
    if (!expandedReplies.includes(questionId)) {
      setExpandedReplies((prev) => [...prev, questionId])
    }
  }

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return
    
    const newQ = {
      id: questions.length + 1,
      author: "나",
      authorImage: "/images/instructor-1.jpg",
      date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(".", ""),
      content: newQuestion,
      likes: 0,
      replies: [],
    }
    setQuestions([newQ, ...questions])
    setNewQuestion("")
  }

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewContent.trim()) return
    
    // Here you would submit to the backend
    setIsReviewModalOpen(false)
    setShowThankYouModal(true)
    
    // Reset form
    setReviewRating(0)
    setReviewContent("")
  }

  // Calculate lecture number for navigation
  let lectureNum = 0
  const allLectures: { sectionIndex: number; lessonIndex: number; lectureId: string; title: string }[] = []
  
  course.curriculum.forEach((section, sIdx) => {
    section.lessons.forEach((lesson, lIdx) => {
      lectureNum++
      allLectures.push({
        sectionIndex: sIdx,
        lessonIndex: lIdx,
        lectureId: `lecture-${lectureNum}`,
        title: lesson.title,
      })
    })
  })

  const currentLectureGlobalIndex = allLectures.findIndex(l => l.lectureId === lectureId)
  const prevLecture = currentLectureGlobalIndex > 0 ? allLectures[currentLectureGlobalIndex - 1] : null
  const nextLecture = currentLectureGlobalIndex < allLectures.length - 1 ? allLectures[currentLectureGlobalIndex + 1] : null

  // Calculate completed lectures (mock: lectures before current are completed)
  const completedLecturesCount = currentLectureGlobalIndex
  const progressPercent = Math.round((completedLecturesCount / allLectures.length) * 100)

  // Calculate section duration
  const getSectionDuration = (sectionIndex: number) => {
    const section = course.curriculum[sectionIndex]
    let totalMinutes = 0
    section.lessons.forEach(lesson => {
      const parts = lesson.duration.split(":")
      if (parts.length === 2) {
        totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1])
      } else if (parts.length === 1) {
        totalMinutes += parseInt(parts[0])
      }
    })
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href={`/courses/${id}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">강의 상세</span>
            </Link>
            <span className="text-border">|</span>
            <h1 className="line-clamp-1 text-sm font-medium text-foreground">{course.title}</h1>
          </div>
          <Link href="/mypage">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              내 강의실
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player - Maximized to fill viewport minus header and tab bar */}
          <div className="relative w-full bg-foreground" style={{ height: 'calc(100vh - 3.5rem - 45px)' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-background">
                <PlayCircle className="mx-auto h-16 w-16 opacity-80" />
                <p className="mt-4 text-lg font-medium">{currentLesson?.title}</p>
                <p className="mt-1 text-sm opacity-70">{currentLesson?.duration}</p>
              </div>
            </div>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {prevLecture && (
                    <Link href={`/courses/${id}/watch/${prevLecture.lectureId}`}>
                      <Button variant="ghost" size="sm" className="text-background hover:bg-white/20">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        이전
                      </Button>
                    </Link>
                  )}
                  {nextLecture && (
                    <Link href={`/courses/${id}/watch/${nextLecture.lectureId}`}>
                      <Button variant="ghost" size="sm" className="text-background hover:bg-white/20">
                        다음
                        <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
                      </Button>
                    </Link>
                  )}
                </div>
                <span className="text-sm text-background/80">
                  {currentLectureGlobalIndex + 1} / {allLectures.length}
                </span>
              </div>
            </div>
          </div>

          {/* Content Tabs - Minimal tab bar like reference */}
          <div className="border-t border-border bg-card">
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setActiveTab(activeTab === "materials" ? null : "materials")}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "materials"
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                강의자료
                {activeTab === "materials" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
              <button
                onClick={() => setActiveTab(activeTab === "qna" ? null : "qna")}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "qna"
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Q&A ({questions.length})
                {activeTab === "qna" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content - Collapsible, appears as overlay or below */}
          {activeTab && <div className="border-t border-border bg-background p-4 lg:p-6">
            {activeTab === "materials" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">학습 자료 다운로드</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* PDF Download */}
                  <button className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-secondary">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{lectureMaterials.pdf.name}</p>
                      <p className="text-xs text-muted-foreground">{lectureMaterials.pdf.size}</p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {/* Source Code Download */}
                  <button className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-secondary">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Code className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{lectureMaterials.source.name}</p>
                      <p className="text-xs text-muted-foreground">{lectureMaterials.source.size}</p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "qna" && (
              <div className="space-y-6">
                {/* Ask Question */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">질문하기</h3>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="강의 내용에 대해 궁금한 점을 질문해주세요..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSubmitQuestion}
                        className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                        disabled={!newQuestion.trim()}
                      >
                        <Send className="h-4 w-4" />
                        질문 등록
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Questions List with Filter Tabs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">질문 목록</h3>
                    <div className="flex rounded-lg border border-border bg-secondary/30 p-0.5">
                      <button
                        onClick={() => setQnaFilter("all")}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          qnaFilter === "all"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        전체 질문
                      </button>
                      <button
                        onClick={() => setQnaFilter("my")}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          qnaFilter === "my"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        내 질문
                      </button>
                    </div>
                  </div>
                  {questions
                    .filter((q) => qnaFilter === "all" || q.author === "나" || q.isMyQuestion)
                    .map((question) => (
                    <div key={question.id} className="rounded-lg border border-border bg-card p-4">
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
                            <span className="text-xs text-muted-foreground">{question.date}</span>
                            {question.isMyQuestion && editingQuestionId !== question.id && (
                              <button 
                                onClick={() => {
                                  setEditingQuestionId(question.id)
                                  setEditQuestionText(question.content)
                                }}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-1"
                              >
                                <Pencil className="h-3 w-3" />
                                수정
                              </button>
                            )}
                          </div>
                          {editingQuestionId === question.id ? (
                            <div className="mt-2 space-y-2">
                              <Textarea
                                value={editQuestionText}
                                onChange={(e) => setEditQuestionText(e.target.value)}
                                className="min-h-[80px] text-sm"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingQuestionId(null)}
                                >
                                  취소
                                </Button>
                                <Button size="sm" onClick={() => setEditingQuestionId(null)}>
                                  수정
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm text-foreground">{question.content}</p>
                          )}
                          <div className="mt-3 flex items-center gap-4">
                            <button 
                              type="button"
                              onClick={() => toggleLike(`question-${question.id}`, question.likes)}
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all duration-200 ${
                                isLiked(`question-${question.id}`)
                                  ? "border border-accent bg-accent/10 text-accent"
                                  : "text-muted-foreground hover:text-accent"
                              }`}
                            >
                              <ThumbsUp className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                isLiked(`question-${question.id}`) ? "scale-110 fill-current" : ""
                              }`} />
                              {getLikeCount(`question-${question.id}`, question.likes)}
                            </button>
                            <button 
                              onClick={() => toggleReplies(question.id)}
                              className={`flex items-center gap-1 text-xs hover:text-foreground ${
                                expandedReplies.includes(question.id) ? "text-primary" : "text-muted-foreground"
                              }`}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
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
                              className="ml-2 h-7 px-3 text-xs"
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
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-foreground">{reply.author}</span>
                                          {reply.isInstructor && (
                                            <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent">
                                              강사
                                            </Badge>
                                          )}
                                          <span className="text-xs text-muted-foreground">{reply.date}</span>
                                          {reply.isMyReply && editingReplyId !== reply.id && (
                                            <button 
                                              onClick={() => {
                                                setEditingReplyId(reply.id)
                                                setEditReplyText(reply.content)
                                              }}
                                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-1"
                                            >
                                              <Pencil className="h-3 w-3" />
                                              수정
                                            </button>
                                          )}
                                        </div>
                                        {editingReplyId === reply.id ? (
                                          <div className="mt-2 space-y-2">
                                            <Textarea
                                              value={editReplyText}
                                              onChange={(e) => setEditReplyText(e.target.value)}
                                              className="min-h-[60px] text-sm"
                                            />
                                            <div className="flex justify-end gap-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingReplyId(null)}
                                              >
                                                취소
                                              </Button>
                                              <Button size="sm" onClick={() => setEditingReplyId(null)}>
                                                수정
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="mt-1 text-sm text-foreground">{reply.content}</p>
                                        )}
                                        <div className="mt-2 flex items-center gap-1">
                                          <button 
                                            type="button"
                                            onClick={() => toggleLike(`reply-${question.id}-${reply.id}`, reply.likes)}
                                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all duration-200 ${
                                              isLiked(`reply-${question.id}-${reply.id}`)
                                                ? "border border-accent bg-accent/10 text-accent"
                                                : "text-muted-foreground hover:text-accent"
                                            }`}
                                          >
                                            <ThumbsUp className={`h-3 w-3 transition-transform duration-200 ${
                                              isLiked(`reply-${question.id}-${reply.id}`) ? "scale-110 fill-current" : ""
                                            }`} />
                                            {getLikeCount(`reply-${question.id}-${reply.id}`, reply.likes)}
                                          </button>
                                        </div>
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
                  ))}
                  {qnaFilter === "my" && questions.filter((q) => q.author === "나").length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-8 text-center">
                      <p className="text-sm text-muted-foreground">아직 작성한 질문이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>}
        </div>

        {/* Curriculum Sidebar */}
        <aside className="w-full shrink-0 border-t border-border bg-card lg:w-[380px] lg:border-l lg:border-t-0">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">커리큘럼</h2>
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                >
                  <Star className="h-3.5 w-3.5 fill-accent" />
                  수강평 작성
                </button>
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">{course.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">수강 기한 무제한</p>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <PlayCircle className="h-3.5 w-3.5" />
                    진도율 <span className="font-semibold">{completedLecturesCount}/{allLectures.length}</span>
                  </span>
                  <span className="font-medium text-foreground">{progressPercent}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-green-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              {course.curriculum.map((section, sIdx) => {
                const isOpen = openSections.includes(sIdx)
                let sectionLectureNum = 0
                for (let i = 0; i < sIdx; i++) {
                  sectionLectureNum += course.curriculum[i].lessons.length
                }

                return (
                  <div key={section.title} className={sIdx > 0 ? "border-t border-border" : ""}>
                    <button
                      onClick={() => toggleSection(sIdx)}
                      className="flex w-full items-center justify-between bg-secondary/30 px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                        <span className="text-sm font-medium text-foreground">{section.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{section.lessons.length}강 ({getSectionDuration(sIdx)})</span>
                    </button>

                    {isOpen && (
                      <ul>
                        {section.lessons.map((lesson, lIdx) => {
                          const thisLectureId = `lecture-${sectionLectureNum + lIdx + 1}`
                          const isActive = thisLectureId === lectureId
                          
                          // Demo: Section 1 shows 4 different states
                          // 1st lesson: preview, 2nd: watched, 3rd: not watched, 4th: locked
                          let isPreview = lesson.isFree
                          let isCompleted = false
                          let isNotWatched = false
                          let isLocked = !lesson.isFree
                          
                          if (sIdx === 0) {
                            isPreview = lIdx === 0
                            isCompleted = lIdx === 1
                            isNotWatched = lIdx === 2
                            isLocked = lIdx === 3
                          } else {
                            // Other sections: use original logic
                            isCompleted = sectionLectureNum + lIdx + 1 < currentLectureGlobalIndex + 1
                            isNotWatched = !isCompleted && !isActive && lesson.isFree
                          }

                          // Determine if clickable
                          const isClickable = isPreview || isCompleted || isNotWatched || isActive

                          return (
                            <li key={lesson.title}>
                              {/* 4 states: preview, completed, not watched, locked */}
                              {isClickable ? (
                                <Link
                                  href={`/courses/${id}/watch/${thisLectureId}`}
                                  className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                    isActive 
                                      ? "bg-accent/10 border-l-2 border-accent" 
                                      : "hover:bg-secondary/30"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                                  ) : isActive ? (
                                    <PlayCircle className="h-4 w-4 shrink-0 text-accent" />
                                  ) : (
                                    <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${isActive ? "font-medium text-accent" : isCompleted ? "text-muted-foreground" : "text-foreground"}`}>
                                      {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs text-muted-foreground">
                                        {lesson.duration}
                                      </span>
                                      {isCompleted && (
                                        <span className="text-xs text-green-500">수강완료</span>
                                      )}
                                      {isPreview && !isCompleted && !isActive && (
                                        <Badge variant="secondary" className="text-[10px] text-accent">
                                          미리보기
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              ) : (
                                <div className="flex items-center gap-3 px-4 py-3 opacity-60">
                                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate text-muted-foreground">{lesson.title}</p>
                                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                  </div>
                                </div>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">수강평 작성</h3>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
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
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`h-8 w-8 ${
                          star <= (reviewHoverRating || reviewRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {reviewRating > 0 && (
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {reviewRating === 1 && "별로예요"}
                    {reviewRating === 2 && "그저 그래요"}
                    {reviewRating === 3 && "보통이에요"}
                    {reviewRating === 4 && "좋아요"}
                    {reviewRating === 5 && "최고예요!"}
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
                disabled={reviewRating === 0 || !reviewContent.trim()}
                className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                수강평 등록
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
              수강평을 남겨주셔서 감사합니다.<br />
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
    </div>
  )
}
