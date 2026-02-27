"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  Search,
  Users,
  Filter,
  Mail,
  Calendar,
  BookOpen,
  Clock,
  TrendingUp,
  Bell,
  MessageSquare,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// 수강생 데이터
const studentsData = [
  {
    id: "1",
    name: "김경민",
    email: "kyungmin@gmail.com",
    avatar: "/images/avatar-user.jpg",
    joinDate: "2025.08.15",
    joinMethod: "email" as const,
    memberType: "admin" as const,
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 75, lastAccess: "2026.02.27", enrollDate: "2025.08.15", price: 149000, isRefunded: false },
      { id: "2", title: "유튜브 수익화 가이드", progress: 30, lastAccess: "2026.02.25", enrollDate: "2025.09.20", price: 129000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 278000,
    status: "active",
  },
  {
    id: "2",
    name: "이수현",
    email: "soohyun@naver.com",
    avatar: "",
    joinDate: "2025.10.20",
    joinMethod: "kakao" as const,
    memberType: "teacher" as const,
    courses: [
      { id: "3", title: "퍼포먼스 마케팅 마스터클래스", progress: 100, lastAccess: "2026.02.20", enrollDate: "2025.10.20", price: 169000, isRefunded: false },
    ],
    refundedCourses: [
      { id: "7", title: "ChatGPT & AI 자동화", progress: 15, lastAccess: "2025.11.05", enrollDate: "2025.10.25", price: 149000, refundDate: "2025.11.10", refundAmount: 149000, isRefunded: true },
    ],
    totalSpent: 169000,
    status: "active",
  },
  {
    id: "3",
    name: "박준영",
    email: "junyoung@kakao.com",
    avatar: "",
    joinDate: "2025.12.01",
    joinMethod: "kakao" as const,
    memberType: "admin" as const,
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 45, lastAccess: "2026.02.26", enrollDate: "2025.12.01", price: 149000, isRefunded: false },
      { id: "4", title: "프리미어 프로 & 포토샵", progress: 20, lastAccess: "2026.02.22", enrollDate: "2026.01.10", price: 149000, isRefunded: false },
      { id: "5", title: "스마트스토어 + 쿠팡", progress: 60, lastAccess: "2026.02.27", enrollDate: "2026.02.01", price: 149000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 447000,
    status: "active",
  },
  {
    id: "4",
    name: "최민지",
    email: "minji@gmail.com",
    avatar: "",
    joinDate: "2026.01.05",
    joinMethod: "email" as const,
    memberType: "student" as const,
    courses: [
      { id: "6", title: "인스타그램 & 틱톡 SNS 수익화", progress: 85, lastAccess: "2026.02.27", enrollDate: "2026.01.05", price: 119000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 119000,
    status: "active",
  },
  {
    id: "5",
    name: "정태호",
    email: "taeho@naver.com",
    avatar: "",
    joinDate: "2025.09.10",
    joinMethod: "email" as const,
    memberType: "teacher" as const,
    courses: [
      { id: "2", title: "유튜브 수익화 가이드", progress: 10, lastAccess: "2026.01.15", enrollDate: "2025.09.10", price: 129000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 129000,
    status: "inactive",
  },
  {
    id: "6",
    name: "한소희",
    email: "sohee@gmail.com",
    avatar: "",
    joinDate: "2026.02.01",
    joinMethod: "kakao" as const,
    memberType: "student" as const,
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 5, lastAccess: "2026.02.27", enrollDate: "2026.02.01", price: 149000, isRefunded: false },
    ],
    refundedCourses: [
      { id: "8", title: "유튜브 수익화 가이드", progress: 8, lastAccess: "2026.02.10", enrollDate: "2026.02.05", price: 129000, refundDate: "2026.02.15", refundAmount: 129000, isRefunded: true },
    ],
    totalSpent: 149000,
    status: "active",
  },
]

const courseFilters = [
  "전체",
  "ChatGPT & AI 자동화",
  "유튜브 수익화 가이드",
  "퍼포먼스 마케팅 마스터클래스",
  "프리미어 프로 & 포토샵",
  "스마트스토어 + 쿠팡",
  "인스타그램 & 틱톡 SNS 수익화",
]

type SortKey = "name" | "memberType" | "joinMethod" | "courses" | "refundedCourses" | "joinDate" | "progress" | "totalSpent" | "status"
type SortOrder = "asc" | "desc"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("전체")
  const [statusFilter, setStatusFilter] = useState("all")
  const [memberTypeFilter, setMemberTypeFilter] = useState("student")
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>("joinDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30
  const [courseSortBy, setCourseSortBy] = useState<"enrollDate" | "lastAccess">("enrollDate")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />
    }
    return sortOrder === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1 text-primary" />
      : <ArrowDown className="h-4 w-4 ml-1 text-primary" />
  }

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse =
      selectedCourse === "전체" ||
      student.courses.some((c) => c.title === selectedCourse)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.status === "active") ||
      (statusFilter === "inactive" && student.status === "inactive")
    const matchesMemberType = memberTypeFilter === "all" || student.memberType === memberTypeFilter
    return matchesSearch && matchesCourse && matchesStatus && matchesMemberType
  })

  // 정렬 로직
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "memberType":
        comparison = a.memberType.localeCompare(b.memberType)
        break
      case "joinMethod":
        comparison = a.joinMethod.localeCompare(b.joinMethod)
        break
      case "courses":
        comparison = a.courses.length - b.courses.length
        break
      case "refundedCourses":
        comparison = (a.refundedCourses?.length || 0) - (b.refundedCourses?.length || 0)
        break
      case "joinDate":
        comparison = new Date(a.joinDate.replace(/\./g, "-")).getTime() - new Date(b.joinDate.replace(/\./g, "-")).getTime()
        break
      case "progress":
        const avgA = a.courses.reduce((acc, c) => acc + c.progress, 0) / a.courses.length
        const avgB = b.courses.reduce((acc, c) => acc + c.progress, 0) / b.courses.length
        comparison = avgA - avgB
        break
      case "totalSpent":
        comparison = a.totalSpent - b.totalSpent
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  // 페이징
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage)
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const openStudentDetail = (student: typeof studentsData[0]) => {
    setSelectedStudent(student)
    setIsDetailOpen(true)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 50) return "text-blue-600"
    if (progress >= 20) return "text-yellow-600"
    return "text-red-500"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{"회원 관리"}</h2>
            <p className="text-muted-foreground">{"회원 정보와 학습 진도를 관리합니다."}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              목록 다운로드
            </Button>
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              일괄 알림 전송
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentsData.length}</p>
                  <p className="text-sm text-muted-foreground">전체 수강생</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {studentsData.filter((s) => s.status === "active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">활성 수강생</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      studentsData.reduce(
                        (acc, s) =>
                          acc +
                          s.courses.reduce((a, c) => a + c.progress, 0) / s.courses.length,
                        0
                      ) / studentsData.length
                    )}%
                  </p>
                  <p className="text-sm text-muted-foreground">평균 진도율</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {studentsData.filter((s) => s.status === "inactive").length}
                  </p>
                  <p className="text-sm text-muted-foreground">{"비활성 회원"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {"회원 목록"}
                </CardTitle>
                <CardDescription>
                  {"총 "}{sortedStudents.length}{"명의 회원 (30명씩 표시)"}
                </CardDescription>
              </div>
              {/* 검색 및 필터 */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{"회원"}</span>
                    <Select value={memberTypeFilter} onValueChange={setMemberTypeFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="회원 유형" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{"전체"}</SelectItem>
                        <SelectItem value="student">{"수강생"}</SelectItem>
                        <SelectItem value="teacher">{"강사"}</SelectItem>
                        <SelectItem value="admin">{"어드민"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{"강좌"}</span>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="강좌 필터" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseFilters.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{"상태"}</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="relative w-full sm:w-[280px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="이름으로 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No.</TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("name")} className="flex items-center hover:text-foreground">
                      이름(닉네임) {getSortIcon("name")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("joinDate")} className="flex items-center hover:text-foreground">
                      가입일 {getSortIcon("joinDate")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("joinMethod")} className="flex items-center hover:text-foreground">
                      가입 방법 {getSortIcon("joinMethod")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("memberType")} className="flex items-center hover:text-foreground">
                      회원 {getSortIcon("memberType")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("courses")} className="flex items-center hover:text-foreground">
                      수강 강좌 {getSortIcon("courses")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("refundedCourses")} className="flex items-center hover:text-foreground">
                      환불 강좌 {getSortIcon("refundedCourses")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("progress")} className="flex items-center hover:text-foreground">
                      평균 진도율 {getSortIcon("progress")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("totalSpent")} className="flex items-center hover:text-foreground">
                      총 결제액 {getSortIcon("totalSpent")}
                    </button>
                  </TableHead>
                  <TableHead className="text-center">
                    <button onClick={() => handleSort("status")} className="flex items-center justify-center hover:text-foreground w-full">
                      상태 {getSortIcon("status")}
                    </button>
                  </TableHead>
                  <TableHead className="text-center">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student, index) => {
                  const avgProgress = Math.round(
                    student.courses.reduce((acc, c) => acc + c.progress, 0) /
                      student.courses.length
                  )
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="text-center text-muted-foreground">
                        {rowNumber}
                      </TableCell>
<TableCell>
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-9 w-9">
                                            <AvatarImage src={student.avatar} alt={student.name} />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">{student.name}</p>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-sm">{student.joinDate}</span>
                                      </TableCell>
                                      <TableCell>
                                        <Badge 
                                          variant="secondary" 
                                          className={
                                            student.joinMethod === "kakao" 
                                              ? "bg-yellow-100 text-yellow-700" 
                                              : "bg-blue-100 text-blue-700"
                                          }
                                        >
                                          {student.joinMethod === "kakao" ? "카카오톡" : "이메일"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge 
                                          variant="secondary" 
                                          className={
                                            student.memberType === "admin" 
                                              ? "bg-purple-100 text-purple-700" 
                                              : student.memberType === "teacher"
                                              ? "bg-green-100 text-green-700"
                                              : "bg-gray-100 text-gray-700"
                                          }
                                        >
                                          {student.memberType === "admin" ? "어드민" : student.memberType === "teacher" ? "강사" : "수강생"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">{student.courses.length}개</p>
                                          <div className="flex flex-col gap-0.5">
                                            {student.courses.slice(0, 2).map((course) => (
                                              <span key={course.id} className="text-xs text-muted-foreground">
                                                {course.title.length > 18
                                                  ? course.title.substring(0, 18) + "..."
                                                  : course.title}
                                              </span>
                                            ))}
                                            {student.courses.length > 2 && (
                                              <span className="text-xs text-muted-foreground">
                                                외 {student.courses.length - 2}개
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {student.refundedCourses && student.refundedCourses.length > 0 ? (
                                          <div className="space-y-1">
                                            <p className="text-sm font-medium text-red-600">{student.refundedCourses.length}개</p>
                                            <div className="flex flex-col gap-0.5">
                                              {student.refundedCourses.slice(0, 2).map((course) => (
                                                <span key={course.id} className="text-xs text-muted-foreground">
                                                  {course.title.length > 18
                                                    ? course.title.substring(0, 18) + "..."
                                                    : course.title}
                                                </span>
                                              ))}
                                              {student.refundedCourses.length > 2 && (
                                                <span className="text-xs text-muted-foreground">
                                                  외 {student.refundedCourses.length - 2}개
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-sm text-muted-foreground">--</span>
                                        )}
                                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getProgressColor(avgProgress)}`}>
                          {avgProgress}%
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.totalSpent.toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={student.status === "active" ? "default" : "secondary"}
                          className={
                            student.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : ""
                          }
                        >
                          {student.status === "active" ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openStudentDetail(student)}
                        >
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  총 {sortedStudents.length}명 중 {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, sortedStudents.length)}명 표시
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

        {/* Student Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedStudent && (
              <>
                <DialogHeader>
                  <DialogTitle>수강생 상세 정보</DialogTitle>
                  <DialogDescription>
                    수강생의 정보와 학습 현황을 확인합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Profile Section */}
                  <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                      <AvatarFallback className="text-xl">
                        {selectedStudent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                        <Badge
                          variant={selectedStudent.status === "active" ? "default" : "secondary"}
                          className={
                            selectedStudent.status === "active"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                        >
                          {selectedStudent.status === "active" ? "활성" : "비활성"}
                        </Badge>
                      </div>
<div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-muted-foreground" />
                                          {selectedStudent.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge 
                                            variant="secondary" 
                                            className={
                                              selectedStudent.joinMethod === "kakao" 
                                                ? "bg-yellow-100 text-yellow-700" 
                                                : "bg-blue-100 text-blue-700"
                                            }
                                          >
                                            {selectedStudent.joinMethod === "kakao" ? "카카오톡 가입" : "이메일 가입"}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          가입일: {selectedStudent.joinDate}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                                          수강 강좌: {selectedStudent.courses.length}개
                                        </div>
                                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Mail className="mr-2 h-4 w-4" />
                      이메일 발송
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      메시지 전송
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Bell className="mr-2 h-4 w-4" />
                      학습 알림
                    </Button>
                  </div>

                  {/* Course Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">수강 현황</h4>
                      <div className="flex items-center gap-3">
                        {[
                          { value: "enrollDate", label: "수강 신청일 순" },
                          { value: "lastAccess", label: "마지막 학습일 순" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setCourseSortBy(option.value as "enrollDate" | "lastAccess")}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              courseSortBy === option.value
                                ? "text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              courseSortBy === option.value ? "bg-primary" : "bg-muted-foreground/50"
                            }`} />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {/* 활성 강좌 */}
                      {[...selectedStudent.courses]
                        .sort((a, b) => {
                          const dateA = new Date(a[courseSortBy].replace(/\./g, "-")).getTime()
                          const dateB = new Date(b[courseSortBy].replace(/\./g, "-")).getTime()
                          return dateB - dateA
                        })
                        .map((course) => (
                        <div
                          key={course.id}
                          className="rounded-lg border border-border p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{course.title}</span>
                            <span className={`font-semibold ${getProgressColor(course.progress)}`}>
                              {course.progress}%
                            </span>
                          </div>
                          <Progress value={course.progress} className="h-2 mb-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>마지막 학습: {course.lastAccess}</span>
                            {course.progress < 50 && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                진도율 낮음
                              </Badge>
                            )}
                            {course.progress === 100 && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                완료
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
                            <span>수강 신청일: {course.enrollDate}</span>
                            <span className="font-medium text-foreground">{course.price.toLocaleString()}원</span>
                          </div>
                        </div>
                      ))}

                      {/* 환불 강좌 */}
                      {selectedStudent.refundedCourses && selectedStudent.refundedCourses.length > 0 && (
                        <>
                          <div className="border-t border-border pt-3 mt-3">
                            <p className="text-sm text-muted-foreground mb-2">환불 강좌</p>
                          </div>
                          {selectedStudent.refundedCourses.map((course) => (
                            <div
                              key={course.id}
                              className="rounded-lg border border-red-200 bg-red-50/50 p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-muted-foreground">{course.title}</span>
                                  <Badge variant="outline" className="text-red-600 border-red-600 text-[10px]">
                                    환불
                                  </Badge>
                                </div>
                                <span className="text-sm text-muted-foreground line-through">
                                  {course.progress}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>수강 신청일: {course.enrollDate}</span>
                                <span>마지막 학습일: {course.lastAccess || "--"}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-red-200 pt-2">
                                <span>환불일: {course.refundDate}</span>
                                <div className="flex items-center gap-2">
                                  <span className="line-through">{course.price.toLocaleString()}원</span>
                                  <span className="text-red-600 font-medium">환불: {course.refundAmount?.toLocaleString()}원</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">총 결제 금액</span>
                      <span className="text-lg font-bold">
                        {selectedStudent.totalSpent.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
