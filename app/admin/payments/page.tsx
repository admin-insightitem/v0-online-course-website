"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Filter,
  CreditCard,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// 결제 데이터
const paymentsData = [
  {
    id: "PAY-2026022701",
    studentName: "김경민",
    email: "kyungmin@gmail.com",
    courses: ["ChatGPT & AI 자동화", "유튜브 수익화 가이드"],
    amount: 149000,
    couponDiscount: 10000,
    paymentMethod: "카드",
    cardInfo: "신한카드 **** 1234",
    status: "completed",
    date: "2026.02.27 14:32",
    refundDate: "",
  },
  {
    id: "PAY-2026022702",
    studentName: "이수현",
    email: "soohyun@naver.com",
    courses: ["유튜브 수익화 가이드"],
    amount: 129000,
    couponDiscount: 0,
    paymentMethod: "카카오페이",
    cardInfo: "",
    status: "refunded",
    date: "2026.02.27 13:15",
    refundDate: "2026.02.27 16:45",
  },
  {
    id: "PAY-2026022703",
    studentName: "박준영",
    email: "junyoung@kakao.com",
    courses: ["퍼포먼스 마케팅 마스터클래스"],
    amount: 169000,
    couponDiscount: 0,
    paymentMethod: "카드",
    cardInfo: "삼성카드 **** 5678",
    status: "completed",
    date: "2026.02.27 11:45",
    refundDate: "",
  },
  {
    id: "PAY-2026022601",
    studentName: "최민지",
    email: "minji@gmail.com",
    courses: ["프리미어 프로 & 포토샵"],
    amount: 139000,
    couponDiscount: 5000,
    paymentMethod: "네이버페이",
    cardInfo: "",
    status: "completed",
    date: "2026.02.26 16:20",
    refundDate: "",
  },
  {
    id: "PAY-2026022602",
    studentName: "정태호",
    email: "taeho@naver.com",
    courses: ["스마트스토어 + 쿠팡"],
    amount: 159000,
    couponDiscount: 0,
    paymentMethod: "카드",
    cardInfo: "현대카드 **** 9012",
    status: "completed",
    date: "2026.02.26 10:08",
    refundDate: "",
  },
]

