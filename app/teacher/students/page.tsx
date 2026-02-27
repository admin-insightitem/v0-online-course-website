"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/teacher-layout"
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

// 강사 본인의 강의 수강생만
const studentsData = [
  {
    id: "1",
    name: "김경민",
    email: "kyungmin@gmail.com",
    avatar: "/images/avatar-user.jpg",
    joinDate: "2025.08.15",
    joinMethod: "email" as const,
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 75, lastAccess: "2026.02.27", enrollDate: "2025.08.15", price: 149000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 149000,
    status: "active",
  },
  {
    id: "3",
    name: "박준영",
    email: "junyoung@kakao.com",
    avatar: "",
    joinDate: "2025.12.01",
    joinMethod: "kakao" as const,
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 45, lastAccess: "2026.02.26", enrollDate: "2025.12.01", price: 149000, isRefunded: false },
      { id: "7", title: "AI 비즈니스 심화", progress: 20, lastAccess: "2026.02.22", enrollDate: "2026.02.10", price: 199000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 348000,
    status: "active",
  },
  {
    id: "6",
    name: "한소희",
    email: "sohee@gmail.com",
    avatar: "",
    joinDate: "2026.02.01",
    joinMethod: "kakao" as const,
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 5, lastAccess: "2026.02.27", enrollDate: "2026.02.01", price: 149000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 149000,
    status: "active",
  },
  {
    id: "7",
    name: "이민호",
    email: "minho@naver.com",
    avatar: "",
    joinDate: "2026.01.15",
    joinMethod: "email" as const,
    courses: [
      { id: "7", title: "AI 비즈니스 심화", progress: 60, lastAccess: "2026.02.25", enrollDate: "2026.01.15", price: 199000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 199000,
    status: "active",
  },
  {
    id: "8",
    name: "정수아",
    email: "sua@gmail.com",
    avatar: "",
    joinDate: "2025.11.20",
    joinMethod: "email" as const,
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 100, lastAccess: "2026.02.20", enrollDate: "2025.11.20", price: 149000, isRefunded: false },
    ],
    refundedCourses: [],
    totalSpent: 149000,
    status: "active",
  },
]

const courseFilters = [
  "전체",
  "ChatGPT & AI 자동화",
  "AI 비즈니스 심화",
]

type SortKey = "name" | "email" | "joinMethod" | "courses" | "joinDate" | "progress" | "totalSpent" | "status"
type SortOrder = "asc" | "desc"

export default function TeacherStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("전체")
  const [statusFilter, setStatusFilter] = useState("all")
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
    return matchesSearch && matchesCourse && matchesStatus
  })

  // 정렬 로직
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "email":
        comparison = a.email.localeCompare(b.email)
        break
      case "joinMethod":
        comparison = a.joinMethod.localeCompare(b.joinMethod)
        break
      case "courses":
        comparison = a.courses.length - b.courses.length
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
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">내 수강생 관리</h2>
            <p className="text-muted-foreground">내 강의를 수강 중인 학생들을 관리합니다.</p>
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
                  <p className="text-sm text-muted-foreground">비활성 수강생</p>
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
                  내 수강생 목록
                </CardTitle>
                <CardDescription>
                  총 {sortedStudents.length}명의 수강생 (30명씩 표시)
                </CardDescription>
              </div>
              {/* 검색 및 필터 */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
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
                    placeholder="이름 또는 이메일로 검색"
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
                    <button onClick={() => handleSort("email")} className="flex items-center hover:text-foreground">
                      이메일 {getSortIcon("email")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("courses")} className="flex items-center hover:text-foreground">
                      수강 강좌 {getSortIcon("courses")}
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
                        <p className="text-sm">{student.email}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{student.courses.length}개</p>
                          <div className="flex flex-col gap-0.5">
                            {student.courses.slice(0, 2).map((course) => (
                              <span key={course.id} className="text-xs text-muted-foreground">
                                {course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title}
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
                        <div className="flex items-center gap-2">
                          <Progress value={avgProgress} className="h-2 w-16" />
                          <span className={`text-sm font-medium ${getProgressColor(avgProgress)}`}>
                            {avgProgress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {student.totalSpent.toLocaleString()}원
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={student.status === "active" ? "default" : "secondary"}
                        >
                          {student.status === "active" ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStudentDetail(student)}
                          >
                            상세보기
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {sortedStudents.length}명 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedStudents.length)}명 표시
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
                  <span className="text-sm">
                    {currentPage} / {totalPages}
                  </span>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>수강생 상세 정보</DialogTitle>
              <DialogDescription>
                수강생의 상세 정보와 학습 현황을 확인합니다.
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                    <AvatarFallback className="text-xl">
                      {selectedStudent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={selectedStudent.status === "active" ? "default" : "secondary"}>
                        {selectedStudent.status === "active" ? "활성" : "비활성"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        가입일: {selectedStudent.joinDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{selectedStudent.courses.length}</p>
                    <p className="text-xs text-muted-foreground">수강 강좌</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">
                      {Math.round(
                        selectedStudent.courses.reduce((acc, c) => acc + c.progress, 0) /
                          selectedStudent.courses.length
                      )}%
                    </p>
                    <p className="text-xs text-muted-foreground">평균 진도율</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">
                      {selectedStudent.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">총 결제액</p>
                  </div>
                </div>

                {/* Courses */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">수강 강좌</h4>
                    <Select value={courseSortBy} onValueChange={(v) => setCourseSortBy(v as "enrollDate" | "lastAccess")}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enrollDate">수강 신청일순</SelectItem>
                        <SelectItem value="lastAccess">최근 접속순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    {[...selectedStudent.courses]
                      .sort((a, b) => {
                        if (courseSortBy === "enrollDate") {
                          return new Date(b.enrollDate.replace(/\./g, "-")).getTime() - new Date(a.enrollDate.replace(/\./g, "-")).getTime()
                        }
                        return new Date(b.lastAccess.replace(/\./g, "-")).getTime() - new Date(a.lastAccess.replace(/\./g, "-")).getTime()
                      })
                      .map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{course.title}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>수강 신청일: {course.enrollDate}</span>
                            <span>최근 접속: {course.lastAccess}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{course.progress}%</p>
                            <Progress value={course.progress} className="h-2 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    이메일 보내기
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    알림 보내기
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  )
}
