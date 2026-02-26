"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
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

// 공지사항 데이터
const noticesData = [
  {
    id: "1",
    title: "[필독] 2026년 환불 정책 변경 안내",
    content: "2026년 3월 1일부터 환불 정책이 변경됩니다. 진도율 30% 미만 전액 환불, 30-50% 50% 환불, 50% 초과 환불 불가로 변경됩니다.",
    isPinned: true,
    isPublished: true,
    views: 2340,
    createdAt: "2026.02.20",
  },
  {
    id: "2",
    title: "설 연휴 고객센터 운영 안내",
    content: "설 연휴 기간 동안 고객센터 운영이 일시 중단됩니다. 긴급 문의는 이메일로 접수해 주세요.",
    isPinned: true,
    isPublished: true,
    views: 1856,
    createdAt: "2026.02.15",
  },
  {
    id: "3",
    title: "신규 강좌 오픈 안내 - AI 비즈니스 심화 과정",
    content: "AI 비즈니스 심화 과정이 3월 1일 오픈 예정입니다. 얼리버드 할인 40% 진행 중!",
    isPinned: false,
    isPublished: true,
    views: 3210,
    createdAt: "2026.02.10",
  },
  {
    id: "4",
    title: "서버 점검 안내 (2/28 새벽 2시-6시)",
    content: "서비스 품질 향상을 위한 서버 점검이 예정되어 있습니다.",
    isPinned: false,
    isPublished: false,
    views: 0,
    createdAt: "2026.02.25",
  },
]

// 1:1 문의 데이터
const inquiriesData = [
  {
    id: "INQ-2026022701",
    title: "결제 오류 문의",
    content: "카드 결제 시 오류가 발생합니다. 확인 부탁드립니다.",
    author: "김경민",
    email: "kyungmin@gmail.com",
    course: null,
    status: "pending",
    priority: "high",
    createdAt: "2026.02.27 14:30",
    reply: null,
  },
  {
    id: "INQ-2026022702",
    title: "강의 자료 다운로드 불가",
    content: "ChatGPT 강의의 PDF 자료가 다운로드되지 않습니다.",
    author: "이수현",
    email: "soohyun@naver.com",
    course: "ChatGPT & AI 자동화",
    status: "in-progress",
    priority: "medium",
    createdAt: "2026.02.27 11:15",
    reply: null,
  },
  {
    id: "INQ-2026022601",
    title: "수료증 발급 문의",
    content: "강의 완료 후 수료증 발급이 가능한가요?",
    author: "박준영",
    email: "junyoung@kakao.com",
    course: "퍼포먼스 마케팅 마스터클래스",
    status: "completed",
    priority: "low",
    createdAt: "2026.02.26 16:45",
    reply: "안녕하세요. 수료증은 강의 완료 후 마이페이지에서 다운로드 가능합니다.",
    repliedAt: "2026.02.26 17:30",
  },
  {
    id: "INQ-2026022602",
    title: "환불 절차 문의",
    content: "환불 신청은 어디서 하나요?",
    author: "최민지",
    email: "minji@gmail.com",
    course: null,
    status: "completed",
    priority: "medium",
    createdAt: "2026.02.26 10:20",
    reply: "마이페이지 > 구매내역에서 환불 신청이 가능합니다.",
    repliedAt: "2026.02.26 11:00",
  },
]

// 강의별 Q&A 데이터
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
    title: "영상 품질이 낮게 나옵니다",
    content: "영상이 480p로만 재생되는데 설정 방법이 있나요?",
    author: "오진우",
    course: "유튜브 수익화 가이드",
    lecture: "Section 1. Lecture 2",
    status: "pending",
    createdAt: "2026.02.27 09:10",
    reply: null,
  },
]

export default function InquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<typeof inquiriesData[0] | null>(null)
  const [selectedQna, setSelectedQna] = useState<typeof qnaData[0] | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const filteredInquiries = inquiriesData.filter((inquiry) => {
    const matchesSearch =
      inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredQna = qnaData.filter((qna) => {
    const matchesSearch =
      qna.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qna.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || qna.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingInquiries = inquiriesData.filter((i) => i.status === "pending").length
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">긴급</Badge>
      case "medium":
        return <Badge variant="secondary">보통</Badge>
      case "low":
        return <Badge variant="outline">낮음</Badge>
      default:
        return null
    }
  }

  const openReplyDialog = (inquiry: typeof inquiriesData[0]) => {
    setSelectedInquiry(inquiry)
    setReplyContent(inquiry.reply || "")
    setIsReplyDialogOpen(true)
  }

  const openQnaReplyDialog = (qna: typeof qnaData[0]) => {
    setSelectedQna(qna)
    setReplyContent(qna.reply || "")
    setIsReplyDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">게시판/문의 관리</h2>
            <p className="text-muted-foreground">공지사항과 고객 문의를 관리합니다.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
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
                  <MessageSquare className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingInquiries}</p>
                  <p className="text-sm text-muted-foreground">1:1 문의 대기</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingQna}</p>
                  <p className="text-sm text-muted-foreground">Q&A 대기</p>
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
                    {inquiriesData.filter((i) => i.status === "completed").length +
                      qnaData.filter((q) => q.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">처리 완료</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              공지사항
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              1:1 문의
              {pendingInquiries > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pendingInquiries}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="qna" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              강의 Q&A
              {pendingQna > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pendingQna}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

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
                      새로운 공지사항을 작성합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
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

          {/* 1:1 Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-4">
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
                <CardTitle>1:1 문의 목록</CardTitle>
                <CardDescription>총 {filteredInquiries.length}건의 문의</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>문의번호</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>관련 강좌</TableHead>
                      <TableHead className="text-center">우선순위</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead className="text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-mono text-sm">{inquiry.id}</TableCell>
                        <TableCell className="font-medium">{inquiry.title}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{inquiry.author}</p>
                            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {inquiry.course ? (
                            <Badge variant="outline">{inquiry.course}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {getPriorityBadge(inquiry.priority)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(inquiry.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {inquiry.createdAt}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReplyDialog(inquiry)}
                          >
                            {inquiry.status === "completed" ? "보기" : "답변"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

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
                        <SelectItem value="completed">완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>강의 Q&A 목록</CardTitle>
                <CardDescription>총 {filteredQna.length}건의 질문</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>질문</TableHead>
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
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {qna.title}
                        </TableCell>
                        <TableCell>{qna.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {qna.course}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {qna.lecture}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(qna.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {qna.createdAt}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openQnaReplyDialog(qna)}
                          >
                            {qna.status === "completed" ? "보기" : "답변"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedInquiry ? "1:1 문의 답변" : "Q&A 답변"}
              </DialogTitle>
              <DialogDescription>
                고객 문의에 답변을 작성합니다.
              </DialogDescription>
            </DialogHeader>
            {(selectedInquiry || selectedQna) && (
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">
                      {selectedInquiry?.title || selectedQna?.title}
                    </span>
                    {selectedInquiry && getStatusBadge(selectedInquiry.status)}
                    {selectedQna && getStatusBadge(selectedQna.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedInquiry?.content || selectedQna?.content}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>작성자: {selectedInquiry?.author || selectedQna?.author}</span>
                    <span>
                      작성일: {selectedInquiry?.createdAt || selectedQna?.createdAt}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reply">답변 내용</Label>
                  <Textarea
                    id="reply"
                    placeholder="답변 내용을 입력하세요"
                    rows={6}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={() => setIsReplyDialogOpen(false)}>
                <Send className="mr-2 h-4 w-4" />
                답변 등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
