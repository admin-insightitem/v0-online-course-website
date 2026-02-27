"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MessageSquare,
  FileText,
  HelpCircle,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Pin,
} from "lucide-react"

// 공지사항 데이터 (강사 본인 강의용)
const noticesData = [
  {
    id: "1",
    title: "[필독] AI 자동화 강의 보충 자료 업데이트 안내",
    content: "Section 3의 보충 자료가 업데이트되었습니다. 강의 자료 탭에서 확인해주세요.",
    isPinned: true,
    isPublished: true,
    views: 1240,
    createdAt: "2026.02.20",
    course: "ChatGPT & AI 자동화",
  },
  {
    id: "2",
    title: "실시간 Q&A 세션 안내 (2/28 저녁 8시)",
    content: "이번 주 토요일 저녁 8시에 실시간 Q&A 세션을 진행합니다. Zoom 링크는 추후 공지드립니다.",
    isPinned: true,
    isPublished: true,
    views: 856,
    createdAt: "2026.02.25",
    course: "ChatGPT & AI 자동화",
  },
  {
    id: "3",
    title: "AI 비즈니스 심화 과정 오픈 안내",
    content: "기존 수강생 대상 40% 할인 이벤트 진행 중입니다!",
    isPinned: false,
    isPublished: true,
    views: 2100,
    createdAt: "2026.02.01",
    course: "AI 비즈니스 심화",
  },
]

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
    reply: null,
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
    reply: "네, 무료 플랜으로도 기본 실습은 가능합니다. 다만 자동화 횟수에 제한이 있어요.",
    repliedAt: "2026.02.26 14:15",
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
    reply: null,
  },
  {
    id: "QNA-004",
    title: "수익화 전략 중 가장 추천하는 방법은?",
    content: "여러 수익화 방법 중 초보자에게 가장 추천하시는 방법이 무엇인가요?",
    author: "이지훈",
    course: "AI 비즈니스 심화",
    lecture: "Section 2. Lecture 1",
    status: "in-progress",
    createdAt: "2026.02.26 18:30",
    reply: null,
  },
]

export default function TeacherInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [selectedQna, setSelectedQna] = useState<typeof qnaData[0] | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const filteredQna = qnaData.filter((qna) => {
    const matchesSearch =
      qna.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qna.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || qna.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingQna = qnaData.filter((q) => q.status === "pending").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="mr-1 h-3 w-3" />
            대기중
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <AlertCircle className="mr-1 h-3 w-3" />
            처리중
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            완료
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
            <h2 className="text-2xl font-bold tracking-tight">게시판/문의 관리</h2>
            <p className="text-muted-foreground">강의 공지사항과 Q&A를 관리합니다.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{noticesData.length}</p>
                  <p className="text-sm text-muted-foreground">공지사항</p>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {/* Tabs */}
        <Tabs defaultValue="qna" className="space-y-4">
          <TabsList>
            <TabsTrigger value="qna" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              강의 Q&A
              {pendingQna > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pendingQna}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              공지사항
            </TabsTrigger>
          </TabsList>

          {/* Q&A Tab */}
          <TabsContent value="qna" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="제목 또는 작성자로 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="pending">대기중</SelectItem>
                        <SelectItem value="in-progress">처리중</SelectItem>
                        <SelectItem value="completed">완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>강의 Q&A</CardTitle>
                <CardDescription>총 {filteredQna.length}건의 질문</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>강좌</TableHead>
                      <TableHead>강의</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead className="text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQna.map((qna) => (
                      <TableRow key={qna.id}>
                        <TableCell className="font-mono text-sm">{qna.id}</TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{qna.title}</TableCell>
                        <TableCell>{qna.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {qna.course.length > 15 ? qna.course.substring(0, 15) + "..." : qna.course}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{qna.lecture}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(qna.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{qna.createdAt}</TableCell>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notices Tab */}
          <TabsContent value="notices" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isNoticeDialogOpen} onOpenChange={setIsNoticeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    공지사항 작성
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>공지사항 작성</DialogTitle>
                    <DialogDescription>
                      강의 수강생에게 전달할 공지사항을 작성합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="noticeCourse">대상 강좌</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="강좌 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체 강좌</SelectItem>
                          <SelectItem value="chatgpt">ChatGPT & AI 자동화</SelectItem>
                          <SelectItem value="ai-business">AI 비즈니스 심화</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="noticeTitle">제목</Label>
                      <Input id="noticeTitle" placeholder="공지사항 제목을 입력하세요" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="noticeContent">내용</Label>
                      <Textarea
                        id="noticeContent"
                        placeholder="공지사항 내용을 입력하세요"
                        rows={8}
                      />
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Switch id="isPinned" />
                        <Label htmlFor="isPinned">상단 고정</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="isPublished" defaultChecked />
                        <Label htmlFor="isPublished">즉시 게시</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNoticeDialogOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={() => setIsNoticeDialogOpen(false)}>등록</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>공지사항 목록</CardTitle>
                <CardDescription>총 {noticesData.length}개의 공지사항</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">고정</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>대상 강좌</TableHead>
                      <TableHead className="text-center">조회수</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead className="text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {noticesData.map((notice) => (
                      <TableRow key={notice.id}>
                        <TableCell>
                          {notice.isPinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{notice.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{notice.course}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{notice.views.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={notice.isPublished ? "default" : "secondary"}>
                            {notice.isPublished ? "게시중" : "비공개"}
                          </Badge>
                        </TableCell>
                        <TableCell>{notice.createdAt}</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                미리보기
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                수정
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Q&A Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Q&A 답변</DialogTitle>
              <DialogDescription>
                수강생의 질문에 답변합니다.
              </DialogDescription>
            </DialogHeader>
            {selectedQna && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedQna.course}</Badge>
                      <span className="text-sm text-muted-foreground">{selectedQna.lecture}</span>
                    </div>
                    {getStatusBadge(selectedQna.status)}
                  </div>
                  <h4 className="font-medium mb-2">{selectedQna.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedQna.content}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedQna.author} · {selectedQna.createdAt}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qnaReply">답변 내용</Label>
                  <Textarea
                    id="qnaReply"
                    placeholder="답변을 입력하세요"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={6}
                    disabled={selectedQna.status === "completed"}
                  />
                </div>

                {selectedQna.reply && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium mb-1">기존 답변</p>
                    <p className="text-sm">{selectedQna.reply}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      답변일: {selectedQna.repliedAt}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                취소
              </Button>
              {selectedQna?.status !== "completed" && (
                <Button onClick={() => setIsReplyDialogOpen(false)}>
                  <Send className="mr-2 h-4 w-4" />
                  답변 등록
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  )
}
