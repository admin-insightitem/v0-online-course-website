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
  Phone,
  Calendar,
  BookOpen,
  Clock,
  TrendingUp,
  Bell,
  MessageSquare,
  Download,
} from "lucide-react"

// 수강생 데이터
const studentsData = [
  {
    id: "1",
    name: "김경민",
    email: "kyungmin@gmail.com",
    phone: "010-1234-5678",
    avatar: "/images/avatar-user.jpg",
    joinDate: "2025.08.15",
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 75, lastAccess: "2026.02.27" },
      { id: "2", title: "유튜브 수익화 가이드", progress: 30, lastAccess: "2026.02.25" },
    ],
    totalSpent: 278000,
    status: "active",
  },
  {
    id: "2",
    name: "이수현",
    email: "soohyun@naver.com",
    phone: "010-2345-6789",
    avatar: "",
    joinDate: "2025.10.20",
    courses: [
      { id: "3", title: "퍼포먼스 마케팅 마스터클래스", progress: 100, lastAccess: "2026.02.20" },
    ],
    totalSpent: 169000,
    status: "active",
  },
  {
    id: "3",
    name: "박준영",
    email: "junyoung@kakao.com",
    phone: "010-3456-7890",
    avatar: "",
    joinDate: "2025.12.01",
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 45, lastAccess: "2026.02.26" },
      { id: "4", title: "프리미어 프로 & 포토샵", progress: 20, lastAccess: "2026.02.22" },
      { id: "5", title: "스마트스토어 + 쿠팡", progress: 60, lastAccess: "2026.02.27" },
    ],
    totalSpent: 447000,
    status: "active",
  },
  {
    id: "4",
    name: "최민지",
    email: "minji@gmail.com",
    phone: "010-4567-8901",
    avatar: "",
    joinDate: "2026.01.05",
    courses: [
      { id: "6", title: "인스타그램 & 틱톡 SNS 수익화", progress: 85, lastAccess: "2026.02.27" },
    ],
    totalSpent: 119000,
    status: "active",
  },
  {
    id: "5",
    name: "정태호",
    email: "taeho@naver.com",
    phone: "010-5678-9012",
    avatar: "",
    joinDate: "2025.09.10",
    courses: [
      { id: "2", title: "유튜브 수익화 가이드", progress: 10, lastAccess: "2026.01.15" },
    ],
    totalSpent: 129000,
    status: "inactive",
  },
  {
    id: "6",
    name: "한소희",
    email: "sohee@gmail.com",
    phone: "010-6789-0123",
    avatar: "",
    joinDate: "2026.02.01",
    courses: [
      { id: "1", title: "ChatGPT & AI 자동화", progress: 5, lastAccess: "2026.02.27" },
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

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("전체")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

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
            <h2 className="text-2xl font-bold tracking-tight">수강생 관리</h2>
            <p className="text-muted-foreground">수강생 정보와 학습 진도를 관리합니다.</p>
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

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 이메일로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
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
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              수강생 목록
            </CardTitle>
            <CardDescription>
              총 {filteredStudents.length}명의 수강생
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>수강생</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>수강 강좌</TableHead>
                  <TableHead>평균 진도율</TableHead>
                  <TableHead>총 결제액</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-center">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const avgProgress = Math.round(
                    student.courses.reduce((acc, c) => acc + c.progress, 0) /
                      student.courses.length
                  )
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">가입: {student.joinDate}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{student.email}</p>
                          <p className="text-xs text-muted-foreground">{student.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.courses.slice(0, 2).map((course) => (
                            <Badge key={course.id} variant="secondary" className="text-xs">
                              {course.title.length > 15
                                ? course.title.substring(0, 15) + "..."
                                : course.title}
                            </Badge>
                          ))}
                          {student.courses.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.courses.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={avgProgress} className="w-20" />
                          <span className={`text-sm font-medium ${getProgressColor(avgProgress)}`}>
                            {avgProgress}%
                          </span>
                        </div>
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
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {selectedStudent.phone}
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
                    <h4 className="mb-3 font-semibold">수강 현황</h4>
                    <div className="space-y-3">
                      {selectedStudent.courses.map((course) => (
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
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
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
                        </div>
                      ))}
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