// 환불 요청 데이터
const refundsData = [
  {
    id: "REF-2026022701",
    paymentId: "PAY-2026022001",
    studentName: "한소희",
    email: "sohee@gmail.com",
    course: "ChatGPT & AI 자동화",
    amount: 149000,
    refundAmount: 149000,
    reason: "개인 사정으로 인한 환불 요청",
    inquiryTitle: "[환불 요청] ChatGPT & AI 자동화 강좌 환불 문의드립니다",
    inquiryContent: "안녕하세요. 개인 사정으로 인해 더 이상 강의를 수강하기 어려워졌습니다. 아직 강의를 거의 듣지 못했는데, 환불 처리가 가능할까요? 빠른 답변 부탁드립니다.",
    status: "pending",
    requestDate: "2026.02.27 09:30",
    progress: 5,
  },
  {
    id: "REF-2026022601",
    paymentId: "PAY-2026021501",
    studentName: "오진우",
    email: "jinwoo@naver.com",
    course: "유튜브 수익화 가이드",
    amount: 129000,
    refundAmount: 103200,
    reason: "강의 내용이 기대와 다름",
    inquiryTitle: "[환불 요청] 유튜브 수익화 가이드 환불 부탁드립니다",
    inquiryContent: "강의 설명과 실제 내용이 다른 것 같습니다. 초보자를 위한 가이드라고 했는데, 너무 기초적인 내용만 다루고 있어 기대와 많이 달랐습니다. 환불 요청드립니다.",
    status: "pending",
    requestDate: "2026.02.26 15:20",
    progress: 20,
  },
  {
    id: "REF-2026022501",
    paymentId: "PAY-2026020101",
    studentName: "송예진",
    email: "yejin@kakao.com",
    course: "퍼포먼스 마케팅 마스터클래스",
    amount: 169000,
    refundAmount: 169000,
    reason: "중복 결제",
    inquiryTitle: "[환불 요청] 중복 결제되어 환불 요청합니다",
    inquiryContent: "결제 오류로 인해 같은 강좌가 두 번 결제되었습니다. 한 건에 대해 환불 처리 부탁드립니다.",
    status: "approved",
    requestDate: "2026.02.25 11:45",
    processedDate: "2026.02.25 14:30",
    progress: 0,
  },
  {
    id: "REF-2026022401",
    paymentId: "PAY-2026021001",
    studentName: "강민수",
    email: "minsu@gmail.com",
    course: "스마트스토어 + 쿠팡",
    amount: 159000,
    refundAmount: 0,
    reason: "진도율 50% 초과로 환불 불가 요청",
    inquiryTitle: "[환불 요청] 스마트스토어 + 쿠팡 강좌 환불 문의",
    inquiryContent: "강의를 듣다가 개인 사정으로 더 이상 수강이 어렵게 되었습니다. 환불이 가능할지 문의드립니다.",
    status: "rejected",
    requestDate: "2026.02.24 16:00",
    processedDate: "2026.02.24 17:45",
    progress: 55,
  },
]

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRefund, setSelectedRefund] = useState<typeof refundsData[0] | null>(null)
  const [isRefundDetailOpen, setIsRefundDetailOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [approveReply, setApproveReply] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [dateRangeType, setDateRangeType] = useState<"all" | "week" | "month" | "3months" | "custom">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [refundCurrentPage, setRefundCurrentPage] = useState(1)
  const itemsPerPage = 30

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const setDateRange = (range: "all" | "week" | "month" | "3months") => {
    setDateRangeType(range)
    
    if (range === "all") {
      setStartDate("")
      setEndDate("")
      return
    }

    const today = new Date()
    const end = formatDate(today)
    let start: Date

    switch (range) {
      case "week":
        start = new Date(today)
        start.setDate(today.getDate() - 6)
        break
      case "month":
        start = new Date(today)
        start.setMonth(today.getMonth() - 1)
        start.setDate(start.getDate() + 1)
        break
      case "3months":
        start = new Date(today)
        start.setMonth(today.getMonth() - 3)
        start.setDate(start.getDate() + 1)
        break
    }

    setStartDate(formatDate(start))
    setEndDate(end)
  }

  const handleDateInputChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
    setDateRangeType("custom")
  }

  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // 페이징 계산
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const filteredRefunds = refundsData.filter((refund) => {
    const matchesSearch =
      refund.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || refund.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 환불 페이징 계산
  const refundTotalPages = Math.ceil(filteredRefunds.length / itemsPerPage)
  const paginatedRefunds = filteredRefunds.slice(
    (refundCurrentPage - 1) * itemsPerPage,
    refundCurrentPage * itemsPerPage
  )

  const pendingRefunds = refundsData.filter((r) => r.status === "pending").length
  const totalRefundAmount = refundsData
    .filter((r) => r.status === "approved")
    .reduce((acc, r) => acc + r.refundAmount, 0)

  const openRefundDetail = (refund: typeof refundsData[0]) => {
    setSelectedRefund(refund)
    setIsRefundDetailOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            결제완료
          </Badge>
        )
      case "refunded":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            <RefreshCw className="mr-1 h-3 w-3" />
            환불완료
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            대기중
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            거절됨
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">결제/환불 관리</h2>
            <p className="text-muted-foreground">결제 내역과 환불 요청을 관리합니다.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* 날짜 범위 입력 */}
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleDateInputChange("start", e.target.value)}
                className="w-36"
              />
              <span className="text-muted-foreground">~</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => handleDateInputChange("end", e.target.value)}
                className="w-36"
              />
            </div>
            {/* 빠른 선택 버튼 */}
            <div className="flex items-center gap-1">
              <Button
                variant={dateRangeType === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("week")}
              >
                이번주
              </Button>
              <Button
                variant={dateRangeType === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("month")}
              >
                이번달
              </Button>
              <Button
                variant={dateRangeType === "3months" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("3months")}
              >
                최근 3달
              </Button>
              <Button
                variant={dateRangeType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("all")}
              >
                전체
              </Button>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              내역 다운로드
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {paymentsData
                      .reduce((acc, p) => acc + p.amount, 0)
                      .toLocaleString()}원
                  </p>
                  <p className="text-sm text-muted-foreground">총 결제 금액</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{paymentsData.length}건</p>
                  <p className="text-sm text-muted-foreground">결제 건수</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRefunds}건</p>
                  <p className="text-sm text-muted-foreground">환불 대기</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-red-100 p-3">
                  <RefreshCw className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalRefundAmount.toLocaleString()}원</p>
                  <p className="text-sm text-muted-foreground">환불 처리 금액</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              결제 내역
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              환불 요청
              {pendingRefunds > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pendingRefunds}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>결제 내역</CardTitle>
                    <CardDescription>총 {filteredPayments.length}건의 결제</CardDescription>
                  </div>
                  {/* 검색 */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="이름, 주문번호, 이메일로 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[280px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">No.</TableHead>
                      <TableHead>결제일시</TableHead>
                      <TableHead>주문번호</TableHead>
                      <TableHead>환불일시</TableHead>
                      <TableHead>구매자</TableHead>
                      <TableHead>강좌</TableHead>
                      <TableHead>결제수단</TableHead>
                      <TableHead className="text-right">쿠폰 할인</TableHead>
                      <TableHead className="text-right">결제금액</TableHead>
                      <TableHead className="text-right">환불금액</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments.map((payment, index) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-center font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.date}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.refundDate || "-"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.studentName}</p>
                            <p className="text-xs text-muted-foreground">{payment.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="flex flex-col gap-0.5">
                            {payment.courses.length === 1 ? (
                              <p className="text-sm truncate">{payment.courses[0]}</p>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-amber-600">{payment.courses.length}{"개 묶음강좌"}</p>
                                <p className="text-sm truncate">{payment.courses[0]}</p>
                                {payment.courses.length === 2 ? (
                                  <p className="text-sm truncate">{payment.courses[1]}</p>
                                ) : (
                                  <>
                                    <p className="text-sm truncate">{payment.courses[1]}</p>
                                    <p className="text-sm text-muted-foreground">{"외 "}{payment.courses.length - 2}{"개"}</p>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{payment.paymentMethod}</p>
                            {payment.cardInfo && (
                              <p className="text-xs text-muted-foreground">{payment.cardInfo}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-500">
                          {payment.couponDiscount > 0 ? `-${payment.couponDiscount.toLocaleString()}원` : "-"}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${payment.status === "refunded" ? "line-through text-muted-foreground" : ""}`}>
                          {payment.amount.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-500">
                          {payment.status === "refunded" ? `${payment.amount.toLocaleString()}원` : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(payment.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      총 {filteredPayments.length}건 중 {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, filteredPayments.length)}건 표시
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        이전
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            if (totalPages <= 5) return true
                            if (page === 1 || page === totalPages) return true
                            if (Math.abs(page - currentPage) <= 1) return true
                            return false
                          })
                          .map((page, idx, arr) => (
                            <span key={page}>
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className="w-9"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            </span>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        다음
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refunds Tab */}
          <TabsContent value="refunds" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>환불 요청 목록</CardTitle>
                    <CardDescription>총 {filteredRefunds.length}건의 환불 요청</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="상태 필터" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="pending">대기중</SelectItem>
                          <SelectItem value="approved">승인됨</SelectItem>
                          <SelectItem value="rejected">거절됨</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="이름 또는 주문번호로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-[220px]"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>환불번호</TableHead>
                      <TableHead>주문번호</TableHead>
                      <TableHead>신청자</TableHead>
                      <TableHead>강좌</TableHead>
                      <TableHead>진도율</TableHead>
                      <TableHead className="text-right">환불금액</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead>신청일</TableHead>
                      <TableHead className="text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRefunds.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell className="font-mono text-sm">{refund.id}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{refund.paymentId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{refund.studentName}</p>
                            <p className="text-xs text-muted-foreground">{refund.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{refund.course}</TableCell>
                        <TableCell>
                          <Badge
                            variant={refund.progress > 50 ? "destructive" : "secondary"}
                          >
                            {refund.progress}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {refund.refundAmount.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(refund.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {refund.requestDate}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openRefundDetail(refund)}
                          >
                            상세보기
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {refundTotalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      총 {filteredRefunds.length}건 중 {(refundCurrentPage - 1) * itemsPerPage + 1}-
                      {Math.min(refundCurrentPage * itemsPerPage, filteredRefunds.length)}건 표시
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRefundCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={refundCurrentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        이전
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: refundTotalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            if (refundTotalPages <= 5) return true
                            if (page === 1 || page === refundTotalPages) return true
                            if (Math.abs(page - refundCurrentPage) <= 1) return true
                            return false
                          })
                          .map((page, idx, arr) => (
                            <span key={page}>
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={refundCurrentPage === page ? "default" : "outline"}
                                size="sm"
                                className="w-9"
                                onClick={() => setRefundCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            </span>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRefundCurrentPage((prev) => Math.min(prev + 1, refundTotalPages))}
                        disabled={refundCurrentPage === refundTotalPages}
                      >
                        다음
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Refund Detail Dialog */}
        <Dialog open={isRefundDetailOpen} onOpenChange={setIsRefundDetailOpen}>
          <DialogContent className="max-w-lg">
            {selectedRefund && (
              <>
                <DialogHeader>
                  <DialogTitle>환불 요청 상세</DialogTitle>
                  <DialogDescription>
                    환불 요청 정보를 확인하고 처리합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{"환불번호"}</p>
                      <p className="font-mono font-medium">{selectedRefund.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">결제번호</p>
                      <p className="font-mono font-medium">{selectedRefund.paymentId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">신청자</p>
                      <p className="font-medium">{selectedRefund.studentName}</p>
                      <p className="text-xs text-muted-foreground">{selectedRefund.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">강좌</p>
                      <p className="font-medium">{selectedRefund.course}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{"결제 금액"}</p>
                      <p className="font-medium">{selectedRefund.amount.toLocaleString()}{"원"}</p>
                      <p className="text-sm text-muted-foreground mt-2">{"환불 금액"}</p>
                      <p className="text-lg font-bold text-primary">
                        {selectedRefund.refundAmount.toLocaleString()}{"원"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{"쿠폰 할인"}</p>
                      <p className="font-medium text-red-500">{"-10,000원"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">진도율</p>
                    <Badge
                      variant={selectedRefund.progress > 50 ? "destructive" : "secondary"}
                      className="mt-1"
                    >
                      {selectedRefund.progress}% 수강 완료
                    </Badge>
                    {selectedRefund.progress > 50 && (
                      <p className="mt-1 text-xs text-destructive">
                        * 50% 초과 수강 시 환불 규정에 따라 환불이 제한될 수 있습니다.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">1:1 문의 내용 (환불 사유)</p>
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <p className="font-medium text-sm mb-2">{selectedRefund.inquiryTitle}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {selectedRefund.inquiryContent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">신청일</p>
                      <p className="text-sm">{selectedRefund.requestDate}</p>
                    </div>
                    <div>{getStatusBadge(selectedRefund.status)}</div>
                  </div>
                  {(selectedRefund.status === "pending" || selectedRefund.status === "rejected") && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{"답변 내용"}</p>
                      <Textarea
                        placeholder="답변 내용을 입력하세요"
                        value={approveReply}
                        onChange={(e) => setApproveReply(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}
                </div>
                {selectedRefund.status === "pending" && (
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsRefundDetailOpen(false)
                        setIsRejectDialogOpen(true)
                      }}
                      disabled={!approveReply.trim()}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {"거절"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsRefundDetailOpen(false)
                        setIsApproveDialogOpen(true)
                      }}
                      disabled={!approveReply.trim()}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {"승인"}
                    </Button>
                  </DialogFooter>
                )}
                {selectedRefund.status === "rejected" && (
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsRefundDetailOpen(false)
                        setIsRejectDialogOpen(true)
                      }}
                      disabled={!approveReply.trim()}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {"거절"}
                    </Button>
                  </DialogFooter>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Dialog */}
        <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>환불 승인</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedRefund?.refundAmount.toLocaleString()}원을 환불 처리하시겠습니까?
                이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                  setIsApproveDialogOpen(false)
                  setApproveReply("")
                }}>
                승인하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Dialog */}
        <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>환불 거절</AlertDialogTitle>
              <AlertDialogDescription>
                환불 요청을 거절하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setIsRejectDialogOpen(false)
                  setApproveReply("")
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                거절하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
