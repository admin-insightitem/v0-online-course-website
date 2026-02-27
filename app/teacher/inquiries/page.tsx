"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  HelpCircle,
  Send,
  Clock,
  CheckCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
} from "lucide-react"

// 강의별 Q&A 데이터 (본인 강의만)
const qnaData = [
  {
    id: "QNA-001",
    title: "프롬프트 템플릿 파일은 어디서 다운받나요?",
    content: "강의에서 말씀하신 프롬프트 템플릿 파일을 찾을 수 없습니다.",
    author: "한소희",
    course: "ChatGPT & AI 자동화",
    lecture: "Section 2. Lecture 3",
    status: "pending",
    createdAt: "2026.02.27 15:20",
    likes: 3,
    replyCount: 0,
    replies: [],
  },
  {
    id: "QNA-002",
    title: "Zapier 무료 플랜으로도 실습 가능한가요?",
    content: "Zapier 무료 플랜의 제한이 있는 것 같은데, 실습이 가능할까요?",
    author: "정태호",
    course: "ChatGPT & AI 자동화",
    lecture: "Section 3. Lecture 1",
    status: "completed",
    createdAt: "2026.02.26 13:40",
    likes: 5,
    replyCount: 1,
    replies: [
      {
        id: "R-001",
        author: "김도현",
        isInstructor: true,
        content: "네, 무료 플랜으로도 기본 실습은 가능합니다. 다만 자동화 횟수에 제한이 있어요.",
        createdAt: "2026.02.26 14:15",
        likes: 3,
      },
    ],
  },
  {
    id: "QNA-003",
    title: "API 키 발급 방법이 변경되었나요?",
    content: "강의와 다르게 OpenAI 대시보드 UI가 변경된 것 같습니다.",
    author: "김민수",
    course: "ChatGPT & AI 자동화",
    lecture: "Section 1. Lecture 5",
    status: "pending",
    createdAt: "2026.02.27 09:10",
    likes: 2,
    replyCount: 0,
    replies: [],
  },
  {
    id: "QNA-004",
    title: "수익화 전략 중 가장 추천하는 방법은?",
    content: "여러 수익화 방법 중 초보자에게 가장 추천하시는 방법이 무엇인가요?",
    author: "이지훈",
    course: "AI 비즈니스 심화",
    lecture: "Section 2. Lecture 1",
    status: "completed",
    createdAt: "2026.02.26 18:30",
    likes: 8,
    replyCount: 2,
    replies: [
      {
        id: "R-002",
        author: "박서연",
        isInstructor: false,
        content: "저도 같은 궁금증이 있어요. 블로그 수익화가 제일 쉬울 것 같은데...",
        createdAt: "2026.02.26 19:00",
        likes: 2,
      },
      {
        id: "R-003",
        author: "김도현",
        isInstructor: true,
        content: "초보자분들께는 AI 콘텐츠 제작부터 시작하시는 것을 추천드립니다. 진입 장벽이 낮고 빠르게 결과를 볼 수 있어요.",
        createdAt: "2026.02.26 20:30",
        likes: 5,
      },
    ],
  },
]

type SortField = "createdAt" | "title" | "author" | "course" | "lecture" | "status"
type SortDirection = "asc" | "desc"

export default function TeacherInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [selectedQna, setSelectedQna] = useState<typeof qnaData[0] | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const itemsPerPage = 30

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
    setCurrentPage(1)
  }

  const filteredQna = qnaData.filter((qna) => {
    const matchesSearch =
      qna.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qna.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || qna.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedQna = [...filteredQna].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "createdAt":
        comparison = a.createdAt.localeCompare(b.createdAt)
        break
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "author":
        comparison = a.author.localeCompare(b.author)
        break
      case "course":
        comparison = a.course.localeCompare(b.course)
        break
      case "lecture":
        comparison = a.lecture.localeCompare(b.lecture)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(sortedQna.length / itemsPerPage)
  const paginatedQna = sortedQna.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {label}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="ml-1 h-3 w-3" />
        ) : (
          <ArrowDown className="ml-1 h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  )

  const pendingQna = qnaData.filter((q) => q.status === "pending").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="mr-1 h-3 w-3" />
            {"대기중"}
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            {"완료"}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const openQnaReplyDialog = (qna: typeof qnaData[0]) => {
    setSelectedQna(qna)
    setReplyContent(qna.reply || "")
    setIsReplyDialogOpen(true)
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{"강의별 Q&A"}</h2>
            <p className="text-muted-foreground">{"수강생들의 질문에 답변합니다."}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <HelpCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingQna}</p>
                  <p className="text-sm text-muted-foreground">미답변 Q&A</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {qnaData.filter((q) => q.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">답변 완료</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Q&A Section */}
        <Card>
          <CardHeader>
            <CardTitle>{"강의 Q&A"}</CardTitle>
            <CardDescription>{"총 "}{sortedQna.length}{"건의 질문"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">{"강사 답변"}</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{"전체"}</SelectItem>
                    <SelectItem value="pending">{"대기중"}</SelectItem>
                    <SelectItem value="completed">{"완료"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="제목 또는 작성자로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">{"No."}</TableHead>
                  <TableHead><SortButton field="createdAt" label="작성일" /></TableHead>
                  <TableHead><SortButton field="title" label="제목" /></TableHead>
                  <TableHead><SortButton field="author" label="작성자" /></TableHead>
                  <TableHead><SortButton field="course" label="강좌" /></TableHead>
                  <TableHead><SortButton field="lecture" label="강의" /></TableHead>
                  <TableHead className="text-center">{"답변 개수"}</TableHead>
                  <TableHead className="text-center"><SortButton field="status" label="강사 답변" /></TableHead>
                  <TableHead className="text-center">{"액션"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQna.map((qna, index) => (
                  <TableRow key={qna.id}>
                    <TableCell className="text-center font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{qna.createdAt}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{qna.title}</TableCell>
                    <TableCell>{qna.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {qna.course.length > 15 ? qna.course.substring(0, 15) + "..." : qna.course}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{qna.lecture}</TableCell>
                    <TableCell className="text-center">{qna.replyCount}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(qna.status)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openQnaReplyDialog(qna)}
                      >
                        <Send className="mr-1 h-4 w-4" />
                        {qna.status === "completed" ? "답변 보기" : "답변하기"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {sortedQna.length}{"개 중 "}{(currentPage - 1) * itemsPerPage + 1}{"-"}{Math.min(currentPage * itemsPerPage, sortedQna.length)}{"개 표시"}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {"이전"}
                  </Button>
                  <span className="text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {"다음"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Q&A Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{"Q&A 답변"}</DialogTitle>
              <DialogDescription>
                {"수강생의 질문에 답변합니다."}
              </DialogDescription>
            </DialogHeader>
            {selectedQna && (
              <div className="space-y-4">
                {/* 질문 영역 */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedQna.course}</Badge>
                      <span className="text-sm text-muted-foreground">{selectedQna.lecture}</span>
                    </div>
                    {getStatusBadge(selectedQna.status)}
                  </div>
                  <div className="flex items-start gap-3 mt-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">{selectedQna.author.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{selectedQna.author}</span>
                        <span className="text-xs text-muted-foreground">{selectedQna.createdAt}</span>
                      </div>
                      <h4 className="font-medium mb-2">{selectedQna.title}</h4>
                      <p className="text-sm text-muted-foreground">{selectedQna.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => toggleLike(`qna-${selectedQna.id}`, selectedQna.likes)}
                          className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-all duration-200 ${
                            isLiked(`qna-${selectedQna.id}`)
                              ? "border border-accent bg-accent/10 text-accent"
                              : "text-muted-foreground hover:text-accent"
                          }`}
                        >
                          <ThumbsUp 
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isLiked(`qna-${selectedQna.id}`) ? "scale-110 fill-current" : ""
                            }`} 
                          />
                          <span className={`transition-all duration-200 ${
                            isLiked(`qna-${selectedQna.id}`) ? "font-medium" : ""
                          }`}>
                            {getLikeCount(`qna-${selectedQna.id}`, selectedQna.likes)}
                          </span>
                        </button>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span>{"답글 "}{selectedQna.replyCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 답변 입력 영역 */}
                <div className="space-y-2">
                  <Label htmlFor="qnaReply">{"답변 내용"}</Label>
                  <Textarea
                    id="qnaReply"
                    placeholder="답글을 입력하세요..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setReplyContent("")}>
                      {"취소"}
                    </Button>
                    <Button size="sm" onClick={() => setIsReplyDialogOpen(false)}>
                      {"등록"}
                    </Button>
                  </div>
                </div>

                {/* 기존 답변 목록 */}
                {selectedQna.replies && selectedQna.replies.length > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    {selectedQna.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 pl-4 border-l-2 border-muted">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium">{reply.author.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{reply.author}</span>
                            {reply.isInstructor && (
                              <Badge variant="secondary" className="text-xs h-5">{"강사"}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                          <button
                            onClick={() => toggleLike(`reply-${reply.id}`, reply.likes)}
                            className={`flex items-center gap-1.5 mt-2 text-sm px-2 py-1 rounded-md transition-all duration-200 ${
                              isLiked(`reply-${reply.id}`)
                                ? "border border-accent bg-accent/10 text-accent"
                                : "text-muted-foreground hover:text-accent"
                            }`}
                          >
                            <ThumbsUp 
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isLiked(`reply-${reply.id}`) ? "scale-110 fill-current" : ""
                              }`} 
                            />
                            <span className={`transition-all duration-200 ${
                              isLiked(`reply-${reply.id}`) ? "font-medium" : ""
                            }`}>
                              {getLikeCount(`reply-${reply.id}`, reply.likes)}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                {"닫기"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  )
}
